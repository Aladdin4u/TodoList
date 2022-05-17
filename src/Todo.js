import React, { useEffect, useRef, useState } from "react";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default function Todo(props) {
  const [isEditing, setEditing] = useState(false);
  const [newName, setNewName] = useState('');

  const editFileRef = useRef(null);
  const editButtonRef = useRef(null);

  const wasEditing = usePrevious(isEditing)

  function handleSubmit(e) {
    e.preventDefault();
    if (!newName.trim()) {
      return;
    }
    props.editTask(props.id, newName);
    setNewName("");
    setEditing(false);
  }

  function handleChange(e) {
    setNewName(e.target.value)
  }

  const editingTemplate = (
    <form className="stack-small" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="todo-label" htmlFor={props.id}>
          New name for {props.name}
        </label>
        <input
         id={props.id}
         className="todo-text"
         type="text"
         value={newName || props.name}
         onChange={handleChange} 
         ref={editFileRef}
         />
      </div>
      <div className="btn-group">
        <button type="button" className="btn todo-cancel" onClick={() => setEditing(false)}>
          Cancel <span className="visually-hidden">renaming {props.name}</span>
        </button>
        <button type="submit" className="btn btn_primary todo-edit">
          Save <span className="visually-hidden">new name for {props.name}</span>
        </button>
      </div>
    </form>
  );
  const viewTemplete = (
    <div className="stack-small">
      <div className="c-cb">
        <input
         type="checkbox"
         id={props.id}
         defaultChecked={props.completed}  
         onChange={() => props.toggleTaskCompleted(props.id)}
        />
        <label className="todo-label" htmlFor={props.id}>
           {props.name}
         </label>
      </div>
      <div className="btn-group">
        <button type="button" className="btn" onClick={() => setEditing(true)}
        ref={editButtonRef}>
          Edit <span className="visually-hidden">{props.name}</span>
        </button>
        <button type="button" className="btn btn__danger" onClick={() =>props.deletedTask(props.id)}>
          Delete <span className="visually-hidden">{props.name}</span>
          </button>
      </div>
    </div>
  )

  useEffect(() => {
    if (!wasEditing && isEditing) {
      editFileRef.current.focus();
    }
    if (wasEditing && !isEditing) {
      editButtonRef.current.focus();
    }
  }, [wasEditing, isEditing]);
  
    return (
        <li className="todo">
          {isEditing ? editingTemplate : viewTemplete}
        </li>
    );
}