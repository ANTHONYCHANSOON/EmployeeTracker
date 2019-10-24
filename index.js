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
            "View Employees by Manager",
            "View Employees by Department",
            "View Employees by Role",
            "Add Employee",
            "Remove Employee",
            "Update Employee Role",
            "Update Employee Manager",
            "View All Roles",
            "Add Role",
            "Remove Role",
            "View All Departments",
            "Add Department",
            "Remove Department",
            "Quit"
        ]
    }).then(function (answer) {
        console.log(answer.action);
        //SWITCH CASE or IF/Else
        if (answer.action === "View All Employees") {
            mergealltables();
        }
        if (answer.action === "View Employees by Manager") {
            allEmployeePerManager();
        }
        if (answer.action === "View Employees by Department") {
            allEmployeePerDepartment();
        }
        if (answer.action === "View Employees by Role") {
            allEmployeePerRole();
        }
        if (answer.action === "Add Employee") {
            addEmployee();
        }
        if (answer.action === "Remove Employee") {
            removeEmployee();
        }
        if (answer.action === "Update Employee Role") {
            updateEmployeeRole();
        }
        if (answer.action === "Update Employee Manager") {
            updateEmployeeManager();
        }
        if (answer.action === "View All Roles") {
            allRoles();
        }
        if (answer.action === "Add Role") {
            addRole();
        }
        if (answer.action === "Remove Role") {
            removeRole();
        }
        if (answer.action === "View All Departments") {
            allDepartment();
        }
        if (answer.action === "Add Department") {
            addDepartment();
        }
        if (answer.action === "Remove Department") {
            removeDepartment();
        }
        if (answer.action === "Quit") {
            console.log("BYE BYE");
        }
    });

}

function allDepartment() {
    connection.query("select NAME from department", function (err, res) {
        if (err) throw err;
        console.log("All Department");
        console.table(res);
        startProgram();
    });
}

function allRoles() {
    connection.query("select ROLE.TITLE, ROLE.SALARY, Department.NAME from Role inner join department on role.department_ID = department.ID", function (err, res) {
        if (err) throw err;
        console.table(res);
        startProgram();
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
                //console.log(answers.action);
                connection.query(`select * from employee where FIRST_NAME = '${answers.action}'`, function (err, data1) {
                    if (err) throw err;
                    //console.log(data1);
                    connection.query(`select employee.FIRST_NAME, employee.LAST_NAME, role.TITLE, role.SALARY  from employee left join role on employee.role_ID = role.ID where manager_ID = ${data1[0].ID}`, function (err, data2) {
                        if (err) throw err;
                        console.table(data2);
                        startProgram();
                    });

                });
            });
        });
    });
}

