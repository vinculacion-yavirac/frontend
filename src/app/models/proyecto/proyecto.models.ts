import { ResponsibleModels } from "../Responsable/responsable.models";
import { User } from "../auth/users/usuario";
import { CatalogoModels } from "../catalogo/catalogo.models";
import { InstitucionBeneficiariaModels } from "../institucion-beneficiaria/institucion-beneficiaria.models";
import { CareersModel } from "./careers.model";


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
    beneficiary_institution_id: InstitucionBeneficiariaModels | null;
    career_id: CareersModel;
    sub_line_investigation_id: number | null;
    authorized_by:ResponsibleModels;
    made_by:ResponsibleModels;
    approved_by: ResponsibleModels;
    catalogue_id: CatalogoModels;
    state_id: number | null;
    state_two_id:CatalogoModels;
    frequency_id: number | null;
    created_by: User;
    archived: boolean;
    archived_at: Date;
    archived_by: User;
    created_at: Date;
    updated_at: Date;
}
