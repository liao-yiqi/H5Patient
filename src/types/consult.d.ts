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
  id: string;
  // 枚举
  type: ConsultType;
  // 病人id
  patientId: string;
  // 病情描述
  illnessDesc: string;
  // 以下两个选项只有 0 或 1
  // 问诊医院类型
  illnessType: 0 | 1;
  // 是否就诊过
  consultFlag: 0 | 1;
  // 医生 id
  docId: string;
  // 优惠券 id
  couponId: string;
  // 科室 id
  depId: string;
  // 药品列表
  medicines: Medicine[];
  // 上传图片
  pictures: Image[];
  // 枚举
  illnessTime: IllnessTime;
};
// 问诊记录-全部可选
// Required 转换为全部必须   Partial 转换问全部可选  两个内置的泛型类型
// 常用泛型工具复习 Partial 全部可选, Required 全部必填, Pick 选中其中一些属性, Omit 删除其中一些属性
export type PartialConsult = Partial<Consult>;
// 表单数据类型
export type ConsultIllness = Pick<
  PartialConsult,
  "illnessDesc" | "illnessTime" | "consultFlag" | "pictures"
>;
// 科室
export type Department = {
  /** 科室ID */
  id: string;
  /** 科室名称 */
  name: string;
  child?: {
    id: string;
    name: string;
  }[];
};
//科室列表
export type DeptList = Department[];
