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
  headCount:number
}

type leaveDetails = {
  totalDays: number
  cashoutValue: number
  excessDays: number
  valueText: string
}

type profile = {
  id: number,
  fullname: string,
  onboarded: boolean,
  hrisLogin: string,
  managerName: string
  department: string
}

type directReport = {
  fullname: string,
  department: string,
  excessDays: number,
}

export type employeeType = {
  id: number
  profile: profile
  leaveDetails: leaveDetails
  leavesByOrg: Array<leavesbyOrg>
  leavesByDepartment: Array<leavesbyDepartment>
  directReports: Array<directReport>
  vitals: vitals
}
