export interface WorkflowStateOutput {
  id: string;
  name: string;
  projectId: string;
  order: number;
  color: string;
  isInitial: boolean;
  isFinal: boolean;
  isDefault: boolean;
  description?: string;
}

export interface CreateWorkflowStateInput {
  projectId: string;
  name: string;
  description?: string;
  color?: string;
  order?: number;
  isInitial?: boolean;
  isFinal?: boolean;
  isDefault?: boolean;
}
