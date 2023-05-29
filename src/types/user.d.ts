//用户信息
export interface User {
  /** token令牌 */
  token: string;
  refshToken: string;
  /** 用户ID */
  id: string;
  /** 用户名称 */
  account: string;
  /** 手机号 */
  mobile: string;
  /** 头像 */
  avatar: string;
}
