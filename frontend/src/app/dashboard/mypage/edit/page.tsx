'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { FaExclamationTriangle } from 'react-icons/fa';

// バリデーションスキーマ
const profileEditSchema = z.object({
  birthDate: z
    .string()
    .min(1, '生年月日は必須です')
    .refine(
      (date) => {
        const today = new Date();
        const birthDate = new Date(date);
        return birthDate < today;
      },
      { message: '生年月日は過去の日付を入力してください' }
    ),
  gender: z.string().min(1, '性別を選択してください'),
  address: z.string().min(1, '現住所は必須です'),
  emergencyContact1Name: z.string().min(1, '緊急連絡先1のお名前は必須です'),
  emergencyContact1Relationship: z
    .string()
    .min(1, '緊急連絡先1の続柄は必須です'),
  emergencyContact1Phone: z
    .string()
    .min(1, '緊急連絡先1の電話番号は必須です')
    .regex(
      /^0\d{1,4}-\d{1,4}-\d{4}$|^0\d{9,10}$/,
      '正しい電話番号形式で入力してください（例：090-1234-5678）'
    ),
  emergencyContact2Name: z.string().optional(),
  emergencyContact2Relationship: z.string().optional(),
  emergencyContact2Phone: z
    .string()
    .optional()
    .refine(
      (phone) => {
        if (!phone || phone === '') return true;
        return /^0\d{1,4}-\d{1,4}-\d{4}$|^0\d{9,10}$/.test(phone);
      },
      { message: '正しい電話番号形式で入力してください' }
    ),
  bankName: z.string().min(1, '銀行名は必須です'),
  branchName: z.string().min(1, '支店名は必須です'),
  accountNumber: z
    .string()
    .min(1, '口座番号は必須です')
    .regex(/^\d{7}$/, '口座番号は7桁の数字で入力してください'),
  accountType: z.string().min(1, '口座種別を選択してください'),
  healthInsuranceNumber: z
    .string()
    .min(1, '健康保険番号は必須です')
    .regex(/^\d{8}$/, '健康保険番号は8桁の数字で入力してください'),
  pensionNumber: z
    .string()
    .min(1, '基礎年金番号は必須です')
    .regex(
      /^\d{4}-\d{6}$/,
      '基礎年金番号は「1234-567890」形式で入力してください'
    ),
});

type ProfileEditFormData = z.infer<typeof profileEditSchema>;

