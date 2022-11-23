export type OnboardingType = {
  employeeAwardType: string,
  thresholdLeaveNotification: number|null,
  thresholdLeaveWarning: number|null,
  thresholdPayoutFrequency: number|null,
  email: string,
  payrollEmail: string,
  payrollLink: string,
  approval: string,
  signature: string
}

export type OnBoardingStore = {
  compliance: string,
  leaveNotification: number|null,
  leaveWarning: number|null,
  maxPayout: number|null,
  email: string,
  payrollEmail: string,
  payrollLink: string,
  approval: string,
  signature: string,
  success: boolean,
  isLoading: boolean,
  onboardingDone:boolean|false
}
