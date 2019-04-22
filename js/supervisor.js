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

viewOptions()
function viewOptions() {
  inquirer.prompt([prompt.supervisor.menu]).then((res) => {

    switch (res.options) {
      case 'View Sales':
        displaySales()
        break;

      case 'Create New Department':
        createDepartment()
        break;

      case 'Exit':
        connection.end();
        break;
    }
  });
}

// View product sales
function displaySales() {
  // Should list all products as a table and calculate the total profit
  // calculate total_profit = product_sales over_head_cost | not stored
  connection.query('SELECT * FROM departments JOIN products', (err, res) => {
    display(res)
  });
}

// create new department
function createDepartment() {
  let department_name = faker.commerce.department();
  prompt.supervisor.department[0].message = `Adding ${department_name}`

  inquirer.prompt(prompt.supervisor.department).then((res) => {

    if (res.confirm_product) {
      connection.query('INSERT INTO departments SET ?',
        {
          department_name: department_name,
          over_head_cost: res.over_head_cost,
        },
        function (err) {
          if (err) throw err;
          console.log(`${department_name} added`)
          // display()
          viewOptions()
        });
    } else {
      viewOptions();
    }
  });
}

// THIS ONE IS DIFFERENT BUT i STILL DON'T LIKE IT
function display(res, profit) {
  res.forEach((item) => {
    console.log(`ID ${item.department_id} | ${item.department_name} | $${item.over_head_cost} | ${profit}\n`);
  });
}