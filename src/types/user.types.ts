export interface Skill {
  id: string;
  name: string;
  description: string;
}

export interface Area {
  id: string;
  name: string;
  description: string;
}

export interface Experience {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
}

export interface UserSkill {
  id: string;
  skill: Skill;
}

export interface UserArea {
  id: string;
  area: Area;
}

export interface User {
  id: string;
  email: string;
  name: string;
  is_recruiter: boolean;
  experiences: Experience[];
  user_skills: UserSkill[];
  user_areas: UserArea[];
  user_summary: { id: string; } | null;
}
