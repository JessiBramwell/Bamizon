require('dotenv').config();
const mysql = require('mysql');
const inquirer = require('inquirer');
// const faker = require('faker')
const prompt = require('./prompt')

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'bamazon_db',
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  displayInventory();
});

function displayInventory() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    res.forEach((item) => {

      console.log(
        'ID ' + item.item_id,
        '$' + item.price,
        item.product_name,
        '|' + item.department_name + '|',
        item.stock_quantity
      );
    });

    order()
  });
}

function order() {
  inquirer.prompt(prompt.order).then((answer) => {

    connection.query(
      `SELECT * FROM products WHERE ${answer.ID}`, function (err, res) {
        if (err) throw err;
        var item = res[0]
        var total = answer.quantity * item.price        

        if (item.stock_quantity > answer.quantity) {
          connection.query("UPDATE products SET ? WHERE ?",
            [{
              stock_quantity: parseInt(item.stock_quantity) - parseInt(answer.quantity),
              product_sales: parseInt(item.product_sales) + parseInt(total)
            },
            {
              item_id: answer.ID
            }], 
            
            function (err) {
              if(err) throw err;
              console.log("Order successful! \nYour total was $" + total);
              displayInventory();
            });

        } else {
          console.log("Out of stock. Please select fewer itmes");
          order();
        }
      });
  });
}
