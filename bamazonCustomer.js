var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 8889,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    askInput ();
  });
  
  function askInput () {
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What product id would you like to buy?",
        choices: [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10"
        ]
      })
      .then(function(answer) {
        var query = "SELECT item_id FROM products WHERE ?";
        connection.query(query, { item_id: answer.choice }, function(err, res) {
            console.log(query.sql);

          if (err) throw err;
          console.log("Item id: " + item_id from inquirer answer  + "has " + stock_quantity + " quantity available.");
          })
      })
    };