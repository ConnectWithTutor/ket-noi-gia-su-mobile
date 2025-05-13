import { User } from './user';
import { StudentRequest } from './student-request';

export interface TutorApplication {
  applicationId: string;
  tutorId: string;
  requestId: string;
  applicationDate: string;
  status: string;
}

export interface TutorApplicationCreateRequest {
  tutorId: string;
  requestId: string;
  applicationDate: string;
  status: string;
}

