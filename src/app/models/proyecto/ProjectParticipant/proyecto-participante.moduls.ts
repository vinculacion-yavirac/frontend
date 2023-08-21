import {CatalogoModels} from "../../catalogo/catalogo.models";
import {ProyectoModels} from "../proyecto.models";
import {User} from "../../auth/users/usuario";


export interface ProyectoParticipanteModels {
  id: number;
  functions: JSON;
  assignment_date:Date;
  catalogue_id:CatalogoModels;
  project_id:ProyectoModels;
  participant_id:User;
  role:string;
  created_by:User;

}
