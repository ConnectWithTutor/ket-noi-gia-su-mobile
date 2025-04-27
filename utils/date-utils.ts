export const formatDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };
  
  export const formatTime = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  export const formatDateTime = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return `${formatDate(d)} ${formatTime(d)}`;
  };
  
  export const getDayName = (date: Date | string, short = true): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('vi-VN', {
      weekday: short ? 'short' : 'long',
    });
  };
  
  export const getMonthName = (date: Date | string, short = false): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('vi-VN', {
      month: short ? 'short' : 'long',
    });
  };
  
  export const isSameDay = (date1: Date | string, date2: Date | string): boolean => {
    const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
    const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
    
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };
  
  export const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  export const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  };
  
  export const generateCalendarDays = (year: number, month: number, events: Date[] = []): Array<{
    date: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    hasEvents: boolean;
  }> => {
    const today = new Date();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    // Previous month days
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevMonthYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);
    
    const calendarDays = [];
    
    // Add previous month days
    for (let i = 0; i < firstDayOfMonth; i++) {
      const date = daysInPrevMonth - firstDayOfMonth + i + 1;
      calendarDays.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        hasEvents: false,
      });
    }
    
    // Add current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      const isToday = 
        currentDate.getDate() === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear();
      
      const hasEvents = events.some(event => isSameDay(event, currentDate));
      
      calendarDays.push({
        date: i,
        isCurrentMonth: true,
        isToday,
        hasEvents,
      });
    }
    
    // Add next month days
    const remainingDays = 42 - calendarDays.length; // 6 rows of 7 days
    for (let i = 1; i <= remainingDays; i++) {
      calendarDays.push({
        date: i,
        isCurrentMonth: false,
        isToday: false,
        hasEvents: false,
      });
    }
    
    return calendarDays;
  };
  
  export const getRelativeTime = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Vừa xong';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} ngày trước`;
    }
    
    return formatDate(d);
  };