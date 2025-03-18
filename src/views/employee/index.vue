<template>
  <div class="container">
    <div class="app-container">
      <!-- <div class="left">
        <span class="left-name">员工名称：</span>
        <el-input
          v-model="queryParams.keyword"
          style="margin-bottom:10px"
          type="text"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="输入员工姓名全员搜索"
          @input="changeValue"
        />
      </div> -->
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
      <div class="right">
        <el-row class="opeate-tools" type="flex" justify="end">
          <el-button size="mini" type="primary" @click="$router.push('/employee/detail')">添加员工</el-button>
          <el-button size="mini" @click="showExcelDialog = true">excel导入</el-button>
          <el-button size="mini" @click="exportEmployee">excel导出</el-button>
        </el-row>
        <!-- 表格组件 -->
        <el-table :data="employeeList">
          <el-table-column prop="staffPhoto" align="center" label="头像">
            <template v-slot="{ row }">
              <el-avatar v-if="row.staffPhoto" :src="row.staffPhoto" :size="30" />
              <span v-else class="username">{{ row.username?.charAt(0) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="username" label="姓名" />
          <el-table-column prop="mobile" label="手机号" sortable />
          <el-table-column prop="workNumber" label="工号" sortable />
          <el-table-column prop="formOfEmployment" label="聘用形式">
            <template v-slot="{ row }">
              <span> {{
                row.formOfEmployment=== 1 ? "正式" : row.formOfEmployment === 2 ? "非正式" : "无"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="departmentName" label="部门" />
          <el-table-column prop="timeofentry" label="入职时间" sortable />
          <el-table-column label="操作" width="200px" align="center">
            <template v-slot="{row}">
              <el-button size="mini" type="text" @click="$router.push(`/employee/detail/${row.id}`)">查看</el-button>
              <el-button size="mini" type="text" @click="btnRole(row.id)">角色</el-button>
              <el-button size="mini" type="text" @click="btnDel(row.id)">删除</el-button>
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

      </div>
    </div>
    <!-- excel导入弹层 .sync双向绑定数据控制弹窗显隐  uploadSuccess监听上传成功-->
    <ImportExcel :show-excel-dialog.sync="showExcelDialog" @uploadSuccess="getEmployeeList" />
    <!-- 角色弹窗 -->
    <el-dialog :visible.sync="showRoleDialog" title="分配角色">
      <!-- 弹层内容 -->
      <!-- checkbox -->
      <el-checkbox-group v-model="roleIds">
        <!-- 放置n个的checkbox  要执行checkbox的存储值 item.id-->
        <el-checkbox
          v-for="item in roleList"
          :key="item.id"
          :label="item.id"
        >{{ item.name }}</el-checkbox>
      </el-checkbox-group>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="mini" @click="btnRoleOK">确定</el-button>
          <el-button size="mini" @click="showRoleDialog = false">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getEmployeeList, exportEmployee, delEmployee, assignRole, getEmployeeDetail } from '@/api/employee'
import { getEnableRoleList } from '@/api/role'
import FileSaver from 'file-saver'
import ImportExcel from './components/importExcel.vue'
export default {
  name: 'Employee',
  components: {
    ImportExcel
  },
  data() {
    return {
      showExcelDialog: false, // 控制excel的弹层显示和隐藏
      // 存储查询参数
      queryParams: {
        departmentId: null,
        page: 1, // 当前页码
        pagesize: 10,
        keyword: '' // 模糊搜索字段
      },
      // 存储员工列表
      employeeList: [],
      total: 0, // 记录员工的总数
      showRoleDialog: false, // 用来控制角色弹层的显示
      roleList: [], // 接收角色列表
      roleIds: [], // 用来双向绑定数据的
      currentUserId: null // 用来记录当前点击的用户id
    }
  },
  created() {
    // 初始化获取员工列表
    this.getEmployeeList()
    // 获取可用角色列表
    this.getEnableRoleList()
  },
  methods: {
    // 获取员工列表的方法
    async getEmployeeList() {
      const { records, total } = await getEmployeeList(this.queryParams)
      // const res = await getEmployeeList(this.queryParams)
      // console.log('res', res)
      this.employeeList = records
      this.total = total // 赋值总数
    },
    // 切换页码
    changePage(newPage) {
      this.queryParams.page = newPage // 赋值新页码
      this.getEmployeeList() // 查询数据
    },
    // changeValue() {
    //   // 单位时间内只执行最后一次
    //   // this的实例上赋值了一个timer的属性
    //   clearTimeout(this.timer) // 清理上一次的定时器
    //   this.timer = setTimeout(() => {
    //     this.queryParams.page = 1
    //     this.getEmployeeList()
    //   }, 300)
    // },
    // 搜索
    handleSearch() {
      this.queryParams.page = 1
      this.getEmployeeList()
    },
    // 重置
    handleReset() {
      this.queryParams = {
        page: 1,
        pagesize: 10,
        keyword: ''
      }
      this.getEmployeeList()
    },
    // 导出excel表格
    async  exportEmployee() {
      const result = await exportEmployee() // 导出所有的员工接口
      // console.log(result) // 使用一个npm包 直接将blob文件下载到本地 file-saver
      // FileSaver.saveAs(blob对象,文件名称)
      FileSaver.saveAs(result, '员工信息表.xlsx') // 下载文件
    },
    // 删除员工
    btnDel(id) {
      console.log('id', id)

      this.$confirm('确认删除该员工信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await delEmployee(id)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          if (this.employeeList.length === 1 && this.queryParams.page > 1) this.queryParams.page--
          this.getEmployeeList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 点击查看可用角色
    // 点击角色按钮弹出层
    async btnRole(id) {
      this.showRoleDialog = true
      const { records } = await getEnableRoleList({ page: 1, pagesize: 10, state: 1 })
      this.roleList = records
      console.log('roleList', this.roleList)
      // 记录当前点击的id 因为后边 确定取消要存取给对应的用户
      this.currentUserId = id
      const { roleIds } = await getEmployeeDetail(id)
      this.roleIds = roleIds
      console.log('roleIds: ', this.roleIds)

      this.showRoleDialog = true // 调整顺序
    },
    // 点击分配角色的确定
    async  btnRoleOK() {
      console.log('roleIds: ', this.roleIds)
      await assignRole({
        id: this.currentUserId,
        roleIds: this.roleIds
      })
      this.$message.success('分配员工角色成功')
      this.showRoleDialog = false
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
