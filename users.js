// require Node's built-in Modules
const fs = require('fs');

// read persisted data from file
var getUsers = () => {
    try {
        var usersString = fs.readFileSync('users.json');
        return JSON.parse(usersString);        
    } catch (err) {
        return [];
    }
};

// persist data in file
var saveUsers = (users) => {
    fs.writeFileSync('users.json', JSON.stringify(users));      
};

// Insert a Mountain
var insertUsers = (username, password,email) => {
    var users = getUsers();
    
    // in ES6, if param and prop names are the same,
    // you can use the following syntax instead of
    // name: name, elev: elev
    var user = {
      username,
      password,
      email
    };
    
    // ensure no dups
    var duplicateUsers = users.filter((user) => {
        return (user.username === username || user.email === email);
    });
    
    // persist the moutains
    if (duplicateUsers.length === 0) {
        users.push(user);
        saveUsers(users);
        return user;
    }
};

// Get a single Mountain by mountain name
var getUser = (username) => {
    var users = getUsers();
    // ES6 single-line command
    var filteredUsers = users.filter((user) => user.username === username);
    return filteredUsers[0];
};

// "Update" (delete and insert) a Mountain
var updateUser = (username, password,email) => {
  var users= getUsers();
  var filteredUsers = users.filter((user) => user.username === username && user.password === password);

  // verify Mountain exists
  if (filteredUsers.length > 0) {
    // delete the existing Mountian
    deleteUser(username,password);
    // insert new Mountain
    return insertUsers(username, password,email);
  }
  
  return filteredUsers[0];
};

// Delete a Mountain
var deleteUser = (username,password) => {
    var users = getUsers();
    var filteredUsers = users.filter((user) => user.username !== username && user.password!==password);

    saveUsers(filteredUsers);
    
    return users.length !== filteredUsers.length;
};

// Return all Mountains
var listUsers = () => {
  return getUsers();
};

// Here, we are exporting the functions we want to expose / invoke from app.js
// Note these functions could have been wrapped in a single Object, as was done in demo/app.js
module.exports = {
  insertUsers,
  getUser,
  updateUser,
  deleteUser,
  listUsers
};