export interface Tutor {
    tutorId: string;
    userId: string;
    degree: string;
    certificate: string;
    experience: string;
    description: string;
    introVideoUrl: string;
    isApproved: boolean;
  }
export interface TutorProfile {
    userId: string;
     tutorId: string;
    degree: string;
    certificate: string;
    experience: string;
    description: string;
    introVideoUrl: string;
  }
export interface TutorUpdateRequest {
    degree?: string;
    certificate?: string;
    experience?: string;
    description?: string;
    introVideoUrl?: string;
  }