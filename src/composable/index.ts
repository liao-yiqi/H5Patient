import { ref } from "vue";
import { followOrUnfollow } from "@/services/consult";
import type { FollowType } from "@/types/consult";

export const useFollow = (type: FollowType = "doc") => {
  const loading = ref(false);
  // {a, b} 类型，传值得时候 {a, b, c} 也可以，这是类型兼容：多的可以给少的
  const follow = async (item: { id: string; likeFlag: 0 | 1 }) => {
    loading.value = true;
    try {
      //修改关注状态
      await followOrUnfollow(item.id, type);
      //强制修改页面关注状态
      item.likeFlag = item.likeFlag === 1 ? 0 : 1;
    } finally {
      loading.value = false;
    }
  };
  return { loading, follow };
};
