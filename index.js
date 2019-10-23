let inquirer = require("inquirer");
let mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "!Anthon69",
    database: "employeetracker_db"
});

connection.connect(function (err) {
    if (err) {
        console.log("error connection " + err.stack);
        return;
    }
    console.log("connected as id " + connection.threadId);
    //allDepartment();
    //allRoles();
    //allEmployee();
    //mergealltables();
    startProgram();
});

function startProgram() {

    inquirer.prompt({

        name: "action",
        type: "list",
        message: "What do you want?",
        choices: [
            "View All Employees",
            "View Employees by Department",
            "View Employees by Role",
            "View Employees by Manager",
        ]
    }).then(function (answer) {
        console.log(answer.action);
        //SWITCH CASE or IF/Else
        if (answer.action === "View All Employees") {
            mergealltables();
        }
        if (answer.action === "View Employees by Department") {
            allEmployeePerDepartment();
        }
        if (answer.action === "View Employees by Role") {
            allEmployeePerRole();
        }
        if (answer.action === "View Employees by Manager") {
            allEmployeePerManager();
        }
    });

}




function allDepartment() {
    connection.query("select * from department", function (err, res) {
        if (err) throw err;
        console.log("All Department");
        console.table(res);
    });
}

function allRoles() {
    connection.query("select * from Role", function (err, res) {
        if (err) throw err;
        console.log("All Roles");
        console.table(res);
    });
}

function allEmployee() {
    connection.query("select * from Employee", function (err, res) {
        if (err) throw err;
        console.log("All Employee");
        console.table(res);
    });
}

function mergealltables() {
    connection.query("select E1.first_name, E1.last_name, role.title, role.salary, department.name, E2.first_name as manager from employee E1 left join role on E1.role_id = role.id left join department on role.department_id = department.id left JOIN employee E2 on E2.id = e1.manager_id", function (err, res) {
        if (err) throw err;
        //console.log("All Employee");
        console.table(res);
        startProgram();
    });
}

function allEmployeePerDepartment() {
    connection.query("select * from department", function (err, department) {
        if (err) throw err;
        let newarray = [];

        for (let i = 0; i < department.length; i++) {
            newarray.push(department[i].NAME);
        }

        inquirer.prompt({

            name: "action",
            type: "list",
            message: "Which Deparment?",
            choices: newarray

        }).then(function (answer) {
            //console.log(answer.action);
            connection.query(`select E1.first_name, E1.last_name, role.title, role.salary, department.name, E2.first_name as manager from employee E1 left join role on E1.role_id = role.id left join department on role.department_id = department.id left JOIN employee E2 on E2.id = e1.manager_id where department.name = "${answer.action}"`, function (err, res) {
                if (err) throw err;
                console.table(res);
                startProgram();
            });
        });
    });
}

function allEmployeePerRole() {
    connection.query("select * from role", function (err, role) {
        if (err) throw err;
        let newarray = [];

        for (let i = 0; i < role.length; i++) {
            newarray.push(role[i].TITLE);
        }
        //console.log(newarray);
        inquirer.prompt({

            name: "action",
            type: "list",
            message: "Which Role?",
            choices: newarray

        }).then(function (answer) {
            //console.log(answer.action);
            connection.query(`select E1.first_name, E1.last_name, role.title, role.salary, department.name, E2.first_name as manager from employee E1 left join role on E1.role_id = role.id left join department on role.department_id = department.id left JOIN employee E2 on E2.id = e1.manager_id where role.TITLE = "${answer.action}"`, function (err, res) {
                if (err) throw err;
                console.table(res);
                startProgram();
            });
        });
    });
}

function allEmployeePerManager() {

    connection.query("select * from role where title like '%manager'", function (err, manager) {
        if (err) throw err;
        let managerlistarray = [];
        for (let i = 0; i < manager.length; i++) {
            managerlistarray.push("role_id = " + manager[i].ID + " or ");
        }

        managerlistarray = managerlistarray.toString();
        managerlistarray = managerlistarray.replace(",", "");
        managerlistarray = managerlistarray.substring(0, managerlistarray.length - 3);

        connection.query(`select * from employee where ${managerlistarray}`, function (err, employeemanagersonly) {
            if (err) throw err;
            let newnewarray = [];
            for (let counter = 0; counter < employeemanagersonly.length; counter++) {
                newnewarray.push(employeemanagersonly[counter].FIRST_NAME);
                // console.log(newnewarray);
            }
            inquirer.prompt({

                name: "action",
                type: "list",
                message: "Which Manager?",
                choices: newnewarray

            }).then(function (answers) {
                console.log(answers.action);
                connection.query(`select * from employee where FIRST_NAME = '${answers.action}'`, function (err, data1) {
                    if (err) throw err;

                    connection.query(`select * from employee where manager_ID = '${data1[0].ID}'`, function (err, data2) {
                        if (err) throw err;

                        console.table(data2);
                        startProgram();
                    });

                });
            });
        });
    });
}