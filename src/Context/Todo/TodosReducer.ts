import { Todo } from '../../types/Todo';
import { TodoActions } from './TodoActions';

export const TodosReducer = (state: Todo[], action: TodoActions): Todo[] => {
  switch (action.type) {
    case 'SET_TODOS':
      return action.payload.todos;
    case 'UPDATE_TODO':
      return state.map(todo =>
        todo.id === action.payload.id
          ? { ...todo, ...action.payload.changes }
          : todo,
      );
    case 'DELETE_TODO':
      return state.filter(todo => todo.id !== action.payload.id);
    case 'ADD_TODO':
      return [...state, action.payload.todo];
    default:
      return state;
  }
};
