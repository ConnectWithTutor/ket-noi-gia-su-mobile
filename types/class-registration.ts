export interface ClassRegistration {
    registrationId: string;
    classId: string;
    studentId: string;
    registrationDate: string; 
}
export interface ClassRegistrationCreateRequest {
    classId: string;
    studentId: string;
    registrationDate: string; 
}