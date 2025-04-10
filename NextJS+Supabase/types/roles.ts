import { Enums } from '@/types/database.types';

export enum ROLES {
  super_admin = 'super_admin',
  admin = 'admin',
  company_admin = 'company_admin',
  company_employee = 'company_employee',
  guest = 'guest'
}

export const rolesPermittedToInviteRole: {
  [key in Enums<'member_role'>]: Enums<'member_role'>[];
} = {
  super_admin: [
    ROLES.super_admin,
    ROLES.admin,
    ROLES.company_admin,
    ROLES.company_employee
  ], //can invite all roles
  admin: [ROLES.admin, ROLES.company_admin, ROLES.company_employee], // can invite company admin, company manager
  company_admin: [ROLES.company_employee], //can invite company manager
  company_employee: [], //can not invite
  guest: [] //can not invite
};

export enum UserRoleLabels {
  super_admin = 'Super Admin',
  admin = 'Admin',
  company_admin = "Company's Admin",
  company_employee = "Company's Employee",
  guest = 'Guest'
}
