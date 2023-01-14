<?php

Router::getRouter()->create("/user/login", function (?array $data = []) {
    require_once $_SERVER['DOCUMENT_ROOT'].'/src/Entities/Inscription.php';
    $inscription = Inscription::findOrCreate($data["email"])->public();
    $_SESSION["email"] = $data["email"];
    $_SESSION["id"] = $inscription['id'];
    echo json_encode($inscription);
}, AUTHENTICATION::$NONE);

Router::getRouter()->create('/user/get', function(?array $data = []) {
    echo json_encode(Inscription::find($data["email"])->public());
}, AUTHENTICATION::$ADMIN);

Router::getRouter()->create("/user/update", function (?array $data = []) {
    require_once $_SERVER['DOCUMENT_ROOT'].'/src/Entities/Inscription.php';
    Inscription::update($_SESSION["email"], $data["email"]);
    echo json_encode(["result" => "OK"]);
}, AUTHENTICATION::$USER);

Router::getRouter()->create('/user/delete', function () {
    require_once $_SERVER['DOCUMENT_ROOT'].'/src/Entities/Inscription.php';
    Inscription::delete($_SESSION['id']);
    echo json_encode(["result" => "OK"]);
}, AUTHENTICATION::$USER);

Router::getRouter()->create('/user/all', function () {
    require_once $_SERVER['DOCUMENT_ROOT'].'/src/Entities/Inscription.php';
    $users = Inscription::findAll();
    $public = [];
    foreach ($users as $user) {
        $public[] = $user->public();
    }
    echo json_encode($public);
}, AUTHENTICATION::$ADMIN);

Router::getRouter()->create('/user/logout', function () {
    require_once $_SERVER['DOCUMENT_ROOT'].'/src/Entities/Inscription.php';
    unset($_SESSION['email']);
    unset($_SESSION['id']);
    echo json_encode(["result" => "OK"]);
}, AUTHENTICATION::$USER);

Router::getRouter()->create('/user/updateTheme', function (?array $data = []) {
    require_once $_SERVER['DOCUMENT_ROOT'].'/src/Entities/Inscription.php';
    require_once $_SERVER['DOCUMENT_ROOT'].'/src/Entities/Theme.php';
    $inscription = Inscription::find($_SESSION['id']);
    foreach ($data["themes"] as $id) {
        $theme = Theme::find($id);
        $inscription->updateTheme($theme);
    }
    echo json_encode($inscription->public());
}, AUTHENTICATION::$USER);