import { useEffect, useReducer, useState } from 'react';
import { TodosContext } from './TodosContext';
import { Todo } from '../../types/Todo';
import * as todoAPI from '../../api/todos';
import { TypeError } from '../../types/TypeError';
import { TodosReducer } from './TodosReducer';

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todoState, todoDispatch] = useReducer(TodosReducer, []);

  const [animatedTodos, setAnimatedTodos] = useState<number[]>([]);
  const [todoError, setError] = useState<TypeError>(TypeError.None);
  const [todoToCreate, setTodoToCreate] = useState<Todo | null>(null);

  function closeErrorMessage() {
    setTimeout(() => setError(TypeError.None), 3000);
  }

  const addAnimatedTodo = (id: number) => {
    setAnimatedTodos(prev => [...prev, id]);
  };

  const removeAnimatedTodo = (id: number) => {
    setAnimatedTodos(prev => prev.filter(todoId => todoId !== id));
  };

  const onAddTodo = (title: string) => {
    if (title.length === 0) {
      setError(TypeError.TitleEmpty);
      closeErrorMessage();

      return Promise.resolve();
    }

    const newTodo = {
      title: title,
      completed: false,
    };

    setTodoToCreate({ ...newTodo, userId: -1, id: -1 });

    return todoAPI
      .postTodo(newTodo)
      .then(createdTodo => {
        todoDispatch({ type: 'ADD_TODO', payload: { todo: createdTodo } });
      })
      .catch(requestError => {
        setError(TypeError.UnableAddTodo);
        throw requestError;
      })
      .finally(() => {
        setTodoToCreate(null);
        closeErrorMessage();
      });
  };

  const onUpdataTodo = (
    id: number,
    changes: Partial<Omit<Todo, 'id'>>,
    onSuccess?: () => void,
  ) => {
    addAnimatedTodo(id);

    return todoAPI
      .patchTodo(id, changes)
      .then(() => {
        todoDispatch({ type: 'UPDATE_TODO', payload: { id, changes } });
        onSuccess?.();
      })
      .catch(requestError => {
        setError(TypeError.UnableUpdateTodo);
        throw requestError;
      })
      .finally(() => {
        closeErrorMessage();
        removeAnimatedTodo(id);
      });
  };

  const onDeleteTodo = (id: number, onSuccess?: () => void) => {
    addAnimatedTodo(id);

    return todoAPI
      .deleteTodo(id)
      .then(() => {
        todoDispatch({ type: 'DELETE_TODO', payload: { id } });
        onSuccess?.();
      })
      .catch(() => {
        setError(TypeError.UnableDeleteTodo);
      })
      .finally(() => {
        closeErrorMessage();
        removeAnimatedTodo(id);
      });
  };

  useEffect(() => {
    todoAPI
      .getTodos()
      .then(newTodos => {
        todoDispatch({ type: 'SET_TODOS', payload: { todos: newTodos } });
      })
      .catch(() => {
        setError(TypeError.UnableLoadTodos);
      })
      .finally(closeErrorMessage);
  }, []);

  return (
    <TodosContext.Provider
      value={{
        todos: todoState,
        animatedTodos,
        todoError,
        todoToCreate,
        onAddTodo,
        onUpdataTodo,
        onDeleteTodo,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};
