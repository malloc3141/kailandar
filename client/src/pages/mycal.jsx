import React, {useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";

import Header from "../components/header";
import UserContext from "../components/usercontext";

function DateEvent(props){

}

const MyCal = () => {
  const navigate = useNavigate();
  const [value, onChange] = useState(new Date());
  const [dateString, setDateString]=useState("");
  const {user,setUser}=useContext(UserContext);
  const handleClick = (date) => {
      onChange(date);
      setDateString(moment(date).format('YYYY년 MM월 DD일'));
  };

    useEffect(()=>{
        console.log(user);
    },[user]);

  return (
    <>
      <Header />
      <div>
        <Calendar
          onChange={handleClick}
          value={value}
          formatDay={(locale, date) =>
            date.toLocaleString("en", { day: "numeric" })
          }
        />
          <DateEvent date={value}/>
      </div>
        <div role={"button"} onClick={()=>navigate("/calendar")}>학과별 캘린더 보러가기</div>
    </>
  );
};
export default MyCal;
