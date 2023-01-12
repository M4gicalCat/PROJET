<?php

Router::getRouter()->create("/admin", function () {
    require_once $_SERVER['DOCUMENT_ROOT']."/src/Entities/Admin.php";
    $admin = Admin::find($_SESSION["admin"]);
    echo json_encode($admin->public());
}, AUTHENTICATION::$ADMIN);

Router::getRouter()->create("/admin/create", function ($data) {
    require_once $_SERVER['DOCUMENT_ROOT']."/src/Entities/Admin.php";
    $admin = Admin::create($data["username"], $data["password"]);
    echo json_encode($admin->public());
}, AUTHENTICATION::$ADMIN);

Router::getRouter()->create("/admin/update", function ($data) {
    require_once $_SERVER['DOCUMENT_ROOT']."/src/Entities/Admin.php";
    $admin = Admin::update($_SESSION["admin"], ["username" => $data["username"], "password" => $data["password"]]);
    echo json_encode($admin->public());
}, AUTHENTICATION::$ADMIN);

Router::getRouter()->create("/admin/delete", function ($data) {
    require_once $_SERVER['DOCUMENT_ROOT']."/src/Entities/Admin.php";
    $admin = Admin::find($data["username"]);
    $admin->delete();
}, AUTHENTICATION::$ADMIN);

Router::getRouter()->create("/admin/login", function ($data) {
    require_once $_SERVER['DOCUMENT_ROOT']."/src/Entities/Admin.php";
    $admin = Admin::find($data["username"]);
    if ($admin !== null && $admin->getPassword() === $data["password"]) {
        $_SESSION["admin"] = $admin->getUsername();
        echo json_encode($admin->public());
    } else {
        echo json_encode(["error" => "Invalid credentials"]);
    }
}, AUTHENTICATION::$NONE);

Router::getRouter()->create("/admin/logout", function ($data) {
    require_once $_SERVER['DOCUMENT_ROOT']."/src/Entities/Admin.php";
    unset($_SESSION["admin"]);
}, AUTHENTICATION::$ADMIN);

Router::getRouter()->create("/admin/all", function ($data) {
    require_once $_SERVER['DOCUMENT_ROOT']."/src/Entities/Admin.php";
    $public = [];
    foreach (Admin::findAll() as $admin) {
        $public[] = $admin->public();
    }
    echo json_encode($public);
}, AUTHENTICATION::$ADMIN);