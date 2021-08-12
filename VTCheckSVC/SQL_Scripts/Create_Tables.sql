DROP Database IF EXISTS vtchecksql;
CREATE Database vtchecksql;

USE vtchecksql;

DROP TABLE IF EXISTS Location;
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Admin;
DROP TABLE IF EXISTS SignIn;
DROP TABLE IF EXISTS UserRole;

CREATE TABLE `Location` (
  `Location_ID` int AUTO_INCREMENT,
  `Name` varchar(50),
  `Room` varchar(50),
  `Address` varchar(50),
  `Manager` int,
  `CurrentOccupancy` int,
  `Limit` int,
  `isInfected` bit,
  PRIMARY KEY (`Location_ID`)
);

CREATE INDEX `FK` ON  `Location` (`Manager`);

CREATE TABLE `User` (
  `User_ID` int AUTO_INCREMENT,
  `Username` varchar(50),
  `Password` varchar(50),
  `Role_ID` int,
  `isInfected` bit,
  PRIMARY KEY (`User_ID`)
);

CREATE INDEX `FK` ON  `User` (`Role_ID`);

CREATE TABLE `Admin` (
  `Admin_ID` int AUTO_INCREMENT,
  `Name` varchar(50),
  `isInfected` bit,
  PRIMARY KEY (`Admin_ID`)
);

CREATE TABLE `SignIn` (
  `Sign_ID` int AUTO_INCREMENT,
  `User_ID` int,
  `Location_ID` int,
  `Sign_Date` datetime,
  `isCheckedOut` int,
  PRIMARY KEY (`Sign_ID`)
);

CREATE INDEX `FK` ON  `SignIn` (`User_ID`, `Location_ID`);

CREATE TABLE `UserRole` (
  `Role_ID` int AUTO_INCREMENT,
  `Role` varchar(50),
  PRIMARY KEY (`Role_ID`)
);

