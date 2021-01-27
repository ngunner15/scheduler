import { useReducer, useEffect } from "react";
import axios from "axios";

import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW,
} from "../reducer/application";

function calculateSpots(days, appointments) {
  return days.map((day) => ({
    ...day,
    spots: day.appointments
      .map((id) => appointments[id])
      .filter((appointment) => appointment.interview === null).length,
  }));
}

export default function useApplicationData() {

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => dispatch({ type: SET_DAY, day });

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      dispatch({
        type: SET_APPLICATION_DATA,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      });
    });
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
    dispatch({ type: SET_INTERVIEW, appointments, days });
  }

  function bookInterview(id, interview) {

    return axios.put(`/api/appointments/${id}`, { interview })
      .then((res) => {
        dispatchNewInterview(id, interview);
      });
  }

  function cancelInterview(id) {
    return axios.delete(`/api/appointments/${id}`)
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