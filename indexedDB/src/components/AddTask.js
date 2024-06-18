import { useContext } from "react";
import { AuthContext } from "../AuthContext";

export const AddTask = ({tasklist, setTasklist, task, setTask, updateTask}) => {
  const {user} = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("task => ", JSON.stringify(task))

    if(task.id){
      const date = new Date();
      const updatedTasklist = tasklist.map((todo) => (
        todo.id === task.id ? {id: task.id, username:user.username,  name: task.name, time: `${date.toLocaleTimeString()} ${date.toLocaleDateString()}`} : todo
      ));
      updateTask(updatedTasklist);
    } else {
      const date = new Date();
      const newTask = {
        id: date.getTime(),
        username:user.username, 
        name: e.target.task.value, 
        time: `${date.toLocaleTimeString()} ${date.toLocaleDateString()}`
      }

      //handleAddTask AND SETTASKLIST
      setTasklist(newTask)
      setTask({});
    }
  }

  return (
    <section className="addTask">
        <form onSubmit={handleSubmit}>
            <input type="text" name="task" value={task.name || ""} autoComplete="off" placeholder="add task" maxLength="25" onChange={e => setTask({...task, name: e.target.value})} />
            <button type="submit">{ task.id ? "Update" : "Add" }</button>
        </form>
    </section>
  )
}