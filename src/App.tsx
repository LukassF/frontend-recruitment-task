import { useApi } from "./hooks/useApi";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Todo, TodoUpdate } from "./types/todo";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import TodoFooter from "./components/TodoFooter";

export function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const { run, loading, error, data } = useApi<Todo[]>();

  const completedItems = useMemo(() => {
    return todos.filter((todo) => todo.completed);
  }, [todos]);

  const notCompletedItems = useMemo(() => {
    return todos.filter((todo) => !todo.completed);
  }, [todos]);

  useEffect(() => {
    if (error) {
      return;
    }

    if (data?.length) {
      setTodos(data);
    }
  }, [data, error]);

  useEffect(() => {
    run("/todos", "GET");
  }, []);

  const addTodo = async (title: string) => {
    await run(
      "/todos",
      "POST",
      { title },
      false, // dont show loading state
    );
    await run("/todos", "GET");
  };

  const setTodoCompleted = async (id: number, completed: boolean) => {
    const todo = todos.find((todo) => todo.id === id);
    if (!todo) {
      alert("Todo not found");
      return;
    }
    try {
      const updated = await run<TodoUpdate>(
        `/todos/${id}`,
        "PUT",
        {
          title: todo.title,
          completed,
        },
        false, // dont show loading state
      );

      if (updated) {
        setTodos((prev) =>
          prev.map((t) => (t.id === id ? { ...t, completed } : t)),
        );
      }
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  const deleteCompletedTodos = useCallback(async () => {
    // it would be better to expose an endpoint on the backend that takes multiple ids in the body so as not to perform multiple requests
    const promises = completedItems?.map((todo) => {
      run(
        `/todos/${todo.id}`,
        "DELETE",
        undefined,
        false, // dont show loading state
      );
    });
    try {
      await Promise.allSettled(promises);
      setTodos((prev) => [...prev.filter((todo) => !todo.completed)]);
    } catch (error) {
      console.error("Failed to delete todos:", error);
    }
  }, [completedItems, run]);

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 p-4">
      <TodoForm
        title={title}
        onChange={(value) => setTitle(value)}
        onSubmit={async (event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          if (!title.trim()) {
            return;
          }

          await addTodo(title.trim());
          setTitle("");
        }}
      />

      <fieldset>
        <legend className="text-base font-semibold leading-6 text-gray-900">
          Todo list
        </legend>
        <TodoList todos={todos} loading={loading} onToggle={setTodoCompleted} />
      </fieldset>

      <TodoFooter
        remainingCount={notCompletedItems.length}
        completedCount={completedItems.length}
        loading={loading}
        onClearCompleted={deleteCompletedTodos}
      />
    </div>
  );
}
