import React, { useMemo, useState } from 'react';
import { useStore } from '../store/useStore';
import { Search, Plus, Trash2, Edit2, X, Target, BarChart3, Users, GraduationCap } from 'lucide-react';
import { getSubjectColor } from '../lib/utils';
import { Mentorship, MentorshipStatus, Subject } from '../types';

export default function Mentorships() {
  const { mentorships, teachers, students, addMentorship, updateMentorship, deleteMentorship } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [activeTab, setActiveTab] = useState<'list' | 'stats' | 'teacher_view' | 'student_view'>('list');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Mentorship | null>(null);

  const filteredMentorships = useMemo(() => {
    return mentorships.filter(m => {
      const teacher = teachers.find(t => t.id === m.teacherId);
      const student = students.find(s => s.id === m.studentId);
      const mText = `${m.mucTieu} ${teacher?.hoTen} ${student?.hoTen}`.toLowerCase();
      
      const matchSearch = mText.includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'All' || m.trangThai === statusFilter;
      const matchSubject = subjectFilter === 'All' || m.bomon === subjectFilter;
      return matchSearch && matchStatus && matchSubject;
    });
  }, [mentorships, searchTerm, statusFilter, subjectFilter, teachers, students]);

  // Thống kê
  const activePairs = mentorships.filter(m => m.trangThai === 'Đang hướng dẫn').length;
  const completedPairs = mentorships.filter(m => m.trangThai === 'Hoàn thành').length;

  const topTeacher = useMemo(() => {
    const counts: Record<string, number> = {};
    mentorships.forEach(m => {
      counts[m.teacherId] = (counts[m.teacherId] || 0) + 1;
    });
    const topId = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
    return teachers.find(t => t.id === topId);
  }, [mentorships, teachers]);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const mData: Mentorship = {
      id: editingItem ? editingItem.id : 'm' + Date.now(),
      teacherId: fd.get('teacherId') as string,
      studentId: fd.get('studentId') as string,
      bomon: fd.get('bomon') as Subject,
      mucTieu: fd.get('mucTieu') as string,
      trangThai: fd.get('trangThai') as MentorshipStatus,
      ngayBatDau: fd.get('ngayBatDau') as string,
      ngayKetThuc: fd.get('ngayKetThuc') as string || undefined,
      ketQua: fd.get('ketQua') as string || undefined,
      danhGiaGV: fd.get('danhGiaGV') as string || undefined,
      ghiChu: fd.get('ghiChu') as string || undefined,
    };

    if (editingItem) updateMentorship(mData.id, mData);
    else addMentorship(mData);

    setIsModalOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Target className="text-blue-600" /> Mentor & Hướng dẫn
        </h2>
        <div className="flex flex-wrap bg-white rounded-lg p-1 shadow-sm border border-gray-200">
          <button 
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'list' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Danh sách
          </button>
          <button 
            onClick={() => setActiveTab('teacher_view')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'teacher_view' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Theo Giáo viên
          </button>
          <button 
            onClick={() => setActiveTab('student_view')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'student_view' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Theo Học sinh
          </button>
          <button 
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'stats' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Thống kê
          </button>
        </div>
      </div>

      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Đang hướng dẫn</p>
              <p className="text-3xl font-bold text-gray-900">{activePairs} <span className="text-sm font-normal text-gray-500">cặp</span></p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Đã hoàn thành</p>
              <p className="text-3xl font-bold text-gray-900">{completedPairs} <span className="text-sm font-normal text-gray-500">cặp</span></p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center font-bold text-xl text-purple-700">
              {topTeacher?.anhDaiDien || <BarChart3 />}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Mentor tích cực nhất</p>
              <p className="text-lg font-bold text-gray-900 line-clamp-1">{topTeacher?.hoTen || 'Chưa có'}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'list' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50/50">
            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm mục tiêu, tên..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-shadow"
                />
              </div>
              <select value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none bg-white min-w-[120px]">
                <option value="All">Mọi bộ môn</option>
                <option value="Toán">Toán</option>
                <option value="Vật Lý">Vật Lý</option>
                <option value="Hóa học">Hóa học</option>
                <option value="Sinh học">Sinh học</option>
                <option value="Tin học">Tin học</option>
                <option value="Robotics">Robotics</option>
              </select>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none bg-white min-w-[150px]">
                <option value="All">Mọi trạng thái</option>
                <option value="Đang hướng dẫn">Đang hướng dẫn</option>
                <option value="Hoàn thành">Hoàn thành</option>
                <option value="Tạm dừng">Tạm dừng</option>
              </select>
            </div>
            <button 
              onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition w-full md:w-auto justify-center shadow-sm"
            >
              <Plus className="w-4 h-4" /> Thêm Mentor
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 uppercase text-xs font-bold text-gray-500">
                  <th className="px-6 py-4">Mục tiêu</th>
                  <th className="px-6 py-4">Giáo viên Mentor</th>
                  <th className="px-6 py-4">Học sinh</th>
                  <th className="px-6 py-4">Bộ môn</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4">Bắt đầu</th>
                  <th className="px-6 py-4">Kết quả</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredMentorships.map(m => {
                  const teacher = teachers.find(t => t.id === m.teacherId);
                  const student = students.find(s => s.id === m.studentId);
                  return (
                    <tr key={m.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4 font-semibold text-gray-900">{m.mucTieu}</td>
                      <td className="px-6 py-4 text-gray-700">{teacher?.hoTen || 'N/A'}</td>
                      <td className="px-6 py-4 text-gray-700">{student?.hoTen || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium text-white ${getSubjectColor(m.bomon)}`}>
                          {m.bomon}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                          ${m.trangThai === 'Đang hướng dẫn' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                            m.trangThai === 'Hoàn thành' ? 'bg-green-50 text-green-700 border-green-200' : 
                            'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                          {m.trangThai}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm whitespace-nowrap">{m.ngayBatDau}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{m.ketQua || '-'}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => { setEditingItem(m); setIsModalOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => { if(confirm('Bạn có chắc muốn xóa?')) deleteMentorship(m.id); }} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {filteredMentorships.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500 italic">Không tìm thấy dữ liệu.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'teacher_view' && (
        <div className="space-y-6">
          {teachers.filter(t => mentorships.some(m => m.teacherId === t.id)).map(teacher => {
            const tMentors = mentorships.filter(m => m.teacherId === teacher.id);
            const total = tMentors.length;
            const completed = tMentors.filter(m => m.trangThai === 'Hoàn thành').length;
            const active = tMentors.filter(m => m.trangThai === 'Đang hướng dẫn').length;
            const passRate = total > 0 ? Math.round((completed / total) * 100) : 0;
            return (
              <div key={teacher.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${getSubjectColor(teacher.bomon)}`}>
                      {teacher.anhDaiDien}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{teacher.hoTen}</h3>
                      <p className="text-sm text-gray-500">{teacher.bomon}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 font-medium">Đang hướng dẫn</p>
                      <p className="font-bold text-blue-600 text-lg">{active}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 font-medium">Số giải (Hoàn thành)</p>
                      <p className="font-bold text-green-600 text-lg">{completed}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 font-medium">Tỷ lệ hoàn thành</p>
                      <p className="font-bold text-purple-600 text-lg">{passRate}%</p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                      <tr>
                        <th className="px-4 py-2">Học sinh</th>
                        <th className="px-4 py-2">Mục tiêu</th>
                        <th className="px-4 py-2">Trạng thái</th>
                        <th className="px-4 py-2">Kết quả</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {tMentors.map(m => {
                        const student = students.find(s => s.id === m.studentId);
                        return (
                          <tr key={m.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 font-medium">{student?.hoTen || 'N/A'}</td>
                            <td className="px-4 py-2 text-gray-600">{m.mucTieu}</td>
                            <td className="px-4 py-2">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border
                                ${m.trangThai === 'Đang hướng dẫn' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                                  m.trangThai === 'Hoàn thành' ? 'bg-green-50 text-green-700 border-green-200' : 
                                  'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                                {m.trangThai}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-gray-600">{m.ketQua || '-'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'student_view' && (
        <div className="space-y-6">
          {students.filter(s => mentorships.some(m => m.studentId === s.id)).map(student => {
            const sMentors = mentorships.filter(m => m.studentId === student.id);
            return (
              <div key={student.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-blue-700 font-bold bg-blue-100 border border-blue-200">
                      {student.hoTen.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{student.hoTen}</h3>
                      <p className="text-sm text-gray-500">Lớp {student.lop}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Mục tiêu đang theo đuổi</h4>
                    <div className="flex flex-wrap gap-2">
                      {sMentors.filter(m => m.trangThai === 'Đang hướng dẫn').length > 0 
                        ? sMentors.filter(m => m.trangThai === 'Đang hướng dẫn').map(m => (
                          <span key={m.id} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-100 text-xs font-medium">
                            {m.mucTieu}
                          </span>
                        )) 
                        : <span className="text-sm text-gray-400 italic">Không có</span>}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                      <tr>
                        <th className="px-4 py-2">Mentor</th>
                        <th className="px-4 py-2">Bộ môn</th>
                        <th className="px-4 py-2">Trạng thái</th>
                        <th className="px-4 py-2">Thành tích liên quan (Kết quả)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {sMentors.map(m => {
                        const teacher = teachers.find(t => t.id === m.teacherId);
                        return (
                          <tr key={m.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 font-medium text-gray-700">{teacher?.hoTen || 'N/A'}</td>
                            <td className="px-4 py-2">
                              <span className={`px-2 py-1 rounded-md text-xs font-medium text-white ${getSubjectColor(m.bomon)}`}>
                                {m.bomon}
                              </span>
                            </td>
                            <td className="px-4 py-2">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border
                                ${m.trangThai === 'Đang hướng dẫn' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                                  m.trangThai === 'Hoàn thành' ? 'bg-green-50 text-green-700 border-green-200' : 
                                  'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                                {m.trangThai}
                              </span>
                            </td>
                            <td className="px-4 py-2 font-medium text-green-600">{m.ketQua || '-'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-lg">{editingItem ? 'Sửa thông tin Mentor' : 'Thêm Mentor mới'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-full transition"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleSave} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Giáo viên Mentor *</label>
                  <select required name="teacherId" defaultValue={editingItem?.teacherId} className="w-full px-3 py-2 border rounded-lg text-sm outline-none">
                    {teachers.map(t => <option key={t.id} value={t.id}>{t.hoTen} - {t.bomon}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Học sinh *</label>
                  <select required name="studentId" defaultValue={editingItem?.studentId} className="w-full px-3 py-2 border rounded-lg text-sm outline-none">
                    {students.map(s => <option key={s.id} value={s.id}>{s.hoTen} - {s.lop}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Bộ môn *</label>
                  <select required name="bomon" defaultValue={editingItem?.bomon || 'Toán'} className="w-full px-3 py-2 border rounded-lg text-sm outline-none">
                    <option value="Toán">Toán</option>
                    <option value="Vật Lý">Vật Lý</option>
                    <option value="Hóa học">Hóa học</option>
                    <option value="Sinh học">Sinh học</option>
                    <option value="Tin học">Tin học</option>
                    <option value="Robotics">Robotics</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Trạng thái *</label>
                  <select required name="trangThai" defaultValue={editingItem?.trangThai || 'Đang hướng dẫn'} className="w-full px-3 py-2 border rounded-lg text-sm outline-none">
                    <option value="Đang hướng dẫn">Đang hướng dẫn</option>
                    <option value="Hoàn thành">Hoàn thành</option>
                    <option value="Tạm dừng">Tạm dừng</option>
                  </select>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Mục tiêu *</label>
                  <input required name="mucTieu" defaultValue={editingItem?.mucTieu} type="text" placeholder="VD: Đạt giải Nhất HSG Tỉnh" className="w-full px-3 py-2 border rounded-lg text-sm outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Ngày bắt đầu *</label>
                  <input required name="ngayBatDau" defaultValue={editingItem?.ngayBatDau} type="date" className="w-full px-3 py-2 border rounded-lg text-sm outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Ngày kết thúc</label>
                  <input name="ngayKetThuc" defaultValue={editingItem?.ngayKetThuc} type="date" className="w-full px-3 py-2 border rounded-lg text-sm outline-none" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Kết quả đạt được</label>
                  <input name="ketQua" defaultValue={editingItem?.ketQua} type="text" placeholder="Ghi nhận thành tích nếu có..." className="w-full px-3 py-2 border rounded-lg text-sm outline-none" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Ghi chú</label>
                  <input name="ghiChu" defaultValue={editingItem?.ghiChu} type="text" className="w-full px-3 py-2 border rounded-lg text-sm outline-none" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition">
                  Hủy
                </button>
                <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm transition">
                  Lưu thông tin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
