<?php

class User
{
    private string $email;

    private function __construct(string $email)
    {
        $this->email = $email;
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
}