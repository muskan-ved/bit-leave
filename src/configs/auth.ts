export const BASE_URL = "https://api.bitleave.co/";

export default {
  meEndpoint: '/auth/me',
  loginEndpoint: '/jwt/login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  userPoolId : 'ap-southeast-2_mRYNJLXqc',
  userPoolAppClientId :'1lia28gqdv6mtefdj1lh36juu1',
  region:'ap-southeast-2',
  bucket_name:'bl-bck-process-upload',
  accessKeyId:'AKIAYPANZ4CMMK3LXE5B',
  secretAccessKey:'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',

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
