import { Todo } from '../../types/Todo';
import { TodoFilterStatus } from '../../types/TodoFilterStatus';
import { CollBeakFilter } from './CollBeakFilter';

export class TodoFilter {
  public static Filter(
    todos: Todo[],
    ...predicates: ((todo: Todo) => boolean)[]
  ): Todo[] {
    return CollBeakFilter.Filter<Todo>(todos, predicates);
  }

  public static FilterByComplete(todoFilterState: TodoFilterStatus) {
    return ({ completed }: Todo) => {
      return (
        todoFilterState === TodoFilterStatus.All ||
        (todoFilterState === TodoFilterStatus.Active && !completed) ||
        (todoFilterState === TodoFilterStatus.Completed && completed)
      );
    };
  }
}
