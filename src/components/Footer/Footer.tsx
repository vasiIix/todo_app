import React, { useContext } from 'react';
import cn from 'classnames';
import { TodoFilterStatus } from '../../types/TodoFilterStatus';
import { TodosContext } from '../../Context/Todo/TodosContext';

type Props = {
  selectedFilter: TodoFilterStatus;
  setTodoFilter: (value: TodoFilterStatus) => void;
};

export const Footer: React.FC<Props> = ({ selectedFilter, setTodoFilter }) => {
  const context = useContext(TodosContext);

  if (!context) {
    throw new Error('TodoList must be used within TodoProvider');
  }

  const { todos, onDeleteTodo } = context;

  function getCompletedTodosCount() {
    return todos.reduce((prev, todo) => (todo.completed ? prev + 1 : prev), 0);
  }

  function handleDeleteCompletedTodos() {
    todos.forEach(todo => {
      if (todo.completed) {
        onDeleteTodo(todo.id);
      }
    });
  }

  return (
    todos.length > 0 && (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {todos.length - getCompletedTodosCount()} items left
        </span>

        {/* Active link should have the 'selected' class */}
        <nav className="filter" data-cy="Filter">
          <a
            href="#/"
            className={cn('filter__link', {
              selected: TodoFilterStatus.All === selectedFilter,
            })}
            data-cy="FilterLinkAll"
            onClick={() => setTodoFilter(TodoFilterStatus.All)}
          >
            All
          </a>

          <a
            href="#/active"
            className={cn('filter__link', {
              selected: TodoFilterStatus.Active === selectedFilter,
            })}
            data-cy="FilterLinkActive"
            onClick={() => setTodoFilter(TodoFilterStatus.Active)}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={cn('filter__link', {
              selected: TodoFilterStatus.Completed === selectedFilter,
            })}
            data-cy="FilterLinkCompleted"
            onClick={() => setTodoFilter(TodoFilterStatus.Completed)}
          >
            Completed
          </a>
        </nav>

        {/* this button should be disabled if there are no completed todos */}
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={handleDeleteCompletedTodos}
          disabled={getCompletedTodosCount() === 0}
        >
          Clear completed
        </button>
      </footer>
    )
  );
};
