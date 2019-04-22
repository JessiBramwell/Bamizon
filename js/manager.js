require('dotenv').config();
const mysql = require('mysql');
const inquirer = require('inquirer');
const prompt = require('./prompt');
const faker = require('faker');

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'bamazon_db',
});
// viewOptions()

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
        newProduct();
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
  connection.query('SELECT * FROM products WHERE stock_quantity < 5000', (err, res) => {
    if (err) throw err;
    if (res) {
      display(res);
      inquirer.prompt([prompt.manager.add]).then((res) => {
        if(res.order_inventory) {
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
            display(res);
            console.log('Inventory update pending delivery.\n');            
            viewOptions();
          });
      });
  });
}
newProduct()
function newProduct() {
  let product_name = faker.commerce.productName();
  prompt.manager.product_confirm.message = `Adding ${product_name}`
  
  connection.query('SELECT department_name FROM departments', (err, res) => {
    var department_name;
    res.foreEach((item) => {
      console.log(item.department_name)
    }); 
  }, 
  function (err) {
    if (err) throw err;
  });

  inquirer.prompt(prompt.manager.product).then((res) => {

    if (res.confirm_product) {
      connection.query('INSERT INTO products SET ?',
        {
          product_name: product_name,
          department_name: department_name,
          price: res.product_price,
          stock_quantity: res.product_quantity,
          product_sales: 0
        },
        function (err) {
          if (err) throw err;
          console.log(`${product_name} added`)
          // display()
          viewOptions()
        });
    } else {
      viewOptions();
    }
  });
}

// THIS IS REPEATED FOR EVERY JS PAGE
function display(res) {
  res.forEach((item) => {
    console.log(`ID ${item.item_id} $${item.price} ${item.product_name} | ${item.department_name} | ${item.stock_quantity}\n`);
  });
}
