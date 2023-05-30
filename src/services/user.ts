import type { CodeType, User } from "@/types/user";
import { request } from "@/utils/request";
//密码登录
export const loginByPassword = (mobile: string, password: string) => {
  return request<User>("/login/password", "post", { mobile, password });
};
//发送验证码
export const sendMobileCode = (mobile: string, type: CodeType) => {
  return request<{ code: string }>("/code", "get", { mobile, type });
};
