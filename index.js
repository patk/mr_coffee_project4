// set up express
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set up morgan
const morgan = require("morgan");
app.use(morgan("dev"));

// set up database
//const database = require("./database");

// port
const PORT = 9000;
// start listening for network activity
app.listen(PORT, () => {
  console.log("server is listening on localhost", PORT);
});

// Step 2:create a GET "/login” route, which will display a form with the fields Email address and Password

//starting templating

app.set("view engine", "ejs");

// routes
app.get("/", (req, res) => {
  res.send("Homepage");
});
app.get("/login", (req, res) => {
  res.render("pages/content_users_new", {});
});

//import crypto library
const crypto = require("crypto");

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
