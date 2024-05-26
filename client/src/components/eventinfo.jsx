import react from "react";

function EventInfo(props) {
  return (
      <div className={"border-2 w-[30vw]"}>
          <div className={"text-xl"}>{props.info.name}</div>
          <p>
              {props.info.day.concat("    ", props.info.all_day ? "하루종일" : "".concat(props.info.start, "~", props.info.end))}
          </p>
          <p className={"text-l"}>주최: {props.info.department_name}</p>
          <p>설명: {props.info.detail}</p>
          <p>장소: {props.info.place}</p>
      </div>

  );
}

export default EventInfo;
