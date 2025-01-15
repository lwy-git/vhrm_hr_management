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
              <div class="icon-wrapper bg-green">
                <i class="el-icon-s-custom" />
              </div>
              <div class="data-content">
                <div class="data-title">本月新入职</div>
                <div class="data-number">{{ dashboardData.newEmployees }}</div>
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
              <div class="icon-wrapper bg-red">
                <i class="el-icon-date" />
              </div>
              <div class="data-content">
                <div class="data-title">平均司龄</div>
                <div class="data-number">{{ dashboardData.averageYears }}年</div>
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
              <span>员工入职趋势</span>
            </div>
            <div ref="employeeTrend" style="height: 300px" />
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

      <!-- 意见箱图标 -->
      <div class="suggestion-box" @click="handelSuggest()">
        <i class="el-icon-message" />
      </div>

      <!-- 建议反馈对话框 -->
      <el-dialog
        title="意见箱"
        :visible.sync="showSuggestionDialog"
        width="30%"
      >
        <el-form
          ref="suggestionForm"
          :model="suggestionForm"
          :rules="suggestionRules"
        >
          <el-form-item prop="content">
            <el-input
              v-model="suggestionForm.content"
              type="textarea"
              :rows="4"
              placeholder="请输入您的建议..."
            />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showSuggestionDialog = false">取 消</el-button>
          <el-button
            type="primary"
            :loading="submitting"
            @click="submitSuggestion"
          >提 交</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { getDashboardData, submitSuggestion } from '@/api/dashboard'

export default {
  name: 'Dashboard',
  data() {
    return {
      dashboardData: {
        totalEmployees: 256,
        newEmployees: 12,
        departmentCount: 8,
        averageYears: 3.5,
        employeeTrendData: [15, 12, 18, 22, 16, 20, 25, 30, 28, 24, 20, 12],
        departmentDistributionData: [
          { value: 80, name: '技术部' },
          { value: 45, name: '销售部' },
          { value: 35, name: '市场部' },
          { value: 30, name: '人事部' },
          { value: 25, name: '财务部' },
          { value: 20, name: '行政部' },
          { value: 15, name: '法务部' },
          { value: 6, name: '高管团队' }
        ],
        ageDistributionData: [45, 85, 65, 42, 19],
        educationDistributionData: [
          { value: 120, name: '本科' },
          { value: 68, name: '硕士' },
          { value: 45, name: '大专' },
          { value: 18, name: '博士' },
          { value: 5, name: '其他' }
        ]
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
    await this.fetchDashboardData()
    this.initCharts()
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
        const response = await getDashboardData()
        // 如果接口调用失败,使用本地数据
        if (!response || !response.data) {
          return
        }
        this.dashboardData = response.data
      } catch (error) {
        console.error('获取仪表盘数据失败:', error)
      }
    },
    initCharts() {
      // 初始化员工入职趋势图
      const employeeTrend = echarts.init(this.$refs.employeeTrend)
      employeeTrend.setOption({
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: [
            '1月',
            '2月',
            '3月',
            '4月',
            '5月',
            '6月',
            '7月',
            '8月',
            '9月',
            '10月',
            '11月',
            '12月'
          ]
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: this.dashboardData.employeeTrendData,
            type: 'line',
            smooth: true
          }
        ]
      })
      this.charts.push(employeeTrend)

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
          data: ['20-25岁', '26-30岁', '31-35岁', '36-40岁', '40岁以上']
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
    },
    async submitSuggestion() {
      try {
        const valid = await this.$refs.suggestionForm.validate()
        if (valid) {
          this.submitting = true
          await submitSuggestion(this.suggestionForm)
          this.$message({
            message: '感谢您的建议！我们会认真考虑。',
            type: 'success'
          })
          this.suggestionForm.content = ''
          this.showSuggestionDialog = false
        }
      } catch (error) {
        this.$message.error('提交建议失败，请稍后重试')
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;
  position: relative;

  .suggestion-box {
    position: fixed;
    right: 40px;
    bottom: 40px;
    width: 50px;
    height: 50px;
    background: #409eff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    i {
      font-size: 24px;
      color: #fff;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px 0 rgba(0, 0, 0, 0.15);
    }
  }

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
