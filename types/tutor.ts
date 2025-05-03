export interface TutorProfile {
    id: string;
    name: string;
    avatar?: string;
    bio: string;
    subjects: string[];
    education: string;
    experience: string[];
    rating: number;
    reviewCount: number;
    hourlyRate: number;
    availability: string;
    location: string;
    contactInfo?: {
      email: string;
      phone: string;
    };
  }