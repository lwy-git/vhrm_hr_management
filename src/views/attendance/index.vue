<template>
  <div class="container">
    <div class="app-container">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-form :inline="true" :model="queryParams" class="search-form">
          <el-form-item>
            <el-input
              v-model="queryParams.keyword"
              placeholder="请输入员工姓名搜索"
              clearable
              style="width: 220px"
              size="small"
              @keyup.enter.native="handleSearch"
            />
          </el-form-item>
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
          </el-form-item>
        </el-form>
      </div>
      <div class="right">
        <el-row class="operate-tools" type="flex" justify="end">
          <el-button
            size="mini"
            type="primary"
            @click="handleAdd"
          >添加考勤</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="handleSet"
          >考勤设置</el-button>
          <el-button size="mini" @click="showExcelDialog = true">考勤导入</el-button>
          <el-button size="mini" @click="handleExport">导出考勤</el-button>
        </el-row>

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
          <el-table-column label="操作" width="200px" align="center">
            <template v-slot="{ row }">
              <el-button
                size="mini"
                type="text"
                @click="handleEdit(row)"
              >编辑</el-button>
              <el-button
                size="mini"
                type="text"
                @click="handleDelete(row.id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>

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

      <!-- 添加/编辑考勤弹窗 -->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        width="500px"
      >
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="员工" prop="employeeId">
            <el-select
              v-model="form.employeeId"
              placeholder="请选择员工"
              :disabled="isEmployeeDisabled"
              style="width: 61%"
              @change="handleEmployeeChange"
            >
              <el-option
                v-for="item in employeeList"
                :key="item.id"
                :label="item.username"
                :value="item.id"
              >
                <span>{{ item.username }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.department }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="考勤日期" prop="attendanceDate">
            <el-date-picker
              v-model="form.attendanceDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              @change="changeStatus"
            />
          </el-form-item>
          <el-form-item label="签到时间" prop="checkinTime">
            <el-time-picker
              v-model="form.checkinTime"
              placeholder="选择时间"
              value-format="HH:mm:ss"
            />
          </el-form-item>
          <el-form-item label="签退时间" prop="checkoutTime">
            <el-time-picker
              v-model="form.checkoutTime"
              placeholder="选择时间"
              value-format="HH:mm:ss"
              @change="changeStatus"
            />
          </el-form-item>
          <el-form-item label="考勤状态" prop="status">
            <el-select v-model="form.status" disabled>
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" type="textarea" />
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </el-dialog>
      <!-- excel导入弹层 .sync双向绑定数据控制弹窗显隐  uploadSuccess监听上传成功-->
      <ImportExcel :show-excel-dialog.sync="showExcelDialog" @uploadSuccess="getAttendanceList" />
      <!-- 设置组件 -->
      <attendance-set ref="set" @handleCloseModal="handleCloseModal" @dataSearch="handleDataSearch" />
    </div>
  </div>
</template>

<script>
import AttendanceSet from './components/attendance-set'
import {
  getAttendanceList,
  addAttendance,
  updateAttendance,
  getAttendanceDetail,
  getAttendanceConfig,
  deleteAttendance
} from '@/api/attendance'
import { getEmployeeList } from '@/api/employee'
import { exportAttendance } from '@/api/attendance'
import FileSaver from 'file-saver'
import ImportExcel from './components/importExcel.vue'
// import { parseTime } from '@/utils'

