import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import axios from "axios";

import Header from "../components/header";
import EventInfo from "../components/eventinfo";

function DpDropDown(props) {
  const [isDropdown, setIsDropdown] = useState(false);
  const [dropDownItems, setDropDownItems] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/dp-names")
      .then((response) => {
        setDropDownItems(response.data);
      })
      .catch((err) => {
        console.error("Error fetching from DB", err);
        setDropDownItems([]);
      });
  }, []);

  const handleSelect = (e) => {
    props.setDepartment(e.target.value);
  };

  return (
    <div>
      <select onChange={handleSelect}>
        {dropDownItems.map((item, index) => (
          <option key={index} value={item.name}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function EventSection(props) {
  return(props.events.length > 0 ? (
      props.events.map((value, index) => (
          <EventInfo key={index} info={props.events[index]} />
      ))
  ) : (
      <p>행사 정보가 없습니다.</p>
  ));
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
    <>
      <Header />
      <div>
        <DpDropDown department={department} setDepartment={setDepartment} />
        <Calendar
          onChange={handleClick}
          value={value}
          formatDay={(locale, date) =>
            date.toLocaleString("en", { day: "numeric" })
          }
        />
        <EventSection events={events}/>
      </div>
    </>
  );
};
export default CustomCalendar;
