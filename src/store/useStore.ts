import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Teacher, TeacherAchievement, Student, StudentAchievement, Mentorship, ScheduleEvent, BirthdayWish, DocumentItem } from '../types';

// Mock Data
const INITIAL_TEACHERS: Teacher[] = [
  { id: 't1', hoTen: 'Nguyễn Văn Chí', bomon: 'Toán', chucVu: 'Tổ trưởng', email: 'chi.nv@thpt.edu.vn', soDienThoai: '0901234567', ngaySinh: '1985-05-15', ngayVaoLam: '2010-09-01', loaiGiaoVien: 'Giáo viên cơ hữu', trangThai: 'Đang làm', anhDaiDien: 'N', ghiChu: '', danhHieuNamHoc: ['2023-2024'] },
  { id: 't2', hoTen: 'Lê Thị Thu Trà', bomon: 'Vật Lý', chucVu: 'Tổ phó', email: 'tra.ltt@thpt.edu.vn', soDienThoai: '0912345678', ngaySinh: '1988-10-20', ngayVaoLam: '2012-08-15', loaiGiaoVien: 'Giáo viên cơ hữu', trangThai: 'Đang làm', anhDaiDien: 'L', ghiChu: '', danhHieuNamHoc: [] },
  { id: 't3', hoTen: 'Phạm Đức Dũng', bomon: 'Toán', chucVu: 'Trưởng bộ môn', email: 'dung.pd@thpt.edu.vn', soDienThoai: '0923456789', ngaySinh: '1983-02-28', ngayVaoLam: '2015-09-01', loaiGiaoVien: 'Giáo viên cơ hữu', trangThai: 'Đang làm', anhDaiDien: 'P', ghiChu: '', danhHieuNamHoc: ['2022-2023'] },
  { id: 't4', hoTen: 'Trần Minh Đức', bomon: 'Hóa học', chucVu: 'Trưởng bộ môn', email: 'duc.tm@thpt.edu.vn', soDienThoai: '0934567890', ngaySinh: '1990-11-10', ngayVaoLam: '2014-09-01', loaiGiaoVien: 'Giáo viên cơ hữu', trangThai: 'Đang làm', anhDaiDien: 'T', ghiChu: '', danhHieuNamHoc: [] },
  { id: 't5', hoTen: 'Hoàng Kim Dung', bomon: 'Sinh học', chucVu: 'Trưởng bộ môn', email: 'dung.hk@thpt.edu.vn', soDienThoai: '0945678901', ngaySinh: '1986-07-05', ngayVaoLam: '2016-09-01', loaiGiaoVien: 'Giáo viên cơ hữu', trangThai: 'Đang làm', anhDaiDien: 'H', ghiChu: '', danhHieuNamHoc: [] },
  { id: 't6', hoTen: 'Bùi Anh Tuấn', bomon: 'Tin học', chucVu: 'Trưởng bộ môn', email: 'tuan.ba@thpt.edu.vn', soDienThoai: '0956789012', ngaySinh: '1992-12-01', ngayVaoLam: '2018-09-01', loaiGiaoVien: 'Giáo viên cơ hữu', trangThai: 'Đang làm', anhDaiDien: 'B', ghiChu: '', danhHieuNamHoc: [] },
  { id: 't7', hoTen: 'Nguyễn Thị Hương', bomon: 'Toán', chucVu: 'Giáo viên', email: 'huong.nt@thpt.edu.vn', soDienThoai: '0967890123', ngaySinh: '1995-04-12', ngayVaoLam: '2019-09-01', loaiGiaoVien: 'Giáo viên thỉnh giảng', trangThai: 'Đang làm', anhDaiDien: 'N', ghiChu: '', danhHieuNamHoc: [] },
  { id: 't8', hoTen: 'Đặng Tuấn Tú', bomon: 'Robotics', chucVu: 'Giáo viên', email: 'tu.dt@thpt.edu.vn', soDienThoai: '0978901234', ngaySinh: '1994-08-25', ngayVaoLam: '2021-09-01', loaiGiaoVien: 'Giáo viên thỉnh giảng', trangThai: 'Đang làm', anhDaiDien: 'Đ', ghiChu: '', danhHieuNamHoc: ['2023-2024'] },
  { id: 't9', hoTen: 'Lê Minh Phượng', bomon: 'Vật Lý', chucVu: 'Giáo viên', email: 'phuong.lm@thpt.edu.vn', soDienThoai: '0989012345', ngaySinh: '1991-03-08', ngayVaoLam: '2020-09-01', loaiGiaoVien: 'Giáo viên cơ hữu', trangThai: 'Nghỉ phép', anhDaiDien: 'L', ghiChu: 'Nghỉ thai sản', danhHieuNamHoc: [] },
  { id: 't10', hoTen: 'Vũ Thanh Hằng', bomon: 'Hóa học', chucVu: 'Giáo viên', email: 'hang.vt@thpt.edu.vn', soDienThoai: '0990123456', ngaySinh: '1989-06-30', ngayVaoLam: '2017-09-01', loaiGiaoVien: 'Giáo viên cơ hữu', trangThai: 'Đang làm', anhDaiDien: 'V', ghiChu: '', danhHieuNamHoc: [] },
  { id: 't11', hoTen: 'Trần Hoài Nam', bomon: 'Sinh học', chucVu: 'Giáo viên', email: 'nam.th@thpt.edu.vn', soDienThoai: '0902345678', ngaySinh: '1993-01-18', ngayVaoLam: '2022-09-01', loaiGiaoVien: 'Giáo viên thỉnh giảng', trangThai: 'Đang làm', anhDaiDien: 'T', ghiChu: '', danhHieuNamHoc: [] },
  { id: 't12', hoTen: 'Phạm Bình Minh', bomon: 'Tin học', chucVu: 'Giáo viên', email: 'minh.pb@thpt.edu.vn', soDienThoai: '0913456789', ngaySinh: '1990-09-09', ngayVaoLam: '2021-09-01', loaiGiaoVien: 'Giáo viên cơ hữu', trangThai: 'Đang làm', anhDaiDien: 'P', ghiChu: '', danhHieuNamHoc: [] },
  { id: 't13', hoTen: 'Ngô Vân Anh', bomon: 'Toán', chucVu: 'Giáo viên', email: 'anh.nv@thpt.edu.vn', soDienThoai: '0924567890', ngaySinh: '1996-11-22', ngayVaoLam: '2023-09-01', loaiGiaoVien: 'Giáo viên thỉnh giảng', trangThai: 'Đang làm', anhDaiDien: 'N', ghiChu: '', danhHieuNamHoc: [] },
  { id: 't14', hoTen: 'Lý Trọng Bằng', bomon: 'Vật Lý', chucVu: 'Giáo viên', email: 'bang.lt@thpt.edu.vn', soDienThoai: '0935678901', ngaySinh: '1987-04-14', ngayVaoLam: '2018-09-01', loaiGiaoVien: 'Giáo viên cơ hữu', trangThai: 'Đã nghỉ việc', anhDaiDien: 'L', ghiChu: '', danhHieuNamHoc: [] },
  { id: 't15', hoTen: 'Đoàn Cẩm Ly', bomon: 'Robotics', chucVu: 'Giáo viên', email: 'ly.dc@thpt.edu.vn', soDienThoai: '0946789012', ngaySinh: '1997-07-27', ngayVaoLam: '2022-09-01', loaiGiaoVien: 'Giáo viên thỉnh giảng', trangThai: 'Đang làm', anhDaiDien: 'Đ', ghiChu: '', danhHieuNamHoc: [] },
];

