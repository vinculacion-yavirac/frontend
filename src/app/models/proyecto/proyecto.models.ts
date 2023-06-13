import { User } from "../auth/users/usuario";
import { FundacionModels } from "../fundacion/fundacion.models";


export interface ProyectoModels {
    id: number;
    code: string;
    name: string;
    field: string;
    term_execution: number;
    start_date: Date;
    end_date: Date;
    linking_activity: any[];
    sectors_intervention: any[];
    strategic_axes: any[];
    description: string;
    situational_analysis: string;
    foundation: string;
    justification: string;
    direct_beneficiaries: any[];
    indirect_beneficiaries: any[];
    schedule: string;
    evaluation_monitoring_strategy: any[];
    bibliographies: any[];
    attached_project: any[];
    convention_id: number | null;
    school_period_id: number | null;
    beneficiary_institution_id: number | null;
    career_id: number | null;
    sub_line_investigation_id: number | null;
    authorized_by: number | null;
    made_by: number | null;
    approved_by: number | null;
    catalogue_id: number | null;
    state_id: number | null;
    stateTwo_id: number | null;
    frequency_id: number | null;
}
