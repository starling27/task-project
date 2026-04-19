export interface CreateEpicInput {
  projectId: string;
  name: string;
  description?: string;
}

export interface UpdateEpicInput {
  id: string;
  name?: string;
  description?: string;
  status?: string;
}

export interface EpicOutput {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}
