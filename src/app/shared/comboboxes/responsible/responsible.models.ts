import { User } from "../../../models/auth/users/usuario";

export interface ResponsibleModels {
    id: number,
    user_id: User,
    charge_id: number,
    created_at?: string;
    updated_at?: string;
}
