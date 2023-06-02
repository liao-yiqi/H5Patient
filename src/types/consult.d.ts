// 发请求时, 知识列表字面量类型
export type KnowledgeType = "like" | "recommend" | "fatReduction" | "food";

// 知识列表相关
export interface Knowledge {
  commentNumber: number;
  likeFlag: number;
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
