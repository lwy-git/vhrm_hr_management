<template>
  <div class="container">
    <div class="app-container">
      <!-- 申请卡片 -->
      <el-card class="apply-card" shadow="hover">
        <div class="data-card">
          <div class="icon-wrapper bg-blue">
            <i class="el-icon-document" />
          </div>
          <div class="data-content">
            <div class="data-title">我的申请记录</div>
            <div class="data-number">{{ total }}条</div>
          </div>
        </div>
      </el-card>

      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择申请类型"
          clearable
          size="small"
          style="width: 200px; margin-right: 10px"
        >
          <el-option label="请假" value="0" />
          <el-option label="加班" value="1" />
          <el-option label="离职" value="2" />
        </el-select>
        <el-button size="small" type="primary" @click="handleSearch">搜索</el-button>
        <el-button size="small" @click="handleReset">重置</el-button>
        <el-button type="primary" size="small" style="float: right" @click="showApplicationDialog">提交申请</el-button>
      </div>

      <!-- 我的申请列表 -->
      <el-table v-loading="loading" :data="myApplications" style="margin-top: 20px;margin-left: 20px;">
        <el-table-column prop="type" label="申请类型">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type === 0">请假</el-tag>
            <el-tag v-if="scope.row.type === 1" type="warning">加班</el-tag>
            <el-tag v-if="scope.row.type === 2" type="danger">离职</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="申请原因" />
        <el-table-column prop="applyTime" label="申请时间" />
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" type="info">待审批</el-tag>
            <el-tag v-if="scope.row.status === 1" type="success">已通过</el-tag>
            <el-tag v-if="scope.row.status === 2" type="danger">已拒绝</el-tag>
            <el-tag v-if="scope.row.status === 3" type="warning">已撤销</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status === 0"
              type="text"
              size="mini"
              @click="handleCallBack(scope.row)"
            >撤销</el-button>
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

      <!-- 新建申请对话框 -->
      <el-dialog title="新建申请" :visible.sync="dialogVisible" width="500px">
        <el-form ref="applicationForm" :model="applicationForm" :rules="rules" label-width="100px">
          <el-form-item label="申请类型" prop="type">
            <el-select v-model="applicationForm.type" placeholder="请选择申请类型" style="width: 100%">
              <el-option label="请假" value="0" />
              <el-option label="加班" value="1" />
              <el-option label="离职" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="申请时间" prop="applyTime">
            <el-date-picker
              v-model="applicationForm.applyTime"
              type="datetime"
              value-format="yyyy-MM-dd"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="申请原因" prop="reason">
            <el-input
              v-model="applicationForm.reason"
              type="textarea"
              :rows="4"
              placeholder="请输入申请原因"
            />
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitApplication">提交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getApprovalList, submitApplication, callbackApplication } from '@/api/approval'
import store from '@/store'
export default {
  name: 'MyApplications',
  data() {
    return {
      loading: false,
      queryParams: {
        page: 1,
        pagesize: 10,
        applicantId: store.getters.Id,
        type: ''
      },
      myApplications: [], // 将从后端获取的数据
      total: 0,
      dialogVisible: false,
      applicationForm: {
        type: '',
        reason: '',
        applicantId: store.getters.Id,
        applicant: store.getters.name,
        status: 0,
        applyTime: ''
      },
      rules: {
        type: [
          { required: true, message: '请选择申请类型', trigger: 'change' }
        ],
        reason: [
          { required: true, message: '请输入申请原因', trigger: 'blur' },
          { min: 5, max: 200, message: '长度在 5 到 200 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getApprovalList()
  },
  methods: {
    // 获取我的申请列表
    async getApprovalList() {
      const { records, total } = await getApprovalList(this.queryParams)
      this.myApplications = records
      this.total = total
    },

    // 显示申请对话框
    showApplicationDialog() {
      this.dialogVisible = true
      this.applicationForm = {
        type: '',
        reason: '',
        applicantId: store.getters.Id,
        applicant: store.getters.name,
        status: 0,
        applyTime: ''
      }
    },
    // 撤销申请
    async handleCallBack(row) {
      try {
        await this.$confirm('确认撤销该条申请?', '提示', {
          type: 'warning'
        })
        // TODO: 调用接口撤销申请
        await callbackApplication(row)
        this.$message.success('撤销申请成功')
        this.getApprovalList()
      } catch (error) {
        console.error('撤销申请失败:', error)
      }
    },
    // 提交申请
    submitApplication() {
      this.$refs.applicationForm.validate(async(valid) => {
        if (valid) {
          try {
            // TODO: 调用后端接口提交申请
            await submitApplication(this.applicationForm)
            this.$message.success('提交申请成功')
            this.dialogVisible = false
            this.getApprovalList()
          } catch (error) {
            console.error('提交申请失败:', error)
          }
        }
      })
    },

    // 当前页改变
    changePage(val) {
      this.queryParams.page = val
      this.getApprovalList()
    },

    // 搜索
    handleSearch() {
      this.queryParams.page = 1
      this.getApprovalList()
    },

    // 重置
    handleReset() {
      this.queryParams.type = ''
      this.queryParams.page = 1
      this.queryParams.pagesize = 10
      this.getApprovalList()
    }
  }
}
</script>
<style lang="scss" scoped>
.apply-card {
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
}.total-count {
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
