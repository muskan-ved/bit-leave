type leavesbyOrg = {
  fullname: string
  department: string
  excessDays: number
}

type leavesbyDepartment = {
  department: string
  averageExcessDays: number
}

type vitals = {
  averageSalary: number
  totalLeaveLiabilities: number
  headCount:number,
  leaveMobilised:number
}

type leaveDetails = {
  totalDays: number
  cashoutValue: number
  excessDays: number
  valueText: string
  canCashoutLeave : boolean
}

type profile = {
  id: number,
  fullname: string,
  onboarded: boolean,
  hrisLogin: string,
  managerName: string,
  avatar:string,
  department: string,
  jobtitle:string,
  country:string,
  role:number,
}

type directReport = {
  fullname: string,
  department: string,
  excessDays: number,
}

type orgs = {
  id: string,
  name: string,
}

export type employeeType = {
  avatar: string,
  firstname: string,
  lastname: string,
  email: string,
  role: number,
  department: string,
  country: string,
  fullname: string,
  jobtitle: string,
  onboarded: boolean,
  id: string,
  orgs: Array<orgs>,
  pages : Array<pages>,
}

type pages = {
  name: string,
  category: string,
  data: {} | [],
}

