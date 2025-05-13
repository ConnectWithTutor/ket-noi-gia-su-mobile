export interface Subject {
  subjectId: string; // UUID
  subjectName_vi: string,
  subjectName_en: string,
  description: string; // Description of the subject
}

export interface SubjectCreateRequest {
   subjectName_vi: string,
  subjectName_en: string,
  description: string;
}

export interface SubjectUpdateRequest {
 subjectName_vi: string,
  subjectName_en: string,
  description?: string;
}