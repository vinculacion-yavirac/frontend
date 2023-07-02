import { User } from "../auth/users/usuario";
import { ParroquiaModels } from "../parroquia/parroquia.models";

export interface InstitucionBeneficiariaModels {
      id: number;
      ruc: string;
      name: string;
      management_nature: string;
      economic_activity: string;
      logo: string;
      state: boolean;
      place_location: string;
      phone: string;
      email: string;
      postal_code: string;
      addresses_id: number;
      parish_main_id: ParroquiaModels;
      parish_branch_id: ParroquiaModels;
      created_at?: string;
      updated_at?: string;
}
