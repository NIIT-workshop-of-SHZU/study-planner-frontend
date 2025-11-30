<template>
  <div class="d-flex flex-column min-vh-100">
    <Navbar />
    
    <div class="container my-5 flex-grow-1">
      <!-- 页面标题 -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="bi bi-journal-text"></i> 我的学习计划</h2>
        <router-link to="/create-plan" class="btn btn-primary">
          <i class="bi bi-plus-lg"></i> 创建新计划
        </router-link>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2 text-muted">正在加载您的计划...</p>
      </div>

      <template v-else>
        <!-- 搜索和筛选区域 -->
        <div v-if="plans.length > 0" class="card mb-4">
          <div class="card-body">
            <div class="row g-3">
              <!-- 搜索框 -->
              <div class="col-md-6">
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-search"></i></span>
                  <input 
                    type="text" 
                    class="form-control" 
                    placeholder="搜索计划标题或目标..." 
                    v-model="searchKeyword"
                  />
                  <button 
                    v-if="searchKeyword" 
                    class="btn btn-outline-secondary" 
                    type="button"
                    @click="searchKeyword = ''"
                  >
                    <i class="bi bi-x"></i>
                  </button>
                </div>
              </div>
              <!-- 状态筛选 -->
              <div class="col-md-6">
                <div class="btn-group w-100" role="group">
                  <button 
                    type="button" 
                    :class="['btn', selectedStatus === '' ? 'btn-primary' : 'btn-outline-primary']"
                    @click="selectedStatus = ''"
                  >
                    <i class="bi bi-list-ul"></i> 全部
                  </button>
                  <button 
                    type="button" 
                    :class="['btn', selectedStatus === '进行中' ? 'btn-success' : 'btn-outline-success']"
                    @click="selectedStatus = '进行中'"
                  >
                    <i class="bi bi-play-circle"></i> 进行中
                  </button>
                  <button 
                    type="button" 
                    :class="['btn', selectedStatus === '已完成' ? 'btn-info' : 'btn-outline-info']"
                    @click="selectedStatus = '已完成'"
                  >
                    <i class="bi bi-check-circle"></i> 已完成
                  </button>
                </div>
              </div>
            </div>
            <!-- 筛选结果统计 -->
            <div v-if="selectedStatus || searchKeyword" class="mt-3 text-muted small">
              <i class="bi bi-funnel"></i> 
              显示 {{ filteredPlans.length }} / {{ plans.length }} 个计划
              <button 
                class="btn btn-link btn-sm p-0 ms-2" 
                @click="clearFilters"
              >
                清除筛选
              </button>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="plans.length === 0" class="empty-state">
          <i class="bi bi-journal-x"></i>
          <h4>还没有学习计划</h4>
          <p class="text-muted">创建您的第一个智能学习计划，让AI帮您规划学习路径</p>
          <router-link to="/create-plan" class="btn btn-primary btn-lg mt-3">
            <i class="bi bi-plus-lg"></i> 创建计划
          </router-link>
        </div>

        <!-- 筛选后无结果 -->
        <div v-else-if="filteredPlans.length === 0" class="empty-state">
          <i class="bi bi-search"></i>
          <h4>没有找到匹配的计划</h4>
          <p class="text-muted">请尝试调整搜索关键词或筛选条件</p>
          <button class="btn btn-primary btn-lg mt-3" @click="clearFilters">
            <i class="bi bi-x-circle"></i> 清除筛选
          </button>
        </div>

        <!-- 计划列表 -->
        <div v-else class="row">
          <div v-for="plan in filteredPlans" :key="plan.id" class="col-md-6 col-lg-4 mb-4">
          <div class="card plan-card h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="card-title mb-0">
                  <i v-if="isPinned(plan.id)" class="bi bi-pin-angle-fill text-warning me-1" title="已置顶"></i>
                  {{ plan.subject || plan.title }}
                </h5>
                <span :class="['badge', getStatusClass(plan.status)]">
                  {{ getStatusText(plan.status) }}
                </span>
              </div>
              <p class="card-text text-muted small">
                <i class="bi bi-calendar"></i> {{ formatDate(plan.createTime) }}
                <span class="ms-2"><i class="bi bi-clock"></i> {{ formatNumber(plan.duration || plan.totalDays || 0) }}天</span>
              </p>
              <div class="mb-3">
                <div class="d-flex justify-content-between small mb-1">
                  <span>学习进度</span>
                  <span>{{ formatNumber(plan.progress || 0) }}%</span>
                </div>
                <div class="progress">
                  <div class="progress-bar bg-success" :style="{ width: (plan.progress || 0) + '%' }"></div>
                </div>
              </div>
              <p class="card-text small">{{ truncateText(plan.goal || '暂无目标描述', 80) }}</p>
            </div>
            <div class="card-footer bg-transparent">
              <button class="btn btn-sm btn-outline-primary me-2" @click="viewDetail(plan.id)">
                <i class="bi bi-eye"></i> 查看详情
              </button>
              <button class="btn btn-sm btn-outline-secondary me-2" @click="openEditModal(plan)">
                <i class="bi bi-pencil"></i> 编辑
              </button>
              <button 
                :class="['btn', 'btn-sm', isPinned(plan.id) ? 'btn-warning' : 'btn-outline-warning', 'me-2']" 
                @click="togglePin(plan.id)"
                :title="isPinned(plan.id) ? '取消置顶' : '置顶'"
              >
                <i :class="isPinned(plan.id) ? 'bi bi-pin-angle-fill' : 'bi bi-pin-angle'"></i> 
                {{ isPinned(plan.id) ? '已置顶' : '置顶' }}
              </button>
              <button class="btn btn-sm btn-outline-danger" @click="deletePlan(plan.id)">
                <i class="bi bi-trash"></i> 删除
              </button>
            </div>
          </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Edit Modal -->
    <div class="modal fade" id="editPlanModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">编辑计划</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="planTitle" class="form-label">计划名称</label>
              <input type="text" class="form-control" id="planTitle" v-model="editingPlan.title">
            </div>
            <div class="mb-3">
              <label for="planGoal" class="form-label">学习目标</label>
              <textarea class="form-control" id="planGoal" rows="3" v-model="editingPlan.goal"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="savePlan">保存</button>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Modal } from 'bootstrap'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import { planApi } from '../api/plan'
