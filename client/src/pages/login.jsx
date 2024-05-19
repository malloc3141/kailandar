import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginFunction(props) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <h2>로그인</h2>

      <div className="form">
        <p>
          <input
            className="login"
            type="text"
            name="username"
            placeholder="아이디"
            onChange={(event) => {
              setId(event.target.value);
            }}
          />
        </p>
        <p>
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
                    props.setMode("COMPLETE");
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

const Login = (props) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("");

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
          onClick={() => {
            setMode("LOGIN");
            fetch("http://localhost:8000/logout");
          }}
        >
          로그아웃
        </button>
      </>
    );
  }

  return <div className="background">{content}</div>;
};
export default Login;