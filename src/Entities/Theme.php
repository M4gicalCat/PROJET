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

    public function delete(): void
    {
        $db = PdoConnexion::getConnexion();
        $query = $db->prepare("DELETE FROM theme WHERE label = :label AND id = :id");
        $query->execute([
            "label" => $this->label,
            'id' => $this->id,
        ]);
    }

    public static function count(): int
    {
        $db = PdoConnexion::getConnexion();
        $query = $db->prepare("SELECT COUNT(*) FROM theme");
        $query->execute();
        $result = $query->fetch();
        return $result[0];
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