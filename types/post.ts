export type PostStatus = 'active' | 'closed' | 'pending';

export interface Post {
  id: string;
  title: string;
  description: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  subject: string;
  studentCount: number;
  location: string;
  tuitionFee: number;
  schedule: string;
  requirements?: string;
  createdAt: string;
  status: PostStatus;
  applicants?: number;
}

export interface PostFormData {
  title: string;
  description: string;
  subject: string;
  studentCount: number;
  location: string;
  tuitionFee: number;
  schedule: string;
  requirements?: string;
}