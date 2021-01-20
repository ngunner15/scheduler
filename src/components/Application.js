import React, { useState, useEffect } from "react";
import axios from 'axios';

import "components/Application.scss";
import "components/Appointment/styles.scss";
import DayList from "components/DayList"
import Appointment from "components/Appointment"

const appointments = [
  {
    id: 1,
    time: "12pm",
  },
  {
    id: 2,
    time: "1pm",
    interview: {
      student: "Lydia Miller-Jones",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  },
  {
    id: 3,
    time: "2pm",
  },
  {
    id: 4,
    time: "3pm",
    interview: {
      student: "Earl James",
      interviewer: {
        id: 4,
        name: "Cohana Roy",
        avatar: "https://i.imgur.com/FK8V841.jpg"
      }
    }
  },
  {
    id: 5,
    time: "4pm",
    interview: {
      student: "Thomas Anderson",
      interviewer: {
        id: 3,
        name: "Mildred Nazir",
        avatar: "https://i.imgur.com/T2WwVfS.png"
      }
    }
  }
];

export default function Application(props) {
  const [day, setDay] = useState("Monday");
  const [days, setDays] = useState([]);
  useEffect(() => {
    const testURL = `http://localhost:8001/api/days`;
    axios.get(testURL).then(response => {
      //console.log(response.data);
      setDays(response.data);
    });
  }, [])
  //console.log(days);
  const eachAppointment = appointments.map(item => <Appointment key={item.id} {...item} />)

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={days}
            day={day}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {eachAppointment}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
