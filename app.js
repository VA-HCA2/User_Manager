/*
 * Tests: (happy path)
 *      node app.js create --name="Mt. Washington" --elev="6,288"
 *      node app.js read   --name="Mt. Washington"
 *      node app.js create --name="Mt. Adams" --elev="0,000"
 *      node app.js list
 *      node app.js update --name="Mt. Adams" --elev="5,799"
 *      node app.js read   --name="Mt. Adams"
 *      node app.js delete --name="Mt. Adams"
 *      node app.js list
 */ 

// require third-party Modules
const os = require('os');
const logger = require('logger').createLogger('log.txt');
const yargs = require('yargs');

// require custom Module
const users = require('./users');

// Get user info from OS
var appUser = os.userInfo();

// Get User input
var command = process.argv[2];
console.log(process.argv);

var args = yargs.argv;

var userName = args.username;
var email = args.email;
var password = args.password;
var logStatus = 'Failure';
var logMsg = '';

// validate data
if (command.match(/-/g)) {
    // no command sent
    console.log('Command not found!');
} else {
    // process command
    if (command === 'create') {
        if (userName !== undefined && email!== undefined && password !== undefined) {
            var user = users.insertUsers(userName, password,email);
            if (user) {
                console.log(`User Created: ${user.username} ${user.password} ${user.email}.`);
            } else {
                console.log(`User not created: Duplicate user (${userName}) found!`);
            }  
        } else {
            console.log('Missing User Data param(s).');
        }
    } else if (command === 'read') {
        if (userName === undefined) {
            console.log('Missing User name param.');
        } else {
            var user = users.getUser(userName);
            if (user) {
                console.log(`User: ${user.username} ${user.email}.`);
            } else {
                console.log(`User (${userName}) not found!`);
            }  
        }
    } else if (command === 'update') {
        if (userName !== undefined && password !== undefined && email !== undefined) {
            var user = users.updateUser(userName, password,email);
            if (user) {
                console.log(`User Updated: ${user.username} ${user.email}.`);
            } else {
                console.log(`User (${userName}) not found!`);
            }  
        }  else {
            console.log('Missing User Data param(s).');
        }
    } else if (command === 'delete') {
        if (userName === undefined || password === undefined ) {
            console.log('Missing User name param.');
        } else {
            var user = users.deleteUser(userName, password);
            if (user) {
                console.log(`User (${userName}) deleted.`);
            } else {
                console.log(`User (${userName}) not found!`);
            }  
        }
    } else if (command === 'list') {
        var userList = users.listUsers();
        if (userList.length === 0) {
            console.log('No users found.');
        } else {
            console.log('Users:');
            userList.forEach((val) => {
                console.log(`${val.username}, ${val.password}, ${val.email}'.`);
            });
        }
    } else {
        console.log(`Command (${command}) not able to be processed.`);
    }
}

// Write log file
logger.info('App accessed by', `${appUser.username}:${logStatus}-${logMsg}`);