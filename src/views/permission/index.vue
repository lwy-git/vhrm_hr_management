<template>
  <div class="container">
    <div class="app-container">
      <el-button class="btnAdd" size="mini" type="primary" @click="addPermission">添加权限</el-button>
      <el-table :data="permissionsList" style="margin-top: 30px; margin-left: 10px;">
        <el-table-column align="center" prop="name" label="名称" />
        <el-table-column align="center" prop="code" label="标识" />
        <el-table-column align="center" prop="enVisible" label="描述">
          <template slot-scope="scope">
            <el-tag :type="getTagType(scope.row.enVisible)">{{ scope.row.enVisible?"启用":"停用" }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="description" label="描述" />
        <el-table-column align="center" label="操作" width="200">
          <template v-slot="{ row }">
            <el-button size="mini" type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 放置分页组件 -->
      <el-row type="flex" style="height: 60px" align="middle" justify="end">
        <span class="total-count">共 {{ total }} 条</span>
        <!-- 放置分页组件 -->
        <el-pagination
          :page-size="pageParams.pagesize"
          :current-page="pageParams.page"
          :total="total"
          background
          layout="prev, pager, next"
          @current-change="changePage"
        />
      </el-row>
    </div>
    <!-- 放置一个弹层 用来编辑新增节点 -->
    <el-dialog :title="`${showText}权限点`" :visible="showDialog" @close="btnCancel">
      <!-- 表单 -->
      <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" style="width:90%" />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch
            v-model="formData.enVisible"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            size="mini"
          />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { getPermissionList, updatePermission, addPermission, getPermissionDetail, delPermission } from '@/api/permission'
export default {
  data() {
    return {
      pageParams: {
        page: 1, // 第几页
        pagesize: 10// 每页多少条
      },
      total: 0, // 总数据量
      permissionsList: [],
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        enVisible: 0 // 默认关闭
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },
      showDialog: false
    }
  },
  computed: {
    showText() {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async  getPermissionList() {
      const { records, total } = await getPermissionList(this.pageParams)
      this.permissionsList = records
      this.total = total // 赋值总数
    },
    // 添加一级权限
    addPermission() {
      this.showDialog = true
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        enVisible: 0 // 默认关闭
      }
    },
    getTagType(state) {
      if (state === 0) return 'info'
      if (state === 1) return 'success'
    },
    // 确定

    btnOK() {
      this.$refs.perForm.validate().then(() => {
        if (this.formData.id) {
          // id存在为编辑
          return updatePermission(this.formData)
        }
        return addPermission(this.formData)
      }).then(() => {
        //  提示消息
        this.$message.success('新增权限成功')
        this.getPermissionList()
        this.showDialog = false
      })
    },
    // 取消
    btnCancel() {
      // 重置数据确保formData字段为空
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        enVisible: 0 // 默认关闭
      }
      this.$refs.perForm.resetFields()
      this.showDialog = false
    },
    async editPermission(id) {
      // 根据获取id获取详情
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
    }, // 切换分页时 请求新的数据
    changePage(newPage) {
      this.pageParams.page = newPage // 赋值当前页码
      this.getPermissionList()
    },
    delPermission(id) {
      // 删除权限
      this.$confirm('确认删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await delPermission(id)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          if (this.permissionsList.length === 1 && this.queryParams.page > 1) {
            this.queryParams.page--
          }
          this.getPermissionList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }

}
</script>
<style lang="scss" scoped>
.btnAdd {
  margin: 10px;
}
.total-count {
  margin-right: 10px;
  font-size: 14px;
  color: gray;
}
</style>
