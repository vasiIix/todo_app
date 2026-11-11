import React, { useContext, useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { TodosContext } from '../../Context/Todo/TodosContext';

type Props = {
  todo: Todo;
};

export const TodoRow: React.FC<Props> = ({ todo }) => {
  const { id, title, completed } = todo;
  const context = useContext(TodosContext);

  if (!context) {
    throw new Error('TodoList must be used within TodoProvider');
  }

  const { animatedTodos, onUpdataTodo, onDeleteTodo } = context;

  const [isEdit, setIsEdit] = useState<boolean>(false);

  const refEditQuery = useRef<HTMLInputElement>(null);

  const handleEditClick = () => setIsEdit(true);

  const handleEditSubmit = () => {
    let newTitle = '';

    if (refEditQuery.current) {
      newTitle = refEditQuery.current.value.trim();
    }

    if (newTitle === title) {
      setIsEdit(false);

      return;
    }

    if (newTitle === '') {
      onDeleteTodo(id);

      return;
    }

    onUpdataTodo(id, { title: newTitle }, () => setIsEdit(false));
  };

  const handleToggleComplete = () =>
    onUpdataTodo(id, { completed: !completed });

  const handleEditCancel = () => setIsEdit(false);

  useEffect(() => {
    if (refEditQuery.current) {
      refEditQuery.current.value = title;
      refEditQuery.current.focus();
    }
  }, [isEdit, title]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: completed })}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleToggleComplete}
        />{' '}
      </label>

      {isEdit ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleEditSubmit();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={refEditQuery}
            onBlur={() => handleEditSubmit()}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                handleEditCancel();
              }
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleEditClick}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDeleteTodo(id)}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': animatedTodos.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
