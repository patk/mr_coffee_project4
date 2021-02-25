// set up express
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set up morgan
const morgan = require("morgan");
app.use(morgan("dev"));

// static files
const path = require("path");
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
//app.use("/static", express.static(path.join(__dirname, "public")));

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
    .then((user) => {
      if (user.length === 0) {
        console.log("User doesn't exist");
        res.redirect("/login");
      } else {
        if (hashedPassword === user[0].password) {
          console.log("Correct email and password -> Login successful");
          // redirect to homepage
          res.redirect("/" + user[0].user_id);
        } else {
          console.log("Incorrect password");
          res.redirect("/login");
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/", (req, res) => {
  database.query("SELECT * FROM schedules").then((schedules) => {
    res.render("pages/content_home", {
      schedules: schedules,
    });
  });
});

app.get("/:userId(\\d+)/", (req, res) => {
  const userId = req.params.userId;
  database
    //.query("SELECT * FROM schedules WHERE user_id = $1", [userId])
    .query(
      "SELECT schedules.user_id, users.firstname, users.surname, schedules.day, schedules.start_time, schedules.end_time FROM schedules LEFT JOIN users ON schedules.user_id = users.user_id;"
    )
    //.query("SELECT * FROM schedules")
    .then((schedules) => {
      var firstname = "";
      var surname = "";
      for (let i = 0; i < schedules.length; i++) {
        if (schedules[i].user_id === Number(userId)) {
          firstname = schedules[i].firstname;
          surname = schedules[i].surname;
        }
      }
      res.render("pages/content_home", {
        schedules: schedules,
        firstname: firstname,
        surname: surname,
      });
    });
});

app.get("/signup", (req, res) => {
  res.render("pages/content_signup");
});

//signin page validation and post

app.post("/signup", (req, res) => {
  valid = true;

  if (!firstname.value.match(letters)) {
    firstname.style.border = "1px solid red";
    valid = false;
  }

  if (!lastname.value.match(letters)) {
    lastname.style.border = "1px solid red";
    valid = false;
  }

  if (!email.value.match(emailAdd)) {
    email.style.border = "1px solid red";
    valid = false;
  }

  if (!password.value.match(letterNumber)) {
    password.style.border = "1px solid red";
    valid = false;
  }

  if (!conf - password === password) {
    password.style.border = "1px solid red";
    valid = false;
  }

  //If the email provided already exists in the database, registration must not be possible.

  if (valid) {
    database
      .query(
        "INSERT INTO schedule(surname, firstname, email, password)values($1, $2, $3, $4);",
        [
          req.body.lastname,
          req.body.firstname,
          req.body.email,
          req.body.password,
        ]
      )

      .then((newUser) => {
        res.redirect("/login");
      })

      .catch((err) => {
        //add error messgae
      });
  }
});