const INITIAL_TEACHER_ACHIEVEMENTS: TeacherAchievement[] = [
  { id: 'ta1', teacherId: 't1', loai: 'Danh hiệu', tenThanhTich: 'Giáo viên giỏi cấp tỉnh', capDo: 'Tỉnh/Thành phố', namHoc: '2023-2024', moTa: 'Giải nhất GV dạy giỏi cấp tỉnh', ngayCap: '2024-03-15', donViCap: 'Sở GD&ĐT' },
  { id: 'ta2', teacherId: 't3', loai: 'Danh hiệu', tenThanhTich: 'Chiến sĩ thi đua cơ sở', capDo: 'Trường', namHoc: '2022-2023', moTa: 'Hoàn thành xuất sắc nhiệm vụ', ngayCap: '2023-05-30', donViCap: 'Trường THPT' },
  { id: 'ta3', teacherId: 't8', loai: 'Khen thưởng', tenThanhTich: 'Bằng khen hướng dẫn Robotics', capDo: 'Quốc gia', namHoc: '2023-2024', moTa: 'Dẫn dắt đội tuyển Robotics', ngayCap: '2024-01-20', donViCap: 'Bộ GD&ĐT' },
  { id: 'ta4', teacherId: 't4', loai: 'Sáng kiến cải tiến', tenThanhTich: 'SKKN Ứng dụng CNTT trong dạy Hóa học', capDo: 'Tỉnh/Thành phố', namHoc: '2023-2024', moTa: 'Đạt loại A', ngayCap: '2024-04-10', donViCap: 'Sở GD&ĐT' },
  { id: 'ta5', teacherId: 't6', loai: 'Sáng kiến cải tiến', tenThanhTich: 'SKKN Lập trình hướng đối tượng bằng C++', capDo: 'Tỉnh/Thành phố', namHoc: '2022-2023', moTa: 'Đạt loại B', ngayCap: '2023-04-15', donViCap: 'Sở GD&ĐT' },
  { id: 'ta6', teacherId: 't2', loai: 'Danh hiệu', tenThanhTich: 'Giáo viên giỏi cấp trường', capDo: 'Trường', namHoc: '2023-2024', moTa: 'Dạy giỏi cấp trường', ngayCap: '2023-11-20', donViCap: 'Trường THPT' },
  { id: 'ta7', teacherId: 't5', loai: 'Danh hiệu', tenThanhTich: 'Chiến sĩ thi đua cơ sở', capDo: 'Trường', namHoc: '2023-2024', moTa: 'Hoàn thành xuất sắc nhiệm vụ', ngayCap: '2024-05-30', donViCap: 'Trường THPT' },
  { id: 'ta8', teacherId: 't7', loai: 'Danh hiệu', tenThanhTich: 'Giáo viên giỏi cấp quận', capDo: 'Quận/Huyện', namHoc: '2022-2023', moTa: 'Giải ba', ngayCap: '2023-02-15', donViCap: 'Phòng GD&ĐT' },
  { id: 'ta9', teacherId: 't10', loai: 'Chứng chỉ', tenThanhTich: 'Chứng chỉ STEM', capDo: 'Quốc gia', namHoc: '2023-2024', moTa: 'Hoàn thành khóa học STEM', ngayCap: '2023-08-10', donViCap: 'Bộ GD&ĐT' },
  { id: 'ta10', teacherId: 't11', loai: 'Khen thưởng', tenThanhTich: 'Đoàn viên xuất sắc', capDo: 'Quận/Huyện', namHoc: '2023-2024', moTa: 'Thành tích phong trào', ngayCap: '2024-03-26', donViCap: 'Quận Đoàn' },
  { id: 'ta11', teacherId: 't12', loai: 'Danh hiệu', tenThanhTich: 'Giáo viên giỏi cấp trường', capDo: 'Trường', namHoc: '2022-2023', moTa: 'Giải nhì', ngayCap: '2022-11-20', donViCap: 'Trường THPT' },
  { id: 'ta12', teacherId: 't1', loai: 'Sáng kiến cải tiến', tenThanhTich: 'SKKN Dạy học giải quyết vấn đề môn Toán', capDo: 'Quận/Huyện', namHoc: '2022-2023', moTa: 'Đạt loại A', ngayCap: '2023-04-05', donViCap: 'Phòng GD&ĐT' },
];

