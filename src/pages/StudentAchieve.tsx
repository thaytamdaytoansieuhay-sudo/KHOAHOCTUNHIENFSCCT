import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { StudentAchievement, StudentAchievementType, AchievementLevel, Subject } from '../types';
import { Search, Plus, Trash2, Edit2, X } from 'lucide-react';
import { getLevelColor, getSubjectColor } from '../lib/utils';

export default function StudentAchieve() {
  const { studentAchievements, students, addStudentAchievement, updateStudentAchievement, deleteStudentAchievement } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAchieve, setEditingAchieve] = useState<StudentAchievement | null>(null);

  const filteredData = useMemo(() => {
    return studentAchievements.filter(a => {
      const student = students.find(s => s.id === a.studentId);
      const studentName = student?.hoTen || '';
      
      const matchSearch = a.tenGiai.toLowerCase().includes(searchTerm.toLowerCase()) || studentName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchLevel = levelFilter === 'All' || a.capDo === levelFilter;
      const matchSubject = subjectFilter === 'All' || a.bomon === subjectFilter;
      return matchSearch && matchLevel && matchSubject;
    });
  }, [studentAchievements, students, searchTerm, levelFilter, subjectFilter]);

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa thành tích này?')) {
      deleteStudentAchievement(id);
    }
  };

  const openForm = (a?: StudentAchievement) => {
    setEditingAchieve(a || null);
    setIsModalOpen(true);
  };

  const closeForm = () => {
    setIsModalOpen(false);
    setEditingAchieve(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Partial<StudentAchievement> = {
      studentId: fd.get('studentId') as string,
      loai: fd.get('loai') as StudentAchievementType,
      tenGiai: fd.get('tenGiai') as string,
      capDo: fd.get('capDo') as AchievementLevel,
      namHoc: fd.get('namHoc') as string,
      bomon: fd.get('bomon') as Subject,
      kyThi: fd.get('kyThi') as string,
      gvcnHuongDan: fd.get('gvcnHuongDan') as string,
      moTa: fd.get('moTa') as string,
      ngayDat: fd.get('ngayDat') as string,
      diemSo: Number(fd.get('diemSo')) || undefined,
    };

    if (editingAchieve) {
      updateStudentAchievement(editingAchieve.id, data);
    } else {
      addStudentAchievement({
        ...data,
        id: "sa" + Date.now().toString(),
      } as StudentAchievement);
    }
    closeForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Tìm HS hoặc giải..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-56"
            />
          </div>
          <select value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none">
            <option value="All">Mọi bộ môn</option>
            <option value="Toán">Toán</option>
            <option value="Vật Lý">Vật Lý</option>
            <option value="Hóa học">Hóa học</option>
            <option value="Sinh học">Sinh học</option>
            <option value="Tin học">Tin học</option>
            <option value="Robotics">Robotics</option>
          </select>
          <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none">
            <option value="All">Mọi cấp độ</option>
            <option value="Quốc tế">Quốc tế</option>
            <option value="Quốc gia">Quốc gia</option>
            <option value="Tỉnh/Thành phố">Tỉnh/Thành phố</option>
            <option value="Quận/Huyện">Quận/Huyện</option>
            <option value="Trường">Trường</option>
          </select>
        </div>
        <button onClick={() => openForm()} className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          Thêm Nhập Mới
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">Tên HS</th>
                <th className="px-6 py-4">Bộ môn</th>
                <th className="px-6 py-4">Tên Giải / Kì thi</th>
                <th className="px-6 py-4">Cấp độ</th>
                <th className="px-6 py-4">Giáo viên HD</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((a) => {
                const s = students.find(st => st.id === a.studentId);
                return (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{s?.hoTen || 'N/A'}</p>
                    <p className="text-xs text-gray-500">Lớp {s?.lop}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getSubjectColor(a.bomon)}`}>
                      {a.bomon}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{a.tenGiai}</p>
                    <p className="text-xs text-gray-500">{a.kyThi} ({a.namHoc})</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getLevelColor(a.capDo)}`}>
                      {a.capDo}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{a.gvcnHuongDan}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openForm(a)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(a.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
          {filteredData.length === 0 && <div className="p-8 text-center text-gray-500">Không tìm thấy dữ liệu.</div>}
        </div>
      </div>

       {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 flex-shrink-0">
              <h3 className="text-xl font-bold text-gray-900">{editingAchieve ? 'Sửa Thành Tích HS' : 'Thêm Thành Tích HS'}</h3>
              <button type="button" onClick={closeForm} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <label className="text-sm font-medium text-gray-700">Học sinh *</label>
                  <select required name="studentId" defaultValue={editingAchieve?.studentId} className="w-full px-3 py-2 border rounded-lg text-sm outline-none">
                    {students.map(s => <option key={s.id} value={s.id}>{s.hoTen} ({s.lop})</option>)}
                  </select>
                </div>
                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <label className="text-sm font-medium text-gray-700">Bộ môn *</label>
                  <select required name="bomon" defaultValue={editingAchieve?.bomon} className="w-full px-3 py-2 border rounded-lg text-sm outline-none">
                    <option value="Toán">Toán</option>
                    <option value="Vật Lý">Vật Lý</option>
                    <option value="Hóa học">Hóa học</option>
                    <option value="Sinh học">Sinh học</option>
                    <option value="Tin học">Tin học</option>
                    <option value="Robotics">Robotics</option>
                  </select>
                </div>
                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <label className="text-sm font-medium text-gray-700">Tên giải thưởng *</label>
                  <input required name="tenGiai" defaultValue={editingAchieve?.tenGiai} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" />
                </div>
                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <label className="text-sm font-medium text-gray-700">Loại thành tích *</label>
                  <select required name="loai" defaultValue={editingAchieve?.loai || 'Học sinh giỏi (HSG)'} className="w-full px-3 py-2 border rounded-lg text-sm outline-none">
                    <option value="Học sinh giỏi (HSG)">Học sinh giỏi (HSG)</option>
                    <option value="Học sinh xuất sắc">Học sinh xuất sắc</option>
                    <option value="Olympic / Thi đấu">Olympic / Thi đấu</option>
                    <option value="Cuộc thi sáng tạo">Cuộc thi sáng tạo</option>
                    <option value="Robotics / Lập trình">Robotics / Lập trình</option>
                    <option value="Học bổng">Học bổng</option>
                  </select>
                </div>
                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <label className="text-sm font-medium text-gray-700">Cấp độ *</label>
                  <select required name="capDo" defaultValue={editingAchieve?.capDo || 'Trường'} className="w-full px-3 py-2 border rounded-lg text-sm outline-none">
                    <option value="Quốc tế">Quốc tế</option>
                    <option value="Quốc gia">Quốc gia</option>
                    <option value="Tỉnh/Thành phố">Tỉnh/Thành phố</option>
                    <option value="Quận/Huyện">Quận/Huyện</option>
                    <option value="Trường">Trường</option>
                  </select>
                </div>
                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <label className="text-sm font-medium text-gray-700">Tên Kì thi *</label>
                  <input required name="kyThi" defaultValue={editingAchieve?.kyThi} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" />
                </div>
                <div className="space-y-1 sm:col-span-1">
                  <label className="text-sm font-medium text-gray-700">Ngày đạt *</label>
                  <input required type="date" name="ngayDat" defaultValue={editingAchieve?.ngayDat} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" />
                </div>
                <div className="space-y-1 sm:col-span-1">
                  <label className="text-sm font-medium text-gray-700">Năm học *</label>
                  <input required name="namHoc" placeholder="VD: 2023-2024" defaultValue={editingAchieve?.namHoc} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" />
                </div>
                <div className="space-y-1 sm:col-span-1">
                  <label className="text-sm font-medium text-gray-700">GV Hướng dẫn *</label>
                  <input required name="gvcnHuongDan" defaultValue={editingAchieve?.gvcnHuongDan} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" />
                </div>
                <div className="space-y-1 sm:col-span-1">
                  <label className="text-sm font-medium text-gray-700">Điểm số (nếu có)</label>
                  <input type="number" step="0.1" name="diemSo" defaultValue={editingAchieve?.diemSo} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Mô tả thêm</label>
                <textarea name="moTa" defaultValue={editingAchieve?.moTa} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm outline-none"></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 flex-shrink-0">
                <button type="button" onClick={closeForm} className="px-4 py-2 font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Hủy</button>
                <button type="submit" className="px-4 py-2 font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg">Lưu lại</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
