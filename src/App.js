import React, {useRef, useEffect, useState} from "react";
import Todo from "./Todo";
import Form from "./Form";
import FilterButton from "./FilterButton";
import {nanoid} from "nanoid";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const FILTER_MAP = {
  All: () => true,
  Active: task => !task.completed,
  completed: task => task.completed
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {
  const [tasks, setTasks] = useState(props.tasks);
  const [filter, setFilter] = useState('All');

  function toggleTasksCompleted(id) {
    const updatedTasks = tasks.map(task => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        // use object spread to make a new object whose 'completed' props has been inverted
        return {...task, completed: !task.completed}
      }
      return task;
    });
    setTasks(updatedTasks);
    // console.log(tasks[0])
  }

  function deletedTask(id) {
    const remainingTasks = tasks.filter(task => id !== task.id);
    setTasks(remainingTasks);
    // console.log(id);
  }

  function editTask(id, newName) {
    const editedTaskList = tasks.map(task => {
      // if this task has the same ID as the edited task
      if(id === task.id) {
        return {...task, name:newName}
      }
      return task;
    });
    setTasks(editedTaskList);
  }


  const taskList = tasks
  .filter(FILTER_MAP[filter])
  .map(task => (
    <Todo 
      id={task.id} 
      name={task.name} 
      completed={task.completed}
      key={task.id} 
      toggleTasksCompleted = {toggleTasksCompleted}
      deletedTask={deletedTask}
      editTask={editTask}
    />
    )
  );

  const filterList = FILTER_NAMES.map(name => (
   <FilterButton 
    key={name} 
    name={name}
    isPressed={name === filter}
    setFilter = {setFilter}
   />
  ));

  function addTask(name) {
    const newTask = { 
      id: "todo-" + nanoid(), 
      name: name,
      completed: false
    };
    setTasks([...tasks, newTask]);
  }

  const tasksNoun = taskList.length <= 1 ? 'task' : 'tasks';
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  const listHeadingRef = useRef(null);
  const PrevTaskLength = usePrevious(tasks.length);
  
  useEffect(() => {
    if (tasks.length - PrevTaskLength === -1) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, PrevTaskLength])

  return (
    <div className="todoapp stack-large">
      <h1 className="h2color">Todo List</h1>
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">
        {filterList}
      </div>
      <h2 className="h2color" id="list-heading" tabIndex="-1" ref={listHeadingRef}>
        {headingText}
      </h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
    </div>
  );
}


export default App;
