<?php
include_once "config.inc.php";

class PdoConnexion
{
    private static ?PDO $connexion = null;
    public static function getConnexion(): PDO
    {
        if (self::$connexion == null) {
            self::$connexion = new PDO(dsn, username, password);
            self::$connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            self::$connexion->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE,PDO::FETCH_ASSOC);
            self::$connexion->setAttribute (PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, true);
        }
        return self::$connexion;
    }

}