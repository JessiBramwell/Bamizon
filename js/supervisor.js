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
  inquirer.prompt([prompt.supervisor.menu]).then((res) => {

    switch (res.options) {
      case 'View Sales':
        displaySales();
        break;

      case 'Create New Department':
        createDepartment();
        break;

      case 'Exit':
        connection.end();
        break;
    }
  });
}

function displaySales() {

  const query =
    `SELECT 
      d.department_id, 
      d.department_name, 
      d.over_head_cost, 
      SUM(p.product_sales) AS total_sales, 
      SUM(p.product_sales) - d.over_head_cost AS total_profit  
    FROM departments d 
    JOIN products p USING(department_name) 
    GROUP BY department_name`

  connection.query(query, (err, res) => {
    if (err) throw err;
    display(res)
    viewOptions()
  });
}

function createDepartment() {
  var department_name = faker.commerce.department();

  prompt.supervisor.confirm.message = `Adding ${department_name}`

  inquirer.prompt(prompt.supervisor.confirm).then((res) => {
    if (res.confirm_department) {
      inquirer.prompt(prompt.supervisor.overhead).then((res) => {

        connection.query('INSERT INTO departments SET ?',
          {
            department_name: department_name,
            over_head_cost: res.over_head_cost,
          },
          function (err, res) {
            if (err) throw err;
            console.log(`${department_name} added. Rows Effected: ${res.affectedRows}`)
            viewOptions()
          });
      });
    } else {
      viewOptions();
    }
  });
}

function display(res) {
  var table = new Table({
    head: ['ID', 'Department', 'Over Head', 'Sales', 'Total Profit'],
  })
  res.forEach((item) => {
    table.push([
      item.department_id,
      item.department_name,
      '$' + item.over_head_cost,
      '$' + item.total_sales,
      '$' + item.total_profit
    ]);
  });
  console.log(table.toString());
}