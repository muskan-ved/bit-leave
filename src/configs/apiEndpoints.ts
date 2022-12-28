export const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}`;
export const APP_URL =  `${process.env.NEXT_PUBLIC_APP_URL}`;
export const ORG_URL =  `${process.env.NEXT_PUBLIC_ORG_URL}`;

export default {
  handleRegister:`${BASE_URL}${process.env.NEXT_PUBLIC_HANDLE_REGISTER}`,
  
  loadOrganisation:`${BASE_URL}${process.env.NEXT_PUBLIC_LOAD_ORGANISATION}`,
  uploadCSVToS3:`${BASE_URL}${process.env.NEXT_PUBLIC_UPLOAD_CSV_TO_S3}`,
  cashoutActionApproval:`${BASE_URL}${process.env.NEXT_PUBLIC_CASHOUT_ACTION_APPROVAL}`,
  updateTemplateData:`${BASE_URL}${process.env.NEXT_PUBLIC_UPDATE_TEMPLATE_DATA}`,
  postEmployeeOnboarding:`${BASE_URL}${process.env.NEXT_PUBLIC_POST_EMPLOYEE_ONBOARDING}`,
  postEmployeeCashout:`${BASE_URL}${process.env.NEXT_PUBLIC_POST_EMPLOYEE_CASHOUT}`,
  calculateEmployeeCashout:`${BASE_URL}${process.env.NEXT_PUBLIC_CALCULATE_EMPLOYEE_CASHOUT}`,
  getCashOutContract:`${BASE_URL}${process.env.NEXT_PUBLIC_GET_CASHOUT_CONTRACT}`,
  loadEmployee:`${BASE_URL}${process.env.NEXT_PUBLIC_LOAD_EMPLOYEE}`,
  listEmployee:`${BASE_URL}${process.env.NEXT_PUBLIC_LIST_EMPLOYEE}`,
  postOrgOnboarding:`${BASE_URL}${process.env.NEXT_PUBLIC_POST_ORG_ONBOARDING}`,
  updateThresholds:`${BASE_URL}${process.env.NEXT_PUBLIC_UPDATE_THRESHOLDS}`,
  xeroReturnUrl: `${BASE_URL}${process.env.NEXT_PUBLIC_XERO_RETURN_URL}`,
  xeroConnectionUrl:  `${BASE_URL}${process.env.NEXT_PUBLIC_XERO_CONNECTION_URL}`,
  roleManage:`${BASE_URL}${process.env.NEXT_PUBLIC_ROLE_MANAGE}`,
  roleUpdate:`${BASE_URL}${process.env.NEXT_PUBLIC_ROLE_UPDATE}`,
  getNotification:`${BASE_URL}${process.env.NEXT_PUBLIC_GET_NOTIFICATION}`,
  setupPost:`${BASE_URL}${process.env.NEXT_PUBLIC_SET_UP_POST}`,
  uploadActionApproval:`${BASE_URL}${process.env.NEXT_PUBLIC_UPLOAD_ACTION_APPROVAL}`,
  uploadProfileAvatar:`${BASE_URL}${process.env.NEXT_PUBLIC_UPLOAD_EMPLOYEE_PROFILE}`,
  allEmployeeList:`${BASE_URL}${process.env.NEXT_PUBLIC_ALL_EMPLOYEE_LIST}`,
  organisationOrgView:`${BASE_URL}${process.env.NEXT_PUBLIC_ORG_VIEW}`,
}