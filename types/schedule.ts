export interface Schedule {
  scheduleId: string;
  classId: string;
  zoomUrl?: string;
  zoomMeetingId?: string;
  zoomPassword?: string;
  dayStudying: string; // ISO date string for specific date
  startTime: string; // ISO time string
  endTime: string; // ISO time string
  status: string;
}

export interface WeeklySchedule {
  classId: string;
  weekdays: number[]; // 0 = Sunday, 1 = Monday, etc.
  startTime: string; // ISO time string
  endTime: string; // ISO time string
}

export interface ScheduleCreateRequest {
  classId: string;
  dayStudying: string;
  startTime: string;
  endTime: string;
}

