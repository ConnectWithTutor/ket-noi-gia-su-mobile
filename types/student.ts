export interface Student {
    studentId: string;
    userId: string;
    gradeLevel: string;
    learningGoals: string;
    preferredStudyTime: string;
 
    description: string;
}

export interface StudentProfile {
    userId: string;
    studentId: string;
    gradeLevel: string;
    learningGoals: string;
    preferredStudyTime: string;
    description: string;
}
export interface StudentProfileUpdateRequest {
    gradeLevel?: string;
    learningGoals?: string;
    preferredStudyTime?: string;
    description?: string;
};