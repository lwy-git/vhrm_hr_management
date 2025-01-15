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
              prefix-icon="el-icon-search"
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
              @change="getAttendanceList"
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
              icon="el-icon-search"
              size="small"
              @click="handleSearch"
            >搜索</el-button>
            <el-button
              icon="el-icon-refresh"
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
          <el-button size="mini" @click="handleExport">导出考勤</el-button>
        </el-row>

        <el-table
          ref="attendanceTable"
          :data="attendanceList"
          border
          style="width: 100%"
        >
          <el-table-column prop="employeeName" label="员工姓名" />
          <el-table-column prop="attendanceDate" label="考勤日期" sortable />
          <el-table-column prop="checkInTime" label="签到时间" sortable />
          <el-table-column prop="checkOutTime" label="签退时间" sortable />
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
          <el-form-item label="员工姓名" prop="employeeName">
            <el-input v-model="form.employeeName" />
          </el-form-item>
          <el-form-item label="考勤日期" prop="attendanceDate">
            <el-date-picker
              v-model="form.attendanceDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="签到时间" prop="checkInTime">
            <el-time-picker
              v-model="form.checkInTime"
              placeholder="选择时间"
              value-format="HH:mm:ss"
            />
          </el-form-item>
          <el-form-item label="签退时间" prop="checkOutTime">
            <el-time-picker
              v-model="form.checkOutTime"
              placeholder="选择时间"
              value-format="HH:mm:ss"
            />
          </el-form-item>
          <el-form-item label="考勤状态" prop="status">
            <el-select v-model="form.status">
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
    </div>
  </div>
</template>

<script>
import {
  getAttendanceList,
  addAttendance,
  updateAttendance,
  deleteAttendance
} from '@/api/attendance'
import { parseTime } from '@/utils'

export default {
  name: 'Attendance',
  data() {
    return {
      queryParams: {
        keyword: '',
        status: '',
        page: 1,
        pagesize: 10
      },
      total: 10,
      attendanceList: [
        {
          id: 1,
          employeeName: '张三',
          attendanceDate: '2024-01-10',
          checkInTime: '09:00:00',
          checkOutTime: '18:00:00',
          status: 1,
          remark: '正常出勤'
        },
        {
          id: 2,
          employeeName: '李四',
          attendanceDate: '2024-01-10',
          checkInTime: '09:30:00',
          checkOutTime: '18:00:00',
          status: 2,
          remark: '迟到30分钟'
        },
        {
          id: 3,
          employeeName: '王五',
          attendanceDate: '2024-01-10',
          checkInTime: '09:00:00',
          checkOutTime: '17:00:00',
          status: 3,
          remark: '提前1小时离开'
        },
        {
          id: 4,
          employeeName: '赵六',
          attendanceDate: '2024-01-10',
          checkInTime: '',
          checkOutTime: '',
          status: 4,
          remark: '全天未打卡'
        },
        {
          id: 5,
          employeeName: '钱七',
          attendanceDate: '2024-01-10',
          checkInTime: '09:00:00',
          checkOutTime: '18:00:00',
          status: 5,
          remark: '外出客户拜访'
        },
        {
          id: 6,
          employeeName: '孙八',
          attendanceDate: '2024-01-10',
          checkInTime: '',
          checkOutTime: '',
          status: 6,
          remark: '年假'
        },
        {
          id: 7,
          employeeName: '周九',
          attendanceDate: '2024-01-10',
          checkInTime: '09:00:00',
          checkOutTime: '18:00:00',
          status: 1,
          remark: '正常出勤'
        },
        {
          id: 8,
          employeeName: '吴十',
          attendanceDate: '2024-01-10',
          checkInTime: '09:45:00',
          checkOutTime: '18:00:00',
          status: 2,
          remark: '迟到45分钟'
        },
        {
          id: 9,
          employeeName: '郑十一',
          attendanceDate: '2024-01-10',
          checkInTime: '09:00:00',
          checkOutTime: '18:00:00',
          status: 5,
          remark: '外出培训'
        },
        {
          id: 10,
          employeeName: '王十二',
          attendanceDate: '2024-01-10',
          checkInTime: '',
          checkOutTime: '',
          status: 6,
          remark: '病假'
        }
      ],
      dialogVisible: false,
      dialogTitle: '',
      // 考勤状态枚举
      attendanceStatus: {
        NORMAL: 1, // 正常
        LATE: 2, // 迟到
        EARLY: 3, // 早退
        ABSENT: 4, // 旷工
        OUTSIDE: 5, // 外勤
        LEAVE: 6 // 请假
      },
      statusOptions: [
        { value: 1, label: '正常' },
        { value: 2, label: '迟到' },
        { value: 3, label: '早退' },
        { value: 4, label: '旷工' },
        { value: 5, label: '外勤' },
        { value: 6, label: '请假' }
      ],
      form: {
        id: null,
        employeeName: '',
        attendanceDate: '',
        checkInTime: '',
        checkOutTime: '',
        status: 1,
        remark: ''
      },
      rules: {
        employeeName: [
          { required: true, message: '请输入员工姓名', trigger: 'blur' }
        ],
        attendanceDate: [
          { required: true, message: '请选择考勤日期', trigger: 'change' }
        ],
        checkInTime: [
          { required: true, message: '请选择签到时间', trigger: 'change' }
        ],
        checkOutTime: [
          { required: true, message: '请选择签退时间', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择考勤状态', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getAttendanceList()
  },
  methods: {
    // 获取考勤列表
    async getAttendanceList() {
      try {
        const { data } = await getAttendanceList(this.queryParams)
        this.attendanceList = data.rows
        this.total = data.total
      } catch (error) {
        console.error('获取考勤列表失败:', error)
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
        [this.attendanceStatus.ABSENT]: 'danger',
        [this.attendanceStatus.OUTSIDE]: 'info',
        [this.attendanceStatus.LEAVE]: 'info'
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
      this.form = {
        id: null,
        employeeName: '',
        attendanceDate: '',
        checkInTime: '',
        checkOutTime: '',
        status: this.attendanceStatus.NORMAL,
        remark: ''
      }
      this.dialogVisible = true
    },
    // 编辑考勤
    handleEdit(row) {
      this.dialogTitle = '编辑考勤'
      this.form = { ...row }
      this.dialogVisible = true
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
    handleExport() {
      const params = { ...this.queryParams }
      window.location.href =
        process.env.VUE_APP_BASE_API +
        '/attendance/export?' +
        this.queryString(params)
    },
    // 提交表单
    submitForm() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          try {
            const formData = {
              ...this.form,
              attendanceDate: parseTime(
                this.form.attendanceDate,
                '{y}-{m}-{d}'
              ),
              checkInTime: parseTime(this.form.checkInTime, '{h}:{i}:{s}'),
              checkOutTime: parseTime(this.form.checkOutTime, '{h}:{i}:{s}')
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
