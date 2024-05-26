import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../components/usercontext";
import DpDropDown from "../components/dpdropdown";

function LoginFunction(props) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser } = useContext(UserContext);
  const navigate=useNavigate();
  return (
    <div className="flex justify-center items-center align-middle h-screen bg-gradient-to-b from-blue-200 to-blue-50">
      <div className={""}>
        <h2
          className={
            "font-noto absolute text-center text-4xl left-[30vw] top-[46.5vh] text-blue-600 font-bold"
          }
        >
          로그인
        </h2>
        <div
          className={
            "font-noto absolute text-center text-xl left-[3vw] top-[3vh] text-blue-600 font-bold hover:text-blue-400"
          }
          role={"button"}
          onClick={() => navigate("/")}
        >
          {"<< 나가기"}
        </div>
        <div className="border-2 border-blue-400 h-[20vh] absolute left-[40vw] top-[40vh]"></div>

        <div className="form">
          <p className={"absolute left-[42vw] top-[45vh]"}>
            <input
              className="font-noto w-[12vw] indent-1.5"
              type="text"
              name="username"
              placeholder="ID"
              onChange={(event) => {
                setId(event.target.value);
              }}
            />
          </p>
          <p className={"absolute left-[42vw] top-[50vh]"}>
            <input
              className="font-noto w-[12vw] indent-1.5"
              type="password"
              name="pwd"
              placeholder="PW"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
          </p>

          <p
            className={
              "absolute left-[55vw] top-[45.3vh] w-[5vw] h-[8vh] bg-blue-300 items-center text-center justify-center flex rounded-lg hover:bg-blue-400 hover:cursor-pointer"
            }
            onClick={() => {
              const userData = {
                userId: id,
                userPassword: password,
              };
              fetch("https://api.malloc.newbie.sparcsandbox.com/login", {
                method: "post",
                headers: {
                  "content-type": "application/json",
                },
                body: JSON.stringify(userData),
              })
                .then((res) => res.json())
                .then((json) => {
                  if (json.isLogin === "True") {
                    const userData = { id: id };
                    window.localStorage.setItem("id", JSON.stringify(id));
                    setUser(userData);
                    props.setMode("COMPLETE");
                  } else if (json.isLogin === "First") {
                    const userData = { id: id };
                    window.localStorage.setItem("id", JSON.stringify(id));
                    setUser(userData);
                    props.setMode("FIRST");
                  } else {
                    alert(json.isLogin);
                  }
                });
            }}
          >
            <input
              className="text-center hover:cursor-pointer"
              type="submit"
              value="로그인"
              onClick={() => {
                const userData = {
                  userId: id,
                  userPassword: password,
                };
                fetch("https://api.malloc.newbie.sparcsandbox.com/login", {
                  method: "post",
                  headers: {
                    "content-type": "application/json",
                  },
                  body: JSON.stringify(userData),
                })
                  .then((res) => res.json())
                  .then((json) => {
                    if (json.isLogin === "True") {
                      const userData = { id: id };
                      window.localStorage.setItem("id", JSON.stringify(id));
                      setUser(userData);
                      props.setMode("COMPLETE");
                    } else if (json.isLogin === "First") {
                      const userData = { id: id };
                      window.localStorage.setItem("id", JSON.stringify(id));
                      setUser(userData);
                      props.setMode("FIRST");
                    } else {
                      alert(json.isLogin);
                    }
                  });
              }}
            />
          </p>
        </div>

        <p className={"absolute left-[42vw] top-[55vh]"}>
          계정이 없으신가요?&nbsp;&nbsp;
          <button
            className={"hover:text-blue-500"}
            onClick={() => {
              props.setMode("JOIN");
            }}
          >
            회원가입
          </button>
        </p>
      </div>
    </div>
  );
}

function JoinFunction(props) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  return (
    <div
      className={
        "flex justify-center items-center align-middle h-screen bg-gradient-to-b from-blue-200 to-blue-50"
      }
    >
      <h2
        className={
          "font-noto absolute text-center text-4xl left-[27vw] top-[46.5vh] text-blue-600 font-bold"
        }
      >
        회원가입
      </h2>
      <div className="border-2 border-blue-400 h-[20vh] absolute left-[40vw] top-[40vh]"></div>

      <div className="form">
        <p className={"absolute left-[42vw] top-[42vh]"}>
          <input
            className="font-noto w-[12vw] indent-1.5"
            type="text"
            placeholder="ID"
            onChange={(event) => {
              setId(event.target.value);
            }}
          />
        </p>
        <p className={"absolute left-[42vw] top-[47vh]"}>
          <input
            className="font-noto w-[12vw] indent-1.5"
            type="password"
            placeholder="PW"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
        </p>
        <p className={"absolute left-[42vw] top-[52vh]"}>
          <input
            className="font-noto w-[12vw] indent-1.5"
            type="password"
            placeholder="Put PW Again"
            onChange={(event) => {
              setPassword2(event.target.value);
            }}
          />
        </p>

        <p
          className={
            "absolute left-[55vw] top-[45.3vh] w-[5vw] h-[8vh] bg-blue-300 items-center text-center justify-center flex rounded-lg hover:bg-blue-400 hover:cursor-pointer"
          }
          onClick={() => {
            const userData = {
              userId: id,
              userPassword: password,
              userPassword2: password2,
            };
            fetch("https://api.malloc.newbie.sparcsandbox.com/join", {
              method: "post",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify(userData),
            })
              .then((res) => res.json())
              .then((json) => {
                if (json.isSuccess === "True") {
                  alert("회원가입이 완료되었습니다!");
                  props.setMode("LOGIN");
                } else {
                  alert(json.isSuccess);
                }
              });
          }}
        >
          <input
            className="text-center hover:cursor-pointer"
            type="submit"
            value="회원가입"
            onClick={() => {
              const userData = {
                userId: id,
                userPassword: password,
                userPassword2: password2,
              };
              fetch("https://api.malloc.newbie.sparcsandbox.com/join", {
                method: "post",
                headers: {
                  "content-type": "application/json",
                },
                body: JSON.stringify(userData),
              })
                .then((res) => res.json())
                .then((json) => {
                  if (json.isSuccess === "True") {
                    alert("회원가입이 완료되었습니다!");
                    props.setMode("LOGIN");
                  } else {
                    alert(json.isSuccess);
                  }
                });
            }}
          />
        </p>
      </div>

      <p className={"absolute left-[42vw] top-[57vh] hover:text-blue-500"}>
        <button
          onClick={() => {
            props.setMode("LOGIN");
          }}
        >
          로그인화면으로 돌아가기
        </button>
      </p>
    </div>
  );
}

