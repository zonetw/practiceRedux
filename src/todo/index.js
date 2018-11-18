import React from "react";
import { Component } from "react";
import ReactDOM from "react-dom";

import { createStore } from "redux";
import { combineReducers } from "redux";

// reducer
const todo = (state = {}, action) => {
  switch (action.type) {
    case "ADD_TODO":
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case "TOGGLE_TODO":
      if (state.id === action.id) {
        return {
          ...state,
          completed: !state.completed
        };
      } else {
        return state;
      }
    default:
      return state;
  }
};

const todos = (state = [], action) => {
  switch (action.type) {
    case "ADD_TODO":
      return [...state, todo(undefined, action)];
    case "TOGGLE_TODO":
      return state.map(el => {
        return todo(el, action);
      });
      break;
    default:
      return state;
      break;
  }
};

const visibilityFilter = (state = "SHOW_ALL", action) => {
  switch (action.type) {
    case "SET_VISIBILITY_FILTER":
      return action.filter;
    default:
      return state;
      break;
  }
};

const FilterLink = ({ filter, currentFilter, children }) => {
  if (filter === currentFilter) {
    return <span>{children}</span>;
  } else {
    return (
      <a
        href="#"
        onClick={e => {
          e.preventDefault();
          store.dispatch({
            type: "SET_VISIBILITY_FILTER",
            filter
          });
        }}
      >
        {children}
      </a>
    );
  }
};

const getFilterdTodos = (todos, filter) => {
  switch (filter) {
    case "SHOW_ALL":
      return todos;
    case "SHOW_COMPLETED":
      return todos.filter(todo => {
        return todo.completed;
      });
    case "SHOW_ACTIVE":
      return todos.filter(todo => {
        return !todo.completed;
      });
  }
};

// reducer
const todoApp = combineReducers({
  todos,
  visibilityFilter
});

const store = createStore(todoApp);

let todoId = 0;

const Todo = ({ onClick, text, completed }) => {
  return (
    <li
      key={todo.id}
      onClick={onClick}
      style={{
        textDecoration: completed ? "line-through" : "none"
      }}
    >
      {text}
    </li>
  );
};

const TodoList = ({ todos, onTodoClick }) => (
  <ul>
    {todos.map(todo => (
      <Todo
        key={todo.id}
        {...todo}
        onClick={() => {
          onTodoClick(todo.id);
        }}
      />
    ))}
  </ul>
);

const AddTodo = ({onAddTodoClick}) => {
  let input;
  return (
    <div>
      <input
        ref={node => {
          input = node;
        }}
      />
      <button
        onClick={() => {
          onAddTodoClick(input.value);
          input.value = "";
        }}
      >
        Add Todo
      </button>
    </div>
  );
};

class TodoApp extends Component {
  render() {
    const { todos, visibilityFilter } = this.props;
    const visibleTodos = getFilterdTodos(todos, visibilityFilter);

    return (
      <div>
        <h1>Practice: reducer with compisition pattern</h1>
        <AddTodo onAddTodoClick={
          (value)=>{
            store.dispatch({
              type: "ADD_TODO",
              text: value,
              id: todoId++
            });
          }
        } />
        <div>current maxId: {todoId}</div>
        <p>
          Show:{" "}
          <FilterLink filter="SHOW_ALL" currentFilter={visibilityFilter}>
            ALL
          </FilterLink>{" "}
          <FilterLink filter="SHOW_ACTIVE" currentFilter={visibilityFilter}>
            Active
          </FilterLink>{" "}
          <FilterLink filter="SHOW_COMPLETED" currentFilter={visibilityFilter}>
            Completed
          </FilterLink>
        </p>
        <ul>
          <TodoList
            todos={visibleTodos}
            onTodoClick={id =>
              store.dispatch({
                type: "TOGGLE_TODO",
                id
              })
            }
          />
        </ul>
      </div>
    );
  }
}

const rootElement = document.getElementById("todo");
const render = () => {
  ReactDOM.render(<TodoApp {...store.getState()} />, rootElement);
};
store.subscribe(render);
render();
export default TodoApp;
