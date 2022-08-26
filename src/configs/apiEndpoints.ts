export const BASE_URL = "https://api.bitleave.co/";

export default {
  loadOrganisation:`${BASE_URL}organisations/`,
  uploadCSVToS3:`${BASE_URL}employees/syncOrg`,
  cashoutActionApproval:`${BASE_URL}employeeactions/`,
  handleRegister:`${BASE_URL}checkorganisations`,
  updateTemplateData:`${BASE_URL}organisations/templates`,
  postEmployeeOnboarding:`${BASE_URL}employees/onboarding`,
  postEmployeeCashout:`${BASE_URL}employeeactions/cashout`,
  calculateEmployeeCashout:`${BASE_URL}employeeactions/calculate`,
  getCashOutContract:`${BASE_URL}employeeactions/cashoutcontract`,
  loadEmployee:`${BASE_URL}employees/`,
  listEmployee:`${BASE_URL}employees/list`,
  postOrgOnboarding:`${BASE_URL}organisations/onboarding`,
  updateThresholds:`${BASE_URL}organisations/thresholds`
}