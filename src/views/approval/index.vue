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
          <el-option label="请假" value="leave" />
          <el-option label="加班" value="overtime" />
          <el-option label="离职" value="resignation" />
        </el-select>
        <el-select
          v-model="queryParams.status"
          placeholder="请选择审批状态"
          style="width: 200px; margin-right: 10px"
          size="small"
        >
          <el-option label="待审批" value="pending" />
          <el-option label="已通过" value="approved" />
          <el-option label="已拒绝" value="rejected" />
          <el-option label="已撤销" value="callbacked" />
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
            <el-tag v-if="scope.row.type === 'leave'">请假</el-tag>
            <el-tag
              v-if="scope.row.type === 'overtime'"
              type="warning"
            >加班</el-tag>
            <el-tag
              v-if="scope.row.type === 'resignation'"
              type="danger"
            >离职</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="申请原因" />
        <el-table-column prop="applyTime" label="申请时间" />
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.status === 'pending'"
              type="info"
            >待审批</el-tag>
            <el-tag
              v-if="scope.row.status === 'approved'"
              type="success"
            >已通过</el-tag>
            <el-tag
              v-if="scope.row.status === 'rejected'"
              type="danger"
            >已拒绝</el-tag>
            <el-tag
              v-if="scope.row.status === 'callbacked'"
              type="warning"
            >已撤销</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status === 'pending'"
              type="text"
              size="mini"
              @click="handleApprove(scope.row)"
            >通过</el-button>
            <el-button
              v-if="scope.row.status === 'pending'"
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

      <!-- 审批详情对话框 -->
      <el-dialog title="审批详情" :visible.sync="dialogVisible" width="500px">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="申请时间">{{
            currentRow.applyTime
          }}</el-descriptions-item>
          <el-descriptions-item label="申请人">{{
            currentRow.applicant
          }}</el-descriptions-item>
          <el-descriptions-item label="申请类型">{{
            currentRow.type === "leave"
              ? "请假"
              : currentRow.type === "overtime"
                ? "加班"
                : currentRow.type === "dimission"
                  ? "离职"
                  : "其他"

          }}</el-descriptions-item>
          <el-descriptions-item label="申请原因">{{
            currentRow.reason
          }}</el-descriptions-item>

          <el-descriptions-item label="状态" style="margin-left: 10px;">
            <el-tag
              v-if="currentRow.status === 'pending'"
              type="info"
            >待审批</el-tag>
            <el-tag
              v-if="currentRow.status === 'approved'"
              type="success"
            >已通过</el-tag>
            <el-tag
              v-if="currentRow.status === 'rejected'"
              type="danger"
            >已拒绝</el-tag>
            <el-tag
              v-if="currentRow.status === 'callbacked'"
              type="warning"
            >已撤销</el-tag>
          </el-descriptions-item>
        </el-descriptions>
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
    handleCurrentChange(val) {
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
}

</style>
