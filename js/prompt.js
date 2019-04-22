const prompt = {
  customer: {
    menu: {
      type: 'list',
      choices: ['View Products', 'Order Item', 'Exit'],
      message: 'Options:',
      name: 'options'
    }
  },
  order: [{
    type: 'input',
    message: 'Enter Item ID',
    name: 'ID'
  },
  {
    type: 'input',
    message: 'Quantity:',
    name: 'quantity'
  }],
  manager: {
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
      name: 'product_price'
    },
    {
      type: 'input',
      message: 'Quantity:',
      name: 'product_quantity'
    }]
  },
  supervisor: {
    menu: {
      type: 'list',
      choices: ['View Sales', 'Create New Department', 'Exit'],
      message: 'Options:',
      name: 'options'
    },
    department: [{
      type: 'confirm',
      message: '',
      name: 'confirm_product'
    },
    {
      type: 'input',
      message: 'Overhead Cost:',
      name: 'over_head_cost'
    }]
  }
}

module.exports = prompt