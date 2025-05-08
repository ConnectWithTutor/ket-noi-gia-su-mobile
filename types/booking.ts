// import { Class } from './class';
// import { Student } from './student';
// import { SearchParams } from './common';

// export interface Booking {
//   id: string;
//   classId: string;
//   class?: Class;
//   studentId: string;
//   student?: Student;
//   status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
//   bookingDate: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface BookingCreateRequest {
//   classId: string;
// }

// export interface BookingStatusUpdateRequest {
//   status: 'confirmed' | 'cancelled' | 'completed';
// }

// export interface BookingSearchParams extends SearchParams {
//   status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
// }