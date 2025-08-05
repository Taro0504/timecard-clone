import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

type Props = {
  id: string;
  label: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  register: UseFormRegisterReturn;
  error?: FieldError;
};

export const InputField = ({
  id,
  label,
  placeholder,
  type = 'text',
  disabled = false,
  register,
  error,
}: Props) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        {...register}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors ${
          error
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
        }`}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error.message}</p>}
    </div>
  );
};
