//import packages from npm
const mysql = require("mysql");
const inquirer = require("inquirer");
const colors = require("colors");

//define an array of the managers choices
let choices = [
    colors.green("View Products for Sale"),
    colors.green("View Low Inventory"),
    colors.green("Add to Inventory"),
    colors.green("Add New Product"),
    colors.red("exit")
];

//import the manager function
const functions = require("./managerMenu.js");

//ask the question of what does the user want to do
function askQuestions(cb) {
    inquirer.prompt([{
        type: "list",
        name: "id",
        message: "     Main Menu:\n------------------------",
        choices: choices
    }]).then(function (answers) {
        console.clear();
        functions(answers.id, con, function () {
            askQuestions();
        });
    });
}


let con = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "root",
    database: "bamazon"
});

//connect to the database
con.connect(function (err) {
    if (err) throw err;
    console.clear();
    // console.log("connected as id " + con.threadId);
    askQuestions();
});