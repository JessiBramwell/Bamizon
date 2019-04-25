require('dotenv').config();
const inquirer = require('inquirer');
const prompt = require('./prompt');
// const connection = require('./connection');
const mysql = require('mysql');
const Table = require('cli-table');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'bamazon_db',
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  viewOptions()
  listDepartments()
});

function display(res) {
  var table = new Table({
    head: ['ID', 'Price', 'Product', 'Department', 'Stock'],
  })
  res.forEach((item) => {
    table.push([
      item.item_id,
      item.price,
      item.product_name,
      item.department_name,
      item.stock_quantity
    ]);
  });
  console.log(table.toString());
}

function viewOptions() {
  inquirer.prompt([prompt.customer.menu]).then((res) => {

    switch (res.options) {
      case 'View Products':
        displayInventory()
        break;

      case 'Search by Department':
        searchDepartment()
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
  connection.query(
    "SELECT * FROM products", (err, res) => {

      if (err) throw err;
      display(res)
      viewOptions()
    });
}

function searchDepartment() {
  inquirer.prompt(prompt.customer.search).then((res) => {
    console.log(res.department_name)
    connection.query(
      'SELECT * FROM products WHERE ?', {
        department_name: res.department_name
      }, (err, res) => {
        if (err) throw err;
        display(res);
      });
  });
}

function listDepartments() {
  connection.query(
    'SELECT DISTINCT department_name FROM products', (err, res) => {

      if (err) throw err;
      res.forEach((item) => {
        prompt.customer.search.choices.push(item.department_name);
      });
      return prompt.customer.search.choices
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
