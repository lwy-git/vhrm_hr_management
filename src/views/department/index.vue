<template>
  <div class="container">
    <div class="app-container">
      <!-- 树形架构 -->
      <el-tree default-expand-all :data="depts" :props="defaultProps">
        <!-- 利用插槽获取数据 -->
        <template v-slot="{data}">
          <el-row style="width: 100%; height: 40px;" type="flex" justify="space-between" align="middle">
            <el-col>{{ data.name }}</el-col>
            <el-col :span="4">
              <span class="tree-manager">{{ data.managerName }}</span>
              <!--$event实参表示类型  -->
              <el-dropdown @command="operateDept($event, data.id)">
                <!-- 显示区域内容 -->
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <!-- 下拉菜单选项 -->
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                  <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="del">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </template>
      </el-tree>
    </div>
    <!-- ref获取dom实例，也可以获取自定义组件实例 -->
    <addEditDialog ref="addDept" :current-node-id="currentNodeId" :show-dialog.sync="showDialog" @updateDepartment="getDepartment" />
  </div>
</template>
<script>
import { getDepartment, deleteDepartment } from '@/api/department'
import { transListToTreeData } from '@/utils/index'
import addEditDialog from './components/addEditDialog.vue'
export default {
  name: 'Department',
  components: { addEditDialog },
  data() {
    return {
      currentNodeId: null, // 存储当前点击的id
      showDialog: false,
      depts: [

      ],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created() {
    this.getDepartment() // 获取数据
  },
  methods: {
    async getDepartment() {
      const res = await getDepartment()
      this.depts = transListToTreeData(res, 0)
    },
    operateDept(type, id) {
      if (type === 'add') {
        this.showDialog = true
        this.currentNodeId = id// 记录id添加子部门用
      } else if (type === 'edit') {
        this.showDialog = true
        this.currentNodeId = id// 记录id编辑获取详情使用
        // 更新props===异步操作，this.$nextTick异步更新
        this.$nextTick(() => {
          this.$refs.addDept.getDeptDetail()
        })
      } else {
        // 删除
        this.$confirm('确认删除该部门?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async() => {
            await deleteDepartment(id)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getDepartment()
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
}
</script>
<style  scoped>
  .app-container{
    padding: 30px 140px;
    font-size: 14px;
  }
  .tree-manager {
     width: 50px;
     display: inline-block;
     margin: 10px;
   }
</style>