const INITIAL_STUDENTS: Student[] = [
  { id: 's1', hoTen: 'Lê Minh Khôi', lop: '12A1', bomon: 'Toán', gvcn: 't1', ngaySinh: '2006-03-15' },
  { id: 's2', hoTen: 'Trần Bội Yến', lop: '12A1', bomon: 'Vật Lý', gvcn: 't3', ngaySinh: '2006-05-20' },
  { id: 's3', hoTen: 'Nguyễn Tấn Phước', lop: '12A2', bomon: 'Hóa học', gvcn: 't4', ngaySinh: '2006-08-10' },
  { id: 's4', hoTen: 'Phạm Thùy Linh', lop: '11B1', bomon: 'Sinh học', gvcn: 't5', ngaySinh: '2007-01-25' },
  { id: 's5', hoTen: 'Bành Tuấn Dũng', lop: '11B1', bomon: 'Tin học', gvcn: 't6', ngaySinh: '2007-11-05' },
  { id: 's6', hoTen: 'Vũ Hải Đăng', lop: '10C1', bomon: 'Robotics', gvcn: 't8', ngaySinh: '2008-04-12' },
  { id: 's7', hoTen: 'Lưu Đức Mạnh', lop: '12A1', bomon: 'Toán', gvcn: 't1', ngaySinh: '2006-07-08' },
  { id: 's8', hoTen: 'Nguyễn Kiều Oanh', lop: '11B2', bomon: 'Vật Lý', gvcn: 't2', ngaySinh: '2007-09-30' },
  { id: 's9', hoTen: 'Trọng Thế Vinh', lop: '10C2', bomon: 'Hóa học', gvcn: 't10', ngaySinh: '2008-02-14' },
  { id: 's10', hoTen: 'Lê Cẩm Tú', lop: '12A3', bomon: 'Sinh học', gvcn: 't11', ngaySinh: '2006-12-05' },
  { id: 's11', hoTen: 'Bùi Đức Anh', lop: '11B1', bomon: 'Tin học', gvcn: 't6', ngaySinh: '2007-06-18' },
  { id: 's12', hoTen: 'Nguyễn Nam Tín', lop: '10C1', bomon: 'Robotics', gvcn: 't8', ngaySinh: '2008-10-22' },
  { id: 's13', hoTen: 'Đinh Lan Anh', lop: '12A1', bomon: 'Toán', gvcn: 't7', ngaySinh: '2006-01-10' },
  { id: 's14', hoTen: 'Phùng Bá Trường', lop: '11B2', bomon: 'Vật Lý', gvcn: 't2', ngaySinh: '2007-08-25' },
  { id: 's15', hoTen: 'Ngô Thiên Nga', lop: '10C2', bomon: 'Hóa học', gvcn: 't10', ngaySinh: '2008-05-15' },
  { id: 's16', hoTen: 'Hoàng Trí Dũng', lop: '12A3', bomon: 'Sinh học', gvcn: 't5', ngaySinh: '2006-09-09' },
  { id: 's17', hoTen: 'Tạ Minh Vương', lop: '11B1', bomon: 'Tin học', gvcn: 't12', ngaySinh: '2007-03-31' },
  { id: 's18', hoTen: 'Kiều Trang', lop: '10C1', bomon: 'Toán', gvcn: 't13', ngaySinh: '2008-07-20' },
  { id: 's19', hoTen: 'Châu Chấn Hưng', lop: '12A2', bomon: 'Vật Lý', gvcn: 't9', ngaySinh: '2006-11-11' },
  { id: 's20', hoTen: 'Lại Gia Hân', lop: '10C3', bomon: 'Robotics', gvcn: 't15', ngaySinh: '2008-12-01' },
];

