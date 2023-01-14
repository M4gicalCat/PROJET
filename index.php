<?php
session_start();
session_set_cookie_params(0, '/', 'localhost');
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Credentials: true");
include_once "src/PDO.php";
include_once "src/Utils/Router.php";
foreach (glob("Entities/*.php") as $filename)
{
    include $filename;
}

if (str_starts_with($_SERVER['REQUEST_URI'], '/app')) {
    // Serve the React app's static files
    return false; // This will tell the server to look for the files requested in the filesystem
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