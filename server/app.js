const express = require("express");
const session = require("express-session");
const cors = require("cors");
const path = require("path");
const app = express();
const port = 8000;

const db = require("./lib/db");
const sessionOption = require("./lib/sessionOption");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/build")));

const MySQLStore = require("express-mysql-session")(session);
const sessionStore = new MySQLStore(sessionOption, db);
app.use(
  session({
    key: "session_cookie_name",
    secret: "~",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  }),
);

const whitelist = ["http://localhost:3000", "http://localhost:8000"];
const corsOptions = {
  origin: (origin, callback) => {
    console.log("[REQUEST-CORS] Request from origin: ", origin);
    if (!origin || whitelist.indexOf(origin) !== -1) callback(null, true);
    else callback(new Error("Not Allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.get("/authcheck", (req, res) => {
  const sendData = { isLogin: "" };
  if (req.session.is_logined) sendData.isLogin = "True";
  else sendData.isLogin = "False";
  res.send(sendData);
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.post("/login", (req, res) => {
  const username = req.body.userId;
  const password = req.body.userPassword;
  const sendData = { isLogin: "" };

  if (username && password) {
    db.query(
      "SELECT * FROM user WHERE id = ?",
      [username],
      (error, results, fields) => {
        if (error) throw error;
        if (results.length > 0) {
          bcrypt.compare(password, results[0].password, (error, result) => {
            if (result) {
              req.session.is_logined = true;
              req.session.nickname = username;
              req.session.save(() => {
                sendData.isLogin = "True";
                res.send(sendData);
              });
            } else {
              sendData.isLogin = "Incorrect user Info";
              res.send(sendData);
            }
          });
        }
      },
    );
  } else {
    sendData.isLogin = "Please put something in username & password";
    res.send(sendData);
  }
});

app.post("/join", (req, res) => {
  const username = req.body.userId;
  const password = req.body.userPassword;
  const password2 = req.body.userPassword2;

  const sendData = { isSuccess: "" };
  if (username && password && password2) {
    db.query(
      "SELECT * FROM user WHERE id = ?",
      [username],
      (error, results, fields) => {
        if (error) throw error;
        if (results.length === 0 && password === password2) {
          const hashedPassword = bcrypt.hashSync(password, 10);
          db.query(
            "INSERT INTO user (id, password) VALUES(?,?)",
            [username, hashedPassword],
            (error, data) => {
              if (error) throw error;
              req.session.save(() => {
                sendData.isSuccess = "True";
                res.send(sendData);
              });
            },
          );
        } else if (results.length === 0) {
          sendData.isSuccess = "Passwords does not match";
          res.send(sendData);
        } else if (password === password2) {
          sendData.isSuccess = "User Already Exists";
          res.send(sendData);
        } else {
          sendData.isSuccess = "Something went wrong";
          res.send(sendData);
        }
      },
    );
  } else {
    sendData.isSuccess = "Please put something in all blanks";
    res.send(sendData);
  }
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});
app.listen(port, () => console.log("Waiting for input..."));
