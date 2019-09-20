DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NULL,
  department_name VARCHAR(45) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)

VALUES ("MacBook Pro", "computers", 1000, 5), ("4K Monitor", "computers", 590, 7), ("Gaming mouse", "peripherals", 10.50, 75), ("iPhone charger", "electronics", 15.00, 7), ("1TB SSD drive", "peripherals", 200, 10), ("Roku", "electronics", 15.00, 30), ("Compressed air", "accessories", 2.50, 100), ("Avengers tshirt", "clothing", 18.75, 30), ("Definitive Guide to Javascipt 7th edition", "books", 34.50, 7), ("Wicking Headband", "sportinggoods", 4.50, 750);

-- ### Alternative way to insert more than one row
-- INSERT INTO products (flavor, price, quantity)
-- VALUES ("vanilla", 2.50, 100), ("chocolate", 3.10, 120), ("strawberry", 3.25, 75);