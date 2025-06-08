<template>
  <div class="container">
    <div class="app-container">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-input
          v-model="queryParams.applicant"
          placeholder="请输入申请人姓名搜索"
          style="width: 200px; margin-right: 10px"
          size="small"
          @keyup.enter.native="handleSearch"
        />
        <el-select
          v-model="queryParams.type"
          placeholder="请选择申请类型"
          style="width: 200px; margin-right: 10px"
          size="small"
        >
          <el-option label="请假" value="0" />
          <el-option label="加班" value="1" />
          <el-option label="离职" value="2" />
        </el-select>
        <el-select
          v-model="queryParams.status"
          placeholder="请选择审批状态"
          style="width: 200px; margin-right: 10px"
          size="small"
        >
          <el-option label="待审批" value="0" />
          <el-option label="已通过" value="1" />
          <el-option label="已拒绝" value="2" />
          <el-option label="已撤销" value="3" />
        </el-select>
        <el-button
          size="small"
          type="primary"
          @click="handleSearch"
        >搜索</el-button>
        <el-button size="small" @click="resetQuery">重置</el-button>
      </div>

      <!-- 审批列表 -->
      <el-table v-loading="loading" :data="approvalList" style="margin-top: 30px; margin-left: 10px;">
        <el-table-column prop="applicant" label="申请人" />
        <el-table-column prop="type" label="申请类型">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type === 0">请假</el-tag>
            <el-tag
              v-if="scope.row.type === 1"
              type="warning"
            >加班</el-tag>
            <el-tag
              v-if="scope.row.type === 2"
              type="danger"
            >离职</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="申请原因" />
        <el-table-column prop="applyTime" label="申请时间" />
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.status === 0"
              type="info"
            >待审批</el-tag>
            <el-tag
              v-if="scope.row.status === 1"
              type="success"
            >已通过</el-tag>
            <el-tag
              v-if="scope.row.status ===2"
              type="danger"
            >已拒绝</el-tag>
            <el-tag
              v-if="scope.row.status === 3"
              type="warning"
            >已撤销</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status ===0"
              type="text"
              size="mini"
              @click="handleApprove(scope.row)"
            >通过</el-button>
            <el-button
              v-if="scope.row.status ===0"
              type="text"
              size="mini"
              @click="handleReject(scope.row)"
            >拒绝</el-button>
            <el-button
              type="text"
              size="mini"
              @click="handleDetail(scope.row)"
            >详情</el-button>
            <el-button
              type="text"
              size="mini"
              @click="handleDelete(scope.row)"
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

      <el-dialog title="审批详情" :visible.sync="dialogVisible" width="800px">
        <div v-if="currentRow" class="approval-details">
          <!-- 使用el-row和el-col布局来确保每行显示两个信息 -->
          <el-row :gutter="20">
            <!-- 申请时间 -->
            <el-col :span="12">
              <div class="approval-item">
                <span class="label">申请时间:</span>
                <span class="value">{{ currentRow.applyTime }}</span>
              </div>
            </el-col>

            <!-- 申请人 -->
            <el-col :span="12">
              <div class="approval-item">
                <span class="label">申请人:</span>
                <span class="value">{{ currentRow.applicant }}</span>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <!-- 申请类型 -->
            <el-col :span="12">
              <div class="approval-item">
                <span class="label">申请类型:</span>
                <span class="value">
                  {{ currentRow.type === 0
                    ? "请假"
                    : currentRow.type === 1
                      ? "加班"
                      : currentRow.type ===2
                        ? "离职"
                        : "其他" }}
                </span>
              </div>
            </el-col>

            <!-- 申请原因 -->
            <el-col :span="12">
              <div class="approval-item">
                <span class="label">申请原因:</span>
                <span class="value">{{ currentRow.reason }}</span>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <!-- 状态 -->
            <el-col :span="12">
              <div class="approval-item">
                <span class="label">状态:</span>
                <span class="value">
                  <el-tag v-if="currentRow.status ===0" type="info">待审批</el-tag>
                  <el-tag v-if="currentRow.status ===1" type="success">已通过</el-tag>
                  <el-tag v-if="currentRow.status ===2" type="danger">已拒绝</el-tag>
                  <el-tag v-if="currentRow.status === 3" type="warning">已撤销</el-tag>
                </span>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 底部按钮 -->
        <template #footer>
          <el-button size="small" @click="dialogVisible = false">关闭</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getApprovalList,
  approveApplication,
  rejectApplication,
  delApproval,
  getApprovalDetail
} from '@/api/approval'
import { delEmployee } from '@/api/employee'
export default {
  name: 'Approvals',
  data() {
    return {
      // 加载状态
      loading: false,
      // 查询参数
      queryParams: {
        page: 1,
        pagesize: 10,
        applicant: '',
        type: '',
        status: ''
      },
      // 审批列表数据
      approvalList: [
        // {
        //   id: 1,
        //   applicant: '张三',
        //   type: 'leave',
        //   reason: '感冒发烧需要休息',
        //   applyTime: '2024-01-10 09:00:00',
        //   status: 'pending'
        // }
      ],
      // 总条数
      total: 0,
      // 对话框显示状态
      dialogVisible: false,
      currentRow: {}
      // 当前选中行数据
    }
  },
  created() {
    this.getApprovalList()
  },
  methods: {
    // 获取审批列表
    async getApprovalList() {
      // 使用员工的历史工资数据
      const { records, total } = await getApprovalList(this.queryParams)
      this.approvalList = records
      this.total = total // 赋值总数
      console.log('records: ', records)
    },
    // 搜索
    handleSearch() {
      this.queryParams.page = 1
      this.getApprovalList()
    },
    // 重置查询
    resetQuery() {
      this.queryParams = {
        page: 1,
        pagesize: 10,
        applicant: '',
        type: '',
        status: ''
      }
      this.getApprovalList()
    },
    // 通过审批
    async handleApprove(row) {
      try {
        await this.$confirm('确认通过该审批申请?', '提示', {
          type: 'warning'
        })
        // TODO: 调用接口处理审批通过
        await approveApplication(row)
        this.$message.success('审批通过成功')
        // 如果是离职申请，审批通过就删除员工
        if (row.type === 2) {
          await delEmployee(row.applicantId)
        }
        this.getApprovalList()
      } catch (error) {
        console.error('审批通过失败:', error)
      }
    },
    // 拒绝审批
    async handleReject(row) {
      try {
        await this.$confirm('确认拒绝该审批申请?', '提示', {
          type: 'warning'
        })
        // TODO: 调用接口处理审批拒绝
        await rejectApplication(row)
        this.$message.success('审批拒绝成功')
        this.getApprovalList()
      } catch (error) {
        console.error('审批拒绝失败:', error)
      }
    },
    // 查看详情
    async handleDetail(row) {
      const ApprovalData = await getApprovalDetail(row.id)
      console.log('ApprovalData: ', ApprovalData)
      this.currentRow = ApprovalData
      this.dialogVisible = true
    },
    // 删除审批申请
    async handleDelete(row) {
      try {
        await this.$confirm('确认删除该审批申请?', '提示', {
          type: 'warning'
        })
        // TODO: 调用接口处理删除审批申请
        await delApproval(row.id)
        this.$message.success('审批申请删除成功')
        this.getApprovalList()
      } catch (error) {
        console.error('审批申请删除失败:', error)
      }
    },
    // 每页条数改变
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getApprovalList()
    },
    // 当前页改变
    changePage(val) {
      this.queryParams.page = val
      this.getApprovalList()
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
  .approval-details {
    padding: 20px;
  }

  .approval-item {
    display: flex;
    align-items: center;
    margin-bottom: 15px; /* 增加上下项之间的间距 */
    padding: 10px; /* 给每个项增加内边距 */
    border-radius: 5px; /* 增加圆角效果 */
    background-color: #f9f9f9; /* 背景色 */
  }

  .approval-item .label {
    font-weight: bold;
    width: 100px;
    margin-right: 10px; /* 增加标签和内容之间的间距 */
  }

  .approval-item .value {
    color: #333;
  }
}

</style>
