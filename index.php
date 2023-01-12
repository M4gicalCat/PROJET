<?php
session_start();
include_once "src/PDO.php";
include_once "src/Utils/Router.php";
foreach (glob("Entities/*.php") as $filename)
{
    include $filename;
}

$ROUTER = Router::getRouter();

foreach (glob("src/Routes/*.routes.php") as $filename)
{
    include_once $filename;
}
$ROUTER->run();