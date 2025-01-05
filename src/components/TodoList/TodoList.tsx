import React from "react";
import { Todo } from "../TodoItem";
import { v4 as uuidv4 } from "uuid";
import { useLocalStorage } from "../../hooks";
import { TodoTabs } from "../../constants";

type TodoTypes = {
  id: string;
  todo: string;
  completed: boolean;
  time: Date;
};

export const TodoList = React.memo(() => {
  const [localStorageData, setLocalStorageData] = useLocalStorage<TodoTypes[]>(
    "todos",
    []
  );
  const [newTodo, setNewTodos] = React.useState<string>("");
  const [activeTab, setActiveTab] = React.useState("View-all");

  const onDelete = (id: string) => {
    setLocalStorageData((prev) => {
      return prev.filter((todo) => id !== todo.id);
    });
  };
  const onEdit = (id: string, newValue: string) => {
    if (newValue === "") return;
    setLocalStorageData((prev) => {
      return prev.map((todo) => {
        return todo.id === id
          ? {
              ...todo,
              todo: newValue,
            }
          : todo;
      });
    });
  };
  const onStatusChange = (id: string) => {
    setLocalStorageData((prev) => {
      return prev.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
            }
          : todo
      );
    });
  };
  const addTodo = () => {
    if (newTodo === "") return;
    setLocalStorageData((prev) => {
      return [
        ...prev,
        {
          id: uuidv4(),
          todo: newTodo,
          time: new Date(),
          completed: false,
        },
      ];
    });

    setNewTodos("");
  };

  const filterTodos = (tab: string) => {
    setActiveTab(tab);
  };
  const filteredTodos = localStorageData
    .filter((todo) => {
      if (activeTab === TodoTabs.Completed) return todo.completed;
      if (activeTab === TodoTabs.Incomplete) return !todo.completed;
      return true;
    })
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  return (
    <div className="main-wrapper">
      <div className="container">
        <div className="cta-container">
          <input
            value={newTodo}
            type="text"
            placeholder="To-do"
            className="todo-input"
            onChange={(e) => setNewTodos(e.target.value)}
          />
          <button onClick={addTodo} className="add-todo">
            Add To-do
          </button>
        </div>
        <h1>Your Todos</h1>
        <div className="tabs-container">
          {Object.keys(TodoTabs).map((tab) => {
            const tabValue = TodoTabs[tab as keyof typeof TodoTabs];
            return (
              <div
                key={tab}
                className={`tab ${activeTab === tabValue && "active"}`}
                onClick={() => filterTodos(tabValue)}
              >
                {tabValue}
              </div>
            );
          })}
        </div>
        <div className="todo-detail-container">
          {filteredTodos.length > 0 ? (
            filteredTodos.map((todo) => {
              return (
                <Todo
                  key={todo.id}
                  id={todo.id}
                  todo={todo.todo}
                  status={todo.completed}
                  time={new Date(todo.time)}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                />
              );
            })
          ) : (
            <h1>No todos</h1>
          )}
        </div>
      </div>
    </div>
  );
});
