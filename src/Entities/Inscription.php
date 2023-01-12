<?php

class Inscription
{
    private string $email;
    private array $themes;

    private function __construct(string $email, array $themes = [])
    {
        $this->email = $email;
        $this->themes = $themes;
    }

    public static function create(string $email): self
    {
        $db = PdoConnexion::getConnexion();
        $query = $db->prepare("INSERT INTO inscription (email) VALUES (:email)");
        $query->execute([
            "email" => $email
        ]);
        return new self($email);
    }

    public static function find(string $email): self
    {
        $db = PdoConnexion::getConnexion();
        $query = $db->prepare("
            SELECT i.email, t.id as theme_id, t.label as theme_label 
            FROM inscription i
            JOIN theme_inscription ti ON ti.inscription_id = i.id
            JOIN theme t ON t.id = ti.theme_id
            WHERE i.email = :email
        ");
        $query->execute([
            "email" => $email
        ]);
        $result = $query->fetchAll();
        $themes = [];
        foreach ($result as $row) {
            $themes[] = Theme::factory($row["theme_label"]);
        }
        return new self($result[0]["email"], $themes);
    }

    public static function update(string $old_email, string $new_email): self
    {
        $db = PdoConnexion::getConnexion();
        $query = $db->prepare("UPDATE inscription SET email = :email WHERE email = :oldEmail");
        $query->execute([
            "email" => $new_email,
            "oldEmail" => $old_email
        ]);
        return new self($new_email);
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
}