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
