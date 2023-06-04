import { ConsultType, IllnessTime } from "@/enums";

// 发请求时, 知识列表字面量类型
export type KnowledgeType = "like" | "recommend" | "fatReduction" | "food";

// 知识列表相关
export interface Knowledge {
  commentNumber: number;
  likeFlag: 0 | 1;
  creatorName: string;
  creatorAvatar: string;
  creatorTitles: string;
  creatorHospatalName: string;
  creatorDep: string;
  hospatalGrade: string;
  id: string;
  content: string;
  coverUrl: string[];
  creatorId: string;
  title: string;
  topic: string;
  collectionNumber: string;
}

export type KnowledgeList = Knowledge[];

export interface KnowledgePage {
  rows: KnowledgeList;
  total: number;
  pageTotal: number;
}

// 医生卡片对象
export type Doctor = {
  /** 医生ID */
  id: string;
  /** 医生名称 */
  name: string;
  /** 头像 */
  avatar: string;
  /** 医院名称 */
  hospitalName: string;
  /** 医院等级 */
  gradeName: string;
  /** 科室 */
  depName: string;
  /** 职称 */
  positionalTitles: string;
  /** 是否关注，0 未关注 1 已关注 */
  likeFlag: 0 | 1;
  /** 接诊服务费 */
  serviceFee: number;
  /** 接诊人数 */
  consultationNum: number;
  /** 评分 */
  score: number;
  /** 主攻方向 */
  major: string;
};

// 医生列表
export type DoctorList = Doctor[];

// 医生分页
export type DoctorPage = {
  pageTotal: number;
  total: number;
  rows: DoctorList;
};

// 关注的类型，医生|文章|百科话题|疾病
export type FollowType = "doc" | "knowledge" | "topic" | "disease";

// 图片列表
export type Image = {
  /** 图片ID */
  id: string;
  /** 图片地址 */
  url: string;
};
// 问诊记录
export type Consult = {
  /** 问诊记录ID */
  id: string;
  /** 问诊类型 */
  type: ConsultType;
  /** 快速问诊类型，0 普通 1 三甲 */
  illnessType: 0 | 1;
  /** 科室ID */
  depId: string;
  /** 疾病描述 */
  illnessDesc: string;
  /** 疾病持续时间 */
  illnessTime: IllnessTime;
  /** 是否就诊过，0 未就诊过  1 就诊过 */
  consultFlag: 0 | 1;
  /** 图片数组 */
  pictures: Image[];
  /** 患者ID */
  patientId: string;
  /** 优惠券ID */
  couponId: string;
};
// 问诊记录-全部可选
export type PartialConsult = Partial<Consult>;
// Required 转换为全部必须   Partial 转换问全部可选  两个内置的泛型类型
