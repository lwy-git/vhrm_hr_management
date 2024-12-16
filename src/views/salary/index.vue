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
        <el-button size="small" type="primary" @click="handleSearch">搜索</el-button>
        <el-button size="small" @click="handleReset">重置</el-button>
      </div>

      <!-- 操作栏 -->
      <div class="operate-bar" style="margin: 10px 0">
        <el-button type="primary" size="small" @click="handleAdd">新增工资记录</el-button>
      </div>

      <!-- 表格 -->
      <el-table :data="salaryList" border style="width: 100%">
        <el-table-column prop="employeeName" label="员工姓名" />
        <el-table-column prop="baseSalary" label="基本工资">
          <template v-slot="{ row }"> {{ row.baseSalary }}元 </template>
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
        <el-table-column prop="month" label="月份" />
        <el-table-column label="操作" width="200" align="center">
          <template v-slot="{ row }">
            <el-button type="text" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="text" size="small" @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        style="margin-top: 20px; text-align: right"
        :current-page="queryParams.page"
        :page-size="queryParams.pagesize"
        :total="total"
        layout="total, prev, pager, next"
        @current-change="handleCurrentChange"
      />

      <!-- 新增/编辑弹窗 -->
      <el-dialog :title="operationType === 'add' ? '新增工资记录' : '编辑工资记录'" :visible.sync="dialogVisible" width="500px">
        <el-form ref="salaryForm" :model="salaryForm" :rules="rules" label-width="100px">
          <el-form-item label="员工" prop="employeeName">
            <el-select v-model="salaryForm.employeeId" placeholder="请选择员工" @change="handleEmployeeChange">
              <el-option v-for="item in employeeList" :key="item.id" :label="item.username" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="基本工资" prop="baseSalary">
            <el-input-number v-model="salaryForm.baseSalary" :min="0" :precision="2" @change="calculateActualSalary" />
          </el-form-item>
          <el-form-item label="奖金">
            <el-input-number v-model="salaryForm.bonus" :min="0" :precision="2" @change="calculateActualSalary" />
          </el-form-item>
          <el-form-item label="扣款">
            <el-input-number v-model="salaryForm.deduction" :min="0" :precision="2" @change="calculateActualSalary" />
          </el-form-item>
          <el-form-item label="实发工资">
            <el-input v-model="salaryForm.actualSalary" disabled />
          </el-form-item>
          <el-form-item label="月份" prop="month">
            <el-date-picker v-model="salaryForm.month" type="month" placeholder="选择月份" value-format="yyyy-MM" />
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
  getSalaryList,
  addSalary,
  updateSalary,
  deleteSalary
} from '@/api/salary'
import { getEmployeeList } from '@/api/employee'

export default {
  name: 'Salary',
  data() {
    return {
      // 查询参数
      queryParams: {
        page: 1,
        pagesize: 10,
        keyword: ''
      },
      // 工资列表数据
      salaryList: [],
      // 员工列表
      employeeList: [],
      total: 0,
      // 弹窗控制
      dialogVisible: false,
      // 表单数据
      salaryForm: {
        employeeName: '',
        employeeId: '',
        baseSalary: '',
        bonus: '',
        deduction: '',
        actualSalary: '',
        month: ''
      },
      // 表单规则
      rules: {
        employeeId: [
          { required: true, message: '请选择员工', trigger: 'change' }
        ],
        baseSalary: [
          { required: true, message: '请输入基本工资', trigger: 'blur' }
        ],
        month: [{ required: true, message: '请选择月份', trigger: 'change' }]
      },
      // 操作类型
      operationType: 'add'
    }
  },
  created() {
    this.getSalaryList()
    this.getEmployeeList()
  },
  methods: {
    // 获取工资列表
    async getSalaryList() {
      const { rows, total } = await getSalaryList(this.queryParams)
      this.salaryList = rows
      this.total = total
    },
    // 获取员工列表
    async getEmployeeList() {
      const { rows } = await getEmployeeList({ page: 1, pagesize: 1000 })
      this.employeeList = rows
    },
    // 员工选择改变
    handleEmployeeChange(employeeId) {
      const employee = this.employeeList.find((item) => item.id === employeeId)
      if (employee) {
        this.salaryForm.employeeName = employee.username
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
      this.dialogVisible = true
      this.salaryForm = {
        employeeName: '',
        employeeId: '',
        baseSalary: '',
        bonus: '',
        deduction: '',
        actualSalary: '',
        month: ''
      }
    },
    // 打开编辑弹窗
    handleEdit(row) {
      this.operationType = 'edit'
      this.dialogVisible = true
      this.salaryForm = { ...row }
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
      const { baseSalary = 0, bonus = 0, deduction = 0 } = this.salaryForm
      this.salaryForm.actualSalary =
        Number(baseSalary) + Number(bonus) - Number(deduction)
    }
  }
}
</script>
