export const BASE_URL = "https://app-stag.api.bitleave.co/api/v1"; 
export const APP_URL = "https://app-stag.bitleave.co";
export const ORG_URL = "https://app-stag.api.bitleave.co"

export default {
  handleRegister:`${ORG_URL}/checkorganisations`,
  
  loadOrganisation:`${BASE_URL}/organisation/me`,
  uploadCSVToS3:`${BASE_URL}/employees/SyncOrg`,
  cashoutActionApproval:`${BASE_URL}/employeeactions/`,
  updateTemplateData:`${BASE_URL}/organisation/template`,
  postEmployeeOnboarding:`${BASE_URL}/employees/onboarding`,
  postEmployeeCashout:`${BASE_URL}/employeeactions/cashout`,
  calculateEmployeeCashout:`${BASE_URL}/employeeactions/calculate`,
  getCashOutContract:`${BASE_URL}/employeeactions/cashoutcontract`,
  loadEmployee:`${BASE_URL}/employees/me`,
  listEmployee:`${BASE_URL}/employees/list`,
  postOrgOnboarding:`${BASE_URL}/organisation/onboarding`,
  updateThresholds:`${BASE_URL}/organisation/threshold`,
  xeroReturnUrl: `${BASE_URL}/organisation/xeroConnect`,
  xeroConnectionUrl:  `${BASE_URL}/organisation/xerogetconnection`,
  roleManage:`${BASE_URL}/employees/allbyRoles`,
  roleUpdate:`${BASE_URL}/employees/roles`,
  getNotification:`${BASE_URL}/employees/me/notifications`,
  setupPost:`${BASE_URL}/organisation/leave`,
}