export enum CreateUserFields {
  Role = 'role',
  FirstName = 'firstName',
  LastName = 'lastName',
  Email = 'email',
  Positions = 'positions',
  DateEmployment = 'dateEmployment',
  Phone = 'phone',
  SalaryInfo = 'salaryInfo',
  Password = 'password',
  UserName = 'username',
  Confirmed = 'confirmed',
}

export type UserProps = {
  onToggleForm: () => void;
};
