import { User } from "../../../../app/feature/personal/usuarios/usuario";

export interface CommentsModels {
    id: number;
    comment: string;
    created_by: User;
    created_at: Date;
    updated_at: Date;
  }