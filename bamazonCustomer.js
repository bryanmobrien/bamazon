const mysql = require("mysql");
const inquirer = require("inquirer");
const {createTable, getProducts} = require("./functions.js");
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    afterCon();
});

//things that need to run after the connection is established
function afterCon(){
    //query the database in a function because yes
    getProducts(`SELECT * FROM products`, connection, function(res){
        //create a table with the resulting data, clear the terminal, and log the newly created table to it
        let table = createTable(res, true);
        console.clear();
        console.log(table.toString()+"\n")
        //run the ask questions function that inquires about what product the user would like to buy
        askQuestions(function(answers){
            //filter the data we got from the database earlier for the id we just got from the user
           let item = res.filter(thing => parseInt(thing.item_id) === parseInt(answers.item_id));
           //if the id does not exist then give the user an error and end the database connection 
            if (!item[0]) {
                connection.end();
                return console.log("incorrect item id given: no product found!")
            }
            //if the number given was to big/small log that it was an issue and end the database connection
            if (parseInt(answers.quantity) > parseInt(item[0].stock_quantity) || parseInt(answers.quantity) <= 0){
                connection.end();
                return console.log("Insufficient quantity!\nOrder Canceled")
            }
            //get the total price
            let totalPrice = item[0].price * parseInt(answers.quantity);
            //update the item in the database for both the quantity and the product_sales
            getProducts(`UPDATE products SET stock_quantity=${ parseInt(item[0].stock_quantity) - parseInt(answers.quantity)},product_sales=${item[0].product_sales + totalPrice} WHERE item_id=${item[0].item_id}`, connection, function(resolve){
                //get the products table again and display it for the user as well as the price
                getProducts(`SELECT * FROM products`, connection, function (res) {
                    let table = createTable(res, true);
                    console.clear();
                    console.log(table.toString()+
`\n\n**********************
      YOUR ORDER\n**********************
 quantity: ${parseInt(answers.quantity)}
Item name: ${item[0].product_name}
  Item id: ${item[0].item_id}
----------------------
    Total: ${totalPrice}\n\n`)
                    connection.end();
                });
            })
        })
    })
}

    //this function will ask the user what they would like to buy and how much
function askQuestions(cb){
  inquirer.prompt([
      {
          name: "item_id",
          message: "What is the ID of the product you would like to buy?\n",
          validate: function(name){
              return name !== "";
          }
      },
      {
          name: "quantity",
          message: "how many would like to buy?\n",
          validate: function(name){
              return name !== "";
          }
      }
  ]).then(function(answers) {
   cb(answers)
  })
}