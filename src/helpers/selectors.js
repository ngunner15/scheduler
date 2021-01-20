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