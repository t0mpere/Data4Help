-- -----------------------------------------------------
-- Schema Data4Help
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `Data4Help` DEFAULT CHARACTER SET utf8 ;
USE `Data4Help` ;

-- -----------------------------------------------------
-- Table `Data4Help`.`BusinessCustomers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Data4Help`.`BusinessCustomers` (
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `name` VARCHAR(45) NULL DEFAULT NULL,
  `partitaIva` VARCHAR(11) NULL DEFAULT NULL,
  `address` VARCHAR(45) NULL DEFAULT NULL,
  `comune` VARCHAR(45) NULL DEFAULT NULL,
  `nazione` VARCHAR(45) NULL DEFAULT NULL,
  `sessionID` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`email`),
  UNIQUE INDEX `partitaIva_UNIQUE` (`partitaIva` ASC) VISIBLE)


-- -----------------------------------------------------
-- Table `Data4Help`.`PrivateCustomers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Data4Help`.`PrivateCustomers` (
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `subToAutomatedSOS` BINARY(1) NULL DEFAULT NULL,
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `name` VARCHAR(45) NULL DEFAULT NULL,
  `surname` VARCHAR(45) NULL DEFAULT NULL,
  `sex` VARCHAR(45) NULL DEFAULT NULL,
  `placeOfBirth` VARCHAR(45) NULL DEFAULT NULL,
  `placeOfBirthProvincia` VARCHAR(2) NULL DEFAULT NULL,
  `dateOfBirth` DATE NULL DEFAULT NULL,
  `codiceFiscale` VARCHAR(16) NULL DEFAULT NULL,
  `sessionID` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`email`),
  UNIQUE INDEX `codiceFiscale_UNIQUE` (`codiceFiscale` ASC) VISIBLE)


-- -----------------------------------------------------
-- Table `Data4Help`.`PrivateRequest`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Data4Help`.`PrivateRequest` (
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `accepted` BINARY(1) NOT NULL DEFAULT '0',
  `BusinessCustomers_email` VARCHAR(100) NOT NULL,
  `PrivateCustomers_email` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`BusinessCustomers_email`, `PrivateCustomers_email`),
  INDEX `fk_PrivateRequest_BusinessCustomers1_idx` (`BusinessCustomers_email` ASC) VISIBLE,
  INDEX `fk_PrivateRequest_PrivateCustomers1_idx` (`PrivateCustomers_email` ASC) VISIBLE,
  CONSTRAINT `fk_PrivateRequest_BusinessCustomers1`
    FOREIGN KEY (`BusinessCustomers_email`)
    REFERENCES `Data4Help`.`BusinessCustomers` (`email`)
  CONSTRAINT `fk_PrivateRequest_PrivateCustomers1`
    FOREIGN KEY (`PrivateCustomers_email`)
    REFERENCES `Data4Help`.`PrivateCustomers` (`email`)


-- -----------------------------------------------------
-- Table `Data4Help`.`Queries`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Data4Help`.`Queries` (
  `timeOfSubmission` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `BusinessCustomer_email` VARCHAR(100) NOT NULL,
  `serializedParameters` MEDIUMBLOB NULL DEFAULT NULL,
  `serializedResult` LONGBLOB NULL DEFAULT NULL,
  `closed` BINARY(1) NULL DEFAULT '0',
  `periodical` BINARY(1) NULL DEFAULT NULL,
  `next_update` TIMESTAMP NULL DEFAULT NULL,
  `Title` VARCHAR(45) NOT NULL,
  `QueryID` INT(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`timeOfSubmission`, `BusinessCustomer_email`),
  UNIQUE INDEX `QueryID_UNIQUE` (`QueryID` ASC) VISIBLE,
  INDEX `BusinessCustomer_email_idx` (`BusinessCustomer_email` ASC) VISIBLE,
  CONSTRAINT `BusinessCustomer_email`
    FOREIGN KEY (`BusinessCustomer_email`)
    REFERENCES `Data4Help`.`BusinessCustomers` (`email`)


-- -----------------------------------------------------
-- Table `Data4Help`.`UserData`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Data4Help`.`UserData` (
  `PrivateCustomers_email` VARCHAR(100) NOT NULL,
  `hearthRate` INT(3) NOT NULL,
  `minBloodPressure` INT(3) NOT NULL,
  `maxBloodPressure` INT(3) NOT NULL,
  `lat` FLOAT NULL DEFAULT NULL,
  `long` FLOAT NULL DEFAULT NULL,
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `timeOfAcquisition` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`PrivateCustomers_email`, `timestamp`),
  CONSTRAINT `fk_UserData_PrivateCustomers`
    FOREIGN KEY (`PrivateCustomers_email`)
    REFERENCES `Data4Help`.`PrivateCustomers` (`email`)


-- -----------------------------------------------------
-- Table `Data4Help`.`QueryData`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Data4Help`.`QueryData` (
  `QueryID` INT(11) NOT NULL,
  `PrivateCustomers_email` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`QueryID`, `PrivateCustomers_email`),
  INDEX `fk_UserData_idx` (`PrivateCustomers_email` ASC) VISIBLE,
  CONSTRAINT `fk_Queries`
    FOREIGN KEY (`QueryID`)
    REFERENCES `Data4Help`.`Queries` (`QueryID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_UserData`
    FOREIGN KEY (`PrivateCustomers_email`)
    REFERENCES `Data4Help`.`UserData` (`PrivateCustomers_email`)