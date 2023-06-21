import {Role} from "../../auth/role/rol";

export interface DocumentoModels {
  id: number;
  name: string;
  template: string;
  state: boolean;
  order: number;
  responsible_id: Role;
}
