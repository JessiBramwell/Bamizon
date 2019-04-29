require('dotenv').config();
const inquirer = require('inquirer');
const prompt = require('./prompt');
const faker = require('faker');
const auth = require('./auth.js')
const mysql = require('mysql');
const Table = require('cli-table');

const connection = mysql.createConnection(auth)

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  viewOptions()
});

function viewOptions() {
  inquirer.prompt([prompt.manager.menu]).then((res) => {

    switch (res.options) {
      case 'View Products':
        displayInventory()
        break;

      case 'View Low Inventory':
        lowInventory();
        break;

      case 'Add Inventory':
        addInventory();
        break;

      case 'Add New Product':
        addProduct();
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
    viewOptions();
  });
}

function lowInventory() {
  connection.query('SELECT * FROM products WHERE stock_quantity < 5', (err, res) => {
    if (err) throw err;
    if (res) {
      display(res);
      inquirer.prompt([prompt.manager.add]).then((res) => {
        if (res.order) {
          addInventory();
        } else {
          viewOptions();
        }
      });
    } else {
      console.log('Currently no low inventory products');
    }
  });
}

function addInventory() {
  inquirer.prompt(prompt.order).then((answer) => {
    connection.query(
      'SELECT * FROM products WHERE ?',
      {
        item_id: answer.ID
      },
      function (err, res) {
        if (err) throw err;
        var item = res[0]

        connection.query('UPDATE products SET ? WHERE ?',
          [{
            stock_quantity: parseInt(item.stock_quantity) + parseInt(answer.quantity),
          },
          {
            item_id: answer.ID
          }],

          function (err) {
            if (err) throw err;
            console.log('Order successful!');
            viewOptions();
          });
      });
  });
}

function addProduct() {

  let product_name = faker.commerce.productName();
  prompt.manager.product_confirm.message = `Adding ${product_name}`

  listDepartments()

  inquirer.prompt(prompt.manager.product_confirm).then((res) => {
    if (res.confirm_product) {

      inquirer.prompt(prompt.manager.product).then((res) => {

        connection.query('INSERT INTO products SET ?',
          {
            product_name: product_name,
            department_name: res.department_name,
            price: res.product_price,
            stock_quantity: res.product_quantity,
            product_sales: 0
          },
          function (err) {
            if (err) throw err;
            console.log(`${product_name} added`)
            viewOptions()
          });
      });

    } else {
      viewOptions();
    }
  });
}

function listDepartments() {
  connection.query('SELECT department_name FROM departments', (err, res) => {

    if (err) throw err;
    res.forEach((item) => {
      prompt.manager.product[0].choices.push(item.department_name)
    });
    return prompt.manager.product[0].choices
  });
}

function display(res) {
  var table = new Table({
    head: ['ID', 'Price', 'Product', 'Department', 'Stock'],
  });
  res.forEach((item) => {
    table.push([
      item.item_id,
      '$' + item.price,
      item.product_name,
      item.department_name,
      item.stock_quantity
    ]);
  });
  console.log(table.toString());
}