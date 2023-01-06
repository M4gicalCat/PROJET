<?php
include "src/PDO.php";
require_once "src/Entities/Admin.php";
define("ROUTES", [
    "GET" => [
        "/" => function () {
            return "Server running !!";
        },
        "/admin" => function () {
            $res = new stdClass();
            $res->count = Admin::count();
            return json_encode($res);
        },
        "/admin/get" => function () {
            $res = new stdClass();
            $res->admin = Admin::find($_GET['username']);
            return json_encode($res);
        }
    ],
    "POST" => [

    ],
    "PUT" => [
        "/admin/update" => function () {
            $res = new stdClass();
            $res->admin = Admin::find($_GET['username']);
            $res->admin->update($_GET['username'], $_GET['password']);
            return json_encode($res);
        }
    ],
    "DELETE" => [

    ],
]);

function route(string $method, string $path): ?callable
{
    var_dump($method, $path);
    $routes = ROUTES[$method];
    if (array_key_exists($path, $routes)) {
        return $routes[$path];
    }
    return null;
}

switch ($_SERVER["REQUEST_METHOD"]) {
    case "GET":
        $res = route("GET", explode("?", $_SERVER["REQUEST_URI"])[0]);
        if ($res != null) {
            echo $res();
        } else {
            http_response_code(404);
        }
        break;
    case "POST":
        $res = route("POST", $_SERVER["REQUEST_URI"]);
        if ($res != null) {
            echo $res;
        } else {
            http_response_code(404);
        }
        break;
    case "PUT":
        $res = route("PUT", $_SERVER["REQUEST_URI"]);
        if ($res != null) {
            echo $res;
        } else {
            http_response_code(404);
        }
        break;
    case "DELETE":
        $res = route("DELETE", $_SERVER["REQUEST_URI"]);
        if ($res != null) {
            echo $res;
        } else {
            http_response_code(404);
        }
        break;
    default:
        http_response_code(405);
        break;
}