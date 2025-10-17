import { FormEvent } from "react";

type TodoFormProps = {
  title: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const TodoForm = ({ title, onChange, onSubmit }: TodoFormProps) => {
  return (
    <form onSubmit={onSubmit}>
      <input
        value={title}
        onChange={(event) => onChange(event.target.value)}
        name="title"
        placeholder="What needs to be done?"
        type="text"
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      />
    </form>
  );
};

export default TodoForm;
