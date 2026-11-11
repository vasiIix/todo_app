import { createContext } from 'react';
import { Todo } from '../../types/Todo';
import { TypeError } from '../../types/TypeError';

type TodosContextType = {
  todos: Todo[];
  animatedTodos: number[];
  todoError: TypeError;
  todoToCreate: Todo | null;
  onAddTodo: (title: string) => Promise<void>;
  onUpdataTodo: (
    id: number,
    changes: Partial<Omit<Todo, 'id'>>,
    onSuccess?: () => void,
  ) => Promise<void>;
  onDeleteTodo: (id: number, onSuccess?: () => void) => Promise<void>;
};

export const TodosContext = createContext<TodosContextType | null>(null);
