import type { CodeType, User, UserInfo, PatientList, Patient } from "@/types/user";
import { request } from "@/utils/request";
//密码登录
export const loginByPassword = (mobile: string, password: string) => {
  return request<User>("/login/password", "post", { mobile, password });
};
//发送验证码
export const sendMobileCode = (mobile: string, type: CodeType) => {
  return request<{ code: string }>("/code", "get", { mobile, type });
};
//验证码登录
export const loginByCode = (mobile: string, code: string) => {
  return request<User>("/login", "post", { mobile, code });
};
//获取个人信息
export const getUserInfo = () => {
  return request<UserInfo>("/patient/myUser");
};
// 获取患者列表
export const getPatientList = () => {
  return request<PatientList>("/patient/mylist");
};
//添加患者
export const addPatient = (patien: Patient) => {
  return request("/patient/add", "post", patien);
};
// 编辑患者信息
export const editPatient = (patient: Patient) => request("/patient/update", "PUT", patient);
