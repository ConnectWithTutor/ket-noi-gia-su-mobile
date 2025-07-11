// Common API response types

export interface PaginatedResponse<T> {
  success: boolean;
  message?: string;
  error?: string;
  statusCode?: number;
  detail?: ErrorResponse;
  pagination: paginatedData;
  data: T[];
  results?: T[];
}
export interface SingleItemResponse<T> {
  id?: string;
  detail?: ErrorResponse;
  pagination: paginatedData;
  data?: T;
}
export interface ErrorResponse {
    loc: (string | number)[];
    msg: string;
    type: string;
  
}
export interface CreateResponse {
  id: string;
  message: string;
  detail?: ErrorResponse;
}

export interface UpdateResponse {
  data: string;
  message: string;
  detail?: ErrorResponse;
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
