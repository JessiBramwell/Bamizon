const customer = {
  menu: {
    type: 'list',
    choices: ['View Products', 'Search by Department', 'Order Item', 'Exit'],
    message: 'Options:',
    name: 'options'
  },
  search: {
    type: 'list',
    choices: [],
    message: 'Select Department',
    name: 'department_name'
  }
}

const order = [{
  type: 'input',
  message: 'Enter Item ID',
  name: 'ID',
  validate: function (value) {
    if (isNaN(value) === false) {
      return true;
    }
    return false;
  }
},
{
  type: 'input',
  message: 'Quantity:',
  name: 'quantity',
  validate: function(value) {
    if (isNaN(value) === false) {
      return true;
    }
    return false;
  }
}]

const manager = {
  add: {
    type: 'confirm',
    message: 'Would you like to order more inventory?',
    name: 'order'
  },
  menu: {
    type: 'list',
    choices: ['View Products', 'View Low Inventory', 'Add Inventory', 'Add New Product', 'Exit'],
    message: 'Options:',
    name: 'options'
  },
  product_confirm: {
    type: 'confirm',
    message: '',
    name: 'confirm_product'
  },
  product: [{
    type: 'list',
    choices: [],
    message: 'Select Department',
    name: 'department_name'
  },
  {
    type: 'input',
    message: 'Price:',
    name: 'product_price',
    validate: function (value) {
      if (isNaN(value) === false) {
        return true;
      }
      return false;
    }
  },
  {
    type: 'input',
    message: 'Quantity:',
    name: 'product_quantity',
    validate: function (value) {
      if (isNaN(value) === false) {
        return true;
      }
      return false;
    }
  }]
}

const supervisor = {
  menu: {
    type: 'list',
    choices: ['View Sales', 'Create New Department', 'Exit'],
    message: 'Options:',
    name: 'options'
  },
  confirm: {
    type: 'confirm',
    message: '',
    name: 'confirm_department'
  },
  overhead: {
    type: 'input',
    message: 'Overhead Cost:',
    name: 'over_head_cost',
    validate: function (value) {
      if (isNaN(value) === false) {
        return true;
      }
      return false;
    }
  }
}

module.exports = {
  customer: customer,
  order: order,
  manager: manager,
  supervisor: supervisor
}  