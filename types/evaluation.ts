export interface Evaluation {
  evaluationId: string;
  classId: string;
  fromUserId: string;
  toUserId: string;
  criteria1: number;
  criteria2: number;
  criteria3: number;
  comment?: string;
  evaluationDate: string; // ISO date string
}
export interface EvaluationCreateRequest {
  classId: string;
  fromUserId: string;
  criteria1: number;
  criteria2: number;
  criteria3: number;
    comment?: string;
}