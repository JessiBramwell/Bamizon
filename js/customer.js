require('dotenv').config();
const mysql = require('mysql');
const inquirer = require('inquirer');
const prompt = require('./prompt');

// THESE ARE REPEATED FOR EVERY JS PAGE
var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'bamazon_db',
});

function display(res) {
  res.forEach((item) => {

    console.log(
      'ID ' + item.item_id,
      '$' + item.price,
      item.product_name,
      '|' + item.department_name + '|',
      item.stock_quantity
    );
  });
}
// FIND SOLUTION 

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  viewOptions()
});

function viewOptions() {
  inquirer.prompt([prompt.customer.menu]).then((res) => {

    switch (res.options) {
      case 'View Products':
        displayInventory()
        break;

      case 'Order Item':
        orderItem()
        break;

      case 'Exit':
        connection.end();
        break;
    }
  });
}

function displayInventory() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    display(res)
    viewOptions()
  });
}

function orderItem() {
  inquirer.prompt(prompt.order).then((answer) => {

    connection.query(
      "SELECT * FROM products WHERE ?",
      {
        item_id: answer.ID
      },

      function (err, res) {
        if (err) throw err;
        var item = res[0]
        var total = answer.quantity * item.price

        if (item.stock_quantity > answer.quantity) {
          connection.query("UPDATE products SET ? WHERE ?",
            [{
              stock_quantity: item.stock_quantity - answer.quantity,
              product_sales: item.product_sales + total
            },
            {
              item_id: answer.ID
            }],

            function (err) {
              if (err) throw err;
              console.log("Order successful! \nYour total was $" + total);
              viewOptions();
            });

        } else {
          console.log("Out of stock. Please select fewer itmes");
          orderItem();
        }
      });
  });
}
