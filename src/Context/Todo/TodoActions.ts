/* eslint-disable @typescript-eslint/indent */
import { Todo } from '../../types/Todo';

export type TodoActions =
  | {
      type: 'UPDATE_TODO';
      payload: { id: number; changes: Partial<Omit<Todo, 'id'>> };
    }
  | { type: 'DELETE_TODO'; payload: { id: number } }
  | { type: 'ADD_TODO'; payload: { todo: Todo } }
  | {
      type: 'SET_TODOS';
      payload: { todos: Array<Todo> };
    };
