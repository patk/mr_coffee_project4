// set up express
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set up morgan
const morgan = require("morgan");
app.use(morgan("dev"));

// set up database
const database = require("./database");

// set up view engine
app.set("view engine", "ejs");

// hash password - crypto library
const crypto = require("crypto");

// port
const PORT = 9000;
// start listening for network activity
app.listen(PORT, () => {
  console.log("server is listening on localhost", PORT);
});

// Step 2:create a GET "/login” route, which will display a form with the fields Email address and Password

//starting templating

// routes
app.get("/login", (req, res) => {
  res.render("pages/content_login_page");
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const hashedPassword = crypto
    .createHash("sha256")
    .update(req.body.password)
    .digest("hex");
  // code login logic here
  // search database to see if username and password match
  database
    .query("SELECT * FROM users WHERE email = $1", [email])
    .then((userEmail) => {
      if (userEmail.length === 0) {
        console.log("User doesn't exist");
      } else {
        if (hashedPassword === userEmail[0].password) {
          console.log("Correct email and password -> Login successful");
          // redirect to homepage
          res.redirect("/");
        } else {
          console.log("Incorrect password");
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/", (req, res) => {
  res.send("Homepage");
});

app.get("/signup", (req, res) => {
  res.send("Signup page");
});


//signin page validation and post 

app.post('/signup', (req, res) => {

  valid = true;

  if(!firstname.value.match(letters)){
      firstname.style.border = "1px solid red"
      valid = false;
     }


  if(!lastname.value.match(letters)){
      lastname.style.border = "1px solid red"
      valid = false;
  }


  if(!email.value.match(emailAdd)){
      email.style.border = "1px solid red"
      valid = false;
     }

  
  if(!password.value.match(letterNumber)){
      password.style.border = "1px solid red"
      valid = false;
     }

  if(!conf-password === password){
      password.style.border = "1px solid red"
      valid = false;
     }

  //If the email provided already exists in the database, registration must not be possible.
  
  if (valid) {
    
    database.query("INSERT INTO schedule(surname, firstname, email, password)values($1, $2, $3, $4);", [req.body.lastname, req.body.firstname, req.body.email, req.body.password])
  
    .then((newUser) => {
      res.redirect("/login")

  })

  .catch((err) => {
    //add error messgae 
  })

  }


})




//attempt to authenticate log in no. 2
/*
app.post('/login', (req, res) => {

    const user = users.find(user => user.email === req.body.email)
    if (user == null) {
        return res.status (400).send('Email address not found')
    }

    try {
        if(await compare(req.body.password, users.password)){
        res.send('Log in Sucessful')
    }

    else {
        res.send ('Log in attempt failed')
    }

    }
    
    catch {
        res.status(500).send()
    }

    

    

})*/
