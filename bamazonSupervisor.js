var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require('console.Table');

var connection = mysql.createConnection({
    host: "localhost",
    PORT: 3306,
    user: "root",
    password: "password",
    database: "bamazonDB"
});