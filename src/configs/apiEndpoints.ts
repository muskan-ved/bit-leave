export const BASE_URL = "https://app-dev.api.bitleave.co/api/v1"; 
export const APP_URL = "https://app-dev.bitleave.co";
export const ORG_URL = "https://app-dev.api.bitleave.co"

export default {
  handleRegister:`${ORG_URL}/checkorganisations`,
  
  loadOrganisation:`${BASE_URL}/organisation/`,
  uploadCSVToS3:`${BASE_URL}/employees/syncOrg`,
  cashoutActionApproval:`${BASE_URL}/employeeactions/`,
  updateTemplateData:`${BASE_URL}/organisation/templates`,
  postEmployeeOnboarding:`${BASE_URL}/employees/onboarding`,
  postEmployeeCashout:`${BASE_URL}/employeeactions/cashout`,
  calculateEmployeeCashout:`${BASE_URL}/employeeactions/calculate`,
  getCashOutContract:`${BASE_URL}/employeeactions/cashoutcontract`,
  loadEmployee:`${BASE_URL}/employees/`,
  listEmployee:`${BASE_URL}/employees/list`,
  postOrgOnboarding:`${BASE_URL}/organisation/onboarding`,
  updateThresholds:`${BASE_URL}/organisation/threshold`,
  xeroReturnUrl: `${BASE_URL}/organisation/xeroConnect`,
  xeroConnectionUrl:  `${BASE_URL}/organisation/xerogetconnection`
}