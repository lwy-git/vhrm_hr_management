<template>
  <el-dialog :title="showTitle" :visible="showDialog" @close="close">
    <el-form ref="addDept" :model="formData" :rules="rules" label-width="120px">
      <el-form-item prop="name" label="部门名称">
        <el-input v-model="formData.name" placeholder="2-10个字符" style="width: 80%" size="mini" />
      </el-form-item>
      <el-form-item prop="code" label="部门编码">
        <el-input v-model="formData.code" placeholder="2-10个字符" style="width: 80%" size="mini" />
      </el-form-item>
      <el-form-item prop="managerId" label="部门负责人">
        <el-select v-model="formData.managerId" placeholder="请选择负责人" style="width: 80%" size="mini">
          <!-- 下拉选项 循环 负责人数据 label表示显示的字段 value 存储字段 -->
          <el-option
            v-for="item in managerList"
            :key="item.id"
            :label="item.username"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="introduce" label="部门介绍">
        <el-input v-model="formData.introduce" placeholder="1-100个字符" type="textarea" size="mini" :rows="4" style="width: 80%" />
      </el-form-item>
      <el-form-item>
        <!-- 按钮 -->
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <el-button size="mini" type="primary" @click="btnOK">确定</el-button>
            <el-button size="mini" @click="close">取消</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { getDepartment, getManagerList, addDepartment, getDepartmentDetail, updateDepartment } from '@/api/department'
export default {
  name: 'AddDept',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    currentNodeId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      formData: {
        code: '', // 部门编码
        introduce: '', // 部门介绍
        managerId: '', // 部门负责人id
        name: '', // 部门名称
        pid: '' // 父级部门的id
      },
      managerList: [], // 存储负责人列表
      rules: {
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
          {
            min: 2, max: 10, message: '部门编码的长度为2-10个字符', trigger: 'blur'
          },
          {
            trigger: 'blur',
            // 自定义校验模式
            validator: async(rule, value, callback) => {
              // value就是输入的编码
              let result = await getDepartment()
              if (this.formData.id) {
                // 如果id存在就是编辑 result需要排除自身id
                result = result.filter(item => item.id !== this.formData.id)
              }
              // result数组中是否存在 value值
              if (result.some(item => item.code === value)) {
                callback(new Error('部门中已经有该编码了'))
              } else {
                callback()
              }
            }
          }
        ], // 部门编码
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' }, {
          min: 1, max: 100, message: '部门介绍的长度为1-100个字符', trigger: 'blur'
        }], // 部门介绍
        managerId: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }], // 部门负责人id
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
          {
            min: 2, max: 10, message: '部门名称的长度为2-10个字符', trigger: 'blur'
          }, {
            trigger: 'blur',
            // 自定义校验模式
            validator: async(rule, value, callback) => {
            // value就是输入的编码
              let result = await getDepartment()
              if (this.formData.id) {
                // 如果id存在就是编辑 result需要排除自身id
                result = result.filter(item => item.id !== this.formData.id)
              }
              // result数组中是否存在 value值
              if (result.some(item => item.name === value)) {
                callback(new Error('部门中已经有该名称了'))
              } else {
                callback()
              }
            }
          }] // 部门名称
        // pid: '' // 父级部门的id 不需要做校验
      }
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  created() {
    // 获取负责人列表并赋值给 managerList
    this.getManagerList()
  },
  methods: {
    close() {
      // resetFields()只能重置模板绑定的数据，无法重置动态数据id
      // 这里直接把formData置空
      this.formData = {
        code: '',
        introduce: '',
        managerId: '',
        name: '',
        pid: ''
      }
      this.$refs.addDept.resetFields() // 重置表单
      this.$emit('update:showDialog', false)
    },
    async getManagerList() {
      this.managerList = await getManagerList()
    },
    // 点击确定时调用
    btnOK() {
      this.$refs.addDept.validate(async isOK => {
        if (isOK) {
          let msg = '新增'
          if (this.formData.id) {
            // 编辑
            msg = '编辑'
            await updateDepartment(this.formData)
          } else {
            // 新增
            await addDepartment({ ...this.formData, pid: this.currentNodeId })
          }

          // 通知父组件更新
          this.$emit('updateDepartment')
          // 提示消息
          this.$message.success(`${msg}部门成功`)
          this.close()
        }
      })
    },
    // 编辑时获取部门信息并赋值给formData
    async getDeptDetail() {
      const result = await getDepartmentDetail(this.currentNodeId)
      this.formData = { ...result }
    }
  }
}
</script>
