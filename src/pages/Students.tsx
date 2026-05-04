import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Student, Subject } from '../types';
import { Search, Plus, Trash2, Edit2, X } from 'lucide-react';
import { getSubjectColor } from '../lib/utils';

export default function Students() {
  const { students, addStudent, updateStudent, deleteStudent, teachers } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<string>('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchSearch = s.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) || s.lop.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSubject = subjectFilter === 'All' || s.bomon === subjectFilter;
      return matchSearch && matchSubject;
    });
  }, [students, searchTerm, subjectFilter]);

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa học sinh này?')) {
      deleteStudent(id);
    }
  };

  const openForm = (s?: Student) => {
    setEditingStudent(s || null);
    setIsModalOpen(true);
  };

  const closeForm = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Partial<Student> = {
      hoTen: fd.get('hoTen') as string,
      lop: fd.get('lop') as string,
      bomon: fd.get('bomon') as Subject,
      gvcn: fd.get('gvcn') as string,
      ngaySinh: fd.get('ngaySinh') as string,
    };

    if (editingStudent) {
      updateStudent(editingStudent.id, data);
    } else {
      addStudent({
        ...data,
        id: "s" + Date.now().toString(),
      } as Student);
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
              placeholder="Tìm theo tên, lớp..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            />
          </div>
          <select value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none">
            <option value="All">Tất cả bộ môn</option>
            <option value="Toán">Toán</option>
            <option value="Vật Lý">Vật Lý</option>
            <option value="Hóa học">Hóa học</option>
            <option value="Sinh học">Sinh học</option>
            <option value="Tin học">Tin học</option>
            <option value="Robotics">Robotics</option>
          </select>
        </div>
        <button onClick={() => openForm()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          Thêm Học Sinh
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">Học sinh</th>
                <th className="px-6 py-4">Lớp</th>
                <th className="px-6 py-4">Bộ môn tham gia</th>
                <th className="px-6 py-4">GV Phụ trách</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.map((s) => {
                const gv = teachers.find(t => t.id === s.gvcn);
                return (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{s.hoTen}</p>
                      <p className="text-xs text-gray-500">{new Date(s.ngaySinh).toLocaleDateString('vi-VN')}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium">{s.lop}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${getSubjectColor(s.bomon)}`}>
                        {s.bomon}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {gv ? gv.hoTen : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openForm(s)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(s.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredStudents.length === 0 && <div className="p-8 text-center text-gray-500">Không tìm thấy dữ liệu.</div>}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">{editingStudent ? 'Sửa Học Sinh' : 'Thêm Học Sinh Mới'}</h3>
              <button type="button" onClick={closeForm} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Họ và tên *</label>
                  <input required name="hoTen" defaultValue={editingStudent?.hoTen} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Lớp *</label>
                  <input required name="lop" defaultValue={editingStudent?.lop} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Ngày sinh *</label>
                  <input required type="date" name="ngaySinh" defaultValue={editingStudent?.ngaySinh} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Bộ môn *</label>
                  <select required name="bomon" defaultValue={editingStudent?.bomon || 'Toán'} className="w-full px-3 py-2 border rounded-lg text-sm outline-none">
                    <option value="Toán">Toán</option>
                    <option value="Vật Lý">Vật Lý</option>
                    <option value="Hóa học">Hóa học</option>
                    <option value="Sinh học">Sinh học</option>
                    <option value="Tin học">Tin học</option>
                    <option value="Robotics">Robotics</option>
                  </select>
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-sm font-medium text-gray-700">Giáo viên phụ trách *</label>
                  <select required name="gvcn" defaultValue={editingStudent?.gvcn} className="w-full px-3 py-2 border rounded-lg text-sm outline-none">
                    {teachers.filter(t => t.trangThai === 'Đang làm').map(t => <option key={t.id} value={t.id}>{t.hoTen} ({t.bomon})</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={closeForm} className="px-4 py-2 font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Hủy</button>
                <button type="submit" className="px-4 py-2 font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Lưu lại</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
