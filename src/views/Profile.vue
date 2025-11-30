<template>
  <div>
    <Navbar />
    
    <main class="container my-5">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card shadow">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0"><i class="bi bi-person-circle"></i> 个人资料</h5>
            </div>
            <div class="card-body p-4">
              <!-- 头像设置 -->
              <div class="mb-4 text-center">
                <div class="position-relative d-inline-block mb-3">
                  <img 
                    :src="user?.avatar || '/uploads/avatars/default.png'" 
                    class="rounded-circle border" 
                    style="width: 120px; height: 120px; object-fit: cover;"
                    alt="User Avatar"
                  >
                  <label for="avatar-upload" class="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2 cursor-pointer" style="cursor: pointer;" title="更换头像">
                    <i class="bi bi-camera-fill"></i>
                  </label>
                  <input 
                    type="file" 
                    id="avatar-upload" 
                    class="d-none" 
                    accept="image/*"
                    @change="handleAvatarUpload"
                  >
                </div>
                <p class="text-muted small">点击相机图标更换头像 (最大2MB)</p>
              </div>

              <hr />

              <!-- 基本信息 -->
              <div class="mb-4">
                <h6 class="text-muted mb-3">基本信息</h6>
                <div class="row mb-3">
                  <label class="col-sm-3 col-form-label">用户名</label>
                  <div class="col-sm-9">
                    <input type="text" class="form-control" :value="user?.username" disabled />
                  </div>
                </div>
                <div class="row mb-3">
                  <label class="col-sm-3 col-form-label">邮箱</label>
                  <div class="col-sm-9">
                    <input type="email" class="form-control" v-model="profileData.email" />
                  </div>
                </div>
                <div class="row mb-3">
                  <label class="col-sm-3 col-form-label">注册时间</label>
                  <div class="col-sm-9">
                    <input type="text" class="form-control" :value="formatDateTime(user?.createTime)" disabled />
                  </div>
                </div>
                <div class="text-end">
                  <button class="btn btn-primary" @click="updateProfile" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="bi bi-check"></i>
                    保存修改
                  </button>
                </div>
              </div>

              <hr />

              <!-- 提醒设置 -->
              <div class="mb-4">
                <h6 class="text-muted mb-3"><i class="bi bi-bell"></i> 提醒设置</h6>
                <div class="row mb-3">
                  <label class="col-sm-3 col-form-label">闲置时间阈值</label>
                  <div class="col-sm-9">
                    <div class="input-group">
                      <input 
                        type="number" 
                        class="form-control" 
                        v-model.number="settingsData.inactiveMinutes"
                        min="1"
                        max="10080"
                        placeholder="分钟"
                      />
                      <span class="input-group-text">分钟</span>
                    </div>
                    <small class="text-muted">超过此时间未打卡算闲置（1-10080分钟，即1分钟到7天）</small>
                  </div>
                </div>
                <div class="row mb-3">
                  <label class="col-sm-3 col-form-label">提醒间隔</label>
                  <div class="col-sm-9">
                    <div class="input-group">
                      <input 
                        type="number" 
                        class="form-control" 
                        v-model.number="settingsData.reminderIntervalMinutes"
                        min="1"
                        max="10080"
                        placeholder="分钟"
                      />
                      <span class="input-group-text">分钟</span>
                    </div>
                    <small class="text-muted">闲置后每隔多久提醒一次（1-10080分钟，即1分钟到7天）</small>
                  </div>
                </div>
                <div class="text-end">
                  <button class="btn btn-primary" @click="updateSettings" :disabled="settingsLoading">
                    <span v-if="settingsLoading" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="bi bi-check"></i>
                    保存设置
                  </button>
                </div>
              </div>

              <hr />

              <!-- 修改密码 -->
              <div class="mb-4">
                <h6 class="text-muted mb-3">修改密码</h6>
                <form @submit.prevent="changePassword">
                  <div class="row mb-3">
                    <label class="col-sm-3 col-form-label">原密码</label>
                    <div class="col-sm-9">
                      <input
                        type="password"
                        class="form-control"
                        v-model="passwordData.oldPassword"
                        required
                      />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label class="col-sm-3 col-form-label">新密码</label>
                    <div class="col-sm-9">
                      <input
                        type="password"
                        class="form-control"
                        v-model="passwordData.newPassword"
                        minlength="6"
                        required
                      />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label class="col-sm-3 col-form-label">确认新密码</label>
                    <div class="col-sm-9">
                      <input
                        type="password"
                        class="form-control"
                        v-model="passwordData.confirmPassword"
                        required
                      />
                    </div>
                  </div>
                  <div class="text-end">
                    <button type="submit" class="btn btn-warning" :disabled="passwordLoading">
                      <span v-if="passwordLoading" class="spinner-border spinner-border-sm me-2"></span>
                      <i v-else class="bi bi-key"></i>
                      修改密码
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import { useUserStore } from '../stores/user'
import { userApi } from '../api/user'
import { settingsApi } from '../api/settings'
import { showToast } from '../utils/toast'
import { formatDateTime } from '../utils/format'