const INITIAL_STUDENT_ACHIEVEMENTS: StudentAchievement[] = [
  { id: 'sa1', studentId: 's1', loai: 'Olympic / Thi đấu', tenGiai: 'Olympic Toán quốc tế (dự tuyển)', capDo: 'Quốc tế', namHoc: '2023-2024', bomon: 'Toán', kyThi: 'Olympic Toán', gvcnHuongDan: 'Nguyễn Văn Chí', moTa: 'Vòng loại quốc gia', ngayDat: '2024-04-05', diemSo: 95 },
  { id: 'sa2', studentId: 's6', loai: 'Cuộc thi sáng tạo', tenGiai: 'Sáng tạo KHKT - Xe lăn tự hành', capDo: 'Quốc gia', namHoc: '2023-2024', bomon: 'Robotics', kyThi: 'Sáng tạo KHKT Toàn quốc', gvcnHuongDan: 'Đặng Tuấn Tú', moTa: 'Giải Trạng Nguyên', ngayDat: '2024-03-20' },
  { id: 'sa3', studentId: 's12', loai: 'Robotics / Lập trình', tenGiai: 'VEX Robotics VN', capDo: 'Quốc gia', namHoc: '2023-2024', bomon: 'Robotics', kyThi: 'Vietnam VEX IQ', gvcnHuongDan: 'Đoàn Cẩm Ly', moTa: 'Giải Nhất', ngayDat: '2024-01-15' },
  { id: 'sa4', studentId: 's1', loai: 'Học sinh giỏi (HSG)', tenGiai: 'Giải Nhất HSG Toán cấp Tỉnh', capDo: 'Tỉnh/Thành phố', namHoc: '2023-2024', bomon: 'Toán', kyThi: 'HSG Cấp Tỉnh', gvcnHuongDan: 'Nguyễn Văn Chí', moTa: 'Thủ khoa', ngayDat: '2023-12-10', diemSo: 19.5 },
  { id: 'sa5', studentId: 's7', loai: 'Học sinh giỏi (HSG)', tenGiai: 'Giải Nhì HSG Toán cấp Tỉnh', capDo: 'Tỉnh/Thành phố', namHoc: '2023-2024', bomon: 'Toán', kyThi: 'HSG Cấp Tỉnh', gvcnHuongDan: 'Phạm Đức Dũng', moTa: '', ngayDat: '2023-12-10', diemSo: 17 },
  { id: 'sa6', studentId: 's3', loai: 'Học sinh giỏi (HSG)', tenGiai: 'Giải Ba HSG Hóa cấp Tỉnh', capDo: 'Tỉnh/Thành phố', namHoc: '2022-2023', bomon: 'Hóa học', kyThi: 'HSG Cấp Tỉnh', gvcnHuongDan: 'Trần Minh Đức', moTa: '', ngayDat: '2022-12-15' },
  { id: 'sa7', studentId: 's5', loai: 'Học sinh giỏi (HSG)', tenGiai: 'Giải Nhất HSG Tin cấp Tỉnh', capDo: 'Tỉnh/Thành phố', namHoc: '2023-2024', bomon: 'Tin học', kyThi: 'HSG Cấp Tỉnh', gvcnHuongDan: 'Bùi Anh Tuấn', moTa: '', ngayDat: '2023-12-10', diemSo: 20 },
  { id: 'sa8', studentId: 's2', loai: 'Học sinh xuất sắc', tenGiai: 'Học bổng Odon Vallet', capDo: 'Quốc gia', namHoc: '2023-2024', bomon: 'Vật Lý', kyThi: 'Học bổng', gvcnHuongDan: 'Lê Thị Thu Trà', moTa: 'Dành cho HS xuất sắc', ngayDat: '2024-05-10' },
  { id: 'sa9', studentId: 's10', loai: 'Học bổng', tenGiai: 'Học bổng toàn phần', capDo: 'Quốc gia', namHoc: '2023-2024', bomon: 'Sinh học', kyThi: 'ĐH KHTN', gvcnHuongDan: 'Hoàng Kim Dung', moTa: '', ngayDat: '2024-06-01' },
];

