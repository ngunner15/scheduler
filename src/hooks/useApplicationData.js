import { useState, useEffect } from "react";
import axios from "axios";

function calculateSpots(days, appointments) {
  return days.map((day) => ({
    ...day,
    spots: day.appointments
      .map((id) => appointments[id])
      .filter((appointment) => appointment.interview === null).length,
  }));
}

export default function useApplicationData() {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8001/api/days'),
      axios.get('http://localhost:8001/api/appointments'),
      axios.get('http://localhost:8001/api/interviewers')
    ]).then((all) => {
        setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    })
  }, [])

  function dispatchNewInterview(id, interview = null) {
    const appointment = {
      ...state.appointments[id],
      interview: interview ? { ...interview } : null,
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };
    const days = calculateSpots(state.days, appointments);
    setState({
      ...state,
      days,
      appointments
    });
  }

  function bookInterview(id, interview) {

    return axios.put(`http://localhost:8001/api/appointments/${id}`, { interview })
      .then((res) => {
        dispatchNewInterview(id, interview);
      });
  }

  function cancelInterview(id) {
    return axios.delete(`http://localhost:8001/api/appointments/${id}`)
      .then((res) => {
        dispatchNewInterview(id);
      });
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  };
}