<?php

class Theme
{
    private int $id;
    private string $label;

    private function __construct(string $label, ?int $id = null)
    {
        $this->id = $id;
        $this->label = $label;
    }

    public static function factory(string $label, int $id): self
    {
        return new self($label, $id);
    }

    public static function create(string $label): self
    {
        $db = PdoConnexion::getConnexion();
        $query = $db->prepare("INSERT INTO theme (label) VALUES (:label)");
        $query->execute([
            "label" => $label
        ]);
        $query = $db->prepare('SELECT * FROM theme WHERE label = :label');
        $query->execute([
            'label' => $label,
        ]);
        $r = $query->fetch();
        return new self($r["label"], $r['id']);
    }

    public static function find(string $label): self
    {
        $db = PdoConnexion::getConnexion();
        $query = $db->prepare("SELECT * FROM theme WHERE label = :label");
        $query->execute([
            "label" => $label
        ]);
        $result = $query->fetch();
        return new self($result["label"], $result['id']);
    }

    public static function update(int $id, string $new_label): self
    {
        $db = PdoConnexion::getConnexion();
        $query = $db->prepare("UPDATE theme SET label = :label WHERE id = :id");
        $query->execute([
            "label" => $new_label,
            "id" => $id
        ]);
        return new self($new_label);
    }

    public static function delete(?int $id = 0): void
    {
        $db = PdoConnexion::getConnexion();
        $query = $db->prepare("DELETE FROM theme WHERE id = :id");
        $query->execute([
            'id' => $id,
        ]);
    }

    public static function count(): array
    {
        $db = PdoConnexion::getConnexion();
        $query = $db->prepare("SELECT COUNT(*) as count FROM theme");
        $query->execute();
        return $query->fetch();
    }

    public static function findAll(): array
    {
        $db = PdoConnexion::getConnexion();
        $query = $db->prepare("SELECT * FROM theme");
        $query->execute();
        $result = $query->fetchAll();
        $themes = [];
        foreach ($result as $theme) {
            $themes[] = new self($theme["label"], $theme['id']);
        }
        return $themes;
    }

    public function getLabel(): string
    {
        return $this->label;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function public(): array
    {
        return [
            'label' => $this->label,
            'id' => $this->id,
        ];
    }
}