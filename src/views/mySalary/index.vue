<template>
  <div class="container">
    <div class="app-container">
      <!-- 工资卡片 -->
      <el-card class="salary-card" shadow="hover">
        <div class="data-card">
          <div class="icon-wrapper bg-blue">
            <i class="el-icon-money" />
          </div>
          <div class="data-content">
            <div class="data-title">我的工资</div>
          </div>
        </div>
      </el-card>

      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-date-picker
          v-model="queryParams.month"
          type="month"
          placeholder="请选择月份"
          style="width: 200px; margin-right: 10px"
          size="small"
          value-format="yyyy-MM"
        />
        <el-button
          size="small"
          type="primary"
          @click="handleSearch"
        >搜索</el-button>
        <el-button size="small" @click="handleReset">重置</el-button>
      </div>

      <!-- 表格 -->
      <el-table :data="salaryList" style="margin-top: 30px; margin-left: 10px">
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
        <el-table-column label="操作" width="120" align="center">
          <template v-slot="{ row }">
            <el-button
              type="text"
              size="small"
              @click="handleHistory(row)"
            >历史工资</el-button>
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
              border: 1px solid #ebeef5;
              border-radius: 4px;
              padding: 20px;
              margin-bottom: 15px;
              background-color: #fafafa;
            "
          >
            <div
              style="
                font-size: 18px;
                font-weight: bold;
                color: #409eff;
                margin-bottom: 15px;
              "
            >
              {{ item.month }}
            </div>
            <div
              style="
                display: flex;
                justify-content: space-around;
                margin-bottom: 10px;
              "
            >
              <span>基本工资: {{ item.baseSalary }}元</span>
              <span>奖金: {{ item.bonus }}元</span>
            </div>
            <div style="display: flex; justify-content: space-around">
              <span>扣款: {{ item.deduction }}元</span>
              <span
                style="color: #67c23a; font-weight: bold"
              >实发工资: {{ item.actualSalary }}元</span>
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
import { getMySalaryList } from '@/api/salary'
import store from '@/store'
export default {
  name: 'MySalary',
  data() {
    return {
      // 查询参数
      queryParams: {
        page: 1,
        pagesize: 10,
        month: '',
        employeeId: store.getters.Id
      },
      // 工资列表数据
      salaryList: [],
      total: 0,
      // 弹窗控制
      historyDialogVisible: false,
      // 历史工资数据
      salaryHistory: [],
      // 当前查看的员工
      currentEmployee: ''
    }
  },
  created() {
    this.getMySalaryList()
  },
  methods: {
    // 获取工资列表
    async getMySalaryList() {
      const { records, total } = await getMySalaryList(this.queryParams)
      this.salaryList = records
      this.total = total
    },
    // 搜索
    handleSearch() {
      this.queryParams.page = 1
      this.getMySalaryList()
    },
    // 重置
    handleReset() {
      this.queryParams.month = ''
      this.getMySalaryList()
    },
    // 分页
    handleCurrentChange(val) {
      this.queryParams.page = val
      this.getMySalaryList()
    },
    // 查看历史工资
    async handleHistory(row) {
      this.currentEmployee = row.employeeName
      // 使用员工的历史工资数据
      const { records } = await getMySalaryList(this.queryParams)
      console.log('records: ', records)
      this.salaryHistory = records || []
      console.log('salaryHistory: ', this.salaryHistory)
      this.historyDialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.salary-card {
  margin-bottom: 20px;
}

.data-card {
  display: flex;
  align-items: center;

  .icon-wrapper {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;

    i {
      font-size: 30px;
      color: #fff;
    }
  }

  .data-content {
    .data-title {
      font-size: 16px;
      font-weight: bold;
      color: #303133;
      margin-bottom: 8px;
    }
  }
}

.bg-blue {
  background-color: #409eff;
}

.total-count {
  margin-right: 10px;
  font-size: 14px;
  color: gray;
}
</style>
