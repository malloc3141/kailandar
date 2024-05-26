import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../components/usercontext";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const login = () => {
    navigate("/login");
  };
  if (user !== null) {
    navigate("/mycal");
  } else {
    return (
      <div className="inline">
        <div className="inline left-0">KAIlendar</div>
        <div className="flex justify-end">
          <div className="inline text-right mr-3" role="button" onClick={login}>
            로그인
          </div>
        </div>
      </div>
    );
  }
};
export default Home;
