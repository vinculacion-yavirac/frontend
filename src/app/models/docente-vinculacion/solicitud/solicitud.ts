import { User } from "../../auth/users/usuario";

export interface SolicitudModels {
    id: number;
    type_of_request:string;
    status: string;
    created_by: User;
    archived: boolean;
    archived_at: Date;
    archived_by: User;
    created_at: Date;
    updated_at: Date;
}