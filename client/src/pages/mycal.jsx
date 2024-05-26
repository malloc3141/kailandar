import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";

import Header from "../components/header";
import { UserContext } from "../components/usercontext";

import EventInfo from "../components/eventinfo";
import axios from "axios";

function DateEvent(props) {
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

const MyCal = () => {
  const navigate = useNavigate();
  const [value, onChange] = useState(new Date());
  const [dateString, setDateString] = useState("");
  const { user, setUser } = useContext(UserContext);
  const [events, setEvents] = useState([]);
  const [majorName, setMajorName] = useState("");
  const [major2Name, setMajor2Name] = useState("");

  const id = JSON.parse(window.localStorage.getItem("id"));
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
          const tmp = res[0];
          delete tmp.password;
          setUser(res[0]);
          window.localStorage.setItem("name", JSON.stringify(res[0].name));
          window.localStorage.setItem("email", JSON.stringify(res[0].email));
          window.localStorage.setItem(
            "student_id",
            JSON.stringify(res[0].student_id),
          );
          window.localStorage.setItem("major", JSON.stringify(res[0].major));
          window.localStorage.setItem("major2", JSON.stringify(res[0].major2));
        });
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const major = JSON.parse(window.localStorage.getItem("major"));
      const major2 = JSON.parse(window.localStorage.getItem("major2"));

      if (dateString) {
        const [majorRes, major2Res] = await Promise.all([
          fetch("http://localhost:8000/dp-id-name", {
            method: "post",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ id: major }),
          }).then((res) => res.json()),
          fetch("http://localhost:8000/dp-id-name", {
            method: "post",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ id: major2 }),
          }).then((res) => res.json()),
        ]);

        setMajorName(majorRes[0].name);
        setMajor2Name(major2Res[0].name);

        const [eventsRes1, eventsRes2] = await Promise.all([
          fetch("http://localhost:8000/dp-event", {
            method: "post",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ date: dateString, dp: majorRes[0].name }),
          }).then((res) => res.json()),
          fetch("http://localhost:8000/dp-event", {
            method: "post",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ date: dateString, dp: major2Res[0].name }),
          }).then((res) => res.json()),
        ]);

        setEvents([...eventsRes1, ...eventsRes2]);
      }
    };

    fetchData();
  }, [dateString]);

  const handleClick = (date) => {
    onChange(date);
    setDateString(moment(date).format("YYYY-MM-DD"));
  };

  return (
      <div className={"h-screen bg-gradient-to-b from-blue-200 to-blue-50"}>
          <Header/>
          <div className={"border-2 border-blue-100 mt-3 mb-3 "}></div>
          <div
              className={
                  "absolute top-[8vh] left-[46.5vw] font-noto font-bold text-xl"
              }
          >
              내 캘린더
          </div>
          <div className={"absolute top-[18vh] left-[26vw]"}>
              <Calendar
                  onChange={handleClick}
                  value={value}
                  formatDay={(locale, date) =>
                      date.toLocaleString("en", {day: "numeric"})
                  }
              />
          </div>

          <div className={"absolute left-[51vw] top-[18vh] ml-3"}>
              <DateEvent events={events}/>
          </div>
          <div
              className={
                  "absolute font-noto top-[13vh] left-[43.5vw] hover:text-blue-500 font-bold"
              }
              role={"button"}
              onClick={() => navigate("/calendar")}
          >
              학과별 캘린더 보러가기>>
          </div>
      </div>
  );
};
export default MyCal;
