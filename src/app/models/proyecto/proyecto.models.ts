import { FilesModels } from "./files/file.models";
import { CommentsModels } from "./comments/comments.models";
import { User } from "../auth/users/usuario";

export interface ProyectoModels {
    id: number;
    name: string;
    status: string;
    foundations: Fundacion[];
    created_by: string;
    created_at: string;
    update_at:string;

}
