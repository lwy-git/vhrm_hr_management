<template>
  <div class="container">
    <div class="app-container">
      <!-- 打卡功能 -->
      <!-- <div class="check-in-section">
        <el-button type="primary" size="small" @click="checkInOrOut">{{ checkInButtonLabel }}</el-button>
      </div> -->

      <!-- 搜索框 -->
      <div class="search-bar">
        <el-form :inline="true" :model="queryParams" class="search-form">
          <!-- <el-form-item>
            <el-input
              v-model="queryParams.keyword"
              placeholder="请输入员工姓名搜索"
              clearable
              style="width: 220px"
              size="small"
              @keyup.enter.native="handleSearch"
            />
          </el-form-item> -->
          <el-form-item>
            <el-select
              v-model="queryParams.status"
              placeholder="请选择考勤状态"
              clearable
              style="width: 160px"
              size="small"
              @keyup.enter.native="handleSearch"
            >
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="small"
              @click="handleSearch"
            >搜索</el-button>
            <el-button
              size="small"
              @click="handleReset"
            >重置</el-button>
            <el-button style="margin-left: 100px;" type="primary" size="small" @click="checkInOrOut">{{ checkInButtonLabel }}</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 考勤列表 -->
      <el-table
        ref="attendanceTable"
        :data="attendanceList"
        style="width: 100%"
      >
        <el-table-column prop="employeeName" label="员工姓名" />
        <el-table-column prop="attendanceDate" label="考勤日期" sortable />
        <el-table-column prop="checkinTime" label="签到时间" sortable />
        <el-table-column prop="checkoutTime" label="签退时间" sortable />
        <el-table-column prop="status" label="考勤状态">
          <template v-slot="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" />
      </el-table>

      <!-- 分页 -->
      <el-row type="flex" style="height: 60px" align="middle" justify="end">
        <span class="total-count">共 {{ total }} 条</span>
        <el-pagination
          layout="prev, pager, next"
          :total="total"
          :current-page="queryParams.page"
          :page-size="queryParams.pagesize"
          background
          @current-change="changePage"
        />
      </el-row>
    </div>
  </div>
</template>

