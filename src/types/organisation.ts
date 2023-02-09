

export type organisation = {
  id:number|null,
  name:string|null,
  onboard_date:Date|null,
  active:boolean|false,
  exit_date:Date|null,
}

export type payrollType = {
  Payroll : string|null,
  tenantName: string|null,
  payrollTenantId : string|null,
};
