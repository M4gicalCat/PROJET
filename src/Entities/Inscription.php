<?php

class Inscription
{
    private int $id;
    private string $email;
    private array $themes;

    private function __construct(int $id, string $email, array $themes = [])
    {
        $this->id = $id;
        $this->email = $email;
        $this->themes = $themes;
    }

    public static function create(string $email): self
    {
        require_once $_SERVER['DOCUMENT_ROOT'].'/src/Entities/Theme.php';
        $db = PdoConnexion::getConnexion();
        $query = $db->prepare("INSERT INTO inscription (email) VALUES (:email)");
        $query->execute([
            "email" => $email
        ]);
        $q = $db->prepare('SELECT id FROM inscription WHERE email = :email;');
        $q->execute([
            'email' => $email,
        ]);
        $id = +$q->fetch()["id"];
        return new self($id, $email, Theme::findAll());
    }

    public static function findOrCreate(string $email): self
    {
        $found = self::find($email);
        return $found ?: self::create($email);
    }

    public static function update($id, $new_email, $themes): self
    {
        include_once $_SERVER['DOCUMENT_ROOT'].'/src/Entities/Theme.php';
        $db = PdoConnexion::getConnexion();
        $query = $db->prepare("UPDATE inscription SET email = :email WHERE id = :id");
        $query->execute([
            "email" => $new_email,
            "id" => $id
        ]);

        $db->prepare('DELETE FROM theme_inscription WHERE inscription_id = :id;')->execute([
            'id' => $id,
        ]);
        foreach ($themes as $theme_id) {
            $db->prepare('INSERT INTO theme_inscription (inscription_id, theme_id) VALUES (:inscription_id, :theme_id);')->execute([
                'inscription_id' => $id,
                'theme_id' => $theme_id,
            ]);
        }
        $q = $db->prepare('SELECT theme.id as theme_id, theme.label as theme_label FROM theme LEFT JOIN theme_inscription ti on theme.id = ti.theme_id WHERE ti.inscription_id = :id');
        $q->execute([
            'id' => $id,
        ]);
        $result = $q->fetchAll();
        $themes = [];
        foreach ($result as $row) {
            $themes[] = Theme::factory($row["theme_label"], $row["theme_id"]);
        }
        return new self($id, $new_email, $themes);
    }

    public static function find(string $email): self | false
    {
        require_once $_SERVER['DOCUMENT_ROOT'].'/src/Entities/Theme.php';
        $db = PdoConnexion::getConnexion();
        $query = $db->prepare("
            SELECT i.id, i.email, t.id as theme_id, t.label as theme_label 
            FROM inscription i
            JOIN theme_inscription ti ON ti.inscription_id = i.id
            JOIN theme t ON t.id = ti.theme_id
            WHERE i.email = :email
        ");
        $query->execute([
            "email" => $email
        ]);
        $result = $query->fetchAll();
        if ($result === false || count($result) === 0) return false;
        $themes = [];
        foreach ($result as $row) {
            $themes[] = Theme::factory($row["theme_label"], $row["theme_id"]);
        }
        return new self(+$result[0]["id"], $result[0]["email"], $themes);
    }

    public static function delete($id): void
    {
        $db = PdoConnexion::getConnexion();
        $db->prepare('DELETE FROM theme_inscription WHERE inscription_id = :id;')->execute([
            'id' => $id,
        ]);
        $db->prepare('DELETE FROM inscription WHERE id = :id;')->execute([
            'id' => $id,
        ]);
    }

    public static function count(): array
    {
        $db = PdoConnexion::getConnexion();
        $query = $db->prepare("SELECT COUNT(*) as count FROM inscription");
        $query->execute();
        return $query->fetch();
    }

    public function updateTheme(Theme $theme): void
    {
        $db = PdoConnexion::getConnexion();
        $found = false;
        foreach ($this->themes as $t) {
            if ($t->getId() === $theme->getId()) {
                $found = true;
                break;
            }
        }
        $query = $db->prepare($found
            ? "DELETE FROM theme_inscription WHERE theme_id = :theme_id AND inscription_id = :inscription_id"
            : "INSERT INTO theme_inscription (theme_id, inscription_id) VALUES (:theme_id, :inscription_id)");
        $query->execute([
            "theme_id" => $theme->getId(),
            "inscription_id" => $this->id
        ]);
        $this->themes[] = $theme;
    }

    public static function findAll(): array
    {
        require_once $_SERVER['DOCUMENT_ROOT'].'/src/Entities/Theme.php';
        $db = PdoConnexion::getConnexion();
        $a = $db->prepare('SELECT i.id as user_id, i.email, t.label, t.id as theme_id FROM inscription i
            LEFT JOIN theme_inscription ti on i.id = ti.inscription_id
            LEFT JOIN theme t on t.id = ti.theme_id
            GROUP BY i.id, i.email, t.label, t.id;');
        $a->execute();

        $users = [];
        foreach ($a->fetchAll() as $row) {
            $theme = $row["theme_id"] ? Theme::factory($row["label"], $row["theme_id"]) : null;
            $themes = $users[$row["user_id"]]->themes ?? [];
            if ($theme !== null) $themes[] = $theme;
            $users[$row["user_id"]] = new self($row["user_id"], $row["email"], $themes);
        }
        return $users;
    }

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * @return string
     */
    public function getEmail(): string
    {
        return $this->email;
    }

    /**
     * @return array
     */
    public function getThemes(): array
    {
        return $this->themes;
    }

    public function public(): array
    {
        require_once $_SERVER['DOCUMENT_ROOT'].'/src/Entities/Theme.php';
        $themes = [];
        foreach ($this->themes as $t) {
            $themes[] = $t->public();
        }
        return [
            "email" => $this->email,
            "themes" => $themes,
            'id' => $this->id,
        ];
    }

    private function addTheme(Theme $factory): void
    {
        $this->themes[] = $factory;
    }
}