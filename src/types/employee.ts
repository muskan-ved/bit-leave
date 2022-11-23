
export type employeeCashOut = {
  cashoutdays: number | null,
  cashoutreason: string,
  signature:string|null
}

export type employee = {
  profile: profile | null,
  team: team | null,
  leaveDetail: leaveDetail | null,
  cashoutOption: cashoutOption | null,
  vitals: vitals | null,
  employeeDetail : employeeDetail | null
}

export type employeeDetail ={
  data : any | null
}

export type profile = {
  id: number | null,
  fullname: string | null,
  onboarded: boolean | false,
}

export type team = {
  department: string | null,
  managerName: string | null
}

export type leaveDetail = {
  excessDays: number | null,
  cashoutValue: string | null,
  valueText: string | null
}

export type cashoutOption = {
  daysAvailable: number | null,
  cashoutAmount: number | null,
  hourlyRate: number | null
}

export type vitals = {
  averageSalary: number | null
}

