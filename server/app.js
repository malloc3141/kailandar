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
              req.session.id = username;
              req.session.save(() => {
                if (results[0].name === null) {
                  sendData.isLogin = "First";
                  res.send(sendData);
                } else {
                  sendData.isLogin = "True";
                  res.send(sendData);
                }
              });
            } else {
              sendData.isLogin = "비밀번호가 일치하지 않습니다";
              res.send(sendData);
            }
          });
        }
      },
    );
  } else {
    sendData.isLogin = "아이디와 비밀번호를 입력해주세요";
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
          sendData.isSuccess = "비밀번호가 일치하지 않습니다";
          res.send(sendData);
        } else if (password === password2) {
          sendData.isSuccess = "중복되는 아이디가 있습니다";
          res.send(sendData);
        } else {
          sendData.isSuccess =
            "중복되는 아이디가 있고 비밀번호가 일치하지 않습니다";
          res.send(sendData);
        }
      },
    );
  } else {
    sendData.isSuccess = "입력란을 모두 채워야 합니다";
    res.send(sendData);
  }
});

app.post("/new", (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  const email = req.body.email;
  const studentId = req.body.studentId;
  const major = req.body.major;
  const major2 = req.body.major2;

  const sendData = { isSuccess: "" };
  if (name && email && studentId && major) {
    let major_id;
    const getMajorId = (major) => {
      return new Promise((resolve, reject) => {
        db.query(
          "SELECT department_id FROM department WHERE name=?",
          [major],
          (error, results, fields) => {
            if (error) {
              reject(error);
            } else if (results.length === 0) {
              sendData.isSuccess = "주전공 학과명을 정확히 입력해 주세요";
              res.send(sendData);
              resolve(null);
            } else {
              resolve(results[0].department_id);
            }
          },
        );
      });
    };

    const handleMajorId = async () => {
      try {
        const id = await getMajorId(major);
        if (id !== null) {
          major_id = id;
        }
      } catch (error) {
        console.error(error);
        res.status(500).send({ isSuccess: "서버 오류 발생" });
      }
    };

    handleMajorId();

    let major2_id;

    if (major2 === "") {
      major2_id = -2;
    } else {
      const getMajor2Id = (major) => {
        return new Promise((resolve, reject) => {
          db.query(
            "SELECT department_id FROM department WHERE name=?",
            [major],
            (error, results, fields) => {
              if (error) {
                reject(error);
              } else if (results.length === 0) {
                sendData.isSuccess = "주전공 학과명을 정확히 입력해 주세요";
                res.send(sendData);
                resolve(null); // 여기가 중요합니다. 리턴되지 않도록 resolve(null) 처리.
              } else {
                resolve(results[0].department_id);
              }
            },
          );
        });
      };

      const handleMajor2Id = async () => {
        try {
          const id = await getMajor2Id(major2);
          if (id !== null) {
            major2_id = id;
          }
        } catch (error) {
          console.error(error);
          res.status(500).send({ isSuccess: "서버 오류 발생" });
        }
      };

      handleMajor2Id();
    }

    if (major_id !== -1 && major2_id !== -1) {
      db.query(
        "SELECT * FROM user WHERE id = ?",
        [id],
        (error, results, fields) => {
          if (error) throw error;
          if (results.length === 0) {
            // Unhandled Situation
            sendData.isSuccess = "무언가 잘못되었습니다";
            res.send(sendData);
          } else {
            if (major2_id === -2) major2_id = null;
            db.query(
              "UPDATE user SET name=?, email=?, student_id=?, major=?, major2=? WHERE id=?",
              [name, email, studentId, major_id, major2_id, id],
              (error, data) => {
                if (error) throw error;
                req.session.save(() => {
                  sendData.isSuccess = "True";
                  res.send(sendData);
                });
              },
            );
          }
        },
      );
    }
  } else {
    sendData.isSuccess =
      "복수전공/부전공을 제외한 모든 정보는 입력되어야 합니다";
    res.send(sendData);
  }
});