function addEmployee() {

    console.log("Employee Information");

    inquirer.prompt({

        name: "action",
        type: "Text",
        message: "First Name"

    }).then(function (fname) {
        //console.log(fname.action);

        inquirer.prompt({

            name: "action",
            type: "Text",
            message: "Last Name"

        }).then(function (lname) {
            //console.log(lname.action);

            connection.query("select * from role", function (err, data) {
                if (err) throw err;
                //console.log(data);

                let newarrayy = [];

                for (let counter = 0; counter < data.length; counter++) {
                    newarrayy.push(data[counter].TITLE);
                }

                inquirer.prompt({

                    name: "action",
                    type: "list",
                    message: "Which Role?",
                    choices: newarrayy

                }).then(function (answers) {
                    //console.log(answers.action);

                    connection.query(`select * from role where TITLE = '${answers.action}'`, function (err, roleid) {
                        if (err) throw err;
                        //console.log(roleid[0].ID);

                        //get manager code here.

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
                                    //console.log(answers.action);
                                    connection.query(`select * from employee where FIRST_NAME = '${answers.action}'`, function (err, managerid) {
                                        if (err) throw err;
                                        //console.log(managerid[0].ID);

                                        //console.log(fname.action, lname.action,roleid[0].ID, managerid[0].ID);

                                        connection.query(`insert into employee (FIRST_NAME, LAST_NAME, ROLE_ID, MANAGER_ID) VALUES ('${fname.action}','${lname.action}', ${roleid[0].ID}, ${managerid[0].ID})`);
                                        if (err) throw err;
                                        console.log("+1 Employee!");
                                        startProgram();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

function removeEmployee() {
    connection.query("select * from Employee", function (err, res) {

        if (err) throw err;
        let newarray = [];

        for (let i = 0; i < res.length; i++) {
            newarray.push(res[i].FIRST_NAME);
        }
        inquirer.prompt({

            name: "action",
            type: "list",
            message: "Which Employee?",
            choices: newarray

        }).then(function (answer) {
            connection.query(`delete from employee where FIRST_NAME = '${answer.action}'`);
            startProgram();
        });

    });
}

function updateEmployeeRole() {
    connection.query("select * from Employee", function (err, res) {

        if (err) throw err;
        let newarray = [];

        for (let i = 0; i < res.length; i++) {
            newarray.push(res[i].FIRST_NAME);
        }
        //console.log(newarray);

        inquirer.prompt({

            name: "action",
            type: "list",
            message: "Which Employee?",
            choices: newarray

        }).then(function (answer) {
            //console.log(answer.action);
            //where clause ----- FIRST_NAME = answer.action
            // console.log(answer.action);

            connection.query("select TITLE from role", function (err, res1) {
                if (err) throw err;
                let rolearray = [];
                for (let i = 0; i < res1.length; i++) {
                    rolearray.push(res1[i].TITLE);
                }

                inquirer.prompt({
                    name: "action",
                    type: "list",
                    message: "role?",
                    choices: rolearray
                }).then(function (answerrole) {
                    // console.log(answerrole.action);

                    connection.query(`select ID from role where TITLE = '${answerrole.action}'`, function (err, roleid) {
                        // console.log(roleid[0].ID);

                        // console.log("FNAME roleID");
                        // console.log(answer.action, roleid[0].ID);

                        connection.query(`update employee set role_ID = ${roleid[0].ID} where FIRST_NAME = '${answer.action}'`, function (err, res) {
                            if (err) throw err;
                            startProgram();
                        })
                    })
                });

            })
        });

    });
}

function updateEmployeeManager() {
    connection.query("select * from Employee", function (err, res) {

        if (err) throw err;
        let newarray = [];

        for (let i = 0; i < res.length; i++) {
            newarray.push(res[i].FIRST_NAME);
        }
        //console.log(newarray);

        inquirer.prompt({

            name: "action",
            type: "list",
            message: "Which Employee?",
            choices: newarray

        }).then(function (answer) {
            //where clause ----- FIRST_NAME = answer.action
            //console.log(answer.action);

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
                        message: "New Manager?",
                        choices: newnewarray

                    }).then(function (answers) {
                        //console.log(answers.action);
                        connection.query(`select ID from employee where FIRST_NAME = '${answers.action}'`, function (err, data1) {
                            if (err) throw err;
                            //console.log(data1);

                            //console.log("employee name", answer.action);
                            //console.log("manager ID", data1[0].ID);

                            connection.query(`update employee set MANAGER_ID = ${data1[0].ID} where FIRST_NAME = '${answer.action}'`, function (err, data2) {
                                if (err) throw err;
                                startProgram();
                            });

                        });
                    });
                });
            });

        });

    });
}

function addRole() {
    console.log("Role Info");
    inquirer.prompt({

        name: "action",
        type: "Text",
        message: "Title"

    }).then(function (title) {

        inquirer.prompt({
            name: "action",
            type: "Text",
            message: "Salary"
        }).then(function (salary) {

            connection.query("select NAME from department", function (res, depts) {
                // console.table(depts);
                let deptarry = []
                for (let i = 0; i < depts.length; i++) {
                    deptarry.push(depts[i].NAME);
                }
                //console.log(deptarry);
                inquirer.prompt({
                    name: "action",
                    type: "list",
                    message: "Which Department?",
                    choices: deptarry
                }).then(function (pickeddepartment) {
                    //console.log(pickeddepartment.action);

                    connection.query(`select ID from department where NAME = '${pickeddepartment.action}'`, function (err, deptid) {
                        // console.log(deptid[0].ID);
                        if (err) throw err;

                        connection.query(`insert into role (TITLE, SALARY, DEPARTMENT_ID) VALUES ('${title.action}', ${salary.action}, ${deptid[0].ID})`, function (err, res) {
                            if (err) throw err;
                            startProgram();
                        })
                    })
                })
            })
        });
    });
}

function removeRole() {
    connection.query("select * from role", function (err, data) {
        if (err) throw err;
        let newarry = [];

        for (let i = 0; i < data.length; i++) {
            newarry.push(data[i].TITLE);
        }
        console.log(newarry);

        inquirer.prompt({
            name: "action",
            type: "list",
            message: "Delete Role?",
            choices: newarry

        }).then(function (role) {
            //console.log(pickeddepartment.action);

            connection.query(`delete from role where TITLE = '${role.action}'`, function (err, deptid) {
                // console.log(deptid[0].ID);
                if (err) throw err;
                startProgram();
            })
        })
    })
}

function addDepartment() {
    inquirer.prompt({
        name: "action",
        type: "Text",
        message: "Department"
    }).then (function(newdept) {
        connection.query(`insert into department (NAME) values ('${newdept.action}')`, function(err, res){
            if(err) throw err;
            startProgram();
        })
    })
}

function removeDepartment() {
    connection.query("select * from department", function(err, res) {
        if(err)throw err;
        // console.log(res);
        let newarry = [];
        for(let i =0; i < res.length; i++){
            newarry.push(res[i].NAME);
        }
        // console.log(newarry);

        inquirer.prompt({
            name: "action",
            type: "list",
            message: "Delete Role?",
            choices: newarry
        }).then(function(dept){
            //console.log(dept.action);

            connection.query(`delete from department where NAME = '${dept.action}'`, function(err,res){
                if (err) throw err;
                startProgram();
            })

        })
    })
}