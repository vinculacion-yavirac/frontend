import {Role} from "../../auth/role/rol";
import {FilesModels} from "../files/file.models";

export interface DocumentoModels {
  id?: number;
  name?: string;
  template?: string;
  state?: boolean;
  order?: number;
  files: FilesModels[];
  responsible_id?: Role;
}

export const defaultDocumentoModels: DocumentoModels = {
  files: [],
};