export default function ProfileEditPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 現在のユーザー情報（読み取り専用）
  const userProfile = {
    employeeId: 'EMP001',
    firstName: '太郎',
    lastName: '田中',
    email: 'tanaka@functional-lab.com',
    role: '正社員',
    department: '開発部',
    joinDate: '2022-04-01',
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ProfileEditFormData>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      birthDate: '1990-05-15',
      gender: '男性',
      address: '東京都渋谷区神宮前1-1-1',
      emergencyContact1Name: '田中 花子',
      emergencyContact1Relationship: '配偶者',
      emergencyContact1Phone: '090-1234-5678',
      emergencyContact2Name: '',
      emergencyContact2Relationship: '',
      emergencyContact2Phone: '',
      bankName: '三菱UFJ銀行',
      branchName: '渋谷支店',
      accountNumber: '1234567',
      accountType: '普通預金',
      healthInsuranceNumber: '12345678',
      pensionNumber: '1234-567890',
    },
  });

  const onSubmit = async (data: ProfileEditFormData) => {
    setIsLoading(true);

    try {
      // TODO: 実際の更新処理をここに実装
      console.log('プロフィール更新:', data);

      // シミュレーション: 2秒後にマイページにリダイレクト
      setTimeout(() => {
        setIsLoading(false);
        console.log('更新成功');
        router.push('/dashboard/profile?updated=true');
      }, 2000);
    } catch {
      setIsLoading(false);
      setError('root', {
        message: '更新に失敗しました。しばらく時間をおいて再度お試しください。',
      });
    }
  };

  const genderOptions = [
    { value: '男性', label: '男性' },
    { value: '女性', label: '女性' },
    { value: 'その他', label: 'その他' },
    { value: '回答しない', label: '回答しない' },
  ];

  const accountTypeOptions = [
    { value: '普通預金', label: '普通預金' },
    { value: '当座預金', label: '当座預金' },
  ];

  const relationshipOptions = [
    { value: '配偶者', label: '配偶者' },
    { value: '親', label: '親' },
    { value: '子', label: '子' },
    { value: '兄弟姉妹', label: '兄弟姉妹' },
    { value: 'その他', label: 'その他' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              プロフィール編集
            </h1>
            <p className="text-gray-600">個人情報の編集・更新を行えます</p>
          </div>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            戻る
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
          {/* エラーメッセージ */}
          {errors.root && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <FaExclamationTriangle className="text-red-500 mr-2" />
                <span className="text-red-700">更新に失敗しました</span>
              </div>
            </div>
          )}

          {/* 編集不可項目 */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              基本情報（編集不可）
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  氏名
                </label>
                <p className="text-gray-900">
                  {userProfile.lastName} {userProfile.firstName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  社員番号
                </label>
                <p className="text-gray-900">{userProfile.employeeId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  メールアドレス
                </label>
                <p className="text-gray-900">{userProfile.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  所属部署・ロール
                </label>
                <p className="text-gray-900">
                  {userProfile.department} - {userProfile.role}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  入社日
                </label>
                <p className="text-gray-900">{userProfile.joinDate}</p>
              </div>
            </div>
          </div>

          {/* 編集可能項目 */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              個人情報（編集可能）
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 生年月日 */}
              <div>
                <label
                  htmlFor="birthDate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  生年月日 <span className="text-red-500">*</span>
                </label>
                <input
                  id="birthDate"
                  type="date"
                  {...register('birthDate')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.birthDate
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                />
                {errors.birthDate && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.birthDate.message}
                  </p>
                )}
              </div>

              {/* 性別 */}
              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  性別 <span className="text-red-500">*</span>
                </label>
                <select
                  id="gender"
                  {...register('gender')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.gender
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                >
                  <option value="">選択してください</option>
                  {genderOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.gender && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.gender.message}
                  </p>
                )}
              </div>
            </div>

            {/* 現住所 */}
            <div className="mt-6">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                現住所 <span className="text-red-500">*</span>
              </label>
              <input
                id="address"
                type="text"
                {...register('address')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.address
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="東京都渋谷区神宮前1-1-1"
                disabled={isLoading}
              />
              {errors.address && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.address.message}
                </p>
              )}
            </div>
          </div>

          {/* 緊急連絡先 */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">緊急連絡先</h3>

            {/* 緊急連絡先1（必須） */}
            <div className="border rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-900 mb-4">
                緊急連絡先1 <span className="text-red-500">*</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="emergencyContact1Name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    お名前 <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="emergencyContact1Name"
                    type="text"
                    {...register('emergencyContact1Name')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.emergencyContact1Name
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300'
                    }`}
                    placeholder="田中 花子"
                    disabled={isLoading}
                  />
                  {errors.emergencyContact1Name && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.emergencyContact1Name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="emergencyContact1Relationship"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    続柄 <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="emergencyContact1Relationship"
                    {...register('emergencyContact1Relationship')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.emergencyContact1Relationship
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300'
                    }`}
                    disabled={isLoading}
                  >
                    <option value="">選択してください</option>
                    {relationshipOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.emergencyContact1Relationship && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.emergencyContact1Relationship.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="emergencyContact1Phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    電話番号 <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="emergencyContact1Phone"
                    type="tel"
                    {...register('emergencyContact1Phone')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.emergencyContact1Phone
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300'
                    }`}
                    placeholder="090-1234-5678"
                    disabled={isLoading}
                  />
                  {errors.emergencyContact1Phone && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.emergencyContact1Phone.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 緊急連絡先2（任意） */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">
                緊急連絡先2（任意）
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="emergencyContact2Name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    お名前
                  </label>
                  <input
                    id="emergencyContact2Name"
                    type="text"
                    {...register('emergencyContact2Name')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="田中 次郎"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label
                    htmlFor="emergencyContact2Relationship"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    続柄
                  </label>
                  <select
                    id="emergencyContact2Relationship"
                    {...register('emergencyContact2Relationship')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    disabled={isLoading}
                  >
                    <option value="">選択してください</option>
                    {relationshipOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="emergencyContact2Phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    電話番号
                  </label>
                  <input
                    id="emergencyContact2Phone"
                    type="tel"
                    {...register('emergencyContact2Phone')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.emergencyContact2Phone
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300'
                    }`}
                    placeholder="090-1234-5678"
                    disabled={isLoading}
                  />
                  {errors.emergencyContact2Phone && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.emergencyContact2Phone.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 給与振込口座 */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              給与振込口座
            </h3>
            <div className="border rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="bankName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    銀行名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="bankName"
                    type="text"
                    {...register('bankName')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.bankName
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300'
                    }`}
                    placeholder="三菱UFJ銀行"
                    disabled={isLoading}
                  />
                  {errors.bankName && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.bankName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="branchName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    支店名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="branchName"
                    type="text"
                    {...register('branchName')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.branchName
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300'
                    }`}
                    placeholder="渋谷支店"
                    disabled={isLoading}
                  />
                  {errors.branchName && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.branchName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="accountNumber"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    口座番号 <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="accountNumber"
                    type="text"
                    {...register('accountNumber')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.accountNumber
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300'
                    }`}
                    placeholder="1234567"
                    disabled={isLoading}
                  />
                  {errors.accountNumber && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.accountNumber.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="accountType"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    口座種別 <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="accountType"
                    {...register('accountType')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.accountType
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300'
                    }`}
                    disabled={isLoading}
                  >
                    <option value="">選択してください</option>
                    {accountTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.accountType && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.accountType.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 社会保険情報 */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              社会保険情報
            </h3>
            <div className="border rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="healthInsuranceNumber"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    健康保険番号 <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="healthInsuranceNumber"
                    type="text"
                    {...register('healthInsuranceNumber')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.healthInsuranceNumber
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300'
                    }`}
                    placeholder="12345678"
                    disabled={isLoading}
                  />
                  {errors.healthInsuranceNumber && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.healthInsuranceNumber.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="pensionNumber"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    基礎年金番号 <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="pensionNumber"
                    type="text"
                    {...register('pensionNumber')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.pensionNumber
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300'
                    }`}
                    placeholder="1234-567890"
                    disabled={isLoading}
                  />
                  {errors.pensionNumber && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.pensionNumber.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ボタン */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  更新中...
                </div>
              ) : (
                '変更を保存'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
