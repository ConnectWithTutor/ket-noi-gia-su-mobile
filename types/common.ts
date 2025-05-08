// Common API response types


  
  export interface PaginatedResponse<T> {
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
      };
    data: T[];
  }
  
  export interface PaginatedData<T> {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  }
  
  export interface ErrorResponse {
    success: false;
    message: string;
    error?: string;
    statusCode?: number;
  }
  
  export interface SearchParams {
    page?: number;
    limit?: number;
  }
export interface ValidationErrorDetail {
    loc: (string | number)[];
    msg: string;
    type: string;
}

export interface ValidationErrorResponse {
    detail: ValidationErrorDetail[];
}