/*
 * Tests: (happy path)
 *      node app.js create --username="FooBar" --password="password123" --email="foobar@test.com"
 *      node app.js read   --username="FooBar"
 *      node app.js create --username="BizBaz" --password="password456" --email="bizbaz@test.com"
 *      node app.js list   --username="Admin"  --password="admin"
 *      node app.js update --username="FooBar" --password="password123" --email="foobar@hig.com"
 *      node app.js read   --username="FooBar"
 *      node app.js delete --username="BizBaz" --password="password456"
 *      node app.js list   --username="Admin"  --password="admin"
 * Tests: (failure)
 *      node app.js --username="FooBar" --password="password123" --email="foobar@test.com"
 *      node app.js read   --username="BingBang"
 *      node app.js create --username="FooBar" --password="password123" --email="foobar@hig.com"
 *      node app.js list   --username="Admin"  --password="admin123"
 */

// require third-party Modules
// (require'os' )Operating system 
const os = require('os');
const logger = require('logger').createLogger('log.txt');
// yargs lets me pass arguments 
const yargs = require('yargs');

// require custom Module
const users = require('./users');

// Get user info from OS
var appUser = os.userInfo();

// Get User input
// 2 is the command number for example 2 
var command = process.argv[2];
var args = yargs.argv;

var userName = args.username;
var email = args.email;
var password = args.password;
var logStatus = 'Failure';
var logMsg = '';

// validate data
if (!command || command.match(/-/g)) {
    // no command sent
    console.log('Command not found!');
} else {
    // process command
    if (command === 'create') {
        if (userName !== undefined && email !== undefined && password !== undefined) {
            var user = users.insertUsers(userName, password, email);
            if (user) {
                logStatus = "Success"
                logMsg = `User Created: ${user.username} ${user.password} ${user.email}.`;
            } else {
                logMsg = `User not created: Duplicate user (${userName}) found!`;
            }
        } else {
            logMsg = 'Missing User Data param(s).';
        }
    } else if (command === 'read') {
        if (userName === undefined) {
            logMsg = 'Missing User name param.';
        } else {
            var user = users.getUser(userName);
            if (user) {
                logStatus = 'Success';
                logMsg = `User: ${user.username} ${user.email}.`;
            } else {
                logMsg = `User (${userName}) not found!`;
            }
        }
    } else if (command === 'update') {
        if (userName !== undefined && password !== undefined && email !== undefined) {
            var user = users.updateUser(userName, password, email);
            if (user) {
                logStatus = 'Success';
                logMsg = `User Updated: ${user.username} ${user.email}.`;
            } else {
                logMsg = `User (${userName}) not found!`;
            }
        } else {
            logMsg = 'Missing User Data param(s).';
        }
    } else if (command === 'delete') {
        if (userName === undefined || password === undefined) {
            logMsg = 'Missing User name param.';
        } else {
            var user = users.deleteUser(userName, password);
            if (user) {
                logStatus = 'Success';
                logMsg = `User (${userName}) deleted.`;
            } else {
                logMsg = `User (${userName}) not found!`;
            }
        }
    } else if (command === 'list') {
        if (userName === undefined || password === undefined) {
            logMsg = 'Missing credentials.';
        } else if (userName !== "Admin" || password !== "admin") {
            logMsg = 'Invalid credentials.';
        } else {
            var userList = users.listUsers();
            if (userList.length === 0) {
                logMsg = 'No users found.';
            } else {
                logStatus = 'Success';
                logMsg = ('Users:');
                userList.forEach((val) => {
                    logMsg = `${val.username}, ${val.email}'.`;
                });
            }
        }
    } else {
        logMsg = `Command (${command}) not able to be processed.`;
    }
}

// Write log file
logger.info('App accessed by', `${appUser.username}:${logStatus}-${logMsg}`);