import { ParroquiaModels } from "src/app/models/parroquia/parroquia.models";

export interface InstituteModels {
    id: number,
    number_resolution: string,
    name: string,
    logo: string,
    state: Boolean,
    place_location: string,
    email: string,
    phone: string,
    parish_id: ParroquiaModels,
    created_at?: string;
    updated_at?: string;
}
