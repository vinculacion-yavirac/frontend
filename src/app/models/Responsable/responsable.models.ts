import {User} from "../auth/users/usuario";

export interface ResponsibleModels {
  id: number;
  user_id: User;
  charge_id: number | null;
  created_at: string;
  updated_at: string;
}
