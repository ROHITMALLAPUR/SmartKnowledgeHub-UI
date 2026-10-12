
export interface DocumentResponse {
  id: number;
  title: string;
  fileName: string;
  filePath: string | null;
  summary: string | null;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string | null;
}
