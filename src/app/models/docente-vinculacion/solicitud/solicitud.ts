import { User } from "../../auth/users/usuario";
import {ProyectoModels} from "../../proyecto/proyecto.models";

export interface SolicitudModels {
    id: number;
    type_of_request:string;
    status: string;
    created_by: User;
    projects:ProyectoModels;
    archived: boolean;
    archived_at: Date;
    archived_by: User;
    created_at: Date;
    updated_at: Date;
}
