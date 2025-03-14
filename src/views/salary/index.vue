<template>
  <div class="container">
    <div class="app-container">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-input
          v-model="queryParams.keyword"
          placeholder="请输入员工姓名搜索"
          style="width: 200px; margin-right: 10px"
          size="small"
          @keyup.enter.native="handleSearch"
        />
        <el-button
          size="small"
          type="primary"
          @click="handleSearch"
        >搜索</el-button>
        <el-button size="small" @click="handleReset">重置</el-button>
      </div>

      <!-- 操作栏 -->
      <div class="operate-bar" style="margin-top: 30px; margin-left: 10px;">
        <el-button
          type="primary"
          size="small"
          @click="handleAdd"
        >新增工资记录</el-button>
      </div>

      <!-- 表格 -->
      <el-table :data="salaryList" style="margin-top: 30px; margin-left: 10px;">
        <el-table-column prop="employeeName" label="员工姓名" />
        <el-table-column prop="baseSalary" label="基本工资">
          <template v-slot="{ row }"> {{ row.baseSalary }}元 </template>
        </el-table-column>
        <el-table-column prop="performanceSalary" label="绩效等级">
          <template v-slot="{ row }">  <el-tag :type="getLevelTagType(row.level)">{{ row.level }}</el-tag></template>
        </el-table-column>
        <!-- 新增绩效工资列 -->
        <el-table-column prop="performanceSalary" label="绩效工资">
          <template v-slot="{ row }"> {{ row.performanceSalary }}元 </template>
        </el-table-column>
        <el-table-column prop="bonus" label="奖金">
          <template v-slot="{ row }"> {{ row.bonus }}元 </template>
        </el-table-column>
        <el-table-column prop="deduction" label="扣款">
          <template v-slot="{ row }"> {{ row.deduction }}元 </template>
        </el-table-column>
        <el-table-column prop="actualSalary" label="实发工资">
          <template v-slot="{ row }"> {{ row.actualSalary }}元 </template>
        </el-table-column>
        <el-table-column prop="month" label="日期" />
        <el-table-column label="操作" width="280" align="center">
          <template v-slot="{ row }">
            <el-button
              type="text"
              size="small"
              @click="handleHistory(row)"
            >历史工资</el-button>
            <el-button
              type="text"
              size="small"
              @click="handleEdit(row)"
            >编辑</el-button>
            <el-button
              type="text"
              size="small"
              @click="handleDelete(row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-row type="flex" style="height: 60px" align="middle" justify="end">
        <span class="total-count">共 {{ total }} 条</span>
        <!-- 放置分页组件 -->
        <el-pagination
          layout="prev, pager, next"
          :total="total"
          :current-page="queryParams.page"
          :page-size="queryParams.pagesize"
          background
          @current-change="changePage"
        />
      </el-row>

      <!-- 新增/编辑弹窗 -->
      <el-dialog
        :title="operationType === 'add' ? '新增工资记录' : '编辑工资记录'"
        :visible.sync="dialogVisible"
        width="500px"
      >
        <el-form
          ref="salaryForm"
          :model="salaryForm"
          :rules="rules"
          label-width="100px"
        >
          <el-form-item label="日期" prop="month">
            <el-date-picker
              v-model="salaryForm.month"
              type="month"
              placeholder="选择日期"
              style="width: 200px;"
              value-format="yyyy-MM"
            />
          </el-form-item>
          <el-form-item label="员工" prop="employeeName">
            <el-select
              v-model="salaryForm.employeeId"
              placeholder="请选择员工"
              :disabled="isEmployeeDisabled"
              @change="handleEmployeeChange"
            >
              <el-option
                v-for="item in employeeList"
                :key="item.id"
                :label="item.username"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="绩效等级" prop="level" style="width: 300px;">
            <el-input v-model="salaryForm.level" disabled />
          </el-form-item>
          <el-form-item label="基本工资" prop="baseSalary">
            <el-input-number
              v-model="salaryForm.baseSalary"
              :min="0"
              :precision="2"
              :step="100"
              @change="changePerformanceSalary"
            />
          </el-form-item>
          <!-- 新增绩效工资表单项 -->
          <el-form-item label="绩效工资" prop="performanceSalary">
            <el-input-number
              v-model="salaryForm.performanceSalary"
              :min="0"
              :precision="2"
              :step="100"
              disabled
              @change="calculateActualSalary"
            />
            <el-tooltip content="绩效工资根据绩效等级：A为基本工资的150%，B为基本工资的100%，C为基本工资的80%，D为基本工资的50%，E为基本工资的0%" placement="top" effect="light">
              <i
                class="el-icon-question"
                style="margin-left: 10px;
                                  cursor: pointer;
                                  font-size: 20px;
                                  color:#E6A23C;
                                 "
              />
            </el-tooltip>
          </el-form-item>
          <el-form-item label="奖金" prop="bonus">
            <el-input-number
              v-model="salaryForm.bonus"
              :min="0"
              :precision="2"
              disabled
              :step="100"
              @change="calculateActualSalary"
            />
            <el-tooltip content="根据考勤情况核算奖金" placement="top" effect="light">
              <i
                class="el-icon-question"
                style="margin-left: 10px;
                                  cursor: pointer;
                                  font-size: 20px;
                                  color:#E6A23C;
                                 "
              />
            </el-tooltip>
          </el-form-item>
          <el-form-item label="扣款" prop="deduction">
            <el-input-number
              v-model="salaryForm.deduction"
              :min="0"
              :precision="2"
              disabled
              :step="100"
              @change="calculateActualSalary"
            />
            <el-tooltip content="根据考勤情况核算扣款" placement="top" effect="light">
              <i
                class="el-icon-question"
                style="margin-left: 10px;
                                  cursor: pointer;
                                  font-size: 20px;
                                  color:#E6A23C;
                                 "
              />
            </el-tooltip>
          </el-form-item>
          <el-form-item label="实发工资" prop="actualSalary">
            <el-input v-model.number="salaryForm.actualSalary" disabled />
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 历史工资弹窗 -->
      <el-dialog
        title="历史工资记录"
        :visible.sync="historyDialogVisible"
        width="800px"
      >
        <div style="text-align: center">
          <h3 style="margin-bottom: 20px">{{ currentEmployee }}的历史工资</h3>
          <div
            v-for="(item, index) in salaryHistory"
            :key="index"
            style="
              border: 1px solid #EBEEF5;
              border-radius: 4px;
              padding: 20px;
              margin-bottom: 15px;
              background-color: #FAFAFA;
            "
          >
            <div style="font-size: 18px; font-weight: bold; color: #409EFF; margin-bottom: 15px">
              {{ item.month }}
            </div>
            <div style="display: flex; justify-content: space-around; margin-bottom: 10px">
              <span>基本工资: {{ item.baseSalary }}元</span>
              <!-- 新增绩效工资显示 -->
              <span>绩效工资: {{ item.performanceSalary }}元</span>
            </div>
            <div style="display: flex; justify-content: space-around; margin-bottom: 10px">
              <span>扣款: {{ item.deduction }}元</span>
              <span>奖金: {{ item.bonus }}元</span>
            </div>
            <div>
              <span style="color: #67C23A; font-weight: bold">实发工资: {{ item.actualSalary }}元</span>
            </div>
          </div>
        </div>
        <div slot="footer">
          <el-button @click="historyDialogVisible = false">关闭</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getSalaryList,
  addSalary,
  updateSalary,
  deleteSalary,
  getSalaryDetail
} from '@/api/salary'
import { calculateDeduction, calculateFullAttendanceBonus } from '@/api/attendance'
import { getEmployeeList } from '@/api/employee'
import { getPerformanceList } from '@/api/performance'
export default {
  name: 'Salary',
  data() {
    return {
      isEmployeeDisabled: false, // 控制员工选择框禁用
      // 查询参数
      queryParams: {
        page: 1,
        pagesize: 10,
        keyword: ''
      },
      // 工资列表数据
      salaryList: [
        // {
        //   id: 1,
        //   employeeName: '张三',
        //   employeeId: 1,
        //   baseSalary: 8000,
        //   performanceSalary: 1000, // 新增绩效工资字段
        //   bonus: 2000,
        //   deduction: 500,
        //   actualSalary: 9500,
        //   month: '2024-01',
        //   history: [
        //     {
        //       month: '2023-12',
        //       baseSalary: 7800,
        //       performanceSalary: 800, // 新增绩效工资字段
        //       bonus: 1800,
        //       deduction: 400,
        //       actualSalary: 9200
        //     },
        //     {
        //       month: '2023-11',
        //       baseSalary: 7600,
        //       performanceSalary: 600, // 新增绩效工资字段
        //       bonus: 1600,
        //       deduction: 300,
        //       actualSalary: 8900
        //     },
        //     {
        //       month: '2023-10',
        //       baseSalary: 7400,
        //       performanceSalary: 400, // 新增绩效工资字段
        //       bonus: 1400,
        //       deduction: 200,
        //       actualSalary: 8600
        //     }
        //   ]
        // },
      ],
      // 员工列表
      employeeList: [],
      total: 10,
      // 弹窗控制
      dialogVisible: false,
      historyDialogVisible: false,
      // 表单数据
      salaryForm: {
        employeeName: '',
        employeeId: '',
        baseSalary: '',
        performanceSalary: '', // 新增绩效工资字段
        bonus: '',
        deduction: '',
        actualSalary: '',
        month: ''
      },
      // 表单规则
      rules: {
        employeeName: [
          { required: true, message: '请选择员工', trigger: 'change' }
        ],
        baseSalary: [
          { required: true, message: '请输入基本工资', trigger: 'blur' }
        ],
        bonus: [
          { required: true, message: '请输入奖金', trigger: 'blur' }
        ],
        deduction: [
          { required: true, message: '请输入扣款', trigger: 'blur' }
        ],
        performanceSalary: [
          { required: true, message: '请输入绩效工资', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '请输入绩效等级', trigger: 'blur' }
        ],
        month: [{ required: true, message: '请选择日期', trigger: 'blur' }],
        actualSalary: [{ required: true, message: '请选择实发工资', trigger: 'blur' }]
      },
      // 操作类型
      operationType: 'add',
      // 历史工资数据
      salaryHistory: [],
      // 当前查看的员工
      currentEmployee: ''
    }
  },
  created() {
    this.getSalaryList()
    this.getEmployeeList()
  },
  methods: {
    getLevelTagType(level) {
      const types = {
        A: 'success',
        B: '',
        C: 'warning',
        D: 'danger',
        E: 'info'
      }
      return types[level] || ''
    },
    // 获取工资列表
    async getSalaryList() {
      const { records, total } = await getSalaryList(this.queryParams)
      this.salaryList = records
      console.log('salaryList', this.salaryList)
      this.total = total
    },
    // 获取员工列表
    async getEmployeeList() {
      const { records } = await getEmployeeList(this.queryParams)
      this.employeeList = records
    },
    // 员工选择改变
    async  handleEmployeeChange(employeeId) {
      const employee = this.employeeList.find((item) => item.id === employeeId)
      if (employee) {
        this.salaryForm.employeeName = employee.username
        const { records } = await getPerformanceList({ page: 1,
          pagesize: 10, employeeId: this.salaryForm.employeeId, period: this.salaryForm.month })
        console.log('records[0].level', records[0].level)
        this.salaryForm.level = records[0].level
        const res = await calculateDeduction({ employeeId: this.salaryForm.employeeId, month: this.salaryForm.month })
        console.log('res', res)
        this.salaryForm.deduction = res

        const res1 = await calculateFullAttendanceBonus({ employeeId: this.salaryForm.employeeId, month: this.salaryForm.month })
        console.log('res1', res1)
        this.salaryForm.bonus = res1
      }
    },
    // 搜索
    handleSearch() {
      this.queryParams.page = 1
      this.getSalaryList()
    },
    // 重置
    handleReset() {
      this.queryParams = {
        page: 1,
        pagesize: 10,
        keyword: ''
      }
      this.getSalaryList()
    },
    // 分页
    handleCurrentChange(val) {
      this.queryParams.page = val
      this.getSalaryList()
    },
    // 打开新增弹窗
    handleAdd() {
      this.operationType = 'add'
      this.isEmployeeDisabled = false
      this.dialogVisible = true
      this.salaryForm = {
        employeeName: '',
        employeeId: '',
        baseSalary: '',
        level: '',
        performanceSalary: '', // 新增绩效工资字段
        bonus: '',
        deduction: '',
        actualSalary: '',
        month: ''
      }
    },
    // 打开编辑弹窗
    async handleEdit(row) {
      this.operationType = 'edit'
      this.dialogVisible = true
      this.isEmployeeDisabled = true
      const salaryData = await getSalaryDetail(row.id)
      console.log('salaryData: ', salaryData)
      this.salaryForm = salaryData
    },
    // 查看历史工资
    async handleHistory(row) {
      this.currentEmployee = row.employeeName
      // 使用员工的历史工资数据
      const { records } = await getSalaryList({ page: 1,
        pagesize: 10, keyword: this.currentEmployee })
      console.log('records: ', records)
      this.salaryHistory = records || []
      console.log('salaryHistory: ', this.salaryHistory)
      this.historyDialogVisible = true
    },
    async changePerformanceSalary() {
      console.log(111)

      const { records } = await getPerformanceList({ page: 1,
        pagesize: 10, employeeId: this.salaryForm.employeeId, period: this.salaryForm.month })
      console.log('records[0].level', records[0].level)
      let rate = 0
      switch (records[0].level) {
        case 'A':
          rate = 1.5
          break
        case 'B':
          rate = 1
          break
        case 'C':
          rate = 0.8
          break
        case 'D':
          rate = 0.5
          break
        case 'E':
          rate = 0
          break
        default:
          rate = 0
      }
      this.salaryForm.performanceSalary = (Number(this.salaryForm.baseSalary) * rate).toFixed(2)
      this.calculateActualSalary()
    },
    // 提交表单
    async submitForm() {
      try {
        await this.$refs.salaryForm.validate()
        if (this.operationType === 'add') {
          await addSalary(this.salaryForm)
          this.$message.success('添加成功')
        } else {
          await updateSalary(this.salaryForm)
          this.$message.success('修改成功')
        }
        this.dialogVisible = false
        this.getSalaryList()
      } catch (error) {
        console.error(error)
      }
    },
    // 删除
    async handleDelete(id) {
      try {
        await this.$confirm('确认删除该工资记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await deleteSalary(id)
        this.$message.success('删除成功')
        if (this.salaryList.length === 1 && this.queryParams.page > 1) {
          this.queryParams.page--
        }
        this.getSalaryList()
      } catch (error) {
        console.error(error)
      }
    },
    // 计算实发工资
    calculateActualSalary() {
      const { baseSalary = 0, performanceSalary = 0, bonus = 0, deduction = 0 } = this.salaryForm
      this.salaryForm.actualSalary =
        Number(baseSalary) + Number(performanceSalary) + Number(bonus) - Number(deduction)
      this.salaryForm.actualSalary = parseFloat(this.salaryForm.actualSalary).toFixed(2)
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container {

.search-bar {
  margin: 20px 0;
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
