<template>
  <div class="container">
    <div class="app-container">
      <!-- 步骤条 -->
      <el-steps :active="step" finish-status="success">
        <el-step title="筛选员工" description="根据条件筛选要评估的员工" />
        <el-step title="填写评估" description="填写员工的绩效评估信息" />
        <el-step title="提交评估" description="确认并提交绩效评估结果" />
      </el-steps>

      <div class="search-bar">
        <el-input
          v-model="queryParams.employeeName"
          placeholder="员工姓名"
          style="width: 200px; margin-right: 10px"
          size="small"
          clearable
          @keyup.enter.native="handleSearch"
        />
        <el-date-picker
          v-model="queryParams.period"
          type="date"
          placeholder="评估时间"
          style="width: 200px; margin-right: 10px"
          size="small"
          value-format="yyyy-MM-dd"
          @keyup.enter.native="handleSearch"
        />
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
        <el-button size="small" type="primary" @click="handleSearch">搜索</el-button>
        <el-button size="small" type="primary" @click="resetQuery">重置</el-button>
      </div>
      <el-button size="small" type="primary" style="margin: 20px 10px 10px 10px;" @click="handleAdd">新增绩效评估</el-button>

      <!-- 绩效评估列表 -->
      <el-table
        v-loading="loading"
        :data="performanceList"
        style="margin-top: 30px; margin-left: 10px;"
      >
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
        >   <template slot-scope="scope">
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
        <!-- <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
        /> -->
        <el-table-column
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleEdit(scope.row.id)"
            >
              编辑
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
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
        :title="operationType === 'add' ? '新增绩效评估' : operationType === 'edit' ? '编辑绩效评估' : '查看绩效评估'"
        :visible.sync="dialogVisible"
        width="700px"
        :close-on-click-modal="false"
      >
        <el-form
          ref="performanceForm"
          :model="performanceForm"
          :rules="rules"
          label-width="100px"
          :disabled="operationType === 'view'"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="员工" prop="employeeId">
                <el-select
                  v-model="performanceForm.employeeId"
                  placeholder="请选择员工"
                  filterable
                  style="width: 100%"
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
            </el-col>
            <el-col :span="12">
              <el-form-item label="评估时间" prop="evaluationPeriod">
                <el-date-picker
                  v-model="performanceForm.evaluationPeriod"
                  type="month"
                  placeholder="选择评估日期"
                  value-format="yyyy-MM"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="工作质量" prop="workQualityScore">
                <el-input
                  v-model.number="performanceForm.workQualityScore"
                  placeholder="请输入0-100的分数"
                  type="number"
                  style="width: 100%"
                  @input="calculateTotalScore"
                >
                  <template slot="append">分</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工作效率" prop="workEfficiencyScore">
                <el-input
                  v-model.number="performanceForm.workEfficiencyScore"
                  placeholder="请输入0-100的分数"
                  type="number"
                  style="width: 100%"
                  @input="calculateTotalScore"
                >
                  <template slot="append">分</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="团队协作" prop="teamworkScore">
                <el-input
                  v-model.number="performanceForm.teamworkScore"
                  placeholder="请输入0-100的分数"
                  type="number"
                  style="width: 100%"
                  @input="calculateTotalScore"
                >
                  <template slot="append">分</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="创新能力" prop="attendanceScore">
                <el-input
                  v-model.number="performanceForm.attendanceScore"
                  placeholder="请输入0-100的分数"
                  type="number"
                  style="width: 100%"
                  @input="calculateTotalScore"
                >
                  <template slot="append">分</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="总评分" prop="score">
                <div style="display: flex; align-items: center;">
                  <el-input
                    v-model.number="performanceForm.score"
                    type="number"
                    style="width: 100%"
                    disabled
                  >
                    <template slot="append">分</template>
                  </el-input>

                  <el-tooltip content="总评分的计算方式为：工作质量权重30%，工作效率权重25%，团队协作权重25%，出勤情况权重20%" placement="top" effect="light">
                    <i
                      class="el-icon-question"
                      style="cursor: pointer; font-size: 20px; color:#E6A23C; margin-left: 10px;"
                    />
                  </el-tooltip>
                </div>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="等级">
                <div style="display: flex; align-items: center;">
                  <el-input v-model="performanceForm.level" disabled />

                  <el-tooltip content="绩效等级评定：90分及以上为A，80 - 89分为B，70 - 79分为C，60 - 69分为D，60分以下为E" placement="top" effect="light">
                    <i
                      class="el-icon-question"
                      style="cursor: pointer; font-size: 20px; color:#E6A23C; margin-left: 10px;"
                    />
                  </el-tooltip>
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="评语" prop="comments">
            <el-input
              v-model="performanceForm.comments"
              type="textarea"
              :rows="4"
              placeholder="请输入评语"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button v-if="operationType !== 'view'" type="primary" @click="submitForm">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getPerformanceList,
  addPerformance,
  updatePerformance,
  delPerformance,
  getPerformanceDetail
} from '@/api/performance'
import { getEmployeeList } from '@/api/employee'
import store from '@/store'
export default {
  name: 'Performance',
  data() {
    return {
      loading: false,
      performanceList: [
        // {
        //   id: 1,
        //   employeeName: '张三',
        //   department: '技术部',
        //   evaluationPeriod: '2023-06',
        //   score: 95,
        //   level: 'A',
        //   evaluator: '李主管',
        //   comments: '工作态度积极,技术能力强,团队协作好',
        //   createTime: '2023-06-30 14:30:00'
        // }
      ],
      employeeList: [],
      total: 0,
      queryParams: {
        page: 1,
        pagesize: 10,
        employeeName: '',
        period: '',
        level: ''
      },
      dialogVisible: false,
      operationType: 'add',
      performanceForm: {
        employeeId: '',
        employeeName: '',
        department: '',
        departmentId: '',
        evaluationPeriod: '',
        workQualityScore: '',
        workEfficiencyScore: '',
        teamworkScore: '',
        attendanceScore: '',
        score: '',
        level: '',
        comments: '',
        evaluator: store.getters.name
      },
      rules: {
        employeeId: [
          { required: true, message: '请选择员工', trigger: 'change' }
        ],
        evaluationPeriod: [
          { required: true, message: '请选择评估时间', trigger: 'change' }
        ],
        workQualityScore: [
          { required: true, message: '请输入工作质量评分', trigger: 'blur' },
          { type: 'number', min: 0, max: 100, message: '评分范围为0-100', trigger: 'change' }
        ],
        workEfficiencyScore: [
          { required: true, message: '请输入工作效率评分', trigger: 'blur' },
          { type: 'number', min: 0, max: 100, message: '评分范围为0-100', trigger: 'change' }
        ],
        teamworkScore: [
          { required: true, message: '请输入团队协作评分', trigger: 'blur' },
          { type: 'number', min: 0, max: 100, message: '评分范围为0-100', trigger: 'change' }
        ],
        attendanceScore: [
          { required: true, message: '请输入出勤情况评分', trigger: 'blur' },
          { type: 'number', min: 0, max: 100, message: '评分范围为0-100', trigger: 'change' }
        ],
        comments: [
          { required: true, message: '请输入评语', trigger: 'blur' }
        ]
      },
      step: 1 // 新增步骤状态
    }
  },
  created() {
    this.getEmployeeList()
    this.getPerformanceList()
  },
  methods: {
    // 获取员工列表
    async getEmployeeList() {
      const { records } = await getEmployeeList(this.queryParams)
      this.employeeList = records
    },
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
    async getPerformanceList() {
      const { records, total } = await getPerformanceList(this.queryParams)
      this.performanceList = records
      this.total = total // 赋值总数
    },
    handleSearch() {
      this.queryParams.page = 1
      this.getPerformanceList()
      this.step = 1 // 搜索后回到第一步
    },
    resetQuery() {
      this.queryParams = {
        page: 1,
        pagesize: 10,
        employeeName: '',
        period: '',
        level: ''
      }
      this.getPerformanceList()
      this.step = 1 // 重置后回到第一步
    },
    handleCurrentChange(val) {
      this.queryParams.page = val
      this.getPerformanceList()
    },
    handleEmployeeChange(employeeId) {
      const employee = this.employeeList.find(item => item.id === employeeId)
      if (employee) {
        this.performanceForm.employeeName = employee.username
        this.performanceForm.department = employee.departmentName
        this.performanceForm.departmentId = employee.departmentId
      }
    },
    calculateTotalScore() {
      const { workQualityScore, workEfficiencyScore, teamworkScore, attendanceScore } = this.performanceForm
      const totalScore = workQualityScore * 0.3 + workEfficiencyScore * 0.25 + teamworkScore * 0.25 + attendanceScore * 0.2
      this.performanceForm.score = totalScore
      this.calculateLevel(totalScore)
    },
    calculateLevel(score) {
      if (score >= 90) {
        this.performanceForm.level = 'A'
      } else if (score >= 80) {
        this.performanceForm.level = 'B'
      } else if (score >= 70) {
        this.performanceForm.level = 'C'
      } else if (score >= 60) {
        this.performanceForm.level = 'D'
      } else {
        this.performanceForm.level = 'E'
      }
    },
    handleAdd() {
      this.operationType = 'add'
      this.performanceForm = {
        employeeId: '',
        employeeName: '',
        department: '',
        departmentId: '',
        evaluationPeriod: '',
        workQualityScore: '',
        workEfficiencyScore: '',
        teamworkScore: '',
        attendanceScore: '',
        score: '',
        level: '',
        comments: '',
        evaluator: store.getters.name
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.performanceForm.clearValidate()
      })
      this.step = 2 // 进入填写评估步骤
    },
    async handleEdit(id) {
      this.operationType = 'edit'
      this.dialogVisible = true
      const performanceData = await getPerformanceDetail(id)
      console.log('performanceData: ', performanceData)
      this.performanceForm = performanceData
      this.step = 2 // 进入编辑评估步骤
    },
    handleDelete(id) {
      this.$confirm('确认删除该绩效记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await delPerformance(id)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        if (this.performanceList.length === 1 && this.queryParams.page > 1) this.queryParams.page--
        this.getPerformanceList()
        this.step = 1 // 删除后回到第一步
      }).catch(() => {})
    },
    async submitForm() {
      this.$refs.performanceForm.validate(async valid => {
        if (valid) {
          try {
            if (this.operationType === 'add') {
              await addPerformance(this.performanceForm)
              this.$message.success('新增成功')
            } else {
              await updatePerformance(this.performanceForm)
              this.$message.success('更新成功')
            }
            this.dialogVisible = false
            this.getPerformanceList()
            this.step = 3 // 提交后进入提交评估步骤
          } catch (error) {
            this.$message.error(this.operationType === 'add' ? '新增失败' : '更新失败')
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  background: #fff;
  .total-count {
    margin-right: 10px;
    font-size: 14px;
    color: gray;
  }
  .left {
    display: flex;
    width: 350px;
    align-items: center;
    padding: 20px;
    // border-right: 1px solid #eaeef4;
    .left-name {
      width: 100px;
      height: 100%;
      font-size: 15px;
      color: #666666;
    }
  }
  .right {
    flex: 1;
    padding: 20px;
    .opeate-tools {
      margin: 10px;
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
      display: inline-block;
    }
  }
  // 调整步骤条上下左右间距
  .el-steps {
    padding: 20px 10px 20px 10px;
    margin-top: 10px; // 上间距
    margin-bottom: 10px; // 下间距
    margin-left: 10px; // 左间距
    margin-right: 10px; // 右间距
  }
.search-bar {
  margin: 20px 0;
  padding: 10px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
}
</style>
