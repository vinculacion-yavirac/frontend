import { User } from "../auth/users/usuario";

export interface FundacionModels {
    id: number;
    name: string;
    authorized_person: string;
    number_ruc:string;
    economic_activity:string;
    company_email:string;
    phone_number: string;
    company_number:string;
    status: boolean;
    received_students:number;
    direct_benefit:string;
    indirect_benefits:string;
    created_by: User;
    created_at: Date;
    updated_at: Date;
}
