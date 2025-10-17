import TodoLoader from "./TodoLoader";
import TodoItem from "./TodoItem";
import { Todo } from "../types/todo";

type TodoListProps = {
  todos: Todo[];
  loading: boolean;
  onToggle: (id: number, completed: boolean) => void;
};

const TodoList = ({ todos, loading, onToggle }: TodoListProps) => {
  return (
    <div className="mt-4 divide-y divide-gray-200 border-b border-t border-gray-200">
      {loading
        ? Array.from({ length: 5 }, (_, index) => <TodoLoader key={index} />)
        : todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onToggle={onToggle} />
          ))}
    </div>
  );
};

export default TodoList;
