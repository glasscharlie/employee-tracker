const inquirer =require("inquirer")
const mysql = require('mysql2');
const cTable = require('console.table');

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'store_db'
    },
    console.log(`Connected to the store_db database.`)
  );


function start() {
    inquirer
    .prompt(
    [{
        type: 'rawlist',
        name: 'choice',
        message: 'What do you want to do?',
        choices:['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update role', 'quit']
      }]
    )
    .then((answers) => {
        switch(answers.choice) {
            case 'view all departments':
                viewAllDepartments()
              break;
            case 'view all roles':
              viewAllRoles()
              break;
            case 'view all employees':
                viewAllEmployees()
                break;
            case 'add a department':
                addDepartment()
                break;
            case 'add a role':
                addRoll()
                break;
            case 'add an employee':
                addEmployee()
                break;
            case 'update role':
                updateRoll()
                break;
            default:
                break
          }
})
}

function viewAllDepartments() {
    const sql = `SELECT id, name as departments FROM departments`;
    db.query(sql, (err, result) => {
        console.table(result)
        start()
      });
}

function viewAllRoles() {
    db.query('SELECT roles.id AS id, roles.roll_name AS title, departments.name as department, roles.salary FROM roles JOIN departments ON roles.department_id = departments.id;', function (err, results) {
        console.table(results)
        start()
})
}

function viewAllEmployees() {
    db.query('SELECT employees.id AS id, employees.first_name AS first_name, employees.last_name as last_name, roles.roll_name as role, roles.salary as salary, employees.manager_name as manager FROM employees JOIN roles ON employees.roll_id = roles.id;', function (err, results) {
        console.table(results)
        start()
})
}

function addDepartment() {
    inquirer
    .prompt([
        {
            type: 'input',
            name: 'department_name',
            message: 'What is the name of the department',
          }])
          .then((answers) => {
            console.log(answers)
            db.query(`INSERT INTO departments (name) VALUES ("${answers.department_name}")`, function (err, result) {
                console.log('department added')
                start()   
                })
              });
}

function addRoll() {
    db.query(`SELECT id, name as departments FROM departments`, function(err, result) { 
        let arr = []
        for (let i = 0; i < result.length; i++) {
            arr.push(result[i].departments)
        }
        inquirer
        .prompt([
            {
                type: 'input',
                name: 'role_name',
                message: 'What is the name of the role?',
              },
              {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of the role?',
              },
              {
                type: 'rawlist',
                name: 'department',
                message: 'What department do you want to add the role to?',
                choices:arr
              }])
              .then((answers) => {
                let department_id;
                for (let x = 0; x < result.length; x++) {
                    if(answers.department === result[x].departments) {
                        department_id = result[x].id

                    }
                    
                }
                salary = parseInt(answers.salary)
                string = `INSERT INTO roles (roll_name, salary, department_id) VALUES ("${answers.role_name}", ${salary}, ${department_id})`
                console.log(string)
                db.query(string, function (err, result) {
                console.log('role added')
                 start()   
                    })
                  });
           })

}

function addEmployee() {
    db.query(`SELECT id, roll_name as roles FROM roles`, function(err, result) { 
        let arr = []
        for (let i = 0; i < result.length; i++) {
            arr.push(result[i].roles)
        }

        db.query(`SELECT first_name, last_name FROM employees`, function(err, results) { 
            let otherarr = ['None']
            for (let x = 0; x < results.length; x++) {
                let str = `${results[x].first_name} ${results[x].last_name}`
                otherarr.push(str)
                
            }
        inquirer
        .prompt([
            {
                type: 'input',
                name: 'first_name',
                message: 'What is their first name?',
              },
              {
                type: 'input',
                name: 'last_name',
                message: 'What is their last name?',
              },
              {
                type: 'rawlist',
                name: 'role',
                message: 'What is their job title?',
                choices:arr
              },
              {
                type: 'rawlist',
                name: 'manager',
                message: 'Who is their manager?',
                choices:otherarr
              }])
              .then((answers) => {
                let roll_id;
                for (let x = 0; x < result.length; x++) {
                    if(answers.role === result[x].roles) {
                        roll_id = result[x].id
                    }
                    
                }
                console.log(roll_id)

                string = `INSERT INTO employees (first_name, last_name, roll_id, manager_name) VALUES ("${answers.first_name}", "${answers.last_name}", ${roll_id}, "${answers.manager}")`
                db.query(string, function (err, result) {
                console.log('Employee added')
                 start()   
                    })
                  });
           })
        })
    }

function updateRoll() {
    console.log('sadsadasd')
    db.query(`SELECT id, roll_name as roles FROM roles`, function(err, result) { 
        let arr = []
        for (let i = 0; i < result.length; i++) {
            arr.push(result[i].roles)
        }

        db.query(`SELECT first_name, last_name FROM employees`, function(err, results) { 
            let otherarr = []
            for (let x = 0; x < results.length; x++) {
                let str = `${results[x].first_name} ${results[x].last_name}`
                otherarr.push(str)
                
            }
            console.log(arr, otherarr)
        inquirer
        .prompt([
  
              {
                type: 'rawlist',
                name: 'name',
                message: 'Who do you want to update?',
                choices:otherarr
              },
              {
                type: 'rawlist',
                name: 'role',
                message: 'What is their their new role?',
                choices:arr
              }])
              .then((answers) => {
                let roll_id;
                for (let x = 0; x < result.length; x++) {
                    if(answers.role === result[x].roles) {
                        roll_id = result[x].id
                    }
                    
                }
                console.log(roll_id)
                let name = answers.name
                name = name.split(' ')
                console.log(name)

                string = `UPDATE employees SET roll_id=${roll_id} WHERE first_name = "${name[0]}" and last_name = "${name[1]}";`
                db.query(string, function (err, result) {
                console.log('Employee updated')
                 start()   
                    })
                  });
           })
        })
}




start()