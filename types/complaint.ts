export enum ComplaintStatus {
    Done = 'Done',
    Pending = 'Pending'
}

export interface Complaint {
    complaintId: string;
    userId: string;
    complaintTypeId: string;
    title: string;
    content: string;
    resolutionNote: string;
    status: ComplaintStatus;
    createdAt: string; 
}

export interface CreateComplaintRequest {
    userId: string;
    complaintTypeId: string;
    title: string;
    content: string;
    status: ComplaintStatus;
}

export interface complaintType {
    complaintTypeId: string;
    name: string;
    description: string;
}