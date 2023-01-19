<?php

Router::getRouter()->create('/theme', function (?array $data = []) {
    require_once $_SERVER['DOCUMENT_ROOT'].'/src/Entities/Theme.php';
    $theme = Theme::find($data["label"])->public();
    echo json_encode($theme);
}, AUTHENTICATION::$NONE);

Router::getRouter()->create('/theme/create', function (?array $data = []) {
    require_once $_SERVER['DOCUMENT_ROOT'].'/src/Entities/Theme.php';
    $theme = Theme::create($data["label"]);
    echo json_encode($theme->public());
}, AUTHENTICATION::$ADMIN);

Router::getRouter()->create('/theme/delete', function (?array $data = []) {
    require_once $_SERVER['DOCUMENT_ROOT'].'/src/Entities/Theme.php';
    Theme::delete($data["id"]);
    echo json_encode(["result" => "OK"]);
}, AUTHENTICATION::$ADMIN);

Router::getRouter()->create('/theme/all', function () {
    require_once $_SERVER['DOCUMENT_ROOT'].'/src/Entities/Theme.php';
    $themes = Theme::findAll();
    $public = [];
    foreach ($themes as $theme) {
        $public[] = $theme->public();
    }
    echo json_encode($public);
}, AUTHENTICATION::$USER);

Router::getRouter()->create('/theme/count', function () {
    require_once $_SERVER['DOCUMENT_ROOT'].'/src/Entities/Theme.php';
    echo json_encode(Theme::count());
}, AUTHENTICATION::$USER);