import {Role} from "../../auth/role/rol";
import { User } from "../../auth/users/usuario";
import {FilesModels} from "../files/file.models";

export interface DocumentoModels {
  id: number;
  name: string;
  template: string;
  state: boolean;
  order: number;
  //files: FilesModels;
  responsible_id?: Role | number;
  archived_by: User;
  created_at: Date;
  updated_at: Date;
  archived_at: Date;
}

