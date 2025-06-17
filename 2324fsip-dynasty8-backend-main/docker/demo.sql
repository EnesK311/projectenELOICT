-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS = @@UNIQUE_CHECKS, UNIQUE_CHECKS = 0;
SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS = 0;
SET @OLD_SQL_MODE = @@SQL_MODE, SQL_MODE =
        'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema immodb
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `immodb`;

-- -----------------------------------------------------
-- Schema immodb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `immodb` DEFAULT CHARACTER SET utf8;
USE `immodb`;

-- -----------------------------------------------------
-- Table `immodb`.`addresses`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `immodb`.`addresses`;

CREATE TABLE IF NOT EXISTS `immodb`.`addresses`
(
    `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `streetname` VARCHAR(45)  NOT NULL,
    `number`     VARCHAR(45)  NOT NULL,
    `bus`        VARCHAR(3)   NULL,
    `zip`        VARCHAR(10)  NOT NULL,
    `city`       VARCHAR(45)  NOT NULL,
    PRIMARY KEY (`id`)
)
    ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `immodb`.`immos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `immodb`.`immos`;

CREATE TABLE IF NOT EXISTS `immodb`.`immos`
(
    `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name`       VARCHAR(45)  NOT NULL,
    `address_id` INT UNSIGNED NOT NULL,
    `link`       VARCHAR(255) NULL,
    `active`     TINYINT      NOT NULL,
    `verified`   TINYINT      NOT NULL,
    `logo`       VARCHAR(45)  NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `fk_immos_adresses1_idx` (`address_id` ASC) VISIBLE,
    UNIQUE INDEX `adresses_id_UNIQUE` (`address_id` ASC) VISIBLE,
    CONSTRAINT `fk_immos_adresses1`
        FOREIGN KEY (`address_id`)
            REFERENCES `immodb`.`addresses` (`id`)
            ON DELETE CASCADE
            ON UPDATE NO ACTION
)
    ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `immodb`.`users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `immodb`.`users`;

CREATE TABLE IF NOT EXISTS `immodb`.`users`
(
    `id`       INT UNSIGNED                               NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(45)                                NOT NULL,
    `password` VARCHAR(120)                               NOT NULL,
    `email`    VARCHAR(45)                                NOT NULL,
    `immo_id`  INT UNSIGNED                               NULL DEFAULT NULL,
    `role`     ENUM ('admin', 'user', 'immo', 'employee') NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
    INDEX `fk_users_immos1_idx` (`immo_id` ASC) VISIBLE,
    CONSTRAINT `fk_users_immos1`
        FOREIGN KEY (`immo_id`)
            REFERENCES `immodb`.`immos` (`id`)
            ON DELETE CASCADE
            ON UPDATE NO ACTION
)
    ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `immodb`.`listings`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `immodb`.`listings`;

CREATE TABLE IF NOT EXISTS `immodb`.`listings`
(
    `id`          INT                                    NOT NULL AUTO_INCREMENT,
    `price`       INT                                    NULL,
    `immo_id`     INT UNSIGNED                           NOT NULL,
    `status`      ENUM ('sold', 'available', 'reserved') NOT NULL,
    `contract`    ENUM ('sale', 'rent')                  NOT NULL,
    `description` TEXT                                   NOT NULL,
    `address_id`  INT UNSIGNED                           NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `fk_listings_immos1_idx` (`immo_id` ASC) VISIBLE,
    INDEX `fk_listings_addresses1_idx` (`address_id` ASC) VISIBLE,
    CONSTRAINT `fk_listings_immos1`
        FOREIGN KEY (`immo_id`)
            REFERENCES `immodb`.`immos` (`id`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION,
    CONSTRAINT `fk_listings_addresses1`
        FOREIGN KEY (`address_id`)
            REFERENCES `immodb`.`addresses` (`id`)
            ON DELETE CASCADE
            ON UPDATE NO ACTION
)
    ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `immodb`.`properties`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `immodb`.`properties`;

CREATE TABLE IF NOT EXISTS `immodb`.`properties`
(
    `id`            INT                           NOT NULL AUTO_INCREMENT,
    `type`          ENUM ('house', 'appartement') NOT NULL,
    `living_area`   DECIMAL(8, 2)                 NOT NULL,
    `building_area` DECIMAL(8, 2)                 NULL DEFAULT NULL,
    `garden_area`   DECIMAL(8, 2)                 NULL DEFAULT NULL,
    `bedrooms`      INT                           NOT NULL,
    `bathrooms`     INT                           NOT NULL,
    `building_year` INT                           NULL,
    `epc`           VARCHAR(4)                    NULL,
    `garagesize`    INT                           NOT NULL,
    `listing_id`    INT                           NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `fk_properties_listings1_idx` (`listing_id` ASC) VISIBLE,
    CONSTRAINT `fk_properties_listings1`
        FOREIGN KEY (`listing_id`)
            REFERENCES `immodb`.`listings` (`id`)
            ON DELETE CASCADE
            ON UPDATE NO ACTION
)
    ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `immodb`.`land`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `immodb`.`land`;

CREATE TABLE IF NOT EXISTS `immodb`.`land`
(
    `id`         INT                            NOT NULL AUTO_INCREMENT,
    `type`       ENUM ('buildland', 'farmland') NOT NULL,
    `listing_id` INT                            NOT NULL,
    `area`       DECIMAL(10, 2) UNSIGNED        NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `fk_land_listings1_idx` (`listing_id` ASC) VISIBLE,
    CONSTRAINT `fk_land_listings1`
        FOREIGN KEY (`listing_id`)
            REFERENCES `immodb`.`listings` (`id`)
            ON DELETE CASCADE
            ON UPDATE NO ACTION
)
    ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `immodb`.`pictures`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `immodb`.`pictures`;

CREATE TABLE IF NOT EXISTS `immodb`.`pictures`
(
    `id`             INT         NOT NULL AUTO_INCREMENT,
    `listing_id`     INT         NOT NULL,
    `thumbnail_name` VARCHAR(45) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `fk_pictures_listings1_idx` (`listing_id` ASC) VISIBLE,
    CONSTRAINT `fk_pictures_listings1`
        FOREIGN KEY (`listing_id`)
            REFERENCES `immodb`.`listings` (`id`)
            ON DELETE CASCADE
            ON UPDATE NO ACTION
)
    ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `immodb`.`favorites`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `immodb`.`favorites`;

CREATE TABLE IF NOT EXISTS `immodb`.`favorites`
(
    `user_id`    INT UNSIGNED NOT NULL,
    `listing_id` INT NOT NULL,
    PRIMARY KEY (`user_id`, `listing_id`),
    INDEX `fk_users_has_listings_listings1_idx` (`listing_id` ASC) VISIBLE,
    INDEX `fk_users_has_listings_users1_idx` (`user_id` ASC) VISIBLE,
    CONSTRAINT `fk_users_has_listings_users1`
        FOREIGN KEY (`user_id`)
            REFERENCES `immodb`.`users` (`id`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION,
    CONSTRAINT `fk_users_has_listings_listings1`
        FOREIGN KEY (`listing_id`)
            REFERENCES `immodb`.`listings` (`id`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION
)
    ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `immodb`.`detailpictures`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `immodb`.`detailpictures`;

CREATE TABLE IF NOT EXISTS `immodb`.`detailpictures`
(
    `picture_id` INT         NOT NULL,
    `image_name` VARCHAR(45) NOT NULL,
    INDEX `fk_detailpictures_pictures1_idx` (`picture_id` ASC) VISIBLE,
    CONSTRAINT `fk_detailpictures_pictures1`
        FOREIGN KEY (`picture_id`)
            REFERENCES `immodb`.`pictures` (`id`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION
)
    ENGINE = InnoDB;

DROP TABLE IF EXISTS `immodb`.`refresh_tokens`;

CREATE TABLE IF NOT EXISTS `immodb`.`refresh_tokens`
(
    `id`          INT(11) NOT NULL AUTO_INCREMENT,
    `token`       VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `user_id`     INT UNSIGNED NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_refresh_tokens_users`
        FOREIGN KEY (`user_id`)
            REFERENCES `immodb`.`users` (`id`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION
) ENGINE = InnoDB;


SET SQL_MODE = @OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS = @OLD_UNIQUE_CHECKS;
