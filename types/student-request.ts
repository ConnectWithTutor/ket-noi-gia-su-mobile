export interface StudentRequest {
    requestId: string;
    studentId: string; 
    subjectId: string;
    studyType: string; 
    preferredSchedule: string; 
    tuitionFee: string; 
    location: string; 
    description: string; 
    status: string; 
    title: string;
    studentCount: number;
    createdAt: string;
}

export interface StudentRequestCreateRequest {
    studentId: string; 
    subjectId: string;
    studyType: string; 
    preferredSchedule: string; 
    tuitionFee: string; 
    location: string; 
    description: string; 
    status: string; 
    title: string;
    studentCount: number;
    createdAt: string;
}

export interface StudentRequestUpdateRequest {
    studyType?: string; 
    preferredSchedule?: string; 
    tuitionFee?: string; 
    location?: string; 
    description?: string; 
    status?: string; 
    title?: string;
    studentCount?: number;
    createdAt?: string;
}
