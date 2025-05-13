export interface Status {
    statusId: string;
    code: string;
    name: string;
}

export interface StatusCreateRequest {
    code: string;
    name: string;
}
