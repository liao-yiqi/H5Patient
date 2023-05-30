//用户信息
export interface User {
  /** token令牌 */
  token: string;
  refreshToken: string;
  /** 用户ID */
  id: string;
  /** 用户名称 */
  account: string;
  /** 手机号 */
  mobile: string;
  /** 头像 */
  avatar: string;
}
// 短信验证码类型，登录|注册|修改手机号|忘记密码|绑定手机号
export type CodeType = "login" | "register" | "changeMobile" | "forgetPassword" | "bindMobile";
// 个人中心获取数据的类型
export interface UserInfo {
  couponNumber: number;
  score: number;
  likeNumber: number;
  collectionNumber: number;
  account: string;
  avatar: string;
  id: string;
  mobile: string;
  consultationInfo: any[];
  orderInfo: {
    paidNumber: number;
    receivedNumber: number;
    shippedNumber: number;
    finishedNumber: number;
  };
}
