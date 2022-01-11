//Creates a new class for users
class User {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }
}
//creates a new class that will contain the registered users
class UserRepository {
  constructor(keyLocalStorage) {
    this.keyLocalStorage = keyLocalStorage;
    var savedStuff = localStorage.getItem(this.keyLocalStorage);
    if (!savedStuff) {
      localStorage.setItem(keyLocalStorage, "[]");
    }
  }
//Checks if there are users on localstorage
  getUsers() {
    return JSON.parse(localStorage.getItem(this.keyLocalStorage));
  }
//Adds a new user to localstorage
  saveUser(user) {
    var savedUsers = JSON.parse(localStorage.getItem(this.keyLocalStorage));
    savedUsers.push(user);
    localStorage.setItem(this.keyLocalStorage, JSON.stringify(savedUsers));
  }
//checks if the user has already registered on the page, based on checking all emails registered on localstorage
  getUserByEmail(email) {
    var savedUsers = JSON.parse(localStorage.getItem(this.keyLocalStorage));
    var foundUser;
    savedUsers.forEach((user) => {
      if (user.email === email) {
        foundUser = user;
      }
    });
    return foundUser || null;
  }
}
//session tokens
function base64encode(value) {
    return btoa(value);
}

function base64decode(value) {
    return atob(value);
}

//Creates a new userRepository
var userRepo = new UserRepository("users");


function checkIfLoggedIn() {
    var session = localStorage.getItem("session");
    if (!session) {
        return false;
    }
    var foundUser = userRepo.getUserByEmail(base64decode(session));
    if (!foundUser) {
        return false
    }
    return true;
}
//redirects the user to main store page, if is logged
if (checkIfLoggedIn()) {
  window.location = "/index.html";
}

var loginBox = document.getElementById("login");
var regBox = document.getElementById("register");
var forgetBox = document.getElementById("forgot");

var loginTab = document.getElementById("lt");
var regTab = document.getElementById("rt");
//registration tab
function regTabFun() {
  event.preventDefault();

  regBox.style.visibility = "visible";
  loginBox.style.visibility = "hidden";
  forgetBox.style.visibility = "hidden";

  regTab.style.backgroundColor = "#5cb85c";
  loginTab.style.backgroundColor = "#5bc0de";
}
//login tab
function loginTabFun() {
  event.preventDefault();

  regBox.style.visibility = "hidden";
  loginBox.style.visibility = "visible";
  forgetBox.style.visibility = "hidden";

  loginTab.style.backgroundColor = "#5cb85c";
  regTab.style.backgroundColor = "#5bc0de";
}
//restore password tab
function forTabFun() {
  event.preventDefault();

  regBox.style.visibility = "hidden";
  loginBox.style.visibility = "hidden";
  forgetBox.style.visibility = "visible";

  regTab.style.backgroundColor = "#5cb85c";
  loginTab.style.backgroundColor = "#5bc0de";
}

function register() {
  event.preventDefault();

  //var email = document.getElementById("re").value;
  var email = $('#re').val(); //changed to jQuery
  //var password = document.getElementById("rp").value;
  var password = $('#rp').val(); //changed to jQuery
  //var passwordRetype = document.getElementById("rrp").value;
  var passwordRetype = $('#rrp').val(); //changed to jQuery


//registration conditions
  if (email == "") {
    $("#inboxNotification").prepend('<h5>Ingresa tu email<h5>');
    $("h5").css("color", "red");
    //alert("Ingresa tu email.");
    $("h5").fadeOut(1000);
    return;
  } else if (password == "") {
    $("#inboxNotification").prepend('<h5>Ingresa tu contraseña<h5>');
    $("h5").css("color", "red");
    //alert("Ingresa tu contraseña.");
    $("h5").fadeOut(1000);
    return;
  } else if (passwordRetype == "") {
    $("#inboxNotification").prepend('<h5>Ingresa tu contraseña<h5>');
    $("h5").css("color", "red");
    //alert("Ingresa tu contraseña.");
    $("h5").fadeOut(1000);
    return;
  } else if (password != passwordRetype) {
    $("#inboxNotification").prepend('<h5>Las contraseñas no coinciden<h5>');
    $("h5").css("color", "red");
    //alert("Las contraseñas no coinciden.");
    $("h5").fadeOut(1000);
    return;
  }
//check if the email is already registered on localstorage
  var userExists = userRepo.getUserByEmail(email);
  if (userExists) {
    $("#inboxNotification").prepend('<h5>El email ya existe<h5>');
    $("h5").css("color", "red");
    //alert("Ingresa tu email.");
    $("h5").fadeOut(1000);
      //alert("El email " + email + "ya existe");
      return;
  }

  //After registrationm adds the new user to localstorage and shows a message
  var newUser = new User(email, password);
  userRepo.saveUser(newUser);
  const registrationMessage = "  Gracias por registrarte. \nYa puedes iniciar sesión";
  const notificationRegistration = document.getElementById('inboxNotification');
  notificationRegistration.innerHTML = registrationMessage;
  
  
 
  //document.getElementById("re").value = "";
  $('#re').val(""); //changed to jQuery
  //document.getElementById("rp").value = "";
  $('#rp').val(""); //changed to jQuery
  //document.getElementById("rrp").value = "";
  $('#rrp').val(""); //changed to jQuery
}
//alows an already registered user to sign in
function login() {
  event.preventDefault();

  //var email = document.getElementById("se").value;
  var email = $('#se').val(); //changed to jQuery
  //var password = document.getElementById("sp").value;
  var password = $('#sp').val(); //changed to jQuery

  if (email === "") {
    $("#inboxNotification").prepend('<h5>Ingresa tu email<h5>');
    $("h5").css("color", "red");
      //alert("Ingresa tu email.");
      $("h5").fadeOut(1000);
      return;
  }
  if (password == "") {
    $("#inboxNotification").prepend('<h5>Se requiere una contraseña<h5>');
    $("h5").css("color", "red");
    //alert("Se requiere una contraseña.");
    $("h5").fadeOut(1000);
    return;
  }

  var foundUser = userRepo.getUserByEmail(email);
  if (!foundUser) {
    $("#inboxNotification").prepend('<h5>Email no registrado<h5>');
    $("h5").css("color", "red");
    //alert("Email no registrado.");
    $("h5").fadeOut(1000);
    return;
  }
  if (foundUser.password !== password) {
    $("#inboxNotification").prepend('<h5>La contraseña es incorrecta<h5>');
    $("h5").css("color", "red");
      //alert("La contraseña es incorrecta")
      $("h5").fadeOut(1000);
  }
//generates session token
  localStorage.setItem("session", base64encode(email));
 

  //document.getElementById("se").value = "";
  $('#se').val(""); //changed to jQuery
  //document.getElementById("sp").value = "";
  $('#sp').val(""); //changed to jQuery

//redirects the user to the main store
  window.location = "/index.html";
  return;
}

//allows a user to restore its password
function forgot() {
  event.preventDefault();
//const inboxMessage = "Se envió un mail para la recuperación de la contraseña. Revise su bandeja de entrada \n Gracias";
  //var email = document.getElementById("fe").value;
  var email = $('#fe').val(); //changed to jQuery
  //const notification = document.getElementById('inboxNotification');
  $('#inboxNotification').prepend('<h5>Se envió un mail para la recuperación de la contraseña. Revise su bandeja de entrada \n Gracias</h5>'); //changed to jQuery
  $("h5").fadeOut(4000);
  //document.getElementById("fe").value = "";
  $('#fe').val(""); // changed to jQuery
}
