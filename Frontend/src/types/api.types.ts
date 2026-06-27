export interface ApiValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  message: string;
  status: number;
  errors: ApiValidationError[] | null;
}
