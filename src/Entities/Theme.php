<?php

class Theme
{
    private string $label;

    private function __construct(string $label)
    {
        $this->label = $label;
    }

    public static function factory(string $label): self
    {
        return new self($label);
    }

    public static function create(string $label): self
    {
        $db = PdoConnexion::getConnexion();
        $query = $db->prepare("INSERT INTO theme (label) VALUES (:label)");
        $query->execute([
            "label" => $label
        ]);
        return new self($label);
    }

    public static function find(string $label): self
    {
        $db = PdoConnexion::getConnexion();
        $query = $db->prepare("SELECT * FROM theme WHERE label = :label");
        $query->execute([
            "label" => $label
        ]);
        $result = $query->fetch();
        return new self($result["label"]);
    }

    public static function update(string $old_label, string $new_label): self
    {
        $db = PdoConnexion::getConnexion();
        $query = $db->prepare("UPDATE theme SET label = :label WHERE label = :oldLabel");
        $query->execute([
            "label" => $new_label,
            "oldLabel" => $old_label
        ]);
        return new self($new_label);
    }

    public function delete(): void
    {
        $db = PdoConnexion::getConnexion();
        $query = $db->prepare("DELETE FROM theme WHERE label = :label");
        $query->execute([
            "label" => $this->label
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
            $themes[] = new self($theme["label"]);
        }
        return $themes;
    }
}