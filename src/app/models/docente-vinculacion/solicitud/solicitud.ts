import { User } from "../../auth/users/usuario";
import {CatalogoModels} from "../../catalogo/catalogo.models";
import {ProyectoParticipanteModels} from "../../proyecto/ProjectParticipant/proyecto-participante.moduls";
import { ProyectoModels } from "../../proyecto/proyecto.models";

export interface SolicitudModels {

    id: number;
    approval_date:Date;
    solicitudes_status_id:CatalogoModels;
    type_request_id:CatalogoModels;
    project_id:ProyectoModels;
    who_made_request_id:ProyectoParticipanteModels,
    created_by: User;
    archived: boolean;
    archived_at: Date;
    archived_by: User;
    created_at: Date;
    updated_at: Date;
}
