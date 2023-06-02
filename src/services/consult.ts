import type { KnowledgePage, KnowledgeType, DoctorPage } from "@/types/consult";
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

// 获取关注医生列表
export const getDoctorPage = (options: { current: number; pageSize: number }) =>
  request<DoctorPage>("/home/page/doc", "GET", {
    current: options.current,
    pageSize: options.pageSize
  });