// Generate some more District / School level achievements
const bomons: StudentAchievement['bomon'][] = ['Toán', 'Vật Lý', 'Hóa học', 'Sinh học', 'Tin học'];
[...Array(6)].forEach((_, i) => {
  INITIAL_STUDENT_ACHIEVEMENTS.push({ id: "sad" + i, studentId: "s" + ((i % 10) + 1), loai: 'Học sinh giỏi (HSG)', tenGiai: "Giải HSG " + bomons[i%5] + " Cấp Quận", capDo: 'Quận/Huyện', namHoc: '2023-2024', bomon: bomons[i%5], kyThi: 'HSG Cấp Quận', gvcnHuongDan: 'N/A', moTa: '', ngayDat: '2023-10-15' });
});

[...Array(8)].forEach((_, i) => {
  INITIAL_STUDENT_ACHIEVEMENTS.push({ id: "sas" + i, studentId: "s" + ((i % 15) + 1), loai: 'Học sinh giỏi (HSG)', tenGiai: "Giải Nhất HSG " + bomons[i%5] + " Cấp Trường", capDo: 'Trường', namHoc: '2023-2024', bomon: bomons[i%5], kyThi: 'HSG Cấp Trường', gvcnHuongDan: 'N/A', moTa: '', ngayDat: '2023-09-20' });
});

const INITIAL_MENTORSHIPS: Mentorship[] = [
  // 8 Đang hướng dẫn 
  { id: 'm1', teacherId: 't1', studentId: 's7', bomon: 'Toán', mucTieu: 'HSG cấp Tỉnh Toán 2025', trangThai: 'Đang hướng dẫn', ngayBatDau: '2024-09-05' },
  { id: 'm2', teacherId: 't3', studentId: 's1', bomon: 'Toán', mucTieu: 'Olympic Toán Quốc gia', trangThai: 'Đang hướng dẫn', ngayBatDau: '2024-08-15' },
  { id: 'm3', teacherId: 't2', studentId: 's8', bomon: 'Vật Lý', mucTieu: 'HSG cấp Quận Vật Lý', trangThai: 'Đang hướng dẫn', ngayBatDau: '2024-09-10' },
  { id: 'm4', teacherId: 't4', studentId: 's3', bomon: 'Hóa học', mucTieu: 'HSG cấp Tỉnh Hóa học', trangThai: 'Đang hướng dẫn', ngayBatDau: '2024-09-01' },
  { id: 'm5', teacherId: 't5', studentId: 's4', bomon: 'Sinh học', mucTieu: 'HSG cấp Trường Sinh học', trangThai: 'Đang hướng dẫn', ngayBatDau: '2024-09-15' },
  { id: 'm6', teacherId: 't6', studentId: 's5', bomon: 'Tin học', mucTieu: 'KHKT Cấp Quận Tin học', trangThai: 'Đang hướng dẫn', ngayBatDau: '2024-10-01' },
  { id: 'm7', teacherId: 't8', studentId: 's6', bomon: 'Robotics', mucTieu: 'VEX Robotics Quốc gia', trangThai: 'Đang hướng dẫn', ngayBatDau: '2024-08-01' },
  { id: 'm8', teacherId: 't10', studentId: 's9', bomon: 'Hóa học', mucTieu: 'HSG cấp Quận Hóa học', trangThai: 'Đang hướng dẫn', ngayBatDau: '2024-09-20' },
  // 5 Hoàn thành
  { id: 'm9', teacherId: 't1', studentId: 's1', bomon: 'Toán', mucTieu: 'HSG cấp Tỉnh Toán 2024', trangThai: 'Hoàn thành', ngayBatDau: '2023-09-05', ngayKetThuc: '2024-04-10', ketQua: 'Giải Nhất HSG Cấp Tỉnh' },
  { id: 'm10', teacherId: 't8', studentId: 's12', bomon: 'Robotics', mucTieu: 'Vietnam VEX IQ 2024', trangThai: 'Hoàn thành', ngayBatDau: '2023-10-01', ngayKetThuc: '2024-01-20', ketQua: 'Giải Nhất' },
  { id: 'm11', teacherId: 't6', studentId: 's5', bomon: 'Tin học', mucTieu: 'HSG cấp Tỉnh Tin 2024', trangThai: 'Hoàn thành', ngayBatDau: '2023-09-15', ngayKetThuc: '2023-12-15', ketQua: 'Giải Nhất' },
  { id: 'm12', teacherId: 't2', studentId: 's2', bomon: 'Vật Lý', mucTieu: 'Săn học bổng Vật Lý', trangThai: 'Hoàn thành', ngayBatDau: '2023-09-01', ngayKetThuc: '2024-05-15', ketQua: 'Học bổng Odon Vallet' },
  { id: 'm13', teacherId: 't4', studentId: 's3', bomon: 'Hóa học', mucTieu: 'HSG cấp Tỉnh Hóa 2023', trangThai: 'Hoàn thành', ngayBatDau: '2022-09-10', ngayKetThuc: '2022-12-20', ketQua: 'Giải Ba' },
  // 2 Tạm dừng
  { id: 'm14', teacherId: 't11', studentId: 's10', bomon: 'Sinh học', mucTieu: 'HSG cấp Tỉnh Sinh học', trangThai: 'Tạm dừng', ngayBatDau: '2024-09-01', ghiChu: 'HS học dồn các môn khác' },
  { id: 'm15', teacherId: 't12', studentId: 's11', bomon: 'Tin học', mucTieu: 'HSG cấp Quận Tin học', trangThai: 'Tạm dừng', ngayBatDau: '2024-09-05', ghiChu: 'HS đổi mục tiêu thi khối' }
];

