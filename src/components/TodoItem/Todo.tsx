import React from "react";

type TodoTypes = {
  todo: string;
  status: boolean;
  time: Date;
  id: string;
  onDelete: (id: string) => void;
  onEdit: (id: string, newValue: string) => void;
  onStatusChange: (id: string) => void;
};
export const Todo = React.memo(
  ({ todo, status, time, onDelete, onEdit, onStatusChange, id }: TodoTypes) => {
    const [isEditing, setIsEditing] = React.useState<boolean>(false);
    const [editValue, setEditValue] = React.useState<string>(todo);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        onEdit(id, editValue);
        setIsEditing(false);
      }
    };
    return (
      <div className={`todo-detail${status ? " completed" : ""}`}>
        <div className="todo-detail-col-1">
          <input
            onChange={() => onStatusChange(id)}
            type="checkbox"
            checked={status}
            id={id}
          />
          {isEditing ? (
            <input
              onChange={(e) => setEditValue(e.target.value)}
              value={editValue}
              type="text"
              onKeyDown={handleKeyDown}
              className="edit-todo-input"
            />
          ) : (
            <label
              style={{
                textDecoration: status ? "line-through" : "auto",
              }}
              onClick={() => setIsEditing(true)}
              htmlFor={id}
              onChange={(e) => {}}
            >
              {todo}
            </label>
          )}
        </div>
        <div className="todo-detail-col-2">
          <span>{time.toDateString()}</span>
          <button className="delete-todo" onClick={() => onDelete(id)}>
            Delete Todo
          </button>
        </div>
      </div>
    );
  }
);
