export interface Area {
  id: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  parentId: string | null;
}

export interface AreasResponse {
  areas: Area[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
