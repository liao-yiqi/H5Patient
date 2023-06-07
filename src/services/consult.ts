import type {
  KnowledgePage,
  KnowledgeType,
  DoctorPage,
  FollowType,
  DeptList,
  Image,
  ConsultOrderPreParams,
  ConsultOrderPreData,
  PartialConsult,
  ConsultOrderItem
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

// 生成订单
export const createConsultOrder = (data: PartialConsult) => {
  return request<{ id: string }>("/patient/consult/order", "POST", data);
};

// 获取支付地址  0 是微信  1 支付宝
export const getConsultOrderPayUrl = (params: {
  paymentMethod: 0 | 1;
  orderId: string;
  payCallback: string;
}) => {
  return request<{ payUrl: string }>("/patient/consult/pay", "POST", params);
};

export const getConsultOrderDetail = (orderId: string) =>
  request<ConsultOrderItem>("/patient/consult/order/detail", "GET", { orderId });
