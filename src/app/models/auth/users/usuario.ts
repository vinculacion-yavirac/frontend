import { Person } from "../persona/persona";
import { Role } from "../role/rol";

export interface User {
  value: any;
  id: number;
  email: string;
  password: string;
  person: Person;
  role: Role;

  active: number;
  archived: boolean;
  archived_at: Date;
  archived_by: Person;
  names: Person;
  last_names: Person;

  created_at: Date;
  updated_at: Date;
  [key: string]:any;
}
