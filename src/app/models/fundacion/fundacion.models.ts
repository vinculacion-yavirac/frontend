import { User } from "../auth/users/usuario";

export interface FundacionModels {
    id: number;
    name: string;
    incharge: string;
    phone_number: string;
    status: boolean;
    created_by: User;
    archived: boolean;
    archived_at: Date;
    archived_by: User;
    created_at: Date;
    updated_at: Date;
}
