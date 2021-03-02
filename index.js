// set up express and express-session
const express = require("express");
const session = require("express-session");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const TWO_HOURS = 1000 * 60 * 60 * 2;

const {
  NODE_ENV = "development",
  SESS_NAME = "sid",
  SESS_SECRET = "keyboard-cat",
  SESS_LIFETIME = TWO_HOURS,
} = process.env;

const IN_PROD = NODE_ENV === "production";

app.use(
  session({
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRET,
    cookie: {
      maxAge: SESS_LIFETIME,
      sameSite: true,
      secure: IN_PROD,
    },
  })
);

// port
const PORT = 9400;
// start listening for network activity
app.listen(PORT, () => {
  console.log("server is listening on localhost", PORT);
});

// set up morgan
const morgan = require("morgan");
app.use(morgan("dev"));

// static files
const path = require("path");
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

// set up database
const database = require("./database");

// set up view engine
app.set("view engine", "ejs");

// hash password - crypto library
const crypto = require("crypto");

var userId = 0;

// middleware functions
const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect("/login");
  } else {
    next();
  }
};

const redirectHome = (req, res, next) => {
  if (req.session.userId) {
    res.redirect("/" + userId);
  } else {
    next();
  }
};

// routes
app.get("/login", redirectHome, (req, res) => {
  res.render("pages/content_login_page");
});

app.post("/login", redirectHome, (req, res) => {
  const email = req.body.email;
  const hashedPassword = crypto
    .createHash("sha256")
    .update(req.body.password)
    .digest("hex");

  let errorMessage = "";
  database
    .query("SELECT * FROM users WHERE email = $1", [email])
    .then((user) => {
      if (user.length === 0) {
        errorMessage = "Invalid email or password";
        res.render("pages/content_login_page", {
          message: errorMessage,
        });
      } else {
        if (hashedPassword === user[0].password) {
          console.log("Correct email and password -> Login successful");
          userId = user[0].user_id;
          // put userId to the session object
          req.session.userId = userId;
          // redirect to homepage
          res.redirect("/" + userId);
        } else {
          errorMessage = "Invalid email or password";
          res.render("pages/content_login_page", {
            message: errorMessage,
          });
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/", redirectLogin, (req, res) => {
  database.query("SELECT * FROM schedules").then((schedules) => {
    res.render("pages/content_home", {
      schedules: schedules,
    });
  });
});

app.get("/:userId(\\d+)/", redirectLogin, (req, res) => {
  const userId = req.params.userId;
  var datetime = new Date();
  const currentDate = datetime.toString().slice(0, 15);

  database
    .query(
      "SELECT schedules.user_id, users.firstname, users.surname, schedules.day, schedules.start_time, schedules.end_time FROM schedules LEFT JOIN users ON schedules.user_id = users.user_id;"
    )
    .then((schedules) => {
      database
        .query("SELECT firstname FROM users WHERE user_id = $1", [userId])
        .then((firstname) => {
          res.render("pages/content_home", {
            userId: userId,
            schedules: schedules,
            firstname: firstname,
            date: currentDate,
          });
        });
    });
});

app.get("/:userId(\\d+)/user", (req, res) => {
  const userId = req.params.userId;
  database
    .query(
      "SELECT day, start_time, end_time FROM schedules WHERE user_id = $1",
      [userId]
    )
    .then((schedules) => {
      database
        .query(
          "SELECT firstname, surname, email FROM users WHERE user_id = $1",
          [userId]
        )
        .then((user) => {
          res.render("pages/content_user", {
            userId: userId,
            user: user,
            schedules: schedules,
          });
        });
    });
});

app.get("/:userId(\\d+)/scheduleManagement", (req, res) => {
  const userId = req.params.userId;
  database
    .query(
      "SELECT schedules.user_id, users.firstname, users.surname, users.email, schedules.day, schedules.start_time, schedules.end_time FROM schedules LEFT JOIN users ON schedules.user_id = users.user_id WHERE users.user_id = $1",
      [userId]
    )
    .then((schedules) => {
      database
        .query(
          "SELECT firstname, surname, email FROM users WHERE user_id = $1",
          [userId]
        )
        .then((user) => {
          res.render("pages/content_schedule_mng", {
            userId: userId,
            user: user,
            schedules: schedules,
          });
        });
    });
});

app.get("/signup", redirectHome, (req, res) => {
  res.render("pages/content_signup");
});

//regular expressions
var letters = /^[A-Za-z]+$/;
var letterNumber = /^[\.a-zA-Z0-9,!? ]*$/;
var emailAdd = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

app.post("/signup", redirectHome, (req, res) => {
  const surname = req.body.surname;
  const firstname = req.body.firstname;
  const email = req.body.email;
  const password = req.body.password;
  const confPassword = req.body.confPassword;

  let valid = true;
  let errorMessage = [];

  if (!letters.test(surname)) {
    errorMessage.push("Invalid surname");
    valid = false;
  }
  if (!letters.test(firstname)) {
    errorMessage.push("Invalid firstname");
    valid = false;
  }
  if (!emailAdd.test(email)) {
    errorMessage.push("Invalid email");
    valid = false;
  }
  if (!letterNumber.test(password)) {
    errorMessage.push("Invalid password");
    valid = false;
  }
  if (confPassword !== password) {
    errorMessage.push("Password doesn't match");
    valid = false;
  }

  if (valid) {
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");
    database
      .query(
        "INSERT INTO users(surname, firstname, email, password) VALUES($1, $2, $3, $4);",
        [surname, firstname, email, hashedPassword]
      )
      .then((newUser) => {
        res.redirect("/login");
      })
      .catch((err) => {
        //add error messgae
      });
  } else {
    res.render("pages/content_signup", {
      message: errorMessage,
    });
  }
});

app.get("/logout", redirectLogin, (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/login");
    if (err) {
      return res.redirect("/" + userId);
    }
  });
});

/*
//schedule management form
app.get("/scheduleManagement", (req, res) => {
  res.render("pages/content_schedule_mng");
});

/*app.post("/signup", (req, res) => {
  const user_id = 1; //need to find out how to generate session uder_id
  const day = req.body.day;
  const start_time = req.body.startingTime;
  const end_time = req.body.finishingTime;

  database
    .query(
      "INSERT INTO schedules(user_id, day, start_time, end_time) VALUES($1, $2, $3, $4);",
      [user_id, day, start_time, end_time]
    )
    .then((newSchedule) => {
      res.redirect("/scheduleManagement");
    })
    .catch((err) => {
      //add error messgae
    });
});*/
