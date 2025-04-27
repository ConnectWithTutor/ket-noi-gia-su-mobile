export type ClassStatus = 'upcoming' | 'completed' | 'cancelled';

export interface Class {
  id: string;
  title: string;
  description?: string;
  tutorId: string;
  tutorName: string;
  studentId: string;
  studentName: string;
  subject: string;
  startTime: string;
  endTime: string;
  location: string;
  status: ClassStatus;
  notes?: string;
}

export interface CalendarDay {
  date: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasEvents: boolean;
}