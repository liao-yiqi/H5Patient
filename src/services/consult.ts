import type {
  KnowledgePage,
  KnowledgeType,
  DoctorPage,
  FollowType,
  DeptList,
  Image,
  ConsultOrderPreParams,
  ConsultOrderPreData
} from "@/types/consult";
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

//关注操作
export const followOrUnfollow = (id: string, type: FollowType = "doc") =>
  request("/like", "POST", { id, type });

// 获取所有科室
export const getAllDep = () => request<DeptList>("/dep/all");

/**
 * 上传图片
 */
export const upLoadImgae = (fileData: File) => {
  const fd = new FormData();
  fd.append("file", fileData);
  return request<Image>("/upload", "post", fd);
};
/**
 * 拉去预支付信息
 */
export const getConsultOrderPre = (params: ConsultOrderPreParams) => {
  return request<ConsultOrderPreData>("/patient/consult/order/pre", "GET", params);
};