import { showToast } from '../utils/toast'
import { formatDate, truncateText, formatNumber } from '../utils/format'

const router = useRouter()
const loading = ref(true)
const plans = ref([])
const searchKeyword = ref('')
const selectedStatus = ref('')
const editingPlan = ref({ id: null, title: '', goal: '' })
let editModalInstance = null

// localStorage key
const PINNED_PLANS_KEY = 'pinned_plans'

// 获取置顶计划列表
function getPinnedPlans() {
  try {
    const pinned = localStorage.getItem(PINNED_PLANS_KEY)
    return pinned ? JSON.parse(pinned) : []
  } catch (e) {
    return []
  }
}

// 保存置顶计划列表
function savePinnedPlans(pinnedList) {
  try {
    localStorage.setItem(PINNED_PLANS_KEY, JSON.stringify(pinnedList))
  } catch (e) {
    console.error('保存置顶列表失败:', e)
  }
}

// 检查计划是否置顶
function isPinned(planId) {
  const pinnedList = getPinnedPlans()
  return pinnedList.includes(planId)
}

// 切换置顶状态
function togglePin(planId) {
  const pinnedList = getPinnedPlans()
  const index = pinnedList.indexOf(planId)
  
  if (index > -1) {
    // 取消置顶
    pinnedList.splice(index, 1)
    showToast('已取消置顶', 'success')
  } else {
    // 置顶
    pinnedList.push(planId)
    showToast('已置顶', 'success')
  }
  
  savePinnedPlans(pinnedList)
  // 重新排序计划列表
  sortPlans()
}

