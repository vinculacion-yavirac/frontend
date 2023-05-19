import { User } from "../../personal/usuarios/usuario";


export interface Files {
  id: number,
  name: string,
  type: string,
  content: string,
  size: number,
  uploaded_by: User
}
