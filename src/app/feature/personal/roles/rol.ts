import { Person } from "../persona/persona";
import { Permission } from "./permisos/permiso";
export interface Role {
  id: number;
  name: string;

  permissions: Permission[];

  active: boolean;
  archived: boolean;
  archived_at: Date;
  archived_by: Person;

  created_at: Date;
  updated_at: Date;
}
