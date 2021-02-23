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

/*

//attempt to authenticate log in no. 1

app.post('/login', (req, res) => {

users.findOne({
    email: req.body.email
})

.then (users => {
    if (users.password === req.body.password){
        
        res.render('pages/content_homepage', {
        
        })


    }
})

})

*/

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
