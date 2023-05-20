
import { FilesModels } from "./files/file.models";
import { CommentsModels } from "./comments/comments.models";
import { User } from "../auth/users/usuario";

export interface PortafoliosModels {
    id: number;
    subject: string;
    files: FilesModels[];
    comments: CommentsModels[];
    description: string;
    status: string;
    created_by: User;
    archived: boolean;
    archived_at: Date;
    archived_by: User;
    created_at: Date;
    updated_at: Date;
}