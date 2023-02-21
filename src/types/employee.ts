
export type employeeCashOut = {
  cashoutdays: number | null,
  cashoutreason: string,
  signature:string|null
}

export type employee = {
  avatar: string | null,
  firstname: string | null,
  lastname: string | null,
  email: string | null,
  role: number | null,
  department: string | null,
  country: string | null,
  fullname: string | null,
  jobtitle: string | null,
  onboarded: boolean | false,
  id: string | null,
  orgs: Array<orgs> | null,
  pages : Array<pages>,
  cashoutOption:cashoutOption | null,

}

type pages = {
  name: string,
  category: string,
  data: {} | [],
}

export type scenariosAnalytics = {
  Headcount: number,
  AverageSalary:number
}

export type orgs = {
  id: string | null,
  name: string | null,
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

