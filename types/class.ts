export interface Class {
    classId: string;
    className_vi: string;
    className_en: string;
    tutorId: string;
    createdBy: string;
    subjectId: string;
    studyType: string;
    startDate: string;
    sessions: number;
    tuitionFee: string;
    description: string;
    maxStudents: number;
    status: string;
}

export interface ClassCreateRequest {
    className_vi: string;
    className_en: string;
    tutorId: string;
    createdBy: string;
    subjectId: string;
    studyType: string;
    startDate: string;
    sessions: number;
    tuitionFee: string;
    description: string;
    maxStudents: number;
    status: string;
}

export interface ClassUpdateRequest {
    className_vi?: string;
    className_en?: string;
    tutorId?: string;
    createdBy?: string;
    subjectId?: string;
    studyType?: string;
    startDate?: string;
    sessions?: number;
    tuitionFee?: string;
    description?: string;
    maxStudents?: number;
    status?: string;
}
