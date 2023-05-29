import { Person } from "../persona/persona";
import { Role } from "../role/rol";

export interface User {
  id: number;
  email: string;
  password: string;

  person: Person;
  role: Role;

  active: number;
  archived: boolean;
  archived_at: Date;
  archived_by: Person;

  created_at: Date;
  updated_at: Date;
}
