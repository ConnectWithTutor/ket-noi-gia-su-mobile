// import { Subject } from './subject';
// import { Tutor } from './tutor';
// import { SearchParams } from './common';

// export interface Class {
//   id: string;
//   title: string;
//   description: string;
//   subjectId: string;
//   subject?: Subject;
//   tutorId: string;
//   tutor?: Tutor;
//   price: number;
//   schedule: string;
//   location?: string;
//   isOnline: boolean;
//   status: 'active' | 'inactive' | 'cancelled';
//   createdAt: string;
//   updatedAt: string;
// }

// export interface ClassCreateRequest {
//   title: string;
//   description: string;
//   subjectId: string;
//   price: number;
//   schedule: string;
//   location?: string;
//   isOnline: boolean;
// }

// export interface ClassUpdateRequest {
//   title?: string;
//   description?: string;
//   subjectId?: string;
//   price?: number;
//   schedule?: string;
//   location?: string;
//   isOnline?: boolean;
//   status?: 'active' | 'inactive' | 'cancelled';
// }

// export interface ClassSearchParams extends SearchParams {
//   subject?: string;
//   tutor?: string;
//   isOnline?: boolean;
//   status?: string;
// }