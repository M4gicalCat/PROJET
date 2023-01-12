<?php
class Admin
{
    private string $username;
    private string $password;

    private function __construct(string $username, string $password)
    {
        $this->username = $username;
        $this->password = $password;
    }

    public static function create(string $username, string $password): self
    {
        $db = PdoConnexion::getConnexion();
        $query = $db->prepare("INSERT INTO admin (username, password) VALUES (:username, :password)");
        $query->execute([
            "username" => $username,
            "password" => $password
        ]);
        return new self($username, $password);
    }

    public static function find(string $username): self
    {
        $db = PdoConnexion::getConnexion();
        $query = $db->prepare("SELECT * FROM admin WHERE username = :username");
        $query->execute([
            "username" => $username
        ]);
        $result = $query->fetch();
        return new self($result["username"], $result["password"]);
    }

    public static function update(string $old_username, array $new): self
    {
        $db = PdoConnexion::getConnexion();
        $query = $db->prepare("UPDATE admin SET username = :username, password = :password WHERE username = :oldUsername");
        $query->execute([
            "username" => $new["username"],
            "password" => $new["password"],
            "oldUsername" => $old_username
        ]);
        return new self($new["username"], $new["password"]);
    }

    public function delete(): void
    {
        $db = PdoConnexion::getConnexion();
        $query = $db->prepare("DELETE FROM admin WHERE username = :username");
        $query->execute([
            "username" => $this->username
        ]);
    }


    public static function count(): int
    {
        $db = PdoConnexion::getConnexion();
        $query = $db->prepare("SELECT COUNT(*) FROM admin");
        $query->execute();
        return $query->fetchColumn();
    }

    public static function findAll(): array
    {
        $db = PdoConnexion::getConnexion();
        $query = $db->prepare("SELECT * FROM admin");
        $query->execute();
        $result = $query->fetchAll();
        $admins = [];
        foreach ($result as $admin) {
            $admins[] = new self($admin["username"], $admin["password"]);
        }
        return $admins;
    }

    /**
     * @return string
     */
    public function getUsername(): string
    {
        return $this->username;
    }

    /**
     * @return string
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function public(): array
    {
        return [
            "username" => $this->username,
            "password" => $this->password
        ];
    }
}
