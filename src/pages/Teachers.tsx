import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Teacher, Subject, TeacherRole, TeacherStatus, TeacherType } from '../types';
import { getSubjectColor } from '../lib/utils';
import { Search, Plus, Edit2, Trash2, X } from 'lucide-react';

export default function Teachers() {
  const { teachers, deleteTeacher, addTeacher, updateTeacher } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<string>('All');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const filteredTeachers = useMemo(() => {
    return teachers.filter(t => {
      const matchSearch = t.hoTen.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSubject = subjectFilter === 'All' || t.bomon === subjectFilter;
      const matchRole = roleFilter === 'All' || t.chucVu === roleFilter;
      return matchSearch && matchSubject && matchRole;
    });
  }, [teachers, searchTerm, subjectFilter, roleFilter]);

  const handleDelete = (id: string, chucVu: string) => {
    if (chucVu === 'Tổ trưởng') {
      alert('Không thể xóa Tổ trưởng! Vui lòng thay đổi chức vụ trước.');
      return;
    }
    if (confirm('Bạn có chắc muốn xóa giáo viên này?')) {
      deleteTeacher(id);
    }
  };

  const openForm = (t?: Teacher) => {
    setEditingTeacher(t || null);
    setIsModalOpen(true);
  };

  const closeForm = () => {
    setIsModalOpen(false);
    setEditingTeacher(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Partial<Teacher> = {
      hoTen: fd.get('hoTen') as string,
      email: fd.get('email') as string,
      soDienThoai: fd.get('soDienThoai') as string,
      bomon: fd.get('bomon') as Subject,
      chucVu: fd.get('chucVu') as TeacherRole,
      trangThai: fd.get('trangThai') as TeacherStatus,
      loaiGiaoVien: fd.get('loaiGiaoVien') as TeacherType,
      ngayVaoLam: fd.get('ngayVaoLam') as string,
      ghiChu: fd.get('ghiChu') as string,
      anhDaiDien: (fd.get('hoTen') as string).charAt(0).toUpperCase(),
    };

    if (editingTeacher) {
      updateTeacher(editingTeacher.id, data);
    } else {
      addTeacher({
        ...data,
        id: "t" + Date.now().toString(),
        danhHieuNamHoc: [],
      } as Teacher);
    }
    closeForm();
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Tìm tên giáo viên..." 
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
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none">
            <option value="All">Tất cả chức vụ</option>
            <option value="Tổ trưởng">Tổ trưởng</option>
            <option value="Tổ phó">Tổ phó</option>
            <option value="Trưởng bộ môn">Trưởng bộ môn</option>
            <option value="Giáo viên">Giáo viên</option>
          </select>
        </div>
        <button onClick={() => openForm()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          Thêm GV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">Giáo viên</th>
                <th className="px-6 py-4">Thông tin liên hệ</th>
                <th className="px-6 py-4">Bộ môn / Chức vụ</th>
                <th className="px-6 py-4">Giáo viên</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTeachers.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${getSubjectColor(t.bomon)}`}>
                        {t.anhDaiDien}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{t.hoTen}</p>
                        <p className="text-xs text-gray-500">ID: {t.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900">{t.soDienThoai}</p>
                    <p className="text-xs text-gray-500">{t.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 mr-2">{t.bomon}</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${t.chucVu.includes('Tổ') ? 'bg-amber-100 text-amber-800' : t.chucVu === 'Trưởng bộ môn' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                      {t.chucVu}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{t.loaiGiaoVien}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      t.trangThai === 'Đang làm' ? 'bg-green-100 text-green-800' : 
                      t.trangThai === 'Nghỉ phép' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {t.trangThai}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openForm(t)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(t.id, t.chucVu)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTeachers.length === 0 && <div className="p-8 text-center text-gray-500">Không tìm thấy dữ liệu.</div>}
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">{editingTeacher ? 'Sửa Giáo Viên' : 'Thêm Giáo Viên Mới'}</h3>
              <button type="button" onClick={closeForm} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Họ và tên *</label>
                  <input required name="hoTen" defaultValue={editingTeacher?.hoTen} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Số điện thoại *</label>
                  <input required name="soDienThoai" defaultValue={editingTeacher?.soDienThoai} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Email *</label>
                  <input required type="email" name="email" defaultValue={editingTeacher?.email} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Ngày vào làm *</label>
                  <input required type="date" name="ngayVaoLam" defaultValue={editingTeacher?.ngayVaoLam} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Bộ môn *</label>
                  <select required name="bomon" defaultValue={editingTeacher?.bomon || 'Toán'} className="w-full px-3 py-2 border rounded-lg text-sm outline-none">
                    <option value="Toán">Toán</option>
                    <option value="Vật Lý">Vật Lý</option>
                    <option value="Hóa học">Hóa học</option>
                    <option value="Sinh học">Sinh học</option>
                    <option value="Tin học">Tin học</option>
                    <option value="Robotics">Robotics</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Chức vụ *</label>
                  <select required name="chucVu" defaultValue={editingTeacher?.chucVu || 'Giáo viên'} className="w-full px-3 py-2 border rounded-lg text-sm outline-none">
                    <option value="Giáo viên">Giáo viên</option>
                    <option value="Trưởng bộ môn">Trưởng bộ môn</option>
                    <option value="Tổ phó">Tổ phó</option>
                    <option value="Tổ trưởng">Tổ trưởng</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Trạng thái *</label>
                  <select required name="trangThai" defaultValue={editingTeacher?.trangThai || 'Đang làm'} className="w-full px-3 py-2 border rounded-lg text-sm outline-none">
                    <option value="Đang làm">Đang làm</option>
                    <option value="Nghỉ phép">Nghỉ phép</option>
                    <option value="Đã nghỉ việc">Đã nghỉ việc</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Giáo viên *</label>
                  <select required name="loaiGiaoVien" defaultValue={editingTeacher?.loaiGiaoVien || 'Giáo viên cơ hữu'} className="w-full px-3 py-2 border rounded-lg text-sm outline-none">
                    <option value="Giáo viên cơ hữu">Giáo viên cơ hữu</option>
                    <option value="Giáo viên thỉnh giảng">Giáo viên thỉnh giảng</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Ghi chú</label>
                <textarea name="ghiChu" defaultValue={editingTeacher?.ghiChu} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm outline-none"></textarea>
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
