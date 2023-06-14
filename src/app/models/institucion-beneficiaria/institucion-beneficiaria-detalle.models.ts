import { SolicitudModels } from "../docente-vinculacion/solicitud/solicitud";
import { PortafoliosModels } from "../portafolio/portafolio.models";
import { ProyectoModels } from "../proyecto/proyecto.models";
import { InstitucionBeneficiariaModels } from "./institucion-beneficiaria.models"

export interface InstitucionBeneficiariaDetalleModels {

    id:number;
    foundations:InstitucionBeneficiariaModels;
    solicitudes:SolicitudModels;
    projects:ProyectoModels;
    briefcases:PortafoliosModels;
    created_at:Date
}
