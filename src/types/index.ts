export interface Declaration {
  _id: string;
  name: string;
  temperature: number;
  hasSymptoms: boolean;
  contactWithCovid: boolean;
  submissionDate: string;
}

export interface DeclarationsResponse {
  data: Declaration[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateDeclarationRequest {
  name: string;
  temperature: number;
  hasSymptoms: boolean;
  contactWithCovid: boolean;
}