function FirstLogin(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [major, setMajor] = useState("");
  const [major2, setMajor2] = useState("");
  const { user } = useContext(UserContext);

  return (
    <div
      className={
        "flex justify-center items-center align-middle h-screen bg-gradient-to-b from-blue-200 to-blue-50"
      }
    >
      <h2
        className={
          "font-noto absolute text-center text-4xl left-[20vw] top-[46.5vh] text-blue-600 font-bold"
        }
      >
        회원정보 입력
      </h2>
      <div className="border-2 border-blue-400 h-[32vh] absolute left-[40vw] top-[30vh]"></div>

      <div className="form">
        <p className={"absolute left-[42vw] top-[35vh]"}>
          <input
            className="font-noto w-[14vw] indent-1.5"
            type="text"
            placeholder="이름"
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
        </p>
        <p className={"absolute left-[42vw] top-[40vh]"}>
          <input
            className="font-noto w-[14vw] indent-1.5"
            type="text"
            placeholder="이메일"
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
        </p>
        <p className={"absolute left-[42vw] top-[45vh]"}>
          <input
              className="font-noto w-[14vw] indent-1.5"
            type="text"
            placeholder="학번"
            onChange={(event) => {
              setStudentId(event.target.value);
            }}
          />
        </p>
        <p className="absolute left-[40vw] top-[50vh] ml-7">
          <DpDropDown placeholder="주전공" department={major} setDepartment={setMajor} />
        </p>
        <p className="absolute left-[40vw] top-[55vh] ml-7">
          <DpDropDown department={major2} setDepartment={setMajor2} placeholder="복수전공/부전공"/>
        </p>

        <p className={
            "absolute left-[58vw] top-[49vh] w-[5vw] h-[8vh] bg-blue-300 items-center text-center justify-center flex rounded-lg hover:bg-blue-400 hover:cursor-pointer"
        } onClick={() => {
            const id = JSON.parse(window.localStorage.getItem("id"));
            const userData = {
                id: id,
                name: name,
                email: email,
                studentId: studentId,
                major: major,
                major2: major2,
            };
            fetch("https://api.malloc.newbie.sparcsandbox.com/new", {
                method: "post",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(userData),
            })
                .then((res) => res.json())
                .then((json) => {
                    if (json.isSuccess === "True") {
                        props.setMode("COMPLETE");
                    } else {
                        alert(json.isSuccess);
                    }
                });
        }}
        >
          <input
            className="text-center hover:cursor-pointer"
            type="submit"
            value="완료"
            onClick={() => {
              const id = JSON.parse(window.localStorage.getItem("id"));
              const userData = {
                id: id,
                name: name,
                email: email,
                studentId: studentId,
                major: major,
                major2: major2,
              };
              fetch("https://api.malloc.newbie.sparcsandbox.com/new", {
                method: "post",
                headers: {
                  "content-type": "application/json",
                },
                body: JSON.stringify(userData),
              })
                .then((res) => res.json())
                .then((json) => {
                  if (json.isSuccess === "True") {
                    props.setMode("COMPLETE");
                  } else {
                    alert(json.isSuccess);
                  }
                });
            }}
          />
        </p>
      </div>
    </div>
  );
}

const Login = (props) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("");
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    fetch("https://api.malloc.newbie.sparcsandbox.com/authcheck")
      .then((res) => res.json())
      .then((json) => {
        if (json.isLogin === "True") {
          setMode("COMPLETE");
        } else {
          setMode("LOGIN");
        }
      });
  }, []);

  let content = null;

  if (mode === "LOGIN") {
    content = <LoginFunction setMode={setMode}></LoginFunction>;
  } else if (mode === "JOIN") {
    content = <JoinFunction setMode={setMode}></JoinFunction>;
  } else if (mode === "COMPLETE") {
    navigate("/mycal");
  } else if (mode === "FIRST") {
    content = <FirstLogin setMode={setMode}></FirstLogin>;
  }

  return <div className="background">{content}</div>;
};
export default Login;
