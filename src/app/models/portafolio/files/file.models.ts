import { User } from "../../../../app/feature/personal/usuarios/usuario";

export interface FilesModels {
    id: number,
    name: string,
    type: string,
    content: string,
    size: number,
    uploaded_by: User
  }
  