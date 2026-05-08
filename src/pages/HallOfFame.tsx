import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Star, Trophy, Medal, Award } from 'lucide-react';
import { getLevelColor, getSubjectColor } from '../lib/utils';
import { StudentAchievement, TeacherAchievement } from '../types';

export default function HallOfFame() {
  const { studentAchievements, teacherAchievements, students, teachers } = useStore();
  const [yearFilter, setYearFilter] = useState('2023-2024');

  const rankWeight = { 'Quốc tế': 5, 'Quốc gia': 4, 'Tỉnh/Thành phố': 3, 'Quận/Huyện': 2, 'Trường': 1 };

  // HS Vinh Danh
  const topStudents = useMemo(() => {
    return studentAchievements
      .filter(a => a.namHoc === yearFilter && rankWeight[a.capDo] >= 3) // Tỉnh trở lên for HofFame
      .sort((a, b) => rankWeight[b.capDo] - rankWeight[a.capDo])
      .slice(0, 10);
  }, [studentAchievements, yearFilter]);

  // GV Vinh Danh
  const topTeachers = useMemo(() => {
    return teacherAchievements
      .filter(a => a.namHoc === yearFilter && rankWeight[a.capDo as keyof typeof rankWeight] >= 3)
      .sort((a, b) => rankWeight[b.capDo as keyof typeof rankWeight] - rankWeight[a.capDo as keyof typeof rankWeight])
      .slice(0, 10);
  }, [teacherAchievements, yearFilter]);

  // Thành tích mới nhất
  const recentStudentAchieve = useMemo(() => {
    return [...studentAchievements]
      .filter(a => a.namHoc === yearFilter)
      .sort((a, b) => new Date(b.ngayDat).getTime() - new Date(a.ngayDat).getTime())
      .slice(0, 3);
  }, [studentAchievements, yearFilter]);

  const recentTeacherAchieve = useMemo(() => {
    return [...teacherAchievements]
      .filter(a => a.namHoc === yearFilter)
      .sort((a, b) => new Date(b.ngayCap).getTime() - new Date(a.ngayCap).getTime())
      .slice(0, 3);
  }, [teacherAchievements, yearFilter]);

  return (
    <div className="bg-gradient-to-br from-yellow-50 via-white to-blue-50 -m-4 md:-m-6 lg:-m-8 p-4 md:p-6 lg:p-8 min-h-full">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-yellow-100 rounded-full mb-2">
            <Star className="w-8 h-8 text-yellow-500 fill-current" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-red-600">
            BẢNG VÀNG VINH DANH
          </h1>
          <p className="text-gray-600 text-lg">Tôn vinh những cá nhân xuất sắc nhất Tổ Khoa học Tự nhiên - THPT FPT Cần Thơ</p>
          
          <div className="flex justify-center mt-6">
            <select 
              value={yearFilter} 
              onChange={e => setYearFilter(e.target.value)}
              className="px-6 py-3 border-2 border-yellow-200 rounded-full text-lg font-bold text-yellow-800 bg-white shadow-sm outline-none focus:border-yellow-400"
            >
              <option value="2023-2024">Năm học 2023-2024</option>
              <option value="2022-2023">Năm học 2022-2023</option>
            </select>
          </div>
        </div>

        {/* Vinh Danh Thành Tích Mới Nhất */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white">
          <h2 className="text-2xl font-bold flex items-center gap-3 justify-center mb-8 text-gray-800">
            <Award className="text-yellow-500 w-8 h-8" /> 
            Vinh Danh Thành Tích Học Sinh Và Giáo Viên Mới Nhất
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Cột Học sinh */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-blue-800 border-b pb-2">Học Sinh Xuất Sắc Mới Nhất</h3>
              {recentStudentAchieve.map(a => {
                const student = students.find(s => s.id === a.studentId);
                return (
                  <div key={a.id} className="flex items-center gap-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white border-2 border-white shadow-sm ${getSubjectColor(a.bomon)}`}>
                      {student?.hoTen.charAt(0) || 'S'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 line-clamp-1">{student?.hoTen}</p>
                      <p className="text-sm font-medium text-gray-700 line-clamp-1">{a.tenGiai}</p>
                      <p className="text-xs text-gray-500">{new Date(a.ngayDat).toLocaleDateString('vi-VN')} • <span className={`px-2 py-0.5 rounded-full inline-block mt-1 ${getLevelColor(a.capDo)}`}>{a.capDo}</span></p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Cột Giáo viên */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-purple-800 border-b pb-2">Giáo Viên Xuất Sắc Mới Nhất</h3>
              {recentTeacherAchieve.map(a => {
                const teacher = teachers.find(t => t.id === a.teacherId);
                return (
                 <div key={a.id} className="flex items-center gap-4 bg-purple-50/50 p-4 rounded-xl border border-purple-100">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white border-2 border-white shadow-sm ${getSubjectColor(teacher?.bomon || 'Toán')}`}>
                      {teacher?.anhDaiDien || 'G'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 line-clamp-1">{teacher?.hoTen}</p>
                      <p className="text-sm font-medium text-gray-700 line-clamp-1">{a.tenThanhTich}</p>
                      <p className="text-xs text-gray-500">{new Date(a.ngayCap).toLocaleDateString('vi-VN')} • <span className={`px-2 py-0.5 rounded-full inline-block mt-1 ${getLevelColor(a.capDo)}`}>{a.capDo}</span></p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CASCADING CARDS - HỌC SINH */}
        <div>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Học Sinh Tiêu Biểu</h2>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topStudents.map(a => {
              const student = students.find(s => s.id === a.studentId);
              return (
                <div key={a.id} className="bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 hover:-translate-y-1 transition-transform relative overflow-hidden group">
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-yellow-400  opacity-20 rounded-bl-full pointer-events-none`}></div>
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold border-2 border-white shadow-md ${getSubjectColor(a.bomon)}`}>
                      {student?.hoTen.charAt(0) || 'H'}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{student?.hoTen || 'Thành viên'}</h3>
                      <p className="text-sm text-gray-500 font-medium">Lớp: {student?.lop || ''} • {a.bomon}</p>
                    </div>
                  </div>
                  <div className="mt-5 space-y-3">
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Thành tích</p>
                      <p className="font-semibold text-gray-800 line-clamp-2">{a.tenGiai}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getLevelColor(a.capDo)}`}>
                        {a.capDo}
                      </span>
                      <span className="text-xs font-medium text-gray-500">GV: {a.gvcnHuongDan}</span>
                    </div>
                  </div>
                </div>
              )
            })}
            {topStudents.length === 0 && <p className="text-gray-500 col-span-3 text-center py-8">Chưa có dữ liệu vinh danh.</p>}
          </div>
        </div>

        {/* CASCADING CARDS - GIÁO VIÊN */}
        <div>
           <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Giáo Viên Xuất Sắc</h2>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {topTeachers.map(a => {
              const teacher = teachers.find(t => t.id === a.teacherId);
              return (
                <div key={a.id} className="bg-white rounded-2xl p-6 shadow-xl shadow-blue-900/5 border border-blue-50 hover:-translate-y-1 transition-transform relative overflow-hidden group">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold border-2 border-white shadow-md ${getSubjectColor(teacher?.bomon || 'Toán')}`}>
                      {teacher?.anhDaiDien || 'G'}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{teacher?.hoTen || 'Giáo viên'}</h3>
                      <p className="text-sm text-gray-500 font-medium">{teacher?.bomon} • {teacher?.chucVu}</p>
                    </div>
                  </div>
                  <div className="mt-5 space-y-3">
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Danh hiệu / SKKN</p>
                      <p className="font-semibold text-blue-900 line-clamp-2">{a.tenThanhTich}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getLevelColor(a.capDo)}`}>
                        {a.capDo}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
            {topTeachers.length === 0 && <p className="text-gray-500 col-span-3 text-center py-8">Chưa có dữ liệu vinh danh.</p>}
          </div>
        </div>

      </div>
    </div>
  );
}
