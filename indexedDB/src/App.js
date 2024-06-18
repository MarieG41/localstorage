import { useEffect, useState, useContext } from "react";
import { AuthContext } from './AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import { Header } from "./components/Header";
import { AddTask } from "./components/AddTask";
import { ShowTask } from "./components/ShowTask";
import { getAllTasks, addTask, updateTask, deleteTask } from './db';
import './App.css';


function App() {
  const [tasklist, setTasklist] = useState(() => {
    const savedTasks = sessionStorage.getItem('tasklist');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [task, setTask] = useState({});
  const [isRegister, setIsRegister] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchTasks = async () => {
      const tasks = await getAllTasks();
      const userTasks = tasks.filter(task => task?.username === user?.username);
      setTasklist(userTasks);
      
    };
    fetchTasks();
  }, [user]);

  useEffect(() => {
    const saveTasks = async () => {
      await Promise.all(tasklist.map(task => updateTask(task)));
    };
    saveTasks();
  }, [tasklist]);

  const handleAddTask = async (newTask) => {
    const id = await addTask(newTask);
    setTasklist([...tasklist, { ...newTask, id }]);
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
    const updatedTasklist = tasklist.filter(todo => todo.id !== id);
        setTasklist(updatedTasklist);
  };

  const handleUpdateTask = async (taskToUpdate) => {
    await Promise.all(taskToUpdate.map(task => updateTask(task)));
    setTasklist(taskToUpdate);
    setTask({});
  };

  const handleDeleteAllTask = async (tasklist) => {
    console.log(`call delete all task function tasklist = ${JSON.stringify(tasklist)}`)
    await Promise.all(tasklist.map(task => deleteTask(task.id)));
    setTasklist([]);
    setTask({});
  };
  
  const toggleForm = () => {
    setIsRegister(!isRegister);
  };

  return (
    <>
      {user ? (
        <div className="App">
          <Header user={user}/>
          <AddTask
            tasklist={tasklist}
            setTasklist={handleAddTask}
            task={task}
            setTask={setTask}
            updateTask={handleUpdateTask}
          />
          <ShowTask
            tasklist={tasklist}
            setTasklist={setTasklist}
            task={task}
            setTask={setTask}
            handleDeleteTask={handleDeleteTask}
            deleteAllTask={handleDeleteAllTask}
          />
        </div>
      ) : (
        <div className="App">
          <Header />
          {isRegister ? <Register toggleForm={toggleForm} /> : <Login toggleForm={toggleForm} />}
        </div>
      )}
    </>
  );
}

export default App;