const userStore = useUserStore()
const user = computed(() => userStore.user)

const loading = ref(false)
const passwordLoading = ref(false)
const settingsLoading = ref(false)

const profileData = reactive({
  email: ''
})

const passwordData = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const settingsData = reactive({
  inactiveMinutes: 3,
  reminderIntervalMinutes: 60
})

onMounted(() => {
  if (user.value) {
    profileData.email = user.value.email || ''
  }
  loadSettings()
})

async function loadSettings() {
  try {
    const result = await settingsApi.getSettings()
    if (result && result.code === 200 && result.data) {
      settingsData.inactiveMinutes = result.data.inactiveMinutes || 3
      settingsData.reminderIntervalMinutes = result.data.reminderIntervalMinutes || 60
    }
  } catch (error) {
    console.error('加载设置失败:', error)
  }
}

async function updateSettings() {
  if (!settingsData.inactiveMinutes || settingsData.inactiveMinutes < 1 || settingsData.inactiveMinutes > 10080) {
    showToast('闲置时间必须在1-10080分钟之间', 'error')
    return
  }
  if (!settingsData.reminderIntervalMinutes || settingsData.reminderIntervalMinutes < 1 || settingsData.reminderIntervalMinutes > 10080) {
    showToast('提醒间隔必须在1-10080分钟之间', 'error')
    return
  }

  settingsLoading.value = true
  
  try {
    const result = await settingsApi.updateSettings({
      inactiveMinutes: settingsData.inactiveMinutes,
      reminderIntervalMinutes: settingsData.reminderIntervalMinutes
    })
    if (result && result.code === 200) {
      showToast('设置更新成功', 'success')
    } else {
      showToast(result?.message || '更新失败', 'error')
    }
  } catch (error) {
    console.error('更新设置失败:', error)
    showToast('更新失败', 'error')
  } finally {
    settingsLoading.value = false
  }
}

async function handleAvatarUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  // Validate file type and size
  if (!file.type.startsWith('image/')) {
    showToast('请选择图片文件', 'error')
    return
  }
  
  if (file.size > 2 * 1024 * 1024) {
    showToast('图片大小不能超过2MB', 'error')
    return
  }

  const formData = new FormData()
  formData.append('file', file)

  try {
    const result = await userApi.uploadAvatar(formData)
    if (result && result.code === 200) {
      showToast('头像上传成功', 'success')
      // Update user store to reflect new avatar
      await userStore.checkLoginStatus()
    } else {
      showToast(result?.message || '上传失败', 'error')
    }
  } catch (error) {
    console.error('上传头像失败:', error)
    showToast('上传失败', 'error')
  }
}

async function updateProfile() {
  loading.value = true
  
  try {
    const result = await userApi.updateProfile(profileData)
    if (result && result.code === 200) {
      showToast('资料更新成功', 'success')
      await userStore.checkLoginStatus()
    } else {
      showToast(result?.message || '更新失败', 'error')
    }
  } catch (error) {
    console.error('更新资料失败:', error)
    showToast('更新失败', 'error')
  } finally {
    loading.value = false
  }
}

async function changePassword() {
  if (passwordData.newPassword !== passwordData.confirmPassword) {
    showToast('两次输入的密码不一致', 'error')
    return
  }

  passwordLoading.value = true
  
  try {
    const result = await userApi.changePassword(
      passwordData.oldPassword,
      passwordData.newPassword
    )
    
    if (result && result.code === 200) {
      showToast('密码修改成功，请重新登录', 'success')
      
      // 清空表单
      passwordData.oldPassword = ''
      passwordData.newPassword = ''
      passwordData.confirmPassword = ''
      
      // 登出并跳转到登录页
      setTimeout(() => {
        userStore.logout()
        window.location.href = '/login'
      }, 1500)
    } else {
      showToast(result?.message || '修改失败', 'error')
    }
  } catch (error) {
    console.error('修改密码失败:', error)
    showToast('修改失败', 'error')
  } finally {
    passwordLoading.value = false
  }
}
</script>

