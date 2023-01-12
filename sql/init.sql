#This script is to run once to create the database and tables. It is not needed after the first run, unless you want to delete the database and start over.

# sudo mysql -u root -p # login as root to create a new user and database
# CREATE DATABASE IF NOT EXISTS phpProject;
# CREATE USER IF NOT EXISTS 'phpProject'@'localhost' IDENTIFIED BY 'phpProject';
# GRANT ALL PRIVILEGES ON phpProject.* TO 'phpProject'@'localhost';
# FLUSH PRIVILEGES;
# USE phpProject;

DROP TABLE IF EXISTS `theme_inscription`;
DROP TABLE IF EXISTS `theme`;
DROP TABLE IF EXISTS `inscription`;
DROP TABLE IF EXISTS `admin`;


CREATE TABLE IF NOT EXISTS `admin` (
    `username` varchar(128) NOT NULL,
    `password` varchar(128) NOT NULL,
    PRIMARY KEY (`username`)
);


CREATE TABLE IF NOT EXISTS `theme` (
    `id` int NOT NULL AUTO_INCREMENT,
    `label` varchar(45) NOT NULL,
    PRIMARY KEY (`id`)
);


CREATE TABLE IF NOT EXISTS `inscription` (
    `id` int NOT NULL AUTO_INCREMENT,
    `email` varchar(1024) NOT NULL,
    PRIMARY KEY (`id`)
);


CREATE TABLE IF NOT EXISTS `theme_inscription` (
    `id` int NOT NULL AUTO_INCREMENT,
    `theme_id` int NOT NULL,
    `inscription_id` int NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`inscription_id`) REFERENCES `inscription`(`id`),
    FOREIGN KEY (`theme_id`) REFERENCES `theme`(`id`),
    UNIQUE KEY `inscription_id_UNIQUE` (`inscription_id`, `theme_id`)
);
