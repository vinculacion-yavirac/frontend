import { DocumentoModels } from "../documentos/documento.models";

export interface CustomFile {
    file: File;
    // name: string;
    // type: string;
    // content: string;
    // size: number;
    document_id:number| DocumentoModels;
}