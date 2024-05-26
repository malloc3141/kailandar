import React, {useContext} from "react";
import { useNavigate } from "react-router-dom";
import {UserContext} from "./usercontext";

const Header = () => {
  const navigate = useNavigate();
const {user, setUser}=useContext(UserContext);
  return (
    <div>
        <div className={"flex justify-center items-center"}>
          <div
              className={"font-noto origin-center font-bold text-2xl text-black inline-block hover:text-blue-500"}
              role="button"
              onClick={(e) => navigate("/mycal")}
          >
            KAIlendar
          </div>
          <div
              className={"absolute right-[10vw] top-[1.5vh] font-noto hover:text-blue-500"}
              role="button"
              onClick={(e) => navigate("/mypage")}
          >
            마이페이지
          </div>
          <button className={"absolute right-[2vw] top-[1.5vh] font-noto hover:text-blue-500"}
              onClick={() => {
                window.localStorage.setItem("id", JSON.stringify(null));
                setUser(null);
                  fetch("https://api.malloc.newbie.sparcsandbox.com/logout",{
                      method:"post",
                      headers:{
                          "content-type":"application/json",
                      },
                  });
                navigate("/");
              }}
          >
            로그아웃
          </button>
        </div>
    </div>
  );
};

export default Header;
