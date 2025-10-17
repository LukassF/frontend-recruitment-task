type TodoFooterProps = {
  remainingCount: number;
  completedCount: number;
  loading: boolean;
  onClearCompleted: () => void;
};

const TodoFooter = ({
  remainingCount,
  completedCount,
  loading,
  onClearCompleted,
}: TodoFooterProps) => {
  if (loading && !remainingCount && !completedCount) {
    return null;
  }

  return (
    <div className="flex h-8 items-center justify-between">
      <span
        data-testid="todo-count"
        className="text-sm font-medium leading-6 text-gray-900"
      >
        {remainingCount} items left
      </span>
      {completedCount ? (
        <button
          onClick={onClearCompleted}
          className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Clear completed
        </button>
      ) : null}
    </div>
  );
};

export default TodoFooter;
