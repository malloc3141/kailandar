import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import axios from "axios";

import Header from "../components/header";
import EventInfo from "../components/eventinfo";
import DpDropDown from "../components/dpdropdown";

function EventSection(props) {
  return props.events.length > 0 ? (
    props.events.map((value, index) => (
      <>
        <EventInfo key={index} info={props.events[index]} />
        <div className={"mt-5 mb-5"}></div>
      </>
    ))
  ) : (
    <p className={"text-noto text-l"}>행사 정보가 없습니다.</p>
  );
}

const CustomCalendar = () => {
  const navigate = useNavigate();
  const [value, onChange] = useState(new Date());
  const [dateString, setDateString] = useState("");

  const [department, setDepartment] = useState("");

  const [events, setEvents] = useState([]);
  useEffect(() => {
    if (dateString && department) {
      fetch("http://localhost:8000/dp-event", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ date: dateString, dp: department }),
      })
        .then((res) => res.json())
        .then((res) => setEvents(res));
    }
  }, [dateString, department]);

  const handleClick = (date) => {
    onChange(date);
    setDateString(moment(date).format("YYYY-MM-DD"));
  };

  return (
    <div className={"h-screen bg-gradient-to-b from-blue-200 to-blue-50"}>
      <Header />
      <div className={"border-2 border-blue-100 mt-3 mb-3 "}></div>
      <div
        className={
          "absolute top-[8vh] left-[45.5vw] font-noto font-bold text-xl"
        }
      >
        학과별 캘린더
      </div>
        <div className={"absolute top-[18vh] left-[26vw]"}>
            <DpDropDown department={department} setDepartment={setDepartment}/>
            <Calendar
                onChange={handleClick}
                value={value}
                formatDay={(locale, date) =>
                    date.toLocaleString("en", {day: "numeric"})
                }
            />
            <div
                className={
                    "absolute font-noto top-[43vh] hover:text-blue-500 font-bold"
                }
                role={"button"}
                onClick={() => navigate("/mycal")}
            >
                {"<<내 캘린더로 돌아가기"}
            </div>
        </div>
        <div className={"absolute left-[51vw] top-[21.5vh]"}>
            <EventSection events={events}/>
        </div>
    </div>
  );
};
export default CustomCalendar;
