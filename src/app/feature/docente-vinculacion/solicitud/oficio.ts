
import { User } from "../../personal/usuarios/usuario";
import { Comments } from "./comments/comments"
import { Files } from "./file/file";

export interface Oficio {
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