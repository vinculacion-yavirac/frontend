
import { FilesModels } from "./files/file.models";
import { CommentsModels } from "./comments/comments.models";
import { User } from "../auth/users/usuario";
import {ProyectoParticipanteModels} from "../proyecto/ProjectParticipant/proyecto-participante.moduls";

export interface PortafoliosModels {
      id: number;
      observations: string;
      state: boolean;
      project_participant_id: ProyectoParticipanteModels;
      created_by: User;
      archived: boolean;
      archived_at: Date;
      archived_by: User;
      created_at: Date;
      updated_at: Date;
}