app.post("/change-user-info", (req, res) => {
  const id = req.body.id;
  const password=req.body.password;
  const name = req.body.name;
  const email = req.body.email;
  const studentId = req.body.studentId;
  const major = req.body.major;
  const major2 = req.body.major2;

  const sendData = { isSuccess: "" };
  if (name && email && studentId && major) {
    let major_id;
    const getMajorId = (major) => {
      return new Promise((resolve, reject) => {
        db.query(
            "SELECT department_id FROM department WHERE name=?",
            [major],
            (error, results, fields) => {
              if (error) {
                reject(error);
              } else if (results.length === 0) {
                sendData.isSuccess = "주전공 학과명을 정확히 입력해 주세요";
                res.send(sendData);
                resolve(null); // 여기가 중요합니다. 리턴되지 않도록 resolve(null) 처리.
              } else {
                resolve(results[0].department_id);
              }
            },
        );
      });
    };

    const handleMajorId = async () => {
      try {
        const id = await getMajorId(major);
        if (id !== null) {
          major_id = id;
        }
      } catch (error) {
        console.error(error);
        res.status(500).send({ isSuccess: "서버 오류 발생" });
      }
    };

    handleMajorId();

    let major2_id;

    if (major2 === "") {
      major2_id = -2;
    } else {
      const getMajor2Id = (major) => {
        return new Promise((resolve, reject) => {
          db.query(
              "SELECT department_id FROM department WHERE name=?",
              [major],
              (error, results, fields) => {
                if (error) {
                  reject(error);
                } else if (results.length === 0) {
                  sendData.isSuccess = "주전공 학과명을 정확히 입력해 주세요";
                  res.send(sendData);
                  resolve(null); // 여기가 중요합니다. 리턴되지 않도록 resolve(null) 처리.
                } else {
                  resolve(results[0].department_id);
                }
              },
          );
        });
      };

      const handleMajor2Id = async () => {
        try {
          const id = await getMajor2Id(major2);
          if (id !== null) {
            major2_id = id;
          }
        } catch (error) {
          console.error(error);
          res.status(500).send({ isSuccess: "서버 오류 발생" });
        }
      };

      handleMajor2Id();
    }

    if (major_id !== -1 && major2_id !== -1) {
      db.query(
          "SELECT * FROM user WHERE id = ?",
          [id],
          (error, results, fields) => {
            if (error) throw error;
            if (results.length === 0) {
              // Unhandled Situation
              sendData.isSuccess = "무언가 잘못되었습니다";
              res.send(sendData);
            } else {
              if (major2_id === -2) major2_id = null;
              bcrypt.compare(password, results[0].password, (error, result) => {
                if (result) {
                  db.query(
                      "UPDATE user SET name=?, email=?, student_id=?, major=?, major2=? WHERE id=?",
                      [name, email, studentId, major_id, major2_id, id],
                      (error, data) => {
                        if (error) throw error;
                        req.session.save(() => {
                          sendData.isSuccess = "True";
                          res.send(sendData);
                        });
                      },
                  );
                }
                else {
                  sendData.isSuccess="비밀번호가 일치하지 않습니다.";
                  res.send(sendData);
                }
              });

            }
          },
      );
    }
  } else {
    sendData.isSuccess =
        "복수전공/부전공을 제외한 모든 정보는 입력되어야 합니다";
    res.send(sendData);
  }
});

/*
app.post("/date-event", (req,res)=>{
  const dp_array=req.body.dp.map(()=>'?').join(',');
  db.query("SELECT * FROM event WHERE day=? AND department_name IN ${dp_array}", [req.body.date, ...req.body.dp], (err, result, fields)=>{
    res.json(result);
  });
});
*/

app.post("/dp-event", (req,res)=>{
  db.query("SELECT * FROM event WHERE day=? AND department_name=?", [req.body.date, req.body.dp], (err, result, fields)=>{
    res.json(result);
  });
});

app.get('/dp-names',(req,res)=>{
  db.query("SELECT name FROM department", (err, result, fields)=>{
    if (err) {
      res.status(500).send(err);
    }
    else {
      res.json(result);
    }
  });
});

app.post('/get-user',(req,res)=>{
  db.query("SELECT * FROM user WHERE id=?",[req.body.id], (err, result, fields)=>{
    if (err){
      res.status(500).send(err);
    }
    else {
      res.json(result);
    }
  });
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});
app.listen(port, () => console.log("Waiting for input..."));
