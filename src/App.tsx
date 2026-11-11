/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useRef, useState } from 'react';

import { TodoForm } from './components/TodoForm';
import { Footer } from './components/Footer';
import { TodosList } from './components/TodosList';

import { TodoFilterStatus } from './types/TodoFilterStatus';

import { TodoFilter } from './utils/filterTodos/TodoFilter';
import { ErrorNotification } from './components/ErrorNotification';
import { ToggleAll } from './components/ToggleAll';
import { TodosContext } from './Context/Todo/TodosContext';

export const App: React.FC = () => {
  const context = useContext(TodosContext);

  if (!context) {
    throw new Error('TodoList must be used within TodoProvider');
  }

  const { todos, todoError, onAddTodo, onUpdataTodo } = context;

  const [todoFilterState, setTodoFilterState] = useState<TodoFilterStatus>(
    TodoFilterStatus.All,
  );
  const refQuery = useRef<HTMLInputElement>(null);

  const filteredTodos = TodoFilter.Filter(
    todos,
    TodoFilter.FilterByComplete(todoFilterState),
  );

  const handleToggleAllTodos = () => {
    const activeTodos = todos.filter(todo => !todo.completed);

    if (activeTodos.length > 0) {
      activeTodos.forEach(todo =>
        onUpdataTodo(todo.id, { completed: !todo.completed }),
      );
    } else {
      todos.forEach(todo =>
        onUpdataTodo(todo.id, { completed: !todo.completed }),
      );
    }
  };

  const handleSetTodoFilter = (filterStatus: TodoFilterStatus) => {
    setTodoFilterState(filterStatus);
  };

  function getCompletedTodosCount() {
    return todos.reduce((prev, todo) => (todo.completed ? prev + 1 : prev), 0);
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <ToggleAll
            isAllDone={todos.length === getCompletedTodosCount()}
            isExist={!!todos.length}
            onToggle={handleToggleAllTodos}
          />
          <TodoForm onSaveTodo={onAddTodo} refQuery={refQuery} />
        </header>

        <TodosList todos={filteredTodos} />

        <Footer
          selectedFilter={todoFilterState}
          setTodoFilter={handleSetTodoFilter}
        />
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification errorType={todoError} />
    </div>
  );
};
