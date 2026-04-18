export interface CreateCommentInput {
  storyId: string;
  author: string;
  content: string;
}

export interface CommentOutput {
  id: string;
  storyId: string;
  author: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}
