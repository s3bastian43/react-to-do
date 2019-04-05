import React, { useState, useEffect } from 'react'

const EditTodoForm = props => {
    const [todo, setTodo] = useState(props.currentTodo);

    useEffect(() => {
        setTodo(props.currentTodo)
    }, [props]);

    const handleInputChange = event => {
        const { name, value } = event.target;

        setTodo({ ...todo, [name]: value })
    };

    return (
        <form
            onSubmit={event => {
                event.preventDefault();

                props.updateTodo(todo.id, todo);
            }}
        >
            <input type="text" name="name" value={todo.text} onChange={handleInputChange} />

            <button>Update todo</button>
            <button onClick={() => props.setEditing(false)} className="button muted-button">
                Cancel
            </button>
        </form>
    )
};

export default EditTodoForm;