import { useReducer, useEffect } from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

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

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return { ...state, day: action.day };
      case SET_APPLICATION_DATA:
        return {
          ...state,
          days: action.days,
          appointments: action.appointments,
          interviewers: action.interviewers,
        };
      case SET_INTERVIEW: {
        return { ...state, appointments: action.appointments, days: action.days };
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  const setDay = (day) => dispatch({ type: SET_DAY, day });

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8001/api/days'),
      axios.get('http://localhost:8001/api/appointments'),
      axios.get('http://localhost:8001/api/interviewers')
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