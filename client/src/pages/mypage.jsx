import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../components/usercontext";
import axios from "axios";
import Header from "../components/header";
import DpDropDown from "../components/dpdropdown";

const MyPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [major, setMajor] = useState("");
  const [major2, setMajor2] = useState("");
  const { user, setUser } = useContext(UserContext);
  const id = JSON.parse(window.localStorage.getItem("id"));

  useEffect(() => {
    const id = JSON.parse(window.localStorage.getItem("id"));
    fetch("https://api.malloc.newbie.sparcsandbox.com/get-user", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    })
      .then((res) => res.json())
      .then((res) => {
        setName(res.name);
        setEmail(res.email);
        setStudentId(res.studentId);
        setMajor(res.major);
        setMajor2(res.major2);
        setUser(res);
      });
  }, []);

  return (
      <div
          className={
            "flex justify-center items-center align-middle h-screen bg-gradient-to-b from-blue-200 to-blue-50"
          }
      >
        <h2
            className={
              "font-noto absolute text-center text-4xl left-[20vw] top-[43vh] text-blue-600 font-bold"
            }
        >
          회원정보 변경
        </h2>
        <div
            className={
              "font-noto absolute text-center text-xl left-[3vw] top-[3vh] text-blue-600 font-bold hover:text-blue-400"
            }
            role={"button"}
            onClick={()=>navigate("/mycal")}
        >
          {"<< 내 캘린더로 돌아가기"}
        </div>
        <div className="border-2 border-blue-400 h-[32vh] absolute left-[40vw] top-[30vh]"></div>

        <div className="form">
          <p
              className={
                "absolute left-[41.9vw] top-[32vh] bg-white w-[10vw] indent-1.5"
              }
          >
            {id}
          </p>
          <p className={"absolute left-[41.9vw] top-[36vh]"}>
            <input
                className="font-noto w-[14vw] indent-1.5"
                type="password"
                placeholder={"비밀번호 확인"}
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
            />
          </p>
          <p className={"absolute left-[41.9vw] top-[40vh]"}>
            <input
                className="font-noto w-[14vw] indent-1.5"
                type="text"
                placeholder={"이름"}
                onChange={(event) => {
                  setName(event.target.value);
                }}
            />
          </p>
          <p className={"absolute left-[41.9vw] top-[44vh]"}>
            <input
                className="font-noto w-[14vw] indent-1.5"
                type="text"
                placeholder="이메일"
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
            />
          </p>
          <p className={"absolute left-[41.9vw] top-[48vh]"}>
            <input
                className="font-noto w-[14vw] indent-1.5"
                type="text"
                placeholder="학번"
                onChange={(event) => {
                  setStudentId(event.target.value);
                }}
            />
          </p>

          <p className="absolute left-[40vw] top-[52vh] ml-7">
            <DpDropDown
                placeholder="주전공"
                department={major}
                setDepartment={setMajor}
            />
          </p>
          <p className="absolute left-[40vw] top-[56vh] ml-7">
            <DpDropDown
                department={major2}
                setDepartment={setMajor2}
                placeholder="복수전공/부전공"
            />
          </p>

          <p
              className={
                "absolute left-[58vw] top-[40vh] w-[5vw] h-[8vh] bg-blue-300 items-center text-center justify-center flex rounded-lg hover:bg-blue-400 hover:cursor-pointer"
              }
              onClick={() => {
                const id = JSON.parse(window.localStorage.getItem("id"));
                const userData = {
                  id: id,
                  password: password,
                  name: name,
                  email: email,
                  studentId: studentId,
                  major: major,
                  major2: major2,
                };
                fetch("https://api.malloc.newbie.sparcsandbox.com/change-user-info", {
                  method: "post",
                  headers: {
                    "content-type": "application/json",
                  },
                  body: JSON.stringify(userData),
                })
                    .then((res) => res.json())
                    .then((json) => {
                      if (json.isSuccess === "True") {
                        delete userData.password;
                        setUser(userData);
                        alert("성공적으로 반영되었습니다.");
                        navigate("/mypage");
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
                    password: password,
                    name: name,
                    email: email,
                    studentId: studentId,
                    major: major,
                    major2: major2,
                  };
                  fetch("https://api.malloc.newbie.sparcsandbox.com/change-user-info", {
                    method: "post",
                    headers: {
                      "content-type": "application/json",
                    },
                    body: JSON.stringify(userData),
                  })
                      .then((res) => res.json())
                      .then((json) => {
                        if (json.isSuccess === "True") {
                          delete userData.password;
                          setUser(userData);
                          alert("성공적으로 반영되었습니다.");
                          navigate("/mypage");
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
};
export default MyPage;
