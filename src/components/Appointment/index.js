import React from "react";
import Header from "./Header"
import Show from "./Show"
import Empty from "./Empty"
import Status from "./Status"
import useVisualMode from "../../hooks/useVisualMode"
import Form from "./Form";
import Confirm from "./Confirm";
import Error from "./Error";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const EDIT = "EDIT";
const SAVING = "SAVING";
const DELETE = "DELETE";
const CONFIRM = "CONFIRM";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview)
    .then(() => {
      transition(SHOW);
    })
    .catch(err => transition(ERROR_SAVE, true));
  }

  function onDelete(){
    transition(DELETE, true);
    props.cancelInterview(props.id)
      .then(()=>{
        transition(EMPTY);
      })
      .catch(err => transition(ERROR_DELETE, true));
  }

  function onCancelAppointment(){
    transition(CONFIRM);
  }

  function onEditAppointment(){
    transition(EDIT)
  }

  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={onCancelAppointment}
          onEdit={onEditAppointment}
        />
      )}
      {mode === CREATE && (
        <Form
        interviewers={props.interviewers}
        onCancel={() => back()}
        onSave={save}
        />
        )}
      {mode === EDIT && (
        <Form
        name={props.interview.student}
        interviewer={props.interview.interviewer && props.interview.interviewer.id}
        interviewers={props.interviewers}
        onSave={save}
        onCancel={()=> back()}
      />
      )}
      {mode === SAVING && <Status message={SAVING}/>}
      {mode === CONFIRM && (
        <Confirm 
        message='Are you sure you would like to delete?'
        onCancel={()=> back()}
        onConfirm={onDelete}
        />
      )}
      {mode === DELETE && <Status message='Deleting'/>}
      {mode === ERROR_SAVE && (
        <Error 
        message='Could not save appointment'
        onClose={()=> back()}
        />
      )}
      {mode === ERROR_DELETE && (
        <Error 
        message='Could not delete appointment'
        onClose={()=> back()}
        />
      )}
    </article>
  );
}