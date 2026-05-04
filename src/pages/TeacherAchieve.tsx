import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { TeacherAchievement, TeacherAchievementType, AchievementLevel } from '../types';
import { Search, Plus, Trash2, Edit2, X } from 'lucide-react';

export default function TeacherAchieve() {
  const { teacherAchievements, teachers, addTeacherAchievement, updateTeacherAchievement, deleteTeacherAchievement } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAchieve, setEditingAchieve] = useState<TeacherAchievement | null>(null);

  const filteredData = useMemo(() => {
    return teacherAchievements.filter(a => {
      const matchSearch = a.tenThanhTich.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = typeFilter === 'All' || a.loai === typeFilter;
      const matchLevel = levelFilter === 'All' || a.capDo === levelFilter;
      return matchSearch && matchType && matchLevel;
    });
  }, [teacherAchievements, searchTerm, typeFilter, levelFilter]);

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa thành tích này?')) {
      deleteTeacherAchievement(id);
    }
  };

  const openForm = (a?: TeacherAchievement) => {
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
    const data: Partial<TeacherAchievement> = {
      teacherId: fd.get('teacherId') as string,
      loai: fd.get('loai') as TeacherAchievementType,
      tenThanhTich: fd.get('tenThanhTich') as string,
      capDo: fd.get('capDo') as AchievementLevel,
      namHoc: fd.get('namHoc') as string,
      moTa: fd.get('moTa') as string,
      ngayCap: fd.get('ngayCap') as string,
      donViCap: fd.get('donViCap') as string,
    };

    if (editingAchieve) {
      updateTeacherAchievement(editingAchieve.id, data);
    } else {
      addTeacherAchievement({
        ...data,
        id: "ta" + Date.now().toString(),
      } as TeacherAchievement);
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
              placeholder="Tìm tên thành tích..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-56"
            />
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none">
            <option value="All">Loại thành tích</option>
            <option value="Danh hiệu">Danh hiệu</option>
            <option value="Khen thưởng">Khen thưởng</option>
            <option value="Chứng chỉ">Chứng chỉ</option>
            <option value="Sáng kiến cải tiến">SKCT</option>
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
        <button onClick={() => openForm()} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          Thêm Nhập Mới
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">Tên GV</th>
                <th className="px-6 py-4">Tên Thành Tích</th>
                <th className="px-6 py-4">Loại</th>
                <th className="px-6 py-4">Cấp độ</th>
                <th className="px-6 py-4">Năm học</th>
                <th className="px-6 py-4">Đơn vị cấp</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((a) => {
                const ts = teachers.find(t => t.id === a.teacherId);
                return (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{ts?.hoTen || 'N/A'}</td>
                  <td className="px-6 py-4 font-medium text-gray-700">{a.tenThanhTich}</td>
                  <td className="px-6 py-4">{a.loai}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      a.capDo === 'Quốc gia' ? 'bg-red-100 text-red-800' :
                      a.capDo === 'Tỉnh/Thành phố' ? 'bg-blue-100 text-blue-800' :
                      a.capDo === 'Quận/Huyện' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {a.capDo}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{a.namHoc}</td>
                  <td className="px-6 py-4 text-gray-500">{a.donViCap}</td>
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">{editingAchieve ? 'Sửa Thành Tích' : 'Thêm Thành Tích GV'}</h3>
              <button type="button" onClick={closeForm} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 col-span-2">
                  <label className="text-sm font-medium text-gray-700">Giáo viên *</label>
                  <select required name="teacherId" defaultValue={editingAchieve?.teacherId} className="w-full px-3 py-2 border rounded-lg text-sm outline-none">
                    {teachers.map(t => <option key={t.id} value={t.id}>{t.hoTen} ({t.bomon})</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Tên thành tích *</label>
                  <input required name="tenThanhTich" defaultValue={editingAchieve?.tenThanhTich} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Phân loại *</label>
                  <select required name="loai" defaultValue={editingAchieve?.loai || 'Danh hiệu'} className="w-full px-3 py-2 border rounded-lg text-sm outline-none">
                    <option value="Danh hiệu">Danh hiệu</option>
                    <option value="Khen thưởng">Khen thưởng</option>
                    <option value="Chứng chỉ">Chứng chỉ</option>
                    <option value="Sáng kiến cải tiến">SKCT</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Cấp độ *</label>
                  <select required name="capDo" defaultValue={editingAchieve?.capDo || 'Trường'} className="w-full px-3 py-2 border rounded-lg text-sm outline-none">
                    <option value="Quốc tế">Quốc tế</option>
                    <option value="Quốc gia">Quốc gia</option>
                    <option value="Tỉnh/Thành phố">Tỉnh/Thành phố</option>
                    <option value="Quận/Huyện">Quận/Huyện</option>
                    <option value="Trường">Trường</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Ngày cấp/Đạt *</label>
                  <input required type="date" name="ngayCap" defaultValue={editingAchieve?.ngayCap} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Năm học *</label>
                  <input required name="namHoc" placeholder="VD: 2023-2024" defaultValue={editingAchieve?.namHoc} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Đơn vị cấp</label>
                  <input required name="donViCap" defaultValue={editingAchieve?.donViCap} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Mô tả thêm</label>
                <textarea name="moTa" defaultValue={editingAchieve?.moTa} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm outline-none"></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={closeForm} className="px-4 py-2 font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Hủy</button>
                <button type="submit" className="px-4 py-2 font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg">Lưu lại</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
