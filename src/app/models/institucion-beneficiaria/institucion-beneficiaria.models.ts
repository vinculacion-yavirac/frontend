import { User } from "../auth/users/usuario";

export interface InstitucionBeneficiariaModels {
      id: number;
      ruc: string;
      name: string;
      logo: string;
      state: boolean;
      placeLocation: string;
      postal_code: string;
      parish_id: number;
      created_at?: string;
      updated_at?: string;
}
