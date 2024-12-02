<template>
  <div class="container">
    <div class="app-container">
      <!-- 角色管理内容 -->
      <div class="role-operate">
        <el-button
          size="mini"
          type="primary"
          @click="showDialog = true"
        >添加角色</el-button>
      </div>
      <!-- 放置table组件 -->
      <el-table :data="roleList">
        <!-- 放置列 -->
        <el-table-column prop="name" align="center" width="200" label="角色">
          <template v-slot="{ row }">
            <!-- 条件判断 isEdit是否编辑-->
            <el-input v-if="row.isEdit" v-model="row.editRow.name" size="mini" />
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="state" align="center" width="200" label="启用">
          <!-- 自定义列结构  v-slot使用插槽获取表格列数据-->
          <template v-slot="{ row }">
            <el-switch v-if="row.isEdit" v-model="row.editRow.state" :active-value="1" :inactive-value="0" active-color="#13ce66" />
            <span v-else>
              {{
                row.state === 1 ? "已启用" : row.state === 0 ? "未启用" : "无"
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="description" align="center" label="描述">
          <template v-slot="{ row }">
            <el-input v-if="row.isEdit" v-model="row.editRow.description" size="mini" type="textarea" />
            <span v-else>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template v-slot="{ row }">
            <template v-if="row.isEdit">
              <!-- 编辑状态 -->
              <el-button type="primary" size="mini" @click="btnIsEdit(row)">确定</el-button>
              <el-button size="mini" @click="row.isEdit=false">取消</el-button>
            </template>
            <template v-else>
              <!-- 非编辑状态 -->
              <el-button size="mini" type="text">分配权限</el-button>
              <el-button
                size="mini"
                type="text"
                @click="btnEdit(row)"
              >编辑</el-button>
              <el-button size="mini" type="text" @click="btnDel(row.id)">删除</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <!-- 放置分页组件 -->
      <el-row type="flex" style="height: 60px" align="middle" justify="end">
        <span class="total-count">共 {{ pageParams.total }} 条</span>
        <!-- 放置分页组件 -->
        <el-pagination
          :page-size="pageParams.pagesize"
          :current-page="pageParams.page"
          :total="pageParams.total"
          background
          layout="prev, pager, next"
          @current-change="changePage"
        />
      </el-row>
    </div>
    <el-dialog width="500px" title="新增角色" :visible.sync="showDialog">
      <!-- 表单内容 -->
      <el-form
        ref="roleForm"
        :model="roleForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="roleForm.name" style="width: 300px" size="mini" />
        </el-form-item>
        <el-form-item label="启用">
          <!-- 如果不需要校验 就不需要写 prop属性 -->
          <el-switch
            v-model="roleForm.state"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            size="mini"
          />
        </el-form-item>
        <el-form-item prop="description" label="角色描述">
          <el-input
            v-model="roleForm.description"
            type="textarea"
            :rows="3"
            style="width: 300px"
            size="mini"
          />
        </el-form-item>
        <el-form-item>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-button
                type="primary"
                size="mini"
                @click="btnConfirm"
              >确定</el-button>
              <el-button size="mini" @click="closeDialog">取消</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getRoleList, addRole, updateRole, deleteRole } from '@/api/role'
export default {
  name: 'Role',
  data() {
    return {
      // 弹出框是否显示
      showDialog: false,
      roleList: [],
      pageParams: {
        page: 1, // 第几页
        pagesize: 5, // 每页多少条
        total: 0
      },
      roleForm: {
        name: '',
        description: '',
        state: 0 // 默认未1启用 关闭 0 打开1
      },
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '角色描述不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { rows, total } = await getRoleList(this.pageParams)
      this.roleList = rows
      this.pageParams.total = total
      // 针对每一行数据添加一个编辑标记
      this.roleList.forEach((item) => {
      // item.isEdit = false // 添加一个属性 初始值为false /item.isEdit = false不具备响应式
      // 数据响应式的问题  数据变化 视图更新
      // 添加的动态属性 不具备响应式特点
      // this.$set(目标对象, 属性名称, 初始值) 可以针对目标对象 添加的属性 添加响应式
        this.$set(item, 'isEdit', false)
        // 编辑状态下 记录原始数据
        // editRow的数据是针对当前行的数据做了一份拷贝，针对这个拷贝，可以随意修改
        this.$set(item, 'editRow', {
          name: item.name,
          state: item.state,
          description: item.description
        })
      })
    },
    // 切换分页时 请求新的数据
    changePage(newPage) {
      this.pageParams.page = newPage // 赋值当前页码
      this.getRoleList()
    },
    // 确认
    btnConfirm() {
      this.$refs.roleForm.validate(async(valid) => {
        if (valid) {
          // 确认添加或者编辑角色
          await addRole(this.roleForm)
          this.$message.success('新增角色成功')
          this.getRoleList()
          // 关闭弹框，重置表单
          this.closeDialog()
        }
      })
    },
    // 点击取消关闭弹出框，重置表单
    closeDialog() {
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    },
    // 点击编辑行
    btnEdit(row) {
      row.isEdit = true // 改变行的编辑状态
      // 更新缓存数据
      row.editRow.name = row.name
      row.editRow.state = row.state
      row.editRow.description = row.description
    },
    // 点击确定编辑
    async btnIsEdit(row) {
      // 角色和描述不能为空
      if (row.editRow.name && row.editRow.description) {
        await updateRole({ ...row.editRow, id: row.id })
        // 请求更新成功提示
        this.$message.success('编辑角色成功')
        // 更新显示数据  退出编辑状态
        // row.name = row.editRow.name // eslint的一校验 误判
        // Object.assign(target, source)
        Object.assign(row, {
          ...row.editRow,
          isEdit: false // 退出编辑模式
        }) // 规避eslint的误判
      } else {
        this.$message.error('角色名称和描述不能为空')
      }
    },
    btnDel(id) {
      // 删除角色
      this.$confirm('确认删除该角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteRole(id)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          if (this.roleList.length === 1) this.pageParams.page--
          this.getRoleList()
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
<style scoped>
.role-operate {
  padding: 10px;
}
.total-count {
  margin-right: 10px;
  font-size: 14px;
  color: gray;
}
</style>