// 排序计划：置顶的在前
function sortPlans() {
  const pinnedList = getPinnedPlans()
  plans.value.sort((a, b) => {
    const aPinned = pinnedList.includes(a.id)
    const bPinned = pinnedList.includes(b.id)
    
    if (aPinned && !bPinned) return -1
    if (!aPinned && bPinned) return 1
    // 如果都是置顶或都不是置顶，按创建时间倒序
    return new Date(b.createTime) - new Date(a.createTime)
  })
}

// 过滤后的计划列表
const filteredPlans = computed(() => {
  let result = [...plans.value]
  
  // 状态筛选
  if (selectedStatus.value) {
    result = result.filter(plan => plan.status === selectedStatus.value)
  }
  
  // 搜索筛选
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.trim().toLowerCase()
    result = result.filter(plan => {
      const title = (plan.subject || plan.title || '').toLowerCase()
      const goal = (plan.goal || '').toLowerCase()
      return title.includes(keyword) || goal.includes(keyword)
    })
  }
  
  // 保持置顶排序
  const pinnedList = getPinnedPlans()
  result.sort((a, b) => {
    const aPinned = pinnedList.includes(a.id)
    const bPinned = pinnedList.includes(b.id)
    
    if (aPinned && !bPinned) return -1
    if (!aPinned && bPinned) return 1
    // 如果都是置顶或都不是置顶，按创建时间倒序
    return new Date(b.createTime) - new Date(a.createTime)
  })
  
  return result
})

// 清除所有筛选
function clearFilters() {
  searchKeyword.value = ''
  selectedStatus.value = ''
}

onMounted(() => {
  loadPlans()
  editModalInstance = new Modal(document.getElementById('editPlanModal'))
})

function openEditModal(plan) {
  editingPlan.value = { ...plan }
  editModalInstance.show()
}

async function savePlan() {
  try {
    const result = await planApi.updatePlan(editingPlan.value.id, {
      title: editingPlan.value.title,
      goal: editingPlan.value.goal
    })
    if (result && result.code === 200) {
      showToast('计划更新成功', 'success')
      editModalInstance.hide()
      loadPlans()
    } else {
      showToast(result?.message || '更新失败', 'error')
    }
  } catch (error) {
    console.error('更新失败:', error)
    showToast('更新失败', 'error')
  }
}

async function loadPlans() {
  loading.value = true
  
  try {
    const result = await planApi.getPlans()
    if (result && result.code === 200) {
      plans.value = result.data || []
      console.log('加载计划成功，共', plans.value.length, '个计划')
      // 加载后排序
      sortPlans()
      console.log('排序后计划数量:', plans.value.length)
      console.log('过滤后计划数量:', filteredPlans.value.length)
    } else {
      console.error('加载计划失败，返回结果:', result)
    }
  } catch (error) {
    console.error('加载计划失败:', error)
    showToast('加载失败', 'error')
  } finally {
    loading.value = false
  }
}

function getStatusClass(status) {
  const map = {
    'active': 'bg-success',
    '进行中': 'bg-success',
    'completed': 'bg-info',
    '已完成': 'bg-info',
    'paused': 'bg-warning',
    '已暂停': 'bg-warning'
  }
  return map[status] || 'bg-secondary'
}

function getStatusText(status) {
  const map = {
    'active': '进行中',
    'completed': '已完成',
    'paused': '已暂停'
  }
  return map[status] || status
}

async function viewDetail(planId) {
  router.push(`/my-plans/${planId}`)
}

async function deletePlan(planId) {
  if (!confirm('确定要删除这个计划吗？此操作不可撤销。')) {
    return
  }

  try {
    const result = await planApi.deletePlan(planId)
    if (result && result.code === 200) {
      // 如果删除的计划是置顶的，从置顶列表中移除
      const pinnedList = getPinnedPlans()
      const index = pinnedList.indexOf(planId)
      if (index > -1) {
        pinnedList.splice(index, 1)
        savePinnedPlans(pinnedList)
      }
      
      showToast('计划已删除', 'success')
      loadPlans()
    } else {
      showToast(result?.message || '删除失败', 'error')
    }
  } catch (error) {
    console.error('删除失败:', error)
    showToast('删除失败', 'error')
  }
}
</script>