import React from 'react';
import { useStore } from '../store/useStore';
import { Users, UserCheck, Star, Award, Trophy, Code, Medal, Target, CalendarDays, Clock, MapPin } from 'lucide-react';

export default function Dashboard() {
  const { teachers, teacherAchievements, studentAchievements, mentorships, scheduleEvents, students } = useStore();

  const totalTeachers = teachers.length;
  const activeTeachers = teachers.filter(t => t.trangThai === 'Đang làm').length;
  const currentYearGVGioi = teacherAchievements.filter(a => a.namHoc === '2023-2024' && a.tenThanhTich.includes('Giáo viên giỏi')).length;
  const skknCount = teacherAchievements.filter(a => a.loai === 'Sáng kiến cải tiến').length;

  const totalStudentAchieve = studentAchievements.length;
  const highLevelAchieve = studentAchievements.filter(a => ['Quốc tế', 'Quốc gia', 'Tỉnh/Thành phố'].includes(a.capDo)).length;
  const xsStudentAchieve = studentAchievements.filter(a => a.loai === 'Học sinh xuất sắc').length;
  const techAchieve = studentAchievements.filter(a => ['Tin học', 'Robotics'].includes(a.bomon)).length;

  // Recent 5 Student Achievements
  const recentStudentAchieve = [...studentAchievements].sort((a, b) => new Date(b.ngayDat).getTime() - new Date(a.ngayDat).getTime()).slice(0, 5);

  // Upcoming 3 Events
  const today = '2024-11-01'; // Since the mock data is around Nov 2024, using this as today's baseline for realistic upcoming calculation
  const upcomingEvents = [...scheduleEvents]
    .filter(e => e.ngay >= today && e.trangThai !== 'Đã hủy')
    .sort((a, b) => new Date(a.ngay).getTime() - new Date(b.ngay).getTime() || a.gioBatDau.localeCompare(b.gioBatDau))
    .slice(0, 3);
    
  const upcomingCompetitions = [...scheduleEvents]
    .filter(e => e.ngay >= today && e.loai.toLowerCase().includes('thi'))
    .sort((a, b) => new Date(a.ngay).getTime() - new Date(b.ngay).getTime() || a.gioBatDau.localeCompare(b.gioBatDau))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Tổng GV" value={totalTeachers} icon={<Users className="text-blue-600" />} color="bg-blue-100" />
        <StatCard title="Đang làm" value={activeTeachers} icon={<UserCheck className="text-green-600" />} color="bg-green-100" />
        <StatCard title="Giáo viên xuất sắc" value={currentYearGVGioi} icon={<Star className="text-yellow-600" />} color="bg-yellow-100" />
        <StatCard title="Sáng kiến cải tiến" value={skknCount} icon={<Award className="text-purple-600" />} color="bg-purple-100" />
      </div>

      {/* Stats row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Tổng giải HS" value={totalStudentAchieve} icon={<Trophy className="text-amber-600" />} color="bg-amber-100" />
        <StatCard title="Giải Tỉnh trở lên" value={highLevelAchieve} icon={<Medal className="text-red-600" />} color="bg-red-100" />
        <StatCard title="HS Xuất sắc" value={xsStudentAchieve} icon={<Star className="text-orange-600" />} color="bg-orange-100" />
        <StatCard title="Robotics / IT" value={techAchieve} icon={<Code className="text-teal-600" />} color="bg-teal-100" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Các cuộc thi sắp diễn ra
          </h3>
          <div className="flex-1 overflow-y-auto space-y-3">
            {upcomingCompetitions.map((event) => {
              const isToday = event.ngay === today;
              return (
                <div key={event.id} className={`p-4 rounded-xl transition border ${isToday ? 'border-amber-300 bg-amber-50/50' : 'border-gray-100 hover:border-amber-200'}`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800">{event.loai}</span>
                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{new Date(event.ngay).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm mb-2">{event.tieuDe}</h4>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-gray-400"/>{event.gioBatDau}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gray-400"/>{event.diaDiem}</span>
                  </div>
                </div>
              );
            })}
            {upcomingCompetitions.length === 0 && (
              <p className="text-center text-gray-500 py-6 italic">Không có cuộc thi nào sắp tới.</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-600" />
            Sự kiện sắp tới
          </h3>
          <div className="flex-1 overflow-y-auto space-y-3">
            {upcomingEvents.map((event) => {
              const isToday = event.ngay === today;
              return (
                <div key={event.id} className={`p-4 rounded-xl transition border ${isToday ? 'border-blue-300 bg-blue-50/50' : 'border-gray-100 hover:border-blue-200'}`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800">{event.loai}</span>
                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{new Date(event.ngay).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm mb-2">{event.tieuDe}</h4>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-gray-400"/>{event.gioBatDau}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gray-400"/>{event.diaDiem}</span>
                  </div>
                </div>
              );
            })}
            {upcomingEvents.length === 0 && (
              <p className="text-center text-gray-500 py-6 italic">Không có sự kiện sắp tới.</p>
            )}
          </div>
        </div>
      </div>

      {/* Outstanding Achievements Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">Thành tích tiêu biểu mới nhất</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-3">Ngày đạt</th>
                <th className="px-6 py-3">Tên giải / Thành tích</th>
                <th className="px-6 py-3">Bộ môn</th>
                <th className="px-6 py-3">Cấp độ</th>
                <th className="px-6 py-3">Người đạt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentStudentAchieve.map((a) => {
                const student = students.find(s => s.id === a.studentId);
                return (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-500">{new Date(a.ngayDat).toLocaleDateString('vi-VN')}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{a.tenGiai}</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium text-gray-600">{a.bomon}</span></td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        a.capDo === 'Quốc tế' ? 'bg-yellow-100 text-yellow-800' :
                        a.capDo === 'Quốc gia' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {a.capDo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{student?.hoTen || 'N/A'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: string }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
