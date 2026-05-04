import React, { useMemo, useState } from 'react';
import { useStore } from '../store/useStore';
import { CalendarDays, List as ListIcon, ChevronLeft, ChevronRight, Plus, X, Clock, MapPin, Users, Edit2, Trash2 } from 'lucide-react';
import { ScheduleEvent, EventType, EventStatus } from '../types';

export default function Schedule() {
  const { scheduleEvents, addScheduleEvent, updateScheduleEvent, deleteScheduleEvent } = useStore();
  const [activeTab, setActiveTab] = useState<'calendar' | 'list'>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date('2024-11-01')); // Defaulting to mock data month which is Nov 2024
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleEvent | null>(null);

  // Filter State
  const [typeFilter, setTypeFilter] = useState('All');

  // Calendar Helpers
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Make Monday = 0, Sunday = 6
  };

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const handleToday = () => setCurrentDate(new Date('2024-11-15')); // Mock today matching data

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  const getEventColor = (type: string) => {
    switch (type) {
      case 'Họp tổ': return 'bg-blue-500 text-white';
      case 'Dự giờ': return 'bg-purple-500 text-white';
      case 'Chuyên đề': return 'bg-teal-500 text-white';
      case 'Thi HSG': return 'bg-orange-500 text-white';
      case 'Nộp báo cáo': return 'bg-amber-500 text-white';
      case 'Sự kiện': return 'bg-green-500 text-white';
      case 'Nghỉ lễ': return 'bg-gray-400 text-white';
      default: return 'bg-blue-300 text-white';
    }
  };

  const currentMonthEvents = useMemo(() => {
    return scheduleEvents.filter(e => {
      const eDate = new Date(e.ngay);
      const matchMonth = eDate.getFullYear() === currentDate.getFullYear() && eDate.getMonth() === currentDate.getMonth();
      const matchType = typeFilter === 'All' || e.loai === typeFilter;
      return matchMonth && matchType;
    });
  }, [scheduleEvents, currentDate, typeFilter]);

  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const eventsOnSelectedDay = useMemo(() => {
    if (selectedDay === null) return [];
    return currentMonthEvents.filter(e => new Date(e.ngay).getDate() === selectedDay).sort((a, b) => a.gioBatDau.localeCompare(b.gioBatDau));
  }, [currentMonthEvents, selectedDay]);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const mData: ScheduleEvent = {
      id: editingItem ? editingItem.id : 'sc' + Date.now(),
      tieuDe: fd.get('tieuDe') as string,
      loai: fd.get('loai') as EventType,
      ngay: fd.get('ngay') as string,
      gioBatDau: fd.get('gioBatDau') as string,
      gioKetThuc: fd.get('gioKetThuc') as string,
      diaDiem: fd.get('diaDiem') as string,
      nguoiPhuTrach: fd.get('nguoiPhuTrach') as string,
      thanhPhanThamDu: (fd.get('thanhPhanThamDu') as string).split(',').map(s => s.trim()),
      moTa: fd.get('moTa') as string || undefined,
      trangThai: fd.get('trangThai') as EventStatus,
    };

    if (editingItem) updateScheduleEvent(mData.id, mData);
    else addScheduleEvent(mData);

    setIsModalOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-6rem)]">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between shrink-0">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <CalendarDays className="text-blue-600" /> Lịch làm việc
        </h2>
        
        <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
          <button 
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition flex items-center gap-2 ${activeTab === 'calendar' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <CalendarDays className="w-4 h-4"/> Lịch tháng
          </button>
          <button 
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition flex items-center gap-2 ${activeTab === 'list' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <ListIcon className="w-4 h-4"/> Danh sách
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft className="w-5 h-5"/></button>
          <h3 className="text-lg font-bold w-40 text-center">Tháng {currentDate.getMonth() + 1}, {currentDate.getFullYear()}</h3>
          <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-full"><ChevronRight className="w-5 h-5"/></button>
          <button onClick={handleToday} className="px-3 py-1.5 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-lg ml-2">Hôm nay</button>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none bg-white">
            <option value="All">Mọi loại sự kiện</option>
            <option value="Họp tổ">Họp tổ</option>
            <option value="Dự giờ">Dự giờ</option>
            <option value="Chuyên đề">Chuyên đề</option>
            <option value="Thi HSG">Thi HSG</option>
            <option value="Nộp báo cáo">Nộp báo cáo</option>
            <option value="Sự kiện">Sự kiện</option>
          </select>
          <button 
            onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Thêm lịch
          </button>
        </div>
      </div>

      {activeTab === 'calendar' && (
        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
          <div className="flex-[3] bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col min-h-0 overflow-hidden">
            <div className="grid grid-cols-7 border-b border-gray-100 shrink-0">
              {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => (
                <div key={d} className="py-3 text-center font-bold text-xs text-gray-500 uppercase">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 flex-1 overflow-y-auto auto-rows-fr">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="border-b border-r border-gray-50 bg-gray-50/30 p-2 min-h-[100px]"></div>
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const events = currentMonthEvents.filter(e => new Date(e.ngay).getDate() === day);
                const isSelected = selectedDay === day;
                
                return (
                  <div 
                    key={day} 
                    onClick={() => setSelectedDay(day)}
                    className={`border-b border-r border-gray-100 p-2 min-h-[100px] cursor-pointer hover:bg-blue-50/30 transition flex flex-col ${isSelected ? 'bg-blue-50 ring-2 ring-inset ring-blue-500' : ''}`}
                  >
                    <div className="font-medium text-sm text-gray-600 mb-1">{day}</div>
                    <div className="flex flex-col gap-1 overflow-y-auto max-h-[80px] no-scrollbar">
                      {events.slice(0, 3).map(e => (
                        <div key={e.id} className={`text-[10px] px-1.5 py-0.5 rounded truncate font-medium ${getEventColor(e.loai)}`} title={e.tieuDe}>
                          {e.gioBatDau} {e.tieuDe}
                        </div>
                      ))}
                      {events.length > 3 && (
                        <div className="text-[10px] font-medium text-gray-500 px-1">+ {events.length - 3} sự kiện</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col min-h-0">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
              <h3 className="font-bold text-gray-800">
                Sự kiện ngày {selectedDay ? `${selectedDay}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}` : '...'}
              </h3>
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              {!selectedDay ? (
                <p className="text-gray-400 italic text-center py-10">Chọn một ngày để xem chi tiết</p>
              ) : eventsOnSelectedDay.length === 0 ? (
                <p className="text-gray-400 italic text-center py-10">Không có sự kiện nào.</p>
              ) : (
                eventsOnSelectedDay.map(e => (
                  <div key={e.id} className="p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition bg-white shadow-sm">
                    <div className="flex items-start justify-between mb-2">
                       <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getEventColor(e.loai)}`}>
                        {e.loai}
                      </span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setEditingItem(e); setIsModalOpen(true); }} className="p-1 hover:bg-blue-50 text-blue-600 rounded"><Edit2 className="w-3.5 h-3.5"/></button>
                        <button onClick={() => { if(confirm('Xóa?')) deleteScheduleEvent(e.id); }} className="p-1 hover:bg-red-50 text-red-600 rounded"><Trash2 className="w-3.5 h-3.5"/></button>
                      </div>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">{e.tieuDe}</h4>
                    <div className="space-y-1.5 text-xs text-gray-600">
                      <p className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-gray-400"/> {e.gioBatDau} - {e.gioKetThuc}</p>
                      <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-gray-400"/> {e.diaDiem}</p>
                      <p className="flex items-start gap-2"><Users className="w-3.5 h-3.5 text-gray-400 mt-0.5"/> <span>Phụ trách: <strong>{e.nguoiPhuTrach}</strong><br/>Tham dự: {e.thanhPhanThamDu.join(', ')}</span></p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'list' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
          <div className="overflow-x-auto flex-1">
             <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="sticky top-0 bg-gray-50 z-10">
                  <tr className="border-b border-gray-100 uppercase text-xs font-bold text-gray-500">
                    <th className="px-6 py-4">Ngày giờ</th>
                    <th className="px-6 py-4">Sự kiện</th>
                    <th className="px-6 py-4">Địa điểm</th>
                    <th className="px-6 py-4">Thành phần</th>
                    <th className="px-6 py-4">Trạng thái</th>
                    <th className="px-6 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentMonthEvents.sort((a,b)=> new Date(a.ngay).getTime() - new Date(b.ngay).getTime()).map(e => (
                    <tr key={e.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-bold text-gray-900 text-sm">{new Date(e.ngay).toLocaleDateString('vi-VN')}</p>
                        <p className="text-gray-500 text-xs">{e.gioBatDau} - {e.gioKetThuc}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-1 inline-block ${getEventColor(e.loai)}`}>{e.loai}</span>
                        <p className="font-bold text-gray-900">{e.tieuDe}</p>
                        <p className="text-gray-500 text-xs line-clamp-1">{e.moTa}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{e.diaDiem}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <span className="font-medium">PT:</span> {e.nguoiPhuTrach}<br/>
                        <span className="font-medium">TD:</span> <span className="text-gray-500">{e.thanhPhanThamDu.join(', ')}</span>
                      </td>
                      <td className="px-6 py-4">
                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                            ${e.trangThai === 'Đã hoàn thành' ? 'bg-green-50 text-green-700 border-green-200' : 
                              e.trangThai === 'Sắp diễn ra' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                              'bg-gray-100 text-gray-600 border-gray-200'}`}>
                            {e.trangThai}
                          </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <div className="flex items-center justify-end gap-2">
                          <button onClick={() => { setEditingItem(e); setIsModalOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => { if(confirm('Xóa?')) deleteScheduleEvent(e.id); }} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {currentMonthEvents.length === 0 && (
                     <tr><td colSpan={6} className="text-center py-10 text-gray-500 italic">Không có sự kiện trong tháng này.</td></tr>
                  )}
                </tbody>
             </table>
          </div>
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-lg">{editingItem ? 'Sửa sự kiện' : 'Thêm sự kiện mới'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-full transition"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="event-form" onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Tiêu đề sự kiện *</label>
                  <input required name="tieuDe" defaultValue={editingItem?.tieuDe} type="text" className="w-full px-3 py-2 border rounded-lg text-sm outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Loại sự kiện *</label>
                  <select required name="loai" defaultValue={editingItem?.loai || 'Họp tổ'} className="w-full px-3 py-2 border rounded-lg text-sm outline-none">
                    <option value="Họp tổ">Họp tổ</option>
                    <option value="Dự giờ">Dự giờ</option>
                    <option value="Chuyên đề">Chuyên đề</option>
                    <option value="Thi HSG">Thi HSG</option>
                    <option value="Nộp báo cáo">Nộp báo cáo</option>
                    <option value="Sự kiện">Sự kiện</option>
                    <option value="Nghỉ lễ">Nghỉ lễ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Trạng thái *</label>
                  <select required name="trangThai" defaultValue={editingItem?.trangThai || 'Sắp diễn ra'} className="w-full px-3 py-2 border rounded-lg text-sm outline-none">
                    <option value="Sắp diễn ra">Sắp diễn ra</option>
                    <option value="Đã hoàn thành">Đã hoàn thành</option>
                    <option value="Đã hủy">Đã hủy</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Ngày *</label>
                  <input required name="ngay" defaultValue={editingItem?.ngay} type="date" className="w-full px-3 py-2 border rounded-lg text-sm outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Địa điểm *</label>
                  <input required name="diaDiem" defaultValue={editingItem?.diaDiem} type="text" className="w-full px-3 py-2 border rounded-lg text-sm outline-none" />
                </div>
                <div className="space-y-1 flex gap-2 w-full">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700">Giờ bắt đầu *</label>
                    <input required name="gioBatDau" defaultValue={editingItem?.gioBatDau} type="time" className="w-full px-3 py-2 border rounded-lg text-sm outline-none" />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700">Giờ kết thúc *</label>
                    <input required name="gioKetThuc" defaultValue={editingItem?.gioKetThuc} type="time" className="w-full px-3 py-2 border rounded-lg text-sm outline-none" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Người phụ trách *</label>
                  <input required name="nguoiPhuTrach" defaultValue={editingItem?.nguoiPhuTrach} type="text" className="w-full px-3 py-2 border rounded-lg text-sm outline-none" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Thành phần tham dự (cách nhau dấu phẩy) *</label>
                  <input required name="thanhPhanThamDu" defaultValue={editingItem?.thanhPhanThamDu.join(', ')} type="text" placeholder="VD: Toàn tổ, t1, t3" className="w-full px-3 py-2 border rounded-lg text-sm outline-none" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Mô tả thêm</label>
                  <textarea name="moTa" defaultValue={editingItem?.moTa} rows={3} className="w-full px-3 py-2 border rounded-lg text-sm outline-none resize-none"></textarea>
                </div>
              </form>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3 shrink-0 bg-gray-50">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium transition">
                Hủy
              </button>
              <button type="submit" form="event-form" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm transition">
                Lưu sự kiện
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
