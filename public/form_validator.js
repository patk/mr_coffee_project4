document.addEventListener("DOMContentLoaded", () => {
  // initialise sign up form
  var signupForm = document.getElementById("signup-form");

  // initialise input elements
  const surname = document.getElementById("surname");
  const firstname = document.getElementById("firstname");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const confPassword = document.getElementById("confPassword");

  signupForm.onsubmit = (event) => {
    // prevent reloading the page
    event.preventDefault();

    // get input values
    const surnameValue = surname.value;
    const firstnameValue = firstname.value;
    const emailValue = email.value;
    const passwordValue = password.value;
    const confPasswordValue = confPassword.value;

    //regular expressions
    var letters = /^[A-Za-z]+$/;
    var letterNumber = /^[\.a-zA-Z0-9,!? ]*$/;
    var emailAdd = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    //let valid = true;

    if (!letters.test(surnameValue)) {
      surname.style.border = "2px solid red";
      //valid = false;
    }
    if (!letters.test(firstnameValue)) {
      firstname.style.border = "2px solid red";
      //valid = false;
    }
    if (!emailAdd.test(emailValue)) {
      email.style.border = "2px solid red";
      //valid = false;
    }
    if (!letterNumber.test(passwordValue)) {
      password.style.border = "2px solid red";
      //valid = false;
    }
    if (confPassword !== confPasswordValue) {
      confPassword.style.border = "2px solid red";
      //valid = false;
    }
  };
});