const INITIAL_SCHEDULES: ScheduleEvent[] = [
  // 4 Họp tổ
  { id: 'sc1', tieuDe: 'Họp tổ chuyên môn Toán - Lý - Tin', loai: 'Họp tổ', ngay: '2024-11-05', gioBatDau: '14:00', gioKetThuc: '16:00', diaDiem: 'Phòng họp B1', nguoiPhuTrach: 'Nguyễn Văn Chí', thanhPhanThamDu: ['Toàn tổ'], trangThai: 'Đã hoàn thành' },
  { id: 'sc2', tieuDe: 'Họp tổ chuyên môn Hóa - Sinh', loai: 'Họp tổ', ngay: '2024-11-20', gioBatDau: '14:00', gioKetThuc: '16:00', diaDiem: 'Phòng họp B2', nguoiPhuTrach: 'Trần Minh Đức', thanhPhanThamDu: ['Toàn tổ'], trangThai: 'Sắp diễn ra' },
  { id: 'sc3', tieuDe: 'Họp tổ chuyên môn tháng 12', loai: 'Họp tổ', ngay: '2024-12-05', gioBatDau: '14:00', gioKetThuc: '16:00', diaDiem: 'Phòng họp B1', nguoiPhuTrach: 'Nguyễn Văn Chí', thanhPhanThamDu: ['Toàn tổ'], trangThai: 'Sắp diễn ra' },
  { id: 'sc4', tieuDe: 'Họp sơ kết Học kì 1', loai: 'Họp tổ', ngay: '2024-12-25', gioBatDau: '08:00', gioKetThuc: '11:00', diaDiem: 'Hội trường', nguoiPhuTrach: 'BGH', thanhPhanThamDu: ['Toàn thể GV'], trangThai: 'Sắp diễn ra' },
  // 3 Dự giờ
  { id: 'sc5', tieuDe: 'Dự giờ đánh giá GV mới (Hóa)', loai: 'Dự giờ', ngay: '2024-11-12', gioBatDau: '08:45', gioKetThuc: '09:30', diaDiem: 'Lớp 10A1', nguoiPhuTrach: 'Trần Minh Đức', thanhPhanThamDu: ['t4', 't10'], trangThai: 'Đã hoàn thành' },
  { id: 'sc6', tieuDe: 'Dự giờ chuyên đề Toán 12', loai: 'Dự giờ', ngay: '2024-11-28', gioBatDau: '07:45', gioKetThuc: '08:30', diaDiem: 'Lớp 12A1', nguoiPhuTrach: 'Nguyễn Văn Chí', thanhPhanThamDu: ['t1', 't3', 't7'], trangThai: 'Sắp diễn ra' },
  { id: 'sc7', tieuDe: 'Dự giờ thao giảng Sinh học', loai: 'Dự giờ', ngay: '2024-12-10', gioBatDau: '14:00', gioKetThuc: '14:45', diaDiem: 'Phòng thực hành Sinh', nguoiPhuTrach: 'Hoàng Kim Dung', thanhPhanThamDu: ['t5', 't11'], trangThai: 'Sắp diễn ra' },
  // 2 Chuyên đề
  { id: 'sc8', tieuDe: 'CĐ: Ứng dụng AI vào giảng dạy', loai: 'Chuyên đề', ngay: '2024-11-18', gioBatDau: '14:00', gioKetThuc: '16:30', diaDiem: 'Phòng máy 1', nguoiPhuTrach: 'Bùi Anh Tuấn', thanhPhanThamDu: ['Toàn thể GV'], trangThai: 'Sắp diễn ra', moTa: 'Thực hành các công cụ AI tạo đề thi' },
  { id: 'sc9', tieuDe: 'CĐ: Đổi mới kiểm tra đánh giá KHTN', loai: 'Chuyên đề', ngay: '2024-12-15', gioBatDau: '14:00', gioKetThuc: '16:00', diaDiem: 'Hội trường', nguoiPhuTrach: 'Trần Minh Đức', thanhPhanThamDu: ['Toán', 'Lý', 'Hóa', 'Sinh'], trangThai: 'Sắp diễn ra' },
  // 4 Mốc thi HSG
  { id: 'sc10', tieuDe: 'Giao đề khảo sát HSG trường Lần 1', loai: 'Thi HSG', ngay: '2024-11-10', gioBatDau: '17:00', gioKetThuc: '17:00', diaDiem: 'Email', nguoiPhuTrach: 'Tổ trưởng chuyên môn', thanhPhanThamDu: ['Toàn bộ tổ trưởng'], trangThai: 'Đã hoàn thành' },
  { id: 'sc11', tieuDe: 'Khảo sát đội tuyển HSG 12 Khối KHTN', loai: 'Thi HSG', ngay: '2024-11-15', gioBatDau: '07:30', gioKetThuc: '10:30', diaDiem: 'Khu A', nguoiPhuTrach: 'Ban Giám Hiệu', thanhPhanThamDu: ['HSG 12', 'GV coi thi'], trangThai: 'Đã hoàn thành' },
  { id: 'sc12', tieuDe: 'Thi HSG cấp Quận (Toán, Lý, Hóa)', loai: 'Thi HSG', ngay: '2024-12-12', gioBatDau: '07:00', gioKetThuc: '11:00', diaDiem: 'THPT Trung Tâm', nguoiPhuTrach: 'Ban Giám Khảo', thanhPhanThamDu: ['HS đội tuyển'], trangThai: 'Sắp diễn ra' },
  { id: 'sc13', tieuDe: 'Nộp danh sách HS thi cấp Tỉnh', loai: 'Thi HSG', ngay: '2024-12-20', gioBatDau: '17:00', gioKetThuc: '17:00', diaDiem: 'Văn phòng Đoàn', nguoiPhuTrach: 'GV Lãnh Đội', thanhPhanThamDu: ['Trưởng bộ môn'], trangThai: 'Sắp diễn ra' },
  // 3 Nộp báo cáo
  { id: 'sc14', tieuDe: 'Nộp báo cáo điểm giữa kì 1', loai: 'Nộp báo cáo', ngay: '2024-11-05', gioBatDau: '17:00', gioKetThuc: '17:00', diaDiem: 'Online System', nguoiPhuTrach: 'Tất cả GV', thanhPhanThamDu: ['Toàn thể GV'], trangThai: 'Đã hoàn thành' },
  { id: 'sc15', tieuDe: 'Nộp kế hoạch tháng 12', loai: 'Nộp báo cáo', ngay: '2024-11-30', gioBatDau: '17:00', gioKetThuc: '17:00', diaDiem: 'Email Tổ trưởng', nguoiPhuTrach: 'Cá nhân GV', thanhPhanThamDu: ['Toàn thể GV'], trangThai: 'Sắp diễn ra' },
  { id: 'sc16', tieuDe: 'Báo cáo thống kê điểm HK1', loai: 'Nộp báo cáo', ngay: '2024-12-30', gioBatDau: '17:00', gioKetThuc: '17:00', diaDiem: 'Hệ thống Quản lý', nguoiPhuTrach: 'GVCN và GVBM', thanhPhanThamDu: ['Toàn thể GV'], trangThai: 'Sắp diễn ra' },
  // 2 Sự kiện
  { id: 'sc17', tieuDe: 'Ngày hội STEM 2024', loai: 'Sự kiện', ngay: '2024-11-25', gioBatDau: '08:00', gioKetThuc: '16:00', diaDiem: 'Sân trường', nguoiPhuTrach: 'Tổ STEM', thanhPhanThamDu: ['Toàn trường'], trangThai: 'Sắp diễn ra' },
  { id: 'sc18', tieuDe: 'Chào mừng 20/11', loai: 'Sự kiện', ngay: '2024-11-20', gioBatDau: '08:00', gioKetThuc: '11:00', diaDiem: 'Hội trường', nguoiPhuTrach: 'Đoàn Thanh Niên', thanhPhanThamDu: ['Toàn trường'], trangThai: 'Sắp diễn ra' },
  // 2 Nghỉ lễ
  { id: 'sc19', tieuDe: 'Nghỉ lễ Giáng sinh', loai: 'Nghỉ lễ', ngay: '2024-12-25', gioBatDau: '00:00', gioKetThuc: '23:59', diaDiem: '-', nguoiPhuTrach: '-', thanhPhanThamDu: ['Toàn trường'], trangThai: 'Sắp diễn ra' },
  { id: 'sc20', tieuDe: 'Nghỉ Tết Dương lịch 2025', loai: 'Nghỉ lễ', ngay: '2025-01-01', gioBatDau: '00:00', gioKetThuc: '23:59', diaDiem: '-', nguoiPhuTrach: '-', thanhPhanThamDu: ['Toàn trường'], trangThai: 'Sắp diễn ra' }
];

