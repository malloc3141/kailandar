import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const login = () => {
    navigate("/login");
  };

  return (
    <div className="inline">
      <div className="inline left-0">KAIlandar</div>
      <div className="flex justify-end">
        <div className="inline text-right mr-3" role="button" onClick={login}>
          로그인
        </div>
      </div>
    </div>
  );
};
export default Home;
