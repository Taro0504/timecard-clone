import { z } from 'zod';

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, '名は必須です')
      .min(2, '名は2文字以上で入力してください'),
    lastName: z
      .string()
      .min(1, '姓は必須です')
      .min(2, '姓は2文字以上で入力してください'),
    email: z
      .string()
      .min(1, 'メールアドレスは必須です')
      .email('正しいメールアドレス形式で入力してください'),
    password: z
      .string()
      .min(1, 'パスワードは必須です')
      .min(8, 'パスワードは8文字以上で入力してください')
      .regex(/[A-Z]/, 'パスワードには大文字を含む必要があります')
      .regex(/[a-z]/, 'パスワードには小文字を含む必要があります')
      .regex(/[0-9]/, 'パスワードには数字を含む必要があります'),
    confirmPassword: z.string().min(1, 'パスワード確認は必須です'),
    termsAccepted: z
      .boolean()
      .refine((val) => val === true, '利用規約に同意してください'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
