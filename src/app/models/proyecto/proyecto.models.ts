import { User } from "../auth/users/usuario";
import { FundacionModels } from "../fundacion/fundacion.models";


export interface ProyectoModels {
    id: number;
    name: string;
    status: string;
    foundations: FundacionModels;
    created_by: User;
    created_at: string;
    update_at:string;
}
