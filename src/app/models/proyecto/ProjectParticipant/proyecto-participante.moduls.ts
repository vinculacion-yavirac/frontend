import {CatalogoModels} from "../../catalogo/catalogo.models";
import {ProyectoModels} from "../proyecto.models";
import {User} from "../../auth/users/usuario";


export interface ProyectoParticipanteModels {
  id: number;
  functions: JSON;
  assignment_date:Date;
  //'level_id',
  catalogue_id:CatalogoModels;
  //'schedule_id',
  //'state_id',
  project_id:ProyectoModels;
  participant_id:User;

}
