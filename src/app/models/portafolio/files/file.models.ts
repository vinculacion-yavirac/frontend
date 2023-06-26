import { User } from "../../auth/users/usuario";
import {PortafoliosModels} from "../portafolio.models";
import {DocumentoModels} from "../documentos/documento.models";

export interface FilesModels {
    id?: number;
    name?: string;
    type?: string;
    content: string;
    size?: number;
    observation?: string;
    state?: boolean;
    file: File;
    briefcase_id?: number | PortafoliosModels;
    document_id?: number | DocumentoModels;
  }
