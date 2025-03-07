<template>
  <div class="container">
    <div class="app-container">
      <!-- 绩效卡片 -->
      <el-card class="performance-card" shadow="hover">
        <div class="data-card">
          <div class="icon-wrapper bg-blue">
            <i class="el-icon-coin" />
          </div>
          <div class="data-content">
            <div class="data-title">我的绩效记录</div>
            <div class="data-number">{{ total }}条</div>
          </div>
        </div>
      </el-card>

      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-select
          v-model="queryParams.level"
          placeholder="评估等级"
          style="width: 120px; margin-right: 10px"
          size="small"
          clearable
          @keyup.enter.native="handleSearch"
        >
          <el-option label="A" value="A" />
          <el-option label="B" value="B" />
          <el-option label="C" value="C" />
          <el-option label="D" value="D" />
          <el-option label="E" value="E" />
        </el-select>
        <el-button
          size="small"
          type="primary"
          @click="handleSearch"
        >搜索</el-button>
        <el-button size="small" @click="handleReset">重置</el-button>
      </div>

      <!-- 表格 -->
      <el-table :data="performanceList" style="margin-top: 30px; margin-left: 10px">
        <el-table-column
          prop="employeeName"
          label="员工姓名"
          align="center"
        />
        <el-table-column
          prop="department"
          label="所属部门"
          align="center"
        />
        <el-table-column
          prop="evaluationPeriod"
          label="评估时间"
          align="center"
        />
        <el-table-column
          prop="workQualityScore"
          label="工作质量"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.workQualityScore }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="workEfficiencyScore"
          label="工作效率"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.workEfficiencyScore }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="teamworkScore"
          label="团队协作"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.teamworkScore }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="attendanceScore"
          label="出勤情况"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.attendanceScore }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="score"
          label="总评分"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag :type="getScoreTagType(scope.row.score)">{{ scope.row.score }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="level"
          label="等级"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag :type="getLevelTagType(scope.row.level)">{{ scope.row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="evaluator"
          label="评估人"
          align="center"
        />
        <el-table-column
          prop="comments"
          label="评语"
          show-overflow-tooltip
        />
        <el-table-column label="操作" width="120" align="center">
          <template v-slot="{ row }">
            <el-button
              type="text"
              size="small"
              @click="handleHistory(row)"
            >历史绩效</el-button>
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
      <!-- 历史绩效弹窗 -->
      <el-dialog
        title="历史绩效记录"
        :visible.sync="historyDialogVisible"
        width="800px"
      >
        <div style="text-align: center">
          <h3 style="margin-bottom: 20px">{{ currentEmployee }}的历史绩效</h3>
          <div
            v-for="(item, index) in performanceHistory"
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
              {{ item.evaluationPeriod }}
            </div>
            <div
              style="
                      display: flex;
                      justify-content: space-around;
                      margin-bottom: 10px;
                    "
            >
              <span>工作质量: {{ item.workQualityScore }}分</span>
              <span>工作效率: {{ item.workEfficiencyScore }}分</span>
            </div>
            <div
              style="
                      display: flex;
                      justify-content: space-around;
                      margin-bottom: 10px;
                    "
            >
              <span>团队协作: {{ item.teamworkScore }}分</span>
              <span>出勤情况: {{ item.attendanceScore }}分</span>
            </div>
            <div style="display: flex; justify-content: space-around;margin-bottom: 10px;">
              <span>评估人: {{ item.evaluator }}</span>
              <span>评语: {{ item.comments }}</span>
            </div>
            <div style="display: flex; justify-content: space-around">
              <span>总评分：<el-tag :type="getScoreTagType(item.score)">{{ item.score }}分</el-tag></span>
              <span>等级：<el-tag :type="getLevelTagType(item.level)">{{ item.level }}</el-tag></span>
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
import { getPerformanceList } from '@/api/performance'
import store from '@/store'
export default {
  name: 'MyPerformance',
  data() {
    return {
      // 查询参数
      queryParams: {
        page: 1,
        pagesize: 10,
        level: '',
        employeeId: store.getters.Id
      },
      // 绩效列表数据
      performanceList: [],
      total: 0,
      // 弹窗控制
      historyDialogVisible: false,
      // 历史绩效数据
      performanceHistory: [],
      // 当前查看的员工
      currentEmployee: ''
    }
  },
  created() {
    this.getPerformanceList()
  },
  methods: {
    getScoreTagType(score) {
      if (score >= 90) return 'success'
      if (score >= 80) return ''
      if (score >= 70) return 'warning'
      return 'danger'
    },
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
    // 获取绩效列表
    async getPerformanceList() {
      const { records, total } = await getPerformanceList(this.queryParams)
      this.performanceList = records
      this.total = total
    },
    // 搜索
    handleSearch() {
      this.queryParams.page = 1
      this.getPerformanceList()
    },
    // 重置
    handleReset() {
      this.queryParams.level = ''
      this.getPerformanceList()
    },
    // 分页
    handleCurrentChange(val) {
      this.queryParams.page = val
      this.getPerformanceList()
    },
    // 查看历史绩效
    async handleHistory(row) {
      this.currentEmployee = row.employeeName
      const { records } = await getPerformanceList({
        ...this.queryParams
      })
      this.performanceHistory = records || []
      this.historyDialogVisible = true
    }
  }
}
</script>

  <style lang="scss" scoped>
  .performance-card {
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

     .data-number {
        font-size: 20px;
        color: #409eff;
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

  .search-bar {
    margin: 20px 0;
    padding: 10px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  </style>
