import request from "./request";

export const planApi = {
  // 生成学习计划
  generatePlan(data) {
    return request({
      url: "/plan/generate",
      method: "POST",
      data,
    });
  },

  // 获取计划列表
  getPlans() {
    return request({
      url: "/plan/list",
      method: "GET",
    });
  },

  // 获取计划详情
  getPlanDetail(planId) {
    return request({
      url: `/plan/${planId}`,
      method: "GET",
    });
  },

  // 获取今日任务
  getTodayTask(planId) {
    return request({
      url: `/plan/${planId}/today`,
      method: "GET",
    });
  },

  // 删除计划
  deletePlan(planId) {
    return request({
      url: `/plan/${planId}`,
      method: "DELETE",
    });
  },

  // 更新计划
  updatePlan(planId, data) {
    return request({
      url: `/plan/${planId}`,
      method: "PUT",
      data,
    });
  },
};
