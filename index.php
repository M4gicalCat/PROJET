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

$ROUTER = Router::getRouter();

foreach (glob("src/Routes/*.routes.php") as $filename)
{
    include_once $filename;
}

$ROUTER->create('/connected', function () {
    // user connected
    if (isset($_SESSION["email"])) {
        include_once "src/Entities/Inscription.php";
        echo json_encode(Inscription::find($_SESSION["email"])->public());
        exit();
    }
    if (isset($_SESSION["admin"])) {
        include_once "src/Entities/Admin.php";
        echo json_encode(Admin::find($_SESSION["admin"])->public());
        exit();
    }
    // user not connected
    echo json_encode(["error" => "Not connected"]);
}, AUTHENTICATION::$NONE);

$ROUTER->create("/session", function () {
    echo json_encode($_SESSION);
}, AUTHENTICATION::$NONE);

$ROUTER->run();
return false;