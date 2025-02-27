import { AppConfig } from '../config/AppConfig';

// API Endpoints Enum based on actual usage
export enum TamilCommunityApi {

  // Account APIs
  SIGNUP = "/api/Account/Signup",
  CONFIRM_EMAIL = "/api/Account/ConfirmEmail",
  LOGIN = "/api/Account/login",
  RESEND_VERIFICATION = "/api/Account/resend-verification-email",
  FORGOT_PASSWORD = "/api/Account/forgot-password",
  RESEND_FORGOT_PASSWORD = "/api/Account/ReSend-forgot-password",
  RESET_PASSWORD = "/api/Account/ResetPassword",
  GET_USER_CODES = "/api/Account/GetUserCodes",

  // Aid APIs
  ADD_BASIC_AID = "/api/Aid/AddBasicAid",
  ADD_DETAIL_AID = "/api/Aid/AddDetailAid",
  UPDATE_BASIC_AID = "/api/Aid/UpdateBasicAid",
  UPDATE_DETAIL_AID = "/api/Aid/UpdateDetailAid",
  GET_BASIC_AID_BY_USER_ID = "/api/Aid/GetBasicAidByUserId",
  GET_BASIC_AID_FOR_SOMEONE_BY_USER_ID = "/api/Aid/GetBasicAidForSomeoneByUserId",
  GET_DETAIL_AID_BY_USER_ID = "/api/Aid/GetDetailAidByUserId",
  GET_BASIC_AID_FOR_SOMEONE_BY_REQUEST_ID = "/api/Aid/GetBasicAidForSomeoneByRequestId",
  GET_BASIC_AID_BY_REQUEST_ID = "/api/Aid/GetBasicAidByRequestId",
  ADD_BASIC_AID_SOMEONE = "/api/Aid/AddBasicAidSomeone",
  ADD_DETAIL_AID_SOMEONE = "/api/Aid/AddDetailAidSomeone",
  CANCEL_AID_REQUEST = "/api/Aid/CancelAidRequest",
  CANCEL_AID_REQUEST_SOMEONE = "/api/Aid/CancelAidRequestSomeone",
  UPLOAD_RECORDING = "/api/Aid/UploadRecording",


  // BasicDetails APIs
  ADD_BASIC_DETAILS = "/api/BasicDetails/Add",
  GET_BASIC_DETAILS_BY_USER_ID = "/api/BasicDetails/GetByUserId",

  // NonMember APIs
  ADD_NON_MEMBER_DETAILS = "/api/NonMember/AddNonMemberDetails",
  GET_USER_CODES_BY_USER_ID = "/api/NonMember/GetUserCodesByUserId",
}

