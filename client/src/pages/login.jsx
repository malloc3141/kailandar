import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../components/usercontext";

function LoginFunction(props) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
    const {user, setUser}=useContext(UserContext);
  return (
    <>
      <h2 className={"font-noto"}>로그인</h2>

      <div className="form">
        <p>
          아이디:{" "}
          <input
            className="font-noto"
            type="text"
            name="username"
            placeholder="아이디"
            onChange={(event) => {
              setId(event.target.value);
            }}
          />
        </p>
        <p>
          비밀번호:{" "}
          <input
            className="login"
            type="password"
            name="pwd"
            placeholder="비밀번호"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
        </p>

        <p>
          <input
            className="btn"
            type="submit"
            value="로그인"
            onClick={() => {
              const userData = {
                userId: id,
                userPassword: password,
              };
              fetch("http://localhost:8000/login", {
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
                      setUser(userData);
                    props.setMode("COMPLETE");
                  } else if (json.isLogin === "First") {
                    const userData = { id: id };
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

      <p>
        계정이 없으신가요?{" "}
        <button
          onClick={() => {
            props.setMode("JOIN");
          }}
        >
          회원가입
        </button>
      </p>
    </>
  );
}

function JoinFunction(props) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  return (
    <>
      <h2>회원가입</h2>

      <div className="form">
        <p>
          아이디:{" "}
          <input
            className="login"
            type="text"
            placeholder="아이디"
            onChange={(event) => {
              setId(event.target.value);
            }}
          />
        </p>
        <p>
          비밀번호:{" "}
          <input
            className="login"
            type="password"
            placeholder="비밀번호"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
        </p>
        <p>
          비밀번호 확인:{" "}
          <input
            className="login"
            type="password"
            placeholder="비밀번호 확인"
            onChange={(event) => {
              setPassword2(event.target.value);
            }}
          />
        </p>

        <p>
          <input
            className="btn"
            type="submit"
            value="회원가입"
            onClick={() => {
              const userData = {
                userId: id,
                userPassword: password,
                userPassword2: password2,
              };
              fetch("http://localhost:8000/join", {
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

      <p>
        <button
          onClick={() => {
            props.setMode("LOGIN");
          }}
        >
          로그인화면으로 돌아가기
        </button>
      </p>
    </>
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
    <div className="form">
      <p>
        이름:{" "}
        <input
          className=""
          type="text"
          placeholder="이름"
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
      </p>
      <p>
        이메일:{" "}
        <input
          className=""
          type="text"
          placeholder="이메일"
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
      </p>
      <p>
        학번:{" "}
        <input
          className=""
          type="text"
          placeholder="학번"
          onChange={(event) => {
            setStudentId(event.target.value);
          }}
        />
      </p>
      <p>
        주전공(소속) - 정식 학과명으로 작성:{" "}
        <input
          className=""
          type="text"
          placeholder="주전공"
          onChange={(event) => {
            setMajor(event.target.value);
          }}
        />
      </p>
      <p>
        복수전공/부전공 - 정식 학과명으로 작성(없을 시 공란):{" "}
        <input
          className=""
          type="text"
          placeholder="복수전공/부전공(없을 시 공란)"
          onChange={(event) => {
            setMajor2(event.target.value);
          }}
        />
      </p>

      <p>
        <input
          className="btn"
          type="submit"
          value="완료"
          onClick={() => {
            const userData = {
              id: user.id,
              name: name,
              email: email,
              studentId: studentId,
              major: major,
              major2: major2,
            };
            fetch("http://localhost:8000/new", {
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
  );
}

const Login = (props) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("");
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    fetch("http://localhost:8000/authcheck")
      .then((res) => res.json())
      .then((json) => {
        if (json.isLogin === "True") {
          setMode("COMPLETE");
        } else {
          setMode("LOGIN");
        }
      });
  }, []);

    useEffect(() => {
        if (user && user.id) {
            fetch("http://localhost:8000/get-user", {
                method: "post",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({ id: user.id }),
            })
                .then((response) => response.json())
                .then((response) => {
                    setUser(response);
                    window.localStorage.setItem("id", user.id);
                })
                .catch((err) => {
                    console.error("Error fetching from DB", err);
                });
        }
    }, [mode, user]);

  let content = null;

  if (mode === "LOGIN") {
    content = <LoginFunction setMode={setMode}></LoginFunction>;
  } else if (mode === "JOIN") {
    content = <JoinFunction setMode={setMode}></JoinFunction>;
  } else if (mode === "COMPLETE") {

    content = (
      <>
        <p>로그인 성공!</p>
        <button
          className={"mr-4"}
          onClick={() => {
            navigate("/mycal");
          }}
        >
          내 캘린더로
        </button>
        <button
          onClick={() => {
            setUser(null);
            setMode("LOGIN");
            fetch("http://localhost:8000/logout");
          }}
        >
          로그아웃
        </button>
      </>
    );
  } else if (mode === "FIRST") {
    content = <FirstLogin setMode={setMode}></FirstLogin>;
  }

  return <div className="background">{content}</div>;
};
export default Login;
