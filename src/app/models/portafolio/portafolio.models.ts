import { Comments } from "src/app/feature/oficios/comments/comments";
import { Files } from "src/app/feature/oficios/file/file";
import { User } from "src/app/feature/personal/usuarios/usuario";


export interface PortafoliosModels {
    id: number;
    subject: string;
    files: Files[];
    comments: Comments[];
    description: string;
    status: string;
    created_by: User;
    archived: boolean;
    archived_at: Date;
    archived_by: User;
    created_at: Date;
    updated_at: Date;
}