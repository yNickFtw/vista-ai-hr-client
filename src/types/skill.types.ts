export interface Skill {
  id: string;
  name: string;
  description: string | null;
  areaId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SkillsResponse {
  page: number;
  limit: number;
  totalPages: number;
  skills: Skill[];
  total: number;
}
