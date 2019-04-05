import React, {useState, useEffect} from 'react';
import './App.css';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Grow from '@material-ui/core/Grow';
import axios from 'axios';
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import EditTodoForm from "./EditTodoForm";

function TodoForm({addTodo}) {
    const [value, setValue] = useState("");

    const handleSubmit = e => {
        e.preventDefault();
        if (!value) return;
        addTodo(value);
        setValue("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                className="input"
                value={value}
                placeholder="Add todo"
                onChange={e => setValue(e.target.value)}
            />
        </form>
    );
}

function Todo({todo, index, completeTodo, removeTodo, editTodo, editing, setEditing, currentTodo, updateTodo}) {
    return (
        <Grow in>
            <div
                className="todo"
                style={{textDecoration: todo.isCompleted ? "line-through" : "", backgroundColor: todo.isCompleted ? "#EFEFEF" : "#FFF"}}
            >
                <div>
                    <Checkbox
                        onChange={() => completeTodo(index)}
                        value="checkedB"
                        checked={todo.isCompleted}
                        color="primary"
                    />
                </div>

                {editing ? (
                    <EditTodoForm
                        editing={editing}
                        setEditing={setEditing}
                        currentTodo={currentTodo}
                        updateTodo={updateTodo}
                    />
                ) : (
                todo.id + '. ' +  todo.text
                )}
                <div>
                    <IconButton aria-label="Edit" onClick={() => editTodo(todo)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton aria-label="Delete" onClick={() => removeTodo(index)}>
                        <DeleteIcon />
                    </IconButton>
                </div>
            </div>
        </Grow>
    );
}

function App(user) {

    const [todos, setTodos] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            const result = await axios(
                    `https://jsonplaceholder.typicode.com/users/${user.user}/todos`,
                );

                result.data.every(function(element, index) {

                    todos.push({id: element.id , text: element.title, isCompleted: element.completed});
                    setTodos(todos);

                    if (element.id === 10) {
                        setIsLoading(false);
                        return false;
                    } else {
                        return true;
                    }
                })
            };
        fetchData();
    }, []);

    /* Edit funct */
    const [editing, setEditing] = useState(false);

    const initialFormState = { id: null, text: '', completed: false };
    
    const [currentTodo, setCurrentTodo] = useState(initialFormState);

    const editTodo = todo => {
        setEditing(true);

        setCurrentTodo({ id: todo.id, text: todo.text, completed: todo.completed });
    };

    const updateTodo = (id, updatedTodo) => {
        setEditing(false);

        setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)))
    };

    const addTodo = text => {
        const newTodos = [...todos, {text}];
        setTodos(newTodos);
    };

    const completeTodo = index => {
        const newTodos = [...todos];

        newTodos[index].isCompleted = newTodos[index].isCompleted !== true;
        setTodos(newTodos);

    };

    const removeTodo = index => {
        const newTodos = [...todos];
        newTodos.splice(index, 1);
        setTodos(newTodos);
    };

    // we'll render our todos here ...
    return (
        <div className="app">

            <div className="todo-list">
                <TodoForm addTodo={addTodo}/>
                {isLoading ? (
                    <LinearProgress />
                ) : (
                    todos.map((todo, index) => (
                        <Todo
                            key={todo.id}
                            index={index}
                            todo={todo}
                            completeTodo={completeTodo}
                            removeTodo={removeTodo}
                            editTodo={editTodo}
                            editing={editing}
                            setEditing={setEditing}
                            currentTodo={currentTodo}
                            updateTodo={updateTodo}
                        />
                    ))
                )}
            </div>
        </div>
    );
}


export default App;
