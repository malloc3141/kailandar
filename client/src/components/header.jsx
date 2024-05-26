import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className={"header"}>
        <div className={"header-content-wrapper"}>
          <div
            className={"home-link"}
            role="button"
            onClick={(e) => navigate("/mycal")}
          >
            KAIlendar
          </div>
          <div
            className={"right-0"}
            role="button"
            onClick={(e) => navigate("/mypage")}
          >
            마이페이지
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
