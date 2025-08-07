import { useState } from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import { FiEye, FiEyeOff } from 'react-icons/fi';

type Props = {
  id: string;
  label: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  disabled?: boolean;
  showStrengthBar?: boolean;
  passwordValue?: string;
};

export const PasswordField = ({
  id,
  label,
  placeholder,
  register,
  error,
  disabled = false,
  showStrengthBar = false,
  passwordValue,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  // パスワード強度チェック
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '' };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const labels = ['', '弱い', '普通', '良い', '強い', '非常に強い'];
    const colors = [
      '',
      'text-red-500',
      'text-orange-500',
      'text-yellow-500',
      'text-green-500',
      'text-blue-500',
    ];

    return { strength, label: labels[strength], color: colors[strength] };
  };

  const passwordStrength = getPasswordStrength(passwordValue || '');

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          {...register}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors pr-12 ${
            error
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          }`}
          placeholder={placeholder}
          disabled={disabled}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          disabled={disabled}
        >
          <span className="text-gray-400 text-sm">
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </span>
        </button>
      </div>

      {/* パスワード強度バー */}
      {showStrengthBar && passwordStrength && (
        <div className="mt-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">強度:</span>
            <span
              className={`text-sm font-medium ${'color' in passwordStrength ? passwordStrength.color : ''}`}
            >
              {passwordStrength.label}
            </span>
          </div>
          <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                passwordStrength.strength <= 1
                  ? 'bg-red-500'
                  : passwordStrength.strength <= 2
                    ? 'bg-orange-500'
                    : passwordStrength.strength <= 3
                      ? 'bg-yellow-500'
                      : passwordStrength.strength <= 4
                        ? 'bg-green-500'
                        : 'bg-blue-500'
              }`}
              style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
            />
          </div>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error.message}</p>}
    </div>
  );
};
