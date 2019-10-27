const mysql = require("mysql");
const asciiTable = require("ascii-table");
const inquirer = require("inquirer");
const colors = require("colors");

//import some universal functions
const {
    createTable,
    getProducts
} = require("./functions.js");

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
    console.log("connected as id " + con.threadId);
    console.clear();
    afterCon();
});

//make an array of the main menu choices
let choices = [
    colors.green("View Product Sales by Department"),
    colors.green("Create New Department"),
    colors.green("View Departments"),
    colors.red("exit")
]

function afterCon() {
    inquirer.prompt([{
        type: "list",
        name: "choice",
        message: "     Main Menu:\n------------------------\n",
        choices: choices
    }]).then(function (answers) {
        switch (answers.choice) {
            case choices[0]:
                //thanks to shane for helping me figure out inner join
                getProducts(
                    `SELECT departments.id, departments.department_name, over_head_costs, product_sales, product_name FROM departments
                INNER JOIN products ON departments.department_name = products.department_name`, con,
                    function (res) {
                        let infoArr = [];
                        let newDataOBJ = {};
                        res.forEach(data => {
                            if (!infoArr.includes(data.department_name)) {
                                newDataOBJ[data.department_name] = {
                                    overhead: data.over_head_costs,
                                    sales: data.product_sales || 0,
                                    id: data.id
                                }
                                infoArr.push(data.department_name)
                            } else {
                                newDataOBJ[data.department_name].sales += data.product_sales;
                            }
                        })
                        let table = new asciiTable("Sales by Department");
                        table.setHeading("id", "department", "over head costs", "product sales", "total profit");
                        infoArr.forEach(dept => {
                            let {
                                overhead,
                                sales,
                                id
                            } = newDataOBJ[dept];
                            let total = parseFloat((sales - overhead).toFixed(2))
                            table.addRow(id, dept, overhead, sales, total)
                        })
                        console.clear();
                        console.log(table.toString() + "\n");
                        afterCon();
                    });

                break;
            case choices[1]:
                console.clear();
                getDepartments(con, function () {
                    inquirer.prompt([{
                        name: "name",
                        message: "what is the new department's name?\n",
                        validate: function (name) {
                            return name !== "";
                        }
                    }, {
                        name: "cost",
                        message: "what is the new department's overhead costs?\n",
                        validate: function (name) {
                            return name !== "";
                        }
                    }]).then(function (answers) {
                        getProducts(`INSERT INTO departments (department_name, over_head_costs) VALUE ("${answers.name}", ${+answers.cost})`, con, function () {
                            getDepartments(con, function () {
                                afterCon();
                            })
                        })
                    })
                });
                break;
            case choices[2]:
                getDepartments(con, function () {
                    afterCon();
                })
                break;
            case choices[3]:
                //if the user chose "exit" option from the main menu we end the DB connection and exit the process
                console.clear();
                con.end();
                process.exit();
                break;
        }
    })
}

function getDepartments(con, cb) {
    getProducts(`SELECT * FROM departments`, con, function (res) {
        let table = new asciiTable("Sales by Department");
        table.setHeading("id", "department name", "over head costs");
        res.forEach(dept => {
            let {
                id,
                department_name,
                over_head_costs
            } = dept;
            table.addRow(id, department_name, over_head_costs)
        })
        console.clear();
        console.log(table.toString() + "\n")
        cb();
    })
}