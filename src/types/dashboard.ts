type leavesbyOrg = {
  fullname: string
  department: string
  excessDays: number
}

type leavesbyDepartment = {
  department: string
  averageExcessDays: number
}

type team = {
  name: string
  department: string
}

type vitals = {
  averageSalary: number
  totalLeaveLiabilities: number
  headcount:number
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
}

type directReport = {
  fullname: string,
  department: string,
  excessDays: number
}

export type employee = {
  id: number
  profile: profile
  leaveDetails: leaveDetails
  leavesByOrg: Array<leavesbyOrg>
  leavesByDepartment: Array<leavesbyDepartment>
  directReports: Array<directReport>
  team: team
  vitals: vitals
}
