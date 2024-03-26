import { useEffect, useState } from "react";
import Task from "./Task";
import TaskForm from "./TaskForm";
import { toast } from "react-toastify";
import axios from "axios";
import { URL } from "../App";
import loadingImage from "../assets/loader.gif";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTask, setCompletedTask] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    completed: false,
  });

  const { name } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    //console.log(formData);
  };

  const getTasks = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${URL}/api/tasks`);
     
      setTasks(data);
      setIsLoading(false);
    } catch (err) {
      toast.error(err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);
  const createTask = async (e) => {
    e.preventDefault();
    //console.log(formData);
    if (name === "") {
      return toast.error("input fields cannot be empty  ");
    }

    try {
      await axios.post(`${URL}/api/tasks`, formData);
      toast.success("Task added sucessfully");
      getTasks();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${URL}/api/tasks/${id}`);
      toast.success("Task deleted sucessfully");
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() =>{
    const cTask = tasks.filter((task) => {
      return task.completed === true
    })
    setCompletedTask(cTask)
  }, [tasks])
  const getSingleTask =  async (task) => {
    setFormData({name: task.name, completed:false});
    setTaskId(task._id);
    setIsEditing(true)
    
  }

  const updateTask = async (e) =>{
    e.preventDefault();
    if( name === ""){
      toast.error("input field cannot be emepty");
    }
    try {
      await axios.put(`${URL}/api/tasks/${taskId}`, formData)
      setFormData({...formData, name: ""})
      getTasks();
      isEditing(false);
      console.log(taskId)
    } catch (error) {
      toast.error(error) 
    }
  }

  const setToComplete = async (task) =>{
    const newFormData = {
      name: task.name,
      completed: true
    }

    try {
      await axios.put(`${URL}/api/tasks/${task._id}`, newFormData)
      toast.success("task set to completed");
      getTasks();
    } catch (error) {
      toast.error(error)
    }
  }

  return (
    <div>
      <h2>Task Manager</h2>
      <TaskForm
        name={name}
        handleInputChange={handleInputChange}
        createTask={createTask}
        isEditing = {isEditing}
        updateTask={updateTask}
      />
      {tasks.length && (
        <div className="--flex-between --pb">
          <p>
            <b>Total Tasks:</b> {tasks.length}
          </p>
          <p>
            <b>completed Tasks:</b> {completedTask.length}
          </p>
        </div>
      )}
      
      <hr />
      {isLoading && (
        <div className="--flex-center">
          <img src={loadingImage} alt="" />
        </div>
      )}

      {!isLoading && tasks.length === 0 ? (
        <p className="--py">no task added...</p>
      ) : (
        tasks.map((task, index) => {
          return (
            <Task
              key={task._id}
              task={task}
              index={index}
              deleteTask={deleteTask}
              getSingleTask={getSingleTask}
              setToComplete={setToComplete}
            />
          );
        })
      )}
    </div>
  );
};

export default TaskList;
