import { TodoRow } from '../TodoRow';
import { TodoLoadindRow } from '../TodoLoadindRow';
import { useContext } from 'react';
import { TodosContext } from '../../Context/Todo/TodosContext';
import { Todo } from '../../types/Todo';

export const TodosList: React.FC<{ todos: Todo[] }> = ({ todos }) => {
  const context = useContext(TodosContext);

  if (!context) {
    throw new Error('TodoList must be used within TodoProvider');
  }

  const { todoToCreate } = context;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return <TodoRow key={todo.id} todo={todo} />;
      })}

      {/* This todo is in loadind state */}
      {todoToCreate && <TodoLoadindRow title={todoToCreate.title} />}
    </section>
  );
};
