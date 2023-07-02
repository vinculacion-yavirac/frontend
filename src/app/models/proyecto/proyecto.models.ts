import { ResponsibleModels } from "../Responsable/responsable.models";
import { User } from "../auth/users/usuario";
import { CatalogoModels } from "../catalogo/catalogo.models";
import { InstitucionBeneficiariaModels } from "../institucion-beneficiaria/institucion-beneficiaria.models";
import { CareerModels } from "../../shared/comboboxes/carrera/career.models";
import { PeriodosEscolaresModels } from "../periodos-escolares/periodos-escolares.models";
import { InstituteModels } from "src/app/shared/comboboxes/instituto/institute.models";

export interface ProyectoModels {

  id: number;
  //GeneralData
  code: string;
  name: string;
  school_period_id: PeriodosEscolaresModels;
  beneficiary_institution_id: InstitucionBeneficiariaModels;
  institute_id: InstituteModels;
  career_id: CareerModels;
  term_execution: string;
  coverage: string;
  modality: string;
  financing: number;
  start_date: Date;
  end_date: Date;
  field: string;
  linking_activity: {
    diaria: boolean,semanal: boolean,quincenal: boolean,mensual: boolean,correos: boolean,pvpij: boolean,pcc: boolean,pvc: boolean,
    investigacion: boolean,acuerdo: boolean,otros: boolean,educacion: boolean,salud: boolean,sa: boolean,ap: boolean,agyp: boolean,
    vivienda: boolean,pma: boolean,rne: boolean,tcv: boolean,desarrolloU: boolean,turismo: boolean,cultura: boolean,dic: boolean,
    deportes: boolean,jys: boolean,ambiente: boolean,dsyc: boolean,ia: boolean,ig: boolean,desarrolloL: boolean,epys: boolean,
    dtyt: boolean,inovacion: boolean,rsu: boolean,matrizP: boolean,otros2: boolean
  };
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
  sub_line_investigation_id: number | null;
  authorized_by: ResponsibleModels;
  made_by: ResponsibleModels;
  approved_by: ResponsibleModels;
  catalogue_id: number | null;
  state_id: number | null;
  state_two_id:CatalogoModels;
  frequency_id: number | null;
  archived: boolean;
  archived_at: Date;
  archived_by: User;
  created_by: User;
  created_at: Date;
  updated_at: Date;

}

/*id: number;
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
    beneficiary_institution_id: InstitucionBeneficiariaModels;
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
    updated_at: Date;*/