const INITIAL_WISHES: BirthdayWish[] = [
  { id: 'w1', teacherId: 't1', senderName: 'Học sinh lớp 12A1', message: 'Chúc thầy sinh nhật vui vẻ, hạnh phúc và thành công!', date: '2024-05-15T08:00:00Z' }
];

const INITIAL_DOCUMENTS: DocumentItem[] = [];

interface AppState {
  teachers: Teacher[];
  teacherAchievements: TeacherAchievement[];
  students: Student[];
  studentAchievements: StudentAchievement[];
  
  // Mentors, schedules
  mentorships: Mentorship[];
  scheduleEvents: ScheduleEvent[];
  birthdayWishes: BirthdayWish[];
  documents: DocumentItem[];

  // Auth
  isAuthenticated: boolean;
  userEmail: string | null;

  // Actions
  login: (email: string) => void;
  logout: () => void;
  
  addTeacher: (t: Teacher) => void;
  updateTeacher: (id: string, t: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
  
  addTeacherAchievement: (a: TeacherAchievement) => void;
  updateTeacherAchievement: (id: string, a: Partial<TeacherAchievement>) => void;
  deleteTeacherAchievement: (id: string) => void;

  addStudent: (s: Student) => void;
  updateStudent: (id: string, s: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  addStudentAchievement: (a: StudentAchievement) => void;
  updateStudentAchievement: (id: string, a: Partial<StudentAchievement>) => void;
  deleteStudentAchievement: (id: string) => void;

  addMentorship: (m: Mentorship) => void;
  updateMentorship: (id: string, m: Partial<Mentorship>) => void;
  deleteMentorship: (id: string) => void;

  addScheduleEvent: (e: ScheduleEvent) => void;
  updateScheduleEvent: (id: string, e: Partial<ScheduleEvent>) => void;
  deleteScheduleEvent: (id: string) => void;

  addBirthdayWish: (w: BirthdayWish) => void;
  deleteBirthdayWish: (id: string) => void;
  
  addDocument: (doc: DocumentItem) => void;
  deleteDocument: (id: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      teachers: INITIAL_TEACHERS,
      teacherAchievements: INITIAL_TEACHER_ACHIEVEMENTS,
      students: INITIAL_STUDENTS,
      studentAchievements: INITIAL_STUDENT_ACHIEVEMENTS,
      mentorships: INITIAL_MENTORSHIPS,
      scheduleEvents: INITIAL_SCHEDULES,
      birthdayWishes: INITIAL_WISHES,
      documents: INITIAL_DOCUMENTS,
      
      isAuthenticated: false,
      userEmail: null,
      
      login: (email) => set({ isAuthenticated: true, userEmail: email }),
      logout: () => set({ isAuthenticated: false, userEmail: null }),
      
      addTeacher: (t) => set((state) => ({ teachers: [...state.teachers, t] })),
      updateTeacher: (id, t) => set((state) => ({ teachers: state.teachers.map((x) => x.id === id ? { ...x, ...t } : x) })),
      deleteTeacher: (id) => set((state) => ({ teachers: state.teachers.filter((x) => x.id !== id) })),
      
      addTeacherAchievement: (a) => set((state) => ({ teacherAchievements: [...state.teacherAchievements, a] })),
      updateTeacherAchievement: (id, a) => set((state) => ({ teacherAchievements: state.teacherAchievements.map((x) => x.id === id ? { ...x, ...a } : x) })),
      deleteTeacherAchievement: (id) => set((state) => ({ teacherAchievements: state.teacherAchievements.filter((x) => x.id !== id) })),
      
      addStudent: (s) => set((state) => ({ students: [...state.students, s] })),
      updateStudent: (id, s) => set((state) => ({ students: state.students.map((x) => x.id === id ? { ...x, ...s } : x) })),
      deleteStudent: (id) => set((state) => ({ students: state.students.filter((x) => x.id !== id) })),
      
      addStudentAchievement: (a) => set((state) => ({ studentAchievements: [...state.studentAchievements, a] })),
      updateStudentAchievement: (id, a) => set((state) => ({ studentAchievements: state.studentAchievements.map((x) => x.id === id ? { ...x, ...a } : x) })),
      deleteStudentAchievement: (id) => set((state) => ({ studentAchievements: state.studentAchievements.filter((x) => x.id !== id) })),

      addMentorship: (m) => set((state) => ({ mentorships: [...state.mentorships, m] })),
      updateMentorship: (id, m) => set((state) => ({ mentorships: state.mentorships.map((x) => x.id === id ? { ...x, ...m } : x) })),
      deleteMentorship: (id) => set((state) => ({ mentorships: state.mentorships.filter((x) => x.id !== id) })),

      addScheduleEvent: (e) => set((state) => ({ scheduleEvents: [...state.scheduleEvents, e] })),
      updateScheduleEvent: (id, e) => set((state) => ({ scheduleEvents: state.scheduleEvents.map((x) => x.id === id ? { ...x, ...e } : x) })),
      deleteScheduleEvent: (id) => set((state) => ({ scheduleEvents: state.scheduleEvents.filter((x) => x.id !== id) })),

      addBirthdayWish: (w) => set((state) => ({ birthdayWishes: [w, ...state.birthdayWishes] })),
      deleteBirthdayWish: (id) => set((state) => ({ birthdayWishes: state.birthdayWishes.filter((x) => x.id !== id) })),

      addDocument: (doc) => set((state) => ({ documents: [doc, ...state.documents] })),
      deleteDocument: (id) => set((state) => ({ documents: state.documents.filter((x) => x.id !== id) })),
    }),
    {
      name: 'tktn_storage',
    }
  )
);
