import react from "react";

function EventInfo(props) {
  return (
    <>
      <div>{props.info.name}</div>
      <p>주최: {props.info.department_name}</p>
      <p>설명: {props.info.detail}</p>
      <p>
        일시: {props.info.day.concat("    ", props.info.all_day ? "하루종일" : "".concat(props.info.start, "~", props.info.end))}
      </p>
      <p>장소: {props.info.place}</p>
        <hr className={"mt-3"}/>
    </>

  );
}

export default EventInfo;