export default {
  name: 'Attendance',
  components: { AttendanceSet, ImportExcel },
  data() {
    return {
      showExcelDialog: false, // 控制excel的弹层显示和隐藏
      queryParams: {
        keyword: '',
        status: '',
        page: 1,
        pagesize: 10
      },
      total: 0,
      attendanceList: [
      ],
      dialogVisible: false,
      dialogTitle: '',
      // 考勤状态枚举
      attendanceStatus: {
        NORMAL: 1, // 正常
        LATE: 2, // 迟到
        EARLY: 3, // 早退
        ABSENT: 4 // 旷工
        // LATEANDEARLY: 5// 迟到且早退
      },
      statusOptions: [
        { value: 1, label: '正常' },
        { value: 2, label: '迟到' },
        { value: 3, label: '早退' },
        { value: 4, label: '旷工' }
        // { value: 5, label: '迟到且早退' }
        // { value: 6, label: '请假' }
      ],
      employeeList: [],
      isEmployeeDisabled: false, // 控制员工选择框禁用
      form: {
        id: null,
        employeeName: '',
        employeeId: '',
        attendanceDate: '',
        checkinTime: '',
        checkoutTime: '',
        status: 1,
        remark: ''
      },
      rules: {
        employeeId: [
          { required: true, message: '请输入员工姓名', trigger: 'blur' }
        ],
        attendanceDate: [
          { required: true, message: '请选择考勤日期', trigger: 'blur' }
        ],
        // checkinTime: [
        //   { required: true, message: '请选择签到时间', trigger: 'blur' }
        // ],
        // checkoutTime: [
        //   { required: true, message: '请选择签退时间', trigger: 'blur' }
        // ],
        status: [
          { required: true, message: '请选择考勤状态', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getAttendanceList()
    this.getEmployeeList()
  },
  methods: {
    async changeStatus() {
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
    },

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
      // if (checkin.getTime() > morningStart.getTime() && checkout.getTime() < afternoonEnd.getTime()) {
      //   return 5// 迟到且早退
      // }
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

    handleDataSearch() {
      this.getAttendanceList()
    },
    // 设置
    handleSet() {
      this.$refs.set.dialogFormV()
    },
    // 弹框关闭
    handleCloseModal() {
      this.$refs.set.dialogFormH()
    },
    // 获取员工列表
    async getEmployeeList() {
      const { records } = await getEmployeeList(this.queryParams)
      this.employeeList = records
    },
    // 获取考勤列表
    async getAttendanceList() {
      try {
        const { records, total } = await getAttendanceList(this.queryParams)
        this.attendanceList = records
        this.total = total // 赋值总数
      } catch (error) {
        console.error('获取考勤列表失败:', error)
      }
    },
    handleEmployeeChange(employeeId) {
      const employee = this.employeeList.find(item => item.id === employeeId)
      if (employee) {
        this.form.employeeName = employee.username
      }
    },
    // 获取状态文本
    getStatusText(status) {
      const statusItem = this.statusOptions.find(
        (item) => item.value === status
      )
      return statusItem ? statusItem.label : ''
    },
    // 搜索
    handleSearch() {
      this.queryParams.page = 1
      this.getAttendanceList()
    },
    // 重置
    handleReset() {
      this.queryParams = {
        keyword: '',
        status: '',
        page: 1,
        pagesize: 10
      }
      this.getAttendanceList()
    },
    // 获取状态对应的类型
    getStatusType(status) {
      const typeMap = {
        [this.attendanceStatus.NORMAL]: 'success',
        [this.attendanceStatus.LATE]: 'warning',
        [this.attendanceStatus.EARLY]: 'warning',
        [this.attendanceStatus.ABSENT]: 'danger'
        // [this.attendanceStatus.LATEANDEARLY]: 'danger'
      }
      return typeMap[status] || ''
    },
    // 切换页码
    changePage(page) {
      this.queryParams.page = page
      this.getAttendanceList()
    },
    // 添加考勤
    handleAdd() {
      this.dialogTitle = '添加考勤'
      this.isEmployeeDisabled = false
      this.form = {
        id: null,
        employeeName: '',
        attendanceDate: '',
        checkinTime: '',
        checkoutTime: '',
        status: this.attendanceStatus.NORMAL,
        remark: ''
      }
      this.dialogVisible = true
    },
    // 编辑考勤
    async handleEdit(row) {
      this.dialogTitle = '编辑考勤'
      this.dialogVisible = true
      this.isEmployeeDisabled = true
      const attendanceData = await getAttendanceDetail(row.id)
      console.log('attendanceData: ', attendanceData)
      this.form = attendanceData
    },
    // 删除考勤
    handleDelete(id) {
      this.$confirm('确认删除该考勤记录吗？', '提示', {
        type: 'warning'
      })
        .then(async() => {
          try {
            await deleteAttendance(id)
            this.$message.success('删除成功')
            this.getAttendanceList()
          } catch (error) {
            console.error('删除考勤失败:', error)
          }
        })
        .catch(() => {})
    },
    // 导出考勤
    async  handleExport() {
      const result = await exportAttendance() // 导出所有的考勤接口
      // console.log(result) // 使用一个npm包 直接将blob文件下载到本地 file-saver
      // FileSaver.saveAs(blob对象,文件名称)
      FileSaver.saveAs(result, '考勤信息表.xlsx') // 下载文件
    },
    // 提交表单
    submitForm() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          try {
            const formData = {
              ...this.form
            }

            if (this.form.id) {
              await updateAttendance(formData)
            } else {
              await addAttendance(formData)
            }

            this.$message.success(this.form.id ? '编辑成功' : '添加成功')
            this.dialogVisible = false
            this.getAttendanceList()
          } catch (error) {
            console.error('保存考勤失败:', error)
          }
        }
      })
    },
    // 将对象转为查询字符串
    queryString(obj) {
      return Object.keys(obj)
        .map(
          (key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`
        )
        .join('&')
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container {

.search-bar {
  margin: 5px 0;
  padding: 10px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
  background: #fff;
  // display: flex;
  .total-count {
  margin-right: 10px;
  font-size: 14px;
  color: gray;
}
  .left {
    display:flex;
    width: 350px;
    align-items: center;
    padding: 20px;
    // border-right: 1px solid #eaeef4;
.left-name{
  width: 100px;
  height:100%;
  font-size: 15px;
  color:#666666;
}
  }
  .right {
    flex: 1;
    padding: 20px;
    .opeate-tools {
      margin:10px ;
    }
    .username {
      height: 30px;
      width: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 50%;
      color: #fff;
      background: #04C9BE;
      font-size: 12px;
      display:inline-block;
    }
  }
}

</style>
