import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Gift, Calendar, CustomIcon } from 'lucide-react'; // Let's not use customIcon if not imported.
import { BirthdayWish } from '../types';

export default function TeacherBirthdays() {
  const { teachers, birthdayWishes, addBirthdayWish, deleteBirthdayWish } = useStore();
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  // Calculate upcoming birthdays
  const getUpcomingBirthdays = () => {
    // Current date logic
    const today = new Date();
    // Assuming 2024 as baseline like before or just ignore year for birthday calculation
    // Return a sorted list of teachers by next birthday
    // Just simple list for now
    return teachers.filter(t => t.ngaySinh).map(t => {
      const birthDate = new Date(t.ngaySinh!);
      return {
        ...t,
        birthMonth: birthDate.getMonth(),
        birthDay: birthDate.getDate(),
      };
    }).sort((a, b) => {
      if (a.birthMonth !== b.birthMonth) return a.birthMonth - b.birthMonth;
      return a.birthDay - b.birthDay;
    });
  };

  const upcomingBirthdays = getUpcomingBirthdays();

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacherId || !senderName || !message) return;

    addBirthdayWish({
      id: "w" + Date.now(),
      teacherId: selectedTeacherId,
      senderName,
      message,
      imageUrl: imageUrl || undefined,
      date: new Date().toISOString()
    });

    setSenderName('');
    setMessage('');
    setImageUrl('');
    setSelectedTeacherId('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Gift className="text-blue-600" /> Sinh nhật Giáo viên
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="text-blue-600 w-5 h-5" /> Gửi lời chúc mới
            </h3>
            <form onSubmit={handleAddWish} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chọn giáo viên</label>
                <select 
                  required
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                >
                  <option value="">-- Chọn giáo viên --</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.hoTen} ({t.ngaySinh ? new Date(t.ngaySinh).toLocaleDateString("vi-VN").slice(0, 5) : '?'})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Người gửi</label>
                <input 
                  type="text" 
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  placeholder="VD: Tập thể lớp 12A1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lời chúc</label>
                <textarea 
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  rows={4}
                  placeholder="Viết lời chúc tốt đẹp nhất..."
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Đường dẫn hình ảnh (Không bắt buộc)</label>
                <input 
                  type="url" 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  placeholder="https://..."
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 text-white rounded-md py-2 font-medium hover:bg-blue-700 transition"
              >
                Gửi lời chúc
              </button>
            </form>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Danh sách sinh nhật</h3>
            <div className="space-y-3">
              {upcomingBirthdays.map(t => {
                const isToday = t.birthMonth === new Date().getMonth() && t.birthDay === new Date().getDate();
                return (
                  <div key={t.id} className={`flex items-center gap-3 p-3 rounded-lg border ${isToday ? 'border-pink-300 bg-pink-50' : 'border-gray-100'}`}>
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 shrink-0">
                      {t.anhDaiDien}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 text-sm">{t.hoTen}</p>
                      <p className="text-xs text-gray-500">{t.bomon}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-sm ${isToday ? 'text-pink-600' : 'text-blue-600'}`}>
                        {t.birthDay.toString().padStart(2, '0')}/{(t.birthMonth + 1).toString().padStart(2, '0')}
                      </p>
                      {isToday && <p className="text-[10px] uppercase font-bold text-pink-500 bg-pink-100 px-1.5 py-0.5 rounded inline-block mt-0.5">Sinh nhật</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-lg text-gray-800 mb-6 flex items-center gap-2">
              <Gift className="text-pink-500 w-5 h-5" /> Lời chúc yêu thương
            </h3>
            
            {birthdayWishes.length === 0 ? (
              <div className="text-center py-12">
                <Gift className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 italic">Chưa có lời chúc nào. Hãy là người đầu tiên gửi lời chúc!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {birthdayWishes.map(wish => {
                  const teacher = teachers.find(t => t.id === wish.teacherId);
                  return (
                    <div key={wish.id} className="relative bg-gradient-to-br from-pink-50 to-orange-50 p-5 rounded-2xl border border-pink-100 shadow-sm group">
                      <button 
                        onClick={() => deleteBirthdayWish(wish.id)}
                        className="absolute top-2 right-2 p-1.5 bg-white text-red-500 rounded-full shadow hover:bg-red-50 opacity-0 group-hover:opacity-100 transition"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                      </button>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-white border border-pink-200 flex items-center justify-center font-bold text-pink-600">
                          {teacher?.anhDaiDien || '?'}
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Gửi đến</p>
                          <p className="font-bold text-gray-800 text-sm">Cô/Thầy {teacher?.hoTen}</p>
                        </div>
                      </div>
                      
                      {wish.imageUrl && (
                        <div className="mb-4 rounded-xl overflow-hidden shadow-sm h-32 bg-white">
                          <img src={wish.imageUrl} alt="Birthday Card" className="w-full h-full object-cover" />
                        </div>
                      )}
                      
                      <div className="bg-white/60 p-4 rounded-xl mb-4 text-gray-700 italic border border-white">
                        "{wish.message}"
                      </div>
                      
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-pink-600 flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                          Từ: {wish.senderName}
                        </span>
                        <span className="text-gray-400">
                          {new Date(wish.date).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
