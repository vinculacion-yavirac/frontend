import { SolicitudModels } from "../docente-vinculacion/solicitud/solicitud";
import { PortafoliosModels } from "../portafolio/portafolio.models";
import { ProyectoModels } from "../proyecto/proyecto.models";
import { FundacionModels } from "./fundacion.models"

export interface FundacionDetalleModels{

    id:number;
    foundations:FundacionModels;
    solicitudes:SolicitudModels;
    projects:ProyectoModels;
    briefcases:PortafoliosModels;
    created_at:Date
}