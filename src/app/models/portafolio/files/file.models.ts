import { User } from "../../auth/users/usuario";

export interface FilesModels {
    id: number,
    name: string,
    type: string,
    content: string,
    size: number,
    uploaded_by: User
  }
  