<?php

Router::getRouter()->create("/admin", function () {
    require_once $_SERVER['DOCUMENT_ROOT']."/src/Entities/Admin.php";
    $admin = Admin::find($_SESSION["admin"]);
    echo json_encode($admin->public());
}, AUTHENTICATION::$ADMIN);

Router::getRouter()->create("/admin/create", function () {
    require_once $_SERVER['DOCUMENT_ROOT']."/src/Entities/Admin.php";
    $admin = Admin::create($_POST["username"], $_POST["password"]);
    echo json_encode($admin->public());
}, AUTHENTICATION::$ADMIN);

Router::getRouter()->create("/admin/update", function () {
    require_once $_SERVER['DOCUMENT_ROOT']."/src/Entities/Admin.php";
    $admin = Admin::update($_SESSION["admin"], ["username" => $_POST["username"], "password" => $_POST["password"]]);
    echo json_encode($admin->public());
}, AUTHENTICATION::$ADMIN);

Router::getRouter()->create("/admin/delete", function () {
    require_once $_SERVER['DOCUMENT_ROOT']."/src/Entities/Admin.php";
    $admin = Admin::find($_POST["username"]);
    $admin->delete();
}, AUTHENTICATION::$ADMIN);

Router::getRouter()->create("/admin/login", function () {
    require_once $_SERVER['DOCUMENT_ROOT']."/src/Entities/Admin.php";
    var_dump($_POST);
    $admin = Admin::find($_POST["username"]);
    if ($admin->getPassword() === $_POST["password"]) {
        $_SESSION["admin"] = $admin->getUsername();
        echo json_encode($admin->public());
    } else {
        echo json_encode(["error" => "Invalid credentials"]);
    }
}, AUTHENTICATION::$NONE);

Router::getRouter()->create("/admin/logout", function () {
    require_once $_SERVER['DOCUMENT_ROOT']."/src/Entities/Admin.php";
    unset($_SESSION["admin"]);
}, AUTHENTICATION::$ADMIN);

Router::getRouter()->create("/admin/all", function () {
    require_once $_SERVER['DOCUMENT_ROOT']."/src/Entities/Admin.php";
    $public = [];
    foreach (Admin::findAll() as $admin) {
        $public[] = $admin->public();
    }
    echo json_encode($public);
}, AUTHENTICATION::$ADMIN);