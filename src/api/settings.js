import request from './request'

export const settingsApi = {
  // 获取用户设置
  getSettings() {
    return request({
      url: '/settings',
      method: 'GET'
    })
  },

  // 更新用户设置
  updateSettings(data) {
    return request({
      url: '/settings',
      method: 'PUT',
      data
    })
  },
}

