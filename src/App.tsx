/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Teachers from './pages/Teachers';
import TeacherAchieve from './pages/TeacherAchieve';
import Students from './pages/Students';
import StudentAchieve from './pages/StudentAchieve';
import HallOfFame from './pages/HallOfFame';
import Reports from './pages/Reports';
import TeacherBirthdays from './pages/TeacherBirthdays';
import Mentorships from './pages/Mentorships';
import Schedule from './pages/Schedule';

export default function App() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/teacher-achievements" element={<TeacherAchieve />} />
          <Route path="/teacher-birthdays" element={<TeacherBirthdays />} />
          <Route path="/students" element={<Students />} />
          <Route path="/student-achievements" element={<StudentAchieve />} />
          <Route path="/mentorships" element={<Mentorships />} />
          <Route path="/hall-of-fame" element={<HallOfFame />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}
