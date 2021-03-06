export function getAppointmentsForDay(state, day) {
  //... returns an array of appointments for that day
  const found = state.days.find(element => element.name === day);
  if (found === undefined) {
    return [];
  }
  let array = [];
  for (const value of found.appointments) {
    array.push(state.appointments[value]);
  }
  return array;
}

export function getInterview(state, interview) {
  let newObj = {};
  if (interview === null) {
    return null;
  }
  newObj["student"] = interview.student;
  newObj["interviewer"] = state.interviewers[interview.interviewer];
  return newObj;
}

export function getInterviewersForDay(state, interviewer) {
  const findDay = state.days.find(element => element.name === interviewer);
  if (findDay === undefined) {
    return [];
  }
  const interviewers = findDay.interviewers.map((id) => state.interviewers[id]);
  return interviewers;
}