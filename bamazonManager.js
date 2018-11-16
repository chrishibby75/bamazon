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

connection.connect(function (err) {
    if (err) throw err;
    managerView();
});

function managerView() {
    inquirer.prompt([
        {
            name: "managerChoice",
            type: "list",
            message: "Choose a task",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
                "Exit"
            ]
        }
    ]).then(function (answer) {
        switch (answer.managerChoice) {
            case "View Products for Sale":
                viewProducts();
                break;

            case "View Low Inventory":
                lowInventory();
                break;

            case "Add to Inventory":
                addInventory();
                break;

            case "Add New Product":
                newProduct();
                break;

            case "Exit":
                connection.end();
                break;
        };
    });
};
function viewProducts() {
    //selection columns from mysql table
    var query = "SELECT item_id AS Id, product_name AS Product, Price, stock_quantity AS Stock FROM products";
    connection.query(query, function (err, data) {
        if (err) throw err;
        console.log("\n=======================================================");
        var string = JSON.stringify(data);
        var parse = JSON.parse(string);
        console.table(parse);
        console.log("=======================================================\n");
        managerView();
    });
};

function lowInventory() {
    //selecting items with less than 5 in stock
    var query = "SELECT item_id AS Id, product_name AS Product, stock_quantity AS Stock FROM products WHERE stock_quantity < 5";
    connection.query(query, function (err, data) {
        if (err) throw err;
        console.log("\n========================================================\n");
        console.log("Items inventory low in stock.");
        console.log("\n--------------------------------------------------------\n");
        var string = JSON.stringify(data);
        var parse = JSON.parse(string);
        console.table(parse);
        console.log("\n========================================================\n");
        managerView();
    });
};

function addInventory() {
    var query = "SELECT * FROM products";
    connection.query(query, function(err, data) {
        if (err) throw err;
        var string = JSON.stringify(data);
        var parse = JSON.parse(string);
        //choosing item to restock
        inquirer.prompt([
            {
                name: "restock",
                input: "input",
                message: "Which item would you like to restock?"
            },
            {
                name: "restockAmount",
                input: "input",
                message: "How many items would you like to add?"
            },
        ]).then(function(answer) {
            
            //getting amount of items in stock
            var quantity = parse[answer.restock - 1].stock_quantity;
            console.log('qty!!!', quantity);
            //product name
            var item_name = parse[answer.restock - 1].product_name;
            //choosing item to restock
            var selectedId = answer.restock;
            //amounct to restock
            var amount = answer.restockAmount;
            connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: parseInt(quantity) + parseInt(amount)
                    },
                    {
                        item_id: selectedId
                    }
                ],
                function (error) {
                    //current amounts in stock
                    var new_stock = parseInt(quantity) + parseInt(amount);
                    if (error) throw err;
                    console.log("\n===================================================\n");
                    console.log("You have added stock to the selected item.");
                    console.log("There is currently " + new_stock + " of the '" + item_name + "' in stock.");
                    console.log("\n===================================================\n");
                    managerView();
                }
            );
        });
    });
};
function newProduct() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, data) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "nameOfProduct",
                input: "input",
                message: "What is the name of the product you would like to add?"
            },
            {
                name: "nameOfDepartment",
                input: "input",
                message: "Which department does the item go to?"
            },
            {
                name: "price",
                input: "input",
                message: "How much does the product cost?",
                //checks to make sure user input is a number
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "howMany",
                input: "input",
                message: "Amount of the product currently in stock",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
        ]).then(function (answer) {
            // Using user input as values for new information for Products table
            var values = [answer.nameOfProduct, answer.nameOfDepartment, answer.price, answer.howMany];
            connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) values (?, ?, ?, ?)",
                 values,
                function (err, data) {
                    if (err) throw err;
                    console.log("\n==================================================\n");
                    console.log("Your new product has been added.\n");
                }
            )
            connection.query("SELECT item_id AS Id, product_name AS Product, stock_quantity AS Stock FROM products",
                function (err, data) {
                    if (err) throw err;
                    var string = JSON.stringify(data);
                    var parse = JSON.parse(string);
                    console.table(parse);
                    console.log("====================================================\n");
                    managerView();
                });
        });
    });
};