<script>
import { getAttendanceList, addAttendance, getAttendanceConfig } from '@/api/attendance'
import store from '@/store'
export default {
  name: 'Attendance',
  data() {
    return {
      queryParams: {
        keyword: store.getters.name,
        status: '',
        page: 1,
        pagesize: 10
      },
      total: 0,
      attendanceList: [],
      attendanceStatus: {
        NORMAL: 1, // 正常
        LATE: 2, // 迟到
        EARLY: 3, // 早退
        ABSENT: 4, // 旷工
        LATEANDEARLY: 5// 迟到且早退
      },
      statusOptions: [
        { value: 1, label: '正常' },
        { value: 2, label: '迟到' },
        { value: 3, label: '早退' },
        { value: 4, label: '旷工' },
        { value: 5, label: '异常' }
      ],
      checkInButtonLabel: '打卡签到',
      isCheckIn: false,
      form: {
        employeeId: store.getters.Id,
        employeeName: store.getters.name,
        attendanceDate: '',
        checkinTime: '',
        checkoutTime: '',
        status: 1,
        remark: ''
      }
    }
  },
  created() {
    this.getAttendanceList()
  },
  methods: {
    // 计算考勤状态
    calculateAttendanceStatus(morningStartTime, afternoonEndTime, checkinTime, checkoutTime) {
      const morningStart = this.parseTimeWithSeconds(morningStartTime)
      const afternoonEnd = this.parseTimeWithSeconds(afternoonEndTime)
      const checkin = this.parseTimeWithSeconds(checkinTime)
      const checkout = this.parseTimeWithSeconds(checkoutTime)

      // 如果没有签到时间或者签退时间，视为旷工
      if (!checkin || !checkout) {
        return 4 // 旷工
      }
      if (checkin.getTime() > morningStart.getTime() && checkout.getTime() < afternoonEnd.getTime()) {
        return 5// 迟到且早退，异常
      }
      // 判断迟到
      if (checkin.getTime() > morningStart.getTime()) {
        return 2 // 迟到
      }

      // 判断早退
      if (checkout.getTime() < afternoonEnd.getTime()) {
        return 3 // 早退
      }

      // 正常考勤
      return 1 // 正常
    },

    // 时间解析方法，处理包含秒钟部分的时间
    parseTimeWithSeconds(timeStr) {
      if (timeStr) {
        const [hours, minutes, seconds = '00'] = timeStr.split(':') // 默认为 '00' 秒
        // 将解析后的时间转换为当天的时间 (1970年1月1日的时间)
        return new Date(1970, 0, 1, Number(hours), Number(minutes), Number(seconds))
      }
      return null
    },

    async getAttendanceList() {
      try {
        const { records, total } = await getAttendanceList(this.queryParams)
        this.attendanceList = records
        this.total = total
      } catch (error) {
        console.error('获取考勤列表失败:', error)
      }
    },
    handleSearch() {
      this.queryParams.page = 1
      this.getAttendanceList()
    },
    handleReset() {
      this.queryParams = {
        keyword: store.getters.name,
        status: '',
        page: 1,
        pagesize: 10
      }
      this.getAttendanceList()
    },
    getStatusText(status) {
      const statusItem = this.statusOptions.find(
        (item) => item.value === status
      )
      return statusItem ? statusItem.label : ''
    },
    // 获取状态对应的类型
    getStatusType(status) {
      const typeMap = {
        [this.attendanceStatus.NORMAL]: 'success',
        [this.attendanceStatus.LATE]: 'warning',
        [this.attendanceStatus.EARLY]: 'warning',
        [this.attendanceStatus.ABSENT]: 'danger',
        [this.attendanceStatus.LATEANDEARLY]: 'danger'
      }
      return typeMap[status] || ''
    },
    changePage(page) {
      this.queryParams.page = page
      this.getAttendanceList()
    },
    async checkInOrOut() {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')

      const attendanceDate = `${year}-${month}-${day}`
      const time = `${hours}:${minutes}:${seconds}`

      if (!this.isCheckIn) {
        // 签到逻辑
        this.isCheckIn = true
        this.checkInButtonLabel = '打卡签退'
        this.form.attendanceDate = attendanceDate
        this.form.checkinTime = time
        console.log('签到成功', this.form)
        // 调用后端签到接口
        // this.submitCheckIn()
      } else {
        // 签退逻辑
        this.isCheckIn = false
        this.checkInButtonLabel = '打卡签到'
        this.form.checkoutTime = time
        const { checkinTime, checkoutTime } = this.form
        console.log('checkinTime', checkinTime)
        console.log('checkoutTime', checkoutTime)

        const res = await getAttendanceConfig()
        console.log('res', res)
        const morningStartTime = res.morningStartTime // 早晨开始时间，如 "09:00"
        const afternoonEndTime = res.afternoonEndTime // 下午结束时间，如 "18:00"

        // 判断考勤状态
        const status = this.calculateAttendanceStatus(morningStartTime, afternoonEndTime, checkinTime, checkoutTime)
        console.log('status', status)
        this.form.status = status // 更新考勤状态
        console.log('签退成功', this.form)
        // 调用后端签退接口
        this.submitCheckOut()
      }
    },
    async submitCheckIn() {
      try {
        // await addAttendance({ ...this.form })
        this.$message.success('签到成功')
        this.getAttendanceList()
      } catch (error) {
        console.error('签到失败:', error)
      }
    },
    async submitCheckOut() {
      try {
        await addAttendance({ ...this.form })
        this.$message.success('签退成功')
        this.getAttendanceList()
      } catch (error) {
        console.error('签退失败:', error)
      }
    }
  }
}
</script>

  <style scoped>
  .app-container {
    padding: 20px;
  }
  .search-bar {
    margin-bottom: 20px;
  }
  .check-in-section {
    margin-bottom: 10px;
    text-align: center;
  }
  .total-count {
    margin-right: 10px;
    font-size: 14px;
    color: gray;
  }
  </style>
