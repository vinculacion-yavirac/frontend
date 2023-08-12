import { DocumentoModels } from "../documentos/documento.models";

export interface CustomFile {
    file: File;
    // name: string;
    // type: string;
    // content: string;
    // size: number;
    state:boolean,
    observation:string;
    created_at:Date;
    document_id:number| DocumentoModels;
}