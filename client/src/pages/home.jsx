import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../components/usercontext";

const Home = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const login = () => {
    navigate("/login");
  };
  useEffect(() => {
    const id = JSON.parse(window.localStorage.getItem("id"));
    if (id !== null) {
      fetch("http://localhost:8000/get-user", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      })
        .then((res) => res.json())
        .then((res) => {
          setUser(res);
        });
      navigate("/mycal");
    }
  }, []);

  return (
    <div className="flex justify-center items-center align-middle h-screen bg-gradient-to-b from-blue-200 to-blue-50">
      <h1 className="font-noto origin-center font-bold text-8xl mb-10 text-blue-500 inline-block text-transparent bg-clip-text">
        KAIlendar
      </h1>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <div className="inline text-right mr-3 font-noto font-bold text-2xl text-blue-700" role="button" onClick={login}>
          로그인
        </div>
    </div>
  );
};
export default Home;
