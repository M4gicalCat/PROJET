<?php
session_start();
include_once "src/PDO.php";
include_once "src/Utils/Router.php";
foreach (glob("Entities/*.php") as $filename)
{
    include $filename;
}
if ($_SERVER['REQUEST_URI'] === "/") {
    header("Location: /app");
    exit();
}

if (!str_starts_with($_SERVER['REQUEST_URI'], '/api')) {
    return false;
}
header('Content-Type: application/json');
$ROUTER = Router::getRouter();

foreach (glob("src/Routes/*.routes.php") as $filename)
{
    include_once $filename;
}

$ROUTER->create('/connected', function () {
    // user connected
    if (isset($_SESSION["email"])) {
        include_once "src/Entities/Inscription.php";
        $inscription = Inscription::find($_SESSION["email"]);
        if ($inscription) {
            echo json_encode($inscription->public());
            exit();
        }
    }
    if (isset($_SESSION["admin"])) {
        include_once "src/Entities/Admin.php";
        echo json_encode(Admin::find($_SESSION["admin"])->public());
        exit();
    }
    // user not connected
    echo json_encode(["error" => "Not connected"]);
}, AUTHENTICATION::$NONE);

Router::getRouter()->create("/logout", function () {
    require_once $_SERVER['DOCUMENT_ROOT']."/src/Entities/Admin.php";
    require_once $_SERVER['DOCUMENT_ROOT'].'/src/Entities/Inscription.php';
    unset($_SESSION["admin"]);
    unset($_SESSION['email']);
    unset($_SESSION['id']);
    echo json_encode(["success" => "Logged out"]);
}, AUTHENTICATION::$NONE);

$ROUTER->run();
return false;