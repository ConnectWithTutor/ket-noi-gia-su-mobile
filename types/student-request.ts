export interface StudentRequest {
    requestId: string;
    studentId: string; 
    subjectId: string;
    studyType: string; 
    preferredSchedule: string; 
    tuitionFee: number; 
    location: string; 
    description: string; 
    status: string; 
}
export interface StudentRequestCreateRequest {
    studentId: string; 
    subjectId: string;
    studyType: string; 
    preferredSchedule: string; 
    tuitionFee: number; 
    location: string; 
    description: string; 
    status: string; 
}
export interface StudentRequestUpdateRequest {
    studyType?: string; 
    preferredSchedule?: string; 
    tuitionFee?: number; 
    location?: string; 
    description?: string; 
    status?: string; 
}
