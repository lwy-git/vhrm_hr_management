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
              <el-dropdown>
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>添加</el-dropdown-item>
                  <el-dropdown-item>编辑</el-dropdown-item>
                  <el-dropdown-item>删除</el-dropdown-item>

                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </template>
      </el-tree>
    </div>
  </div>
</template>
<script>
import { getDepartment } from '@/api/department'
export default {
  name: 'Department',
  data() {
    return {
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
      this.depts = res
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
