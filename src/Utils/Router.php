<?php
require_once "utils.php";

class Router
{
    private array $routes = [];
    private static self $router;

    public static function getRouter(): self
    {
        if (isset(self::$router)) {
            return self::$router;
        }
        return self::$router = new self();
    }

    public function create(string $path, closure $callback, int $authentication): void
    {
        $this->routes[$path] = ["cb" => $callback, "auth" => $authentication];
    }

    public function run(): void
    {
        $path = $_SERVER["REQUEST_URI"];
        if (str_ends_with($path, "/")) {
            $path = substr($path, 0, -1);
        }
        foreach ($this->routes as $route => $cb) {
            if ('/api'.$route === $path) {
                if (authenticate() < $cb["auth"]) {
                    echo json_encode(["message" => "You are not allowed to access this resource", "code" => 401, "err" => true]);
                    exit();
                }
                $cb["cb"](json_decode(file_get_contents('php://input'), true));
                exit();
            }
        };
    }
}
