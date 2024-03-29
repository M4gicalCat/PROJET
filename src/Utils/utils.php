<?php

class AUTHENTICATION {
    public static int $NONE = 0;
    public static int $USER = 1;
    public static int $ADMIN = 2;
}

/**
 * Checks that a user is authenticated
 * A user will set the $_SESSION["email"] variable, whereas an admin will set the $_SESSION["admin"] variable
 * @return int
 */
function authenticate(): int
{
    if (!isset($_SESSION["email"]) && !isset($_SESSION["admin"])) return AUTHENTICATION::$NONE;
    return isset($_SESSION["email"]) ? AUTHENTICATION::$USER : AUTHENTICATION::$ADMIN;
}