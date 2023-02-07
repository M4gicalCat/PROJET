<?php

Router::getRouter()->create("/admin", function () {
    require_once $_SERVER['DOCUMENT_ROOT']."/src/Entities/Admin.php";
    $admin = Admin::find($_SESSION["admin"]);
    echo json_encode($admin->public());
}, AUTHENTICATION::$ADMIN);

Router::getRouter()->create("/admin/create", function (?array $data = []) {
    require_once $_SERVER['DOCUMENT_ROOT']."/src/Entities/Admin.php";
    $admin = Admin::create($data["username"], $data["password"]);
    echo json_encode($admin->public());
}, AUTHENTICATION::$ADMIN);

Router::getRouter()->create("/admin/update", function (?array $data = []) {
    require_once $_SERVER['DOCUMENT_ROOT']."/src/Entities/Admin.php";
    $admin = Admin::update($data['oldUsername'], ["username" => $data["newUsername"], "password" => $data["password"]]);
    $_SESSION['admin'] = $data["username"];
    echo json_encode($admin->public());
}, AUTHENTICATION::$ADMIN);

Router::getRouter()->create("/admin/delete", function (?array $data = []) {
    require_once $_SERVER['DOCUMENT_ROOT']."/src/Entities/Admin.php";
    $admin = Admin::find($data["username"]);
    $admin->delete();
    echo json_encode('{}');
}, AUTHENTICATION::$ADMIN);

Router::getRouter()->create("/admin/login", function (?array $data = []) {
    require_once $_SERVER['DOCUMENT_ROOT']."/src/Entities/Admin.php";
    $admin = Admin::find($data["username"]);
    if ($admin !== null && $admin->getPassword() === $data["password"]) {
        $_SESSION["admin"] = $admin->getUsername();
        echo json_encode($admin->public());
    } else {
        echo json_encode(["error" => "Invalid credentials"]);
    }
}, AUTHENTICATION::$NONE);

Router::getRouter()->create("/admin/all", function () {
    require_once $_SERVER['DOCUMENT_ROOT']."/src/Entities/Admin.php";
    $public = [];
    foreach (Admin::findAll() as $admin) {
        $public[] = $admin->public();
    }
    echo json_encode($public);
}, AUTHENTICATION::$ADMIN);

Router::getRouter()->create('/admin/createInscription', function (?array $data = []) {
    require_once $_SERVER['DOCUMENT_ROOT']."/src/Entities/Inscription.php";
    $inscription = Inscription::create($data["email"]);
    echo json_encode($inscription->public());
}, AUTHENTICATION::$ADMIN);

Router::getRouter()->create('/admin/updateInscription', function (?array $data = []) {
    require_once $_SERVER['DOCUMENT_ROOT']."/src/Entities/Inscription.php";
    $inscription = Inscription::update($data["id"], $data["email"], $data["themes"]);
    echo json_encode($inscription->public());
}, AUTHENTICATION::$ADMIN);

Router::getRouter()->create('/admin/deleteInscription', function (?array $data = []) {
    require_once $_SERVER['DOCUMENT_ROOT']."/src/Entities/Inscription.php";
    Inscription::delete($data["id"]);
    echo json_encode(["result" => "OK"]);
}, AUTHENTICATION::$ADMIN);

Router::getRouter()->create('/admin/updateUserTheme', function (array $data) {
    require_once $_SERVER['DOCUMENT_ROOT'].'/src/Entities/Inscription.php';
    require_once $_SERVER['DOCUMENT_ROOT'].'/src/Entities/Theme.php';
    $inscription = Inscription::find($data['id']);
    foreach ($data["themes"] as $id) {
        $theme = Theme::find($id);
        $inscription->updateTheme($theme);
    }
    echo json_encode($inscription->public());
}, AUTHENTICATION::$USER);