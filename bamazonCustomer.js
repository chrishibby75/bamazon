//require dependancies from npm
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

//connect to mysql server and database
connection.connect(function(err) {
    if (err) throw err;
    displayProducts();
});

function displayProducts() {
    //selecting columns from product table
    connection.query("SELECT item_id AS Id, product_name AS Product, price, stock_quantity AS 'In Stock' FROM products", function(err,data) {
        if(err) throw err;
        console.log("\n==============================================================\n");
        //turning data from table into a string
        var string = JSON.stringify(data);
        var parse = JSON.parse(string);
        //using npm console.table to display mysql table as a table in console
        console.table(parse);
        console.log("================================================================\n");
        start();
    });
}

function start() {
    //selecting all from products table
    var query = "SELECT * FROM products";
    //connecting to mysql
    connection.query(query, function(err, data) {
        inquirer.prompt([
            {
                name: "itemId",
                input: "input",
                message: "What is the ID of the item you would like to purchase?",
                //checks if user input is a number
                validate: function(value) {
                    if(isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "numOfItems",
                input: "input",
                message: "How many would you like to purchase?",
                //checks if user input is a number
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }

        ]).then(function(answer) {
            //turning data from sql table into a string
            var string = JSON.stringify(data);
            //parsing through the string
            var parse = JSON.parse(string);
            //amount of stock there is of an item
            var quantity = parse[answer.itemId -1].stock_quantity;
            //checking if product is sold out
            if (quantity === 0) {
                console.log("\n=====================================================\n");
                console.log("We're all sold out of this item.  Check back later.");
                console.log("\n=====================================================\n");
                //checking if there is enough stock of desired item
            } else if (answer.numOfItems > quantity) {
                console.log("\n=====================================================\n");
                console.log("Insufficient Quantity!");
                console.log("We're sorry, but the amount you have requested exceeds what we have in stock.");
                console.log("\n=====================================================\n");
                //able to sell desired amount to user
            } else {
                //total amount of sales
                var product_sales_total = parse[answer.itemId - 1].product_sales;
                //item selected
                var selectedId = answer.itemId;
                //connection to mysql
                connection.query("UPDATE products SET ? WHERE ?",
                [
                    {
                        //updating stock
                        stock_quantity: quantity - answer.numOfItems,
                        //updating product sales
                        product_sales: (parse[answer.itemId - 1].price * answer.numOfItems) + product_sales_total
                    },
                    {
                        //updating selected item
                        item_id: selectedId
                    }
                ],
                function(error) {
                    if (error) throw err;
                    //order displayed
                    console.log("Your total comes to: $" + (parse[answer.itemId - 1].price * answer.numOfItems));
                    console.log("Your order has been placed successfully!");
                    
                }
                );
            }
            //ending connection
            connection.end();
        })
    })
};