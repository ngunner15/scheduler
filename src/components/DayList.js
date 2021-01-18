import React from "react";
import DayListItem from "components/DayListItem"

export default function DayList(props) {

  const eachDay = props.days.map(day =>  <DayListItem 
    id={day.id}
    name={day.name} 
    spots={day.spots} 
    selected={day.name === props.day}
    setDay={props.setDay}  
  />);

  return(
    <ul>
      {eachDay}
    </ul>
  );
}