import { useReducer } from "react"

const initialState = {
    todos: JSON.parse(localStorage.getItem("todos")) || [],
    filter: "All",
    editId: null,
    editText: "",
}
// action = { type: "ADD-TODO", payload: {}}
function reducer(state, action) {
    switch(action.type) {
        case "ADD_TODO": {
            const newTodo = {
                id: Date.now(),
                text: action.payload,
                completed: false,   
                createdAt: new Date().toISOString(),
            }
            const updateTodos = [ ...state.todos, newTodo]
            localStorage.setItem("todos", JSON.stringify(updateTodos))
            return { ...state, todos: updateTodos }
        }
        case "TOGGLE_TODO": {
            const toggledTodos = state.todos.map((todo) => todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo)
            localStorage.setItem("todos", JSON.stringify(toggledTodos))
            return { ...state, todos: toggledTodos }
        }
        case "DELETE_TODO": {
            const filterTodos =state.todos.filter((todo) => todo.id !== action.payload)
            localStorage.setItem("todos", JSON.stringify(filterTodos))
            return { ...state, todos: filterTodos}
        }
        case "EDIT_TODO": {
            return {
                ...state,
                editId: action.payload.id,
                editText: action.payload.text,
            }
        }
        case "UPDATE_TODO": {
            const updateEditTodos = state.todos.map((todo) => (todo.id === state.editId ? {
                ...todo, text: action.payload
            } : todo))
            localStorage.setItem("todos", JSON.stringify(updateEditTodos))
            return {
                ...state,
                todos: updateEditTodos,
                editId: null,
                editText: "",
            }
        }
        case "CANCEL_TODO": {
            return {
                ...state,
                editId: null,
                editText: "",
            }
        }
        case "SET_FILTER": {
            return { ...state, filter: action.payload }
        }
        default: 
            return state
    }
}
const TodoApp = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
//   Send New Todo text to Reducer Function
  const handleAddTodo = (e) => {
    e.preventDefault()
    const text = e.target.elements.todoInput.value.trim()
    if(text) {
        dispatch({type: "ADD_TODO", payload: text})
        e.target.reset()
    }
}
// Filter Todos
const getFilteredTodos = () => {
    switch(state.filter)
    {
        case "Active":
          return state.todos.filter((todo) => !todo.completed)
        case "Completed": 
          return state.todos.filter((todo) => todo.completed)
        default: 
          return state.todos

    }
}
  return (
    <div className="max-w-2xl mx-auto p-6 border border-gray-300">
        <h1 className="text-3xl font-semibold mb-4 text-center">TODO APP</h1>
        {/*TODO FORM*/}
    <div className="mb-4">
        <form className="flex gap-2" onSubmit = {handleAddTodo}>
            <input type="text" 
                   name="todoInput" 
                   className="p-2 border border-gray-500 flex-1 rounded focus:outline-gray-200 " 
                   placeholder="Add a New Todo"
             />
            <button className="bg-blue-600 hover:bg-blue-800 px-4 py-2 text-white rounded" type="submit">ADD</button>
        </form>
    </div>
    <div className="flex justify-between my-3 items-center">
        {/* Filter Button */}
      <div className="mb-4 flex gap-2">{["All", "Active", "Completed"].map((filter) => (
        <button onClick={() => dispatch({ type: "SET_FILTER", payload: filter })} key={filter} className={`px-4 py-2 ${state.filter === filter ? "bg-blue-600" : "bg-gray-600"} text-white gap-2 rounded`}>{filter}</ button>
    ))}
      </div>
      {/* Todo Stats */}
      <div className="text-sm text-gray-600 flex gap-6">
        <p>Total: {state.todos.length}</p>
        <p>Completed : {state.todos.filter((t) => t.completed).length}</p>
        <p>Active : {state.todos.filter((t) => !t.completed).length}</p>
      </div>
    </div>
    {/* Todo List */}
    <ul className="space-y-3">
        {getFilteredTodos().map((todo) => (
        <li key={todo.id} className="flex items-center gap-2 p-2 border border-gray-300 rounded">
            {state.editId === todo.id ? (
                <div className="flex flex-1 gap-2 items-center">
                   <input type="text" className="border border-blue-600 rounded p-1 flex-1" value={state.editText} onChange={(e) => dispatch({ type: "EDIT_TODO", payload: { id: state.editId, text: e.target.value } })} />
                   <button className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-800" onClick={() => dispatch({ type: "UPDATE_TODO", payload: state.editText })}>Save</button>
                   <button className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-800" onClick={() => dispatch({ type: "CANCEL_TODO" })}>Cancel</button>
                </div>
              ) : (
                <>
                  <input type="checkbox" onChange={() => dispatch({ type: "TOGGLE_TODO", payload: todo.id })} checked={todo.completed} className="h-5 w-5" />
                  <span className={`text-gray-600 flex-1 ${todo.completed ? "line-through text-gray-600" : "text-gray-800"}`} onDoubleClick={() => dispatch({ 
                    type: "EDIT_TODO", 
                    payload: { 
                        id: todo.id,
                        text: todo.text, 
                        }})}>{todo.text}
                  </span>
                  <button className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-800" onClick={() => (confirm("You want to delete it?") ? dispatch({type: "DELETE_TODO", payload: todo.id}) : "")}>Delete</button>
                </>
            )}
        </li>
        ))}
        {/* <li key={todo.id} className="flex items-center gap-2 p-2 border border-gray-300 rounded">
            <div className="flex-1 flex gap-2">
                <input type="text" className="flex-1 p-1 border border-gray-300 rounded focus:outline-blue-300" />
                <button className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-800">Save</button>
                <button className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-800">Cancel</button>
            </div>
        </li>
        <li className="flex items-center gap-2 p-2 border border-gray-300 rounded">
            <input type="checkbox" className="h-5 w-5" />
            <span className="text-gray-600 flex-1">Apple</span>
            <button className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-800">Delete</button>
        </li> */}
    </ul>
    </div>
  )
}

export default TodoApp

