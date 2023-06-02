import type { KnowledgePage, KnowledgeType } from "@/types/consult";
import { request } from "@/utils/request";

// 获取知识列表
export const getKnowledgeList = (options: {
  current: number;
  pageSize: number;
  type: KnowledgeType;
}) => {
  return request<KnowledgePage>("/patient/home/knowledge", "get", {
    current: options.current,
    pageSize: options.pageSize,
    type: options.type
  });
};
