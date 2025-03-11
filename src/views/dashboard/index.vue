<template>
  <div class="container">
    <div class="dashboard-container">
      <!-- 顶部数据卡片 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="data-card">
              <div class="icon-wrapper bg-blue">
                <i class="el-icon-user" />
              </div>
              <div class="data-content">
                <div class="data-title">员工总数</div>
                <div class="data-number">{{ dashboardData.totalEmployees }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="data-card">
              <div class="icon-wrapper bg-orange">
                <i class="el-icon-office-building" />
              </div>
              <div class="data-content">
                <div class="data-title">部门数量</div>
                <div class="data-number">{{ dashboardData.departmentCount }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="data-card">
              <div class="icon-wrapper bg-green">
                <i class="el-icon-s-custom" />
              </div>
              <div class="data-content">
                <div class="data-title">平均薪资</div>
                <div class="data-number">{{ dashboardData.averageSalary }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="data-card">
              <div class="icon-wrapper bg-red">
                <i class="el-icon-date" />
              </div>
              <div class="data-content">
                <div class="data-title">平均绩效评分</div>
                <div class="data-number">{{ dashboardData.averagePerformanceScore }}分</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 图表区域 -->
      <el-row :gutter="20" style="margin-top: 20px">
        <!-- 员工入职趋势图 -->
        <el-col :span="12">
          <el-card shadow="hover">
            <div slot="header">
              <span>员工薪资分布</span>
            </div>
            <div ref="SalaryDistribution" style="height: 300px" />
          </el-card>
        </el-col>
        <!-- 部门人员分布图 -->
        <el-col :span="12">
          <el-card shadow="hover">
            <div slot="header">
              <span>部门人员分布</span>
            </div>
            <div ref="departmentDistribution" style="height: 300px" />
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 20px">
        <!-- 员工年龄分布 -->
        <el-col :span="12">
          <el-card shadow="hover">
            <div slot="header">
              <span>员工年龄分布</span>
            </div>
            <div ref="ageDistribution" style="height: 300px" />
          </el-card>
        </el-col>
        <!-- 员工学历构成 -->
        <el-col :span="12">
          <el-card shadow="hover">
            <div slot="header">
              <span>员工学历构成</span>
            </div>
            <div ref="educationDistribution" style="height: 300px" />
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { getHomeData } from '@/api/dashboard'

export default {
  name: 'Dashboard',
  data() {
    return {
      dashboardData: {
        totalEmployees: 0,
        averageSalary: 0,
        departmentCount: 0,
        averagePerformanceScore: 0,
        SalaryDistributionData: [],
        departmentDistributionData: [],
        ageDistributionData: [],
        educationDistributionData: []
      },
      charts: [],
      showSuggestionDialog: false,
      submitting: false,
      suggestionForm: {
        content: ''
      },
      suggestionRules: {
        content: [
          { required: true, message: '请输入建议内容', trigger: 'blur' },
          { min: 10, message: '建议内容不能少于10个字符', trigger: 'blur' }
        ]
      }
    }
  },
  async mounted() {
    this.fetchDashboardData()
    // this.initCharts()
  },
  beforeDestroy() {
    this.charts.forEach((chart) => {
      chart.dispose()
    })
  },
  methods: {
    handelSuggest() {
      this.showSuggestionDialog = true
      console.log('this.showSuggestionDialog', this.showSuggestionDialog)
    },
    async fetchDashboardData() {
      try {
        const response = await getHomeData()
        this.dashboardData = response
        console.log(this.dashboardData)
        this.charts.forEach((chart) => chart.dispose()) // 先销毁现有图表
        this.charts = [] // 清空图表数组
        this.initCharts() // 重新初始化图表
      } catch (error) {
        console.error('获取仪表盘数据失败:', error)
      }
    },
    initCharts() {
      // 初始化员工平均薪资分布图
      const SalaryDistribution = echarts.init(this.$refs.SalaryDistribution)
      SalaryDistribution.setOption({
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: ['5k以下', '6-10k', '10-15k', '16-20k', '20k以上']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: this.dashboardData.SalaryDistributionData,
            type: 'bar'
          }
        ]
      })
      this.charts.push(SalaryDistribution)

      // 初始化部门分布图
      const departmentDistribution = echarts.init(
        this.$refs.departmentDistribution
      )
      departmentDistribution.setOption({
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            type: 'pie',
            radius: '60%',
            data: this.dashboardData.departmentDistributionData
          }
        ]
      })
      this.charts.push(departmentDistribution)

      // 初始化年龄分布图
      const ageDistribution = echarts.init(this.$refs.ageDistribution)
      ageDistribution.setOption({
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: ['25岁以下', '26-35岁', '36-45岁', '46-55岁', '55岁以上']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: this.dashboardData.ageDistributionData,
            type: 'bar'
          }
        ]
      })
      this.charts.push(ageDistribution)

      // 初始化学历分布图
      const educationDistribution = echarts.init(
        this.$refs.educationDistribution
      )
      educationDistribution.setOption({
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            data: this.dashboardData.educationDistributionData
          }
        ]
      })
      this.charts.push(educationDistribution)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;
  position: relative;
  .data-card {
    display: flex;
    align-items: center;

    .icon-wrapper {
      width: 80px;
      height: 80px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 15px;

      i {
        font-size: 40px;
        color: #fff;
      }
    }

    .data-content {
      .data-title {
        font-size: 14px;
        color: #909399;
        margin-bottom: 10px;
      }

      .data-number {
        font-size: 24px;
        font-weight: bold;
        color: #303133;
      }
    }
  }

  .bg-blue {
    background-color: #409eff;
  }

  .bg-green {
    background-color: #67c23a;
  }

  .bg-orange {
    background-color: #e6a23c;
  }

  .bg-red {
    background-color: #f56c6c;
  }
}
</style>
