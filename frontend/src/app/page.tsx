'use client';

import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isWorking, setIsWorking] = useState<boolean>(false);
  const [workStartTime, setWorkStartTime] = useState<Date | null>(null);

  // 現在時刻の更新
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 出勤処理
  const handleClockIn = () => {
    const now = new Date();
    setWorkStartTime(now);
    setIsWorking(true);
    console.log('出勤時刻:', now.toLocaleString('ja-JP'));
  };

  // 退勤処理
  const handleClockOut = () => {
    const now = new Date();
    setIsWorking(false);
    console.log('退勤時刻:', now.toLocaleString('ja-JP'));
    if (workStartTime) {
      const workDuration = now.getTime() - workStartTime.getTime();
      const hours = Math.floor(workDuration / (1000 * 60 * 60));
      const minutes = Math.floor(
        (workDuration % (1000 * 60 * 60)) / (1000 * 60)
      );
      console.log(`勤務時間: ${hours}時間${minutes}分`);
    }
  };

  // 勤務時間の計算
  const calculateWorkTime = () => {
    if (!isWorking || !workStartTime) return '0時間0分';
    const duration = currentTime.getTime() - workStartTime.getTime();
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}時間${minutes}分`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            FunctionalLab Timecard Dashboard
          </h1>
          <p className="text-gray-600">
            {currentTime.toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long',
            })}
          </p>
        </header>

        {/* メインコンテンツ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 時計・打刻セクション */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              現在時刻
            </h2>

            {/* デジタル時計 */}
            <div className="text-center mb-6">
              <div className="text-4xl font-mono font-bold text-blue-600 mb-2">
                {currentTime.toLocaleTimeString('ja-JP')}
              </div>
              <div className="text-sm text-gray-500">
                {currentTime.toLocaleDateString('ja-JP')}
              </div>
            </div>

            {/* 打刻ボタン */}
            <div className="space-y-3">
              <button
                onClick={handleClockIn}
                disabled={isWorking}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  isWorking
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg'
                }`}
              >
                🟢 出勤
              </button>

              <button
                onClick={handleClockOut}
                disabled={!isWorking}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  !isWorking
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg'
                }`}
              >
                🔴 退勤
              </button>
            </div>
          </div>

          {/* 勤務状況セクション */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              今日の勤務状況
            </h2>

            <div className="space-y-4">
              {/* 勤務状態 */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600">勤務状態</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isWorking
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {isWorking ? '勤務中' : '退勤済み'}
                </span>
              </div>

              {/* 出勤時刻 */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600">出勤時刻</span>
                <span className="font-mono">
                  {workStartTime
                    ? workStartTime.toLocaleTimeString('ja-JP')
                    : '--:--:--'}
                </span>
              </div>

              {/* 勤務時間 */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600">勤務時間</span>
                <span className="font-mono text-blue-600 font-semibold">
                  {calculateWorkTime()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 最近の活動セクション */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            最近の活動
          </h2>
          <div className="text-center text-gray-500 py-8">
            <p>打刻履歴はまだありません</p>
            <p className="text-sm mt-2">
              出勤・退勤ボタンを押すと履歴が表示されます
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
