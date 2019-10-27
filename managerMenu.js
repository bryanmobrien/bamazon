const colors = require("colors");
const asciiTable = require("ascii-table");
const inquirer = require("inquirer");
const cfonts = require("cfonts");


const createTable = require("./functions.js").createTable;
const getProducts = require("./functions.js").getProducts;

//function that takes a sting, mysql connection, and a callback function
module.exports = function (str, connection, cb) {
    //run a given string through a switch case
    switch (str) {
        case colors.green("View Products for Sale"):
            //if the user chose "View Products for Sale" option from the main menu we query the database to get all of the products from the DB
            getData(connection, cb);
            break;
        case colors.green("View Low Inventory"):
            //if the user chose "View Low Inventory" option from the main menu we run the low inventory function
            lowInventory(connection, cb);
            break;
        case colors.green("Add to Inventory"):
            //if the user chose "Add to Inventory" option from the main menu we run the add inventory function
            addInventory(connection, cb);
            break;
        case colors.green("Add New Product"):
            //if the user chose "Add New Product" option from the main menu we run the add product function
            addProduct(connection, cb);
            break;
        case colors.red("exit"):
            //if the user chose "exit" option from the main menu we end the DB connection and exit the process
            connection.end();
            process.exit();
            break;
    }
}

//query the database to get all of the products from the DB
function getData(connection, cb) {
    getProducts(`SELECT * FROM products`, connection, function (res) {
        //after we have gotten the data we create a table for the data so it looks nice, we are clearing the terminal
        let table = createTable(res);
        console.clear();
        //log the table to the terminal to show the products that we currently have, run the passed in callback function
        console.log(table.toString() + "\n\n");
        cb();
    });
}

//get the new information from the user and add the product to the database
function addProduct(connection, cb) {
    //prompt the user for the name, department, price, quantity of the new product
    inquirer.prompt([{
        name: "name",
        message: "What is the name of the new item? :",
        validate: function (name) {
            return name !== "";
        }
    }, {
        name: "department",
        message: "what is the department this item belongs to? :",
        validate: function (name) {
            return name !== "";
        }
    }, {
        name: "price",
        message: "what is the sale price? :",
        validate: function (name) {
            return name !== "";
        }
    }, {
        name: "quantity",
        message: "how many of this item do we have in stock? :",
        validate: function (name) {
            return name !== "";
        }
    }]).then(function (answers) {
        //insert the new data into the database 
        getProducts(`INSERT INTO products (product_name, department_name, price, stock_quantity)
            VALUES ("${answers.name}", "${answers.department}", ${+answers.price}, ${+answers.quantity});`, connection, function (resolve) {
                //get the data from the database and display the updated information from the database on screen and run the callback function to bring up the main menu again
            getData(con, cb);
        })
    })
}

//prompt the user to choose what product to add inventory to
function addInventory(connection, cb) {
    //get and display the data on screen to help the user decide what to update
    getData(connection, function () {
        //ask the user what id to update and how much to add to it
        inquirer.prompt([{
            name: "id",
            message: "What is the id of the product you would like to update?\n"
        }, {
            name: "count",
            message: "how much would you like to add to the inventory?\n"
        }]).then(function (answers) {
            //update the id in the database with the new quantity
            getProducts(`UPDATE products SET stock_quantity= stock_quantity + ${parseInt(answers.count)} WHERE item_id=${answers.id}`, connection, function (resolve) {
                //display the new data on screen and run the callback function to get to the main menu
                getData(connection, cb);
            })
        })
    });
}

//this checks for anything in the database that is less than 5 in in quantity and displays the relevant data to the user
function lowInventory(connection, cb) {
    getProducts(`SELECT * FROM products WHERE stock_quantity BETWEEN 0 AND 5`, connection, function (res) {
        //if nothing is returned from the database
        if (res.length === 0) {
            //clear the console and use the cfonts package we imported earlier to make a cool looking message for "No Low Inventory Found" instead of plain old text 
            console.clear();
            cfonts.say("No Low Inventory\nFound", {
                align: "left",
                background: "transparent",
                font: "block",
                colors: ["blue", "red"]
            })
            //return the callback function so the function stops here
            return cb();
        }
        //create a table for the new data, clear the console, display the table in the console and run the callback function
        let table = createTable(res);
        console.clear();
        console.log(table.toString() + "\n\n");
        cb();
    });
}