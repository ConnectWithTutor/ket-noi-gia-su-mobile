// Common API response types

export interface PaginatedResponse<T> {
  success: boolean;
  message?: string;
  error?: string;
  statusCode?: number;
  detail?: ErrorResponse;
  pagination: paginatedData;
  data: T[];
}
export interface SingleItemResponse<T> {
  detail?: ErrorResponse;
  pagination: paginatedData;
  data: T;
}
export interface ErrorResponse {
    loc: (string | number)[];
    msg: string;
    type: string;
  
}

export interface paginatedData
{
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

  export interface SearchParams {
    page?: number;
    limit?: number;
  }
