-- setting up bamazon database with table and columns
DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products(

item_id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(100) NOT NULL, 
department_name VARCHAR(50) NOT NULL,
price NUMERIC (10, 6) NOT NULL,
stock_quantity INT NOT NULL,
product_sales NUMERIC(10, 6),
PRIMARY KEY (item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("table", "furniture", 350.00, 100);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("television", "electronics", 750.00, 48);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUE ("wine rack","home goods", 150.00, 75);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUE ("shower curtain", "home goods", 19.00, 250);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUE ("ceiling fan", "home goods", 175.00, 55);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUE ("surround sound", "electronics", 250.00, 35);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUE ("bounce house", "toys", 190.00, 18);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUE ("swing set", "toys", 899.00, 9);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUE ("wool coat", "clothing", 275.00, 25);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUE ("miter saw", "power tools", 450.00, 23);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUE ("tires", "automotive", 400.00, 15);

