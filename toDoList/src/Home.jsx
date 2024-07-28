import React, { useEffect, useState } from 'react';
import Create from './Create';
import axios from 'axios';
import { BsCircleFill, BsFillCheckCircleFill, BsFillTrashFill } from 'react-icons/bs';

const Home = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/get-items")
      .then(result => setTodos(result.data))
      .catch(error => console.log(error));
  }, []);

  const handleEdit = (id) => {
    axios.put(`http://localhost:5000/update/${id}`)
      .then(result => {
        
        
       location.reload();
      })
      .catch(error => console.log(error));
  }

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/delete/${id}`)
      .then(result => {
        
       location.reload();
      })
      .catch(error => console.log(error));
  }

  return (
    <div className='home'>
      <h2>TO DO LIST</h2>
      <Create />
      {
        todos.length === 0 ?
          <div><h2>No record</h2></div>
          :
          todos.map((todo, index) => (
            <div className='task' key={index}>
              <div className='checkbox' onClick={() => handleEdit(todo._id)}>
                {
                    todo.done ? 
                    <BsFillCheckCircleFill className='icon'></BsFillCheckCircleFill>:
                    <BsCircleFill className='icon'/>
                }
                <p className={`task-text ${todo.done ? "line_through" : ""}`}>{todo.task}</p>
              </div>
              <div>
                <span><BsFillTrashFill className='icon'  onClick={()=>handleDelete(todo._id)}/></span>
              </div>
            </div>
          ))
      }
    </div>
  );
}

export default Home;
