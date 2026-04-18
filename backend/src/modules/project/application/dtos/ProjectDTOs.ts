export interface CreateProjectInput {
  name: string;
  description?: string;
}

export interface UpdateProjectInput {
  id: string;
  name?: string;
  description?: string;
}

export interface ProjectOutput {
  id: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}
