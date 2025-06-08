<template>
  <div class="dashboard-container">
    <div class="app-container">
      <div class="edit-form">
        <el-form ref="userForm" :model="userInfo" :rules="rules" label-width="220px">
          <!-- 姓名 部门 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名" prop="username">
                <el-input v-model="userInfo.username" placeholder="请输入姓名" size="mini" class="inputWidth" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 工号 入职时间 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="工号" prop="workNumber">
                <el-input v-model="userInfo.workNumber" placeholder="请输入工号" size="mini" class="inputWidth" />
              </el-form-item>
            </el-col>
          </el-row>
          <!--手机 聘用形式  -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="手机" prop="mobile">
                <el-input v-model="userInfo.mobile" :disabled="!!$route.params.id" placeholder="请输入手机号" size="mini" class="inputWidth" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="年龄" prop="age">
                  <el-input v-model="userInfo.age" placeholder="请输入年龄" size="mini" class="inputWidth" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="学历" prop="education">
                  <el-select v-model="userInfo.education" placeholder="请选择学历" size="mini" class="inputWidth">
                    <el-option label="大专" value="大专" />
                    <el-option label="本科" value="本科" />
                    <el-option label="硕士" value="硕士" />
                    <el-option label="博士" value="博士" />
                    <el-option label="其他" value="其他" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-col :span="12">
              <el-form-item label="部门" prop="departmentId">
                <!-- 放置及联部门组件 -->
                <!-- 引入并使用 -->
                <!-- inputW样式会给到selectTree中 template第一层的组件 -->
                <detailCascader v-model="userInfo.departmentId" class="inputWidth" />

              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="聘用形式" prop="formOfEmployment">
                <el-select v-model="userInfo.formOfEmployment" placeholder="请选择聘用形式" size="mini" class="inputWidth">
                  <el-option label="正式" :value="1" />
                  <el-option label="非正式" :value="2" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="入职时间"
                prop="timeofentry"
              >
                <el-date-picker
                  v-model="userInfo.timeofentry"
                  size="mini"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择入职时间"
                  class="inputWidth"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="转正时间">
                <el-date-picker v-model="userInfo.correctionTime" size="mini" type="datetime" class="inputWidth" placeholder="请选择转正时间" value-format="yyyy-MM-dd HH:mm:ss" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 员工照片 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="员工头像">
                <!-- 放置上传图片 -->
                <imageUpload v-model="userInfo.staffPhoto" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 保存个人信息 -->
          <el-row type="flex">
            <el-col :span="12" style="margin-left: 220px">
              <el-button size="mini" type="primary" @click="saveData">保存更新</el-button>
              <el-button size="mini" type="primary" @click="goBack">取消</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import detailCascader from './detailCascader.vue'
import imageUpload from './imageUpload.vue'
import { getDepartment } from '@/api/department'
import { addEmployee, getEmployeeDetail, updateEmployee } from '@/api/employee'
export default {
  components: {
    detailCascader,
    imageUpload
  },
  data() {
    return {
      userInfo: {
        username: '', // 用户名
        mobile: '', // 手机号
        workNumber: '', // 工号
        age: '', // 年龄
        education: '', // 学历
        formOfEmployment: null, // 聘用形式
        departmentId: null, // 部门id
        departmentName: '', // 部门名称
        timeofentry: '', // 入职时间
        correctionTime: '', // 转正时间
        staffPhoto: '' // 头像
      },
      departmentList: [],
      rules: {
        username: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        age: [
          { required: true, message: '请输入年龄', trigger: 'blur' }
        ],
        education: [
          { required: true, message: '请选择学历', trigger: 'change' }
        ],
        workNumber: [
          { required: true, message: '请输入学历', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            //   pattern 正则表达式
            pattern: /^1[3-9]\d{9}$/,
            message: '手机号格式不正确',
            trigger: 'blur'
          }
        ],
        formOfEmployment: [
          { required: true, message: '请选择聘用形式', trigger: 'blur' }
        ],
        // departmentId: [
        //   { required: true, message: '请选择部门', trigger: 'blur' }
        // ],
        timeofentry: [
          { required: true, message: '请选择入职时间', trigger: 'blur' }
        ],
        correctionTime: [
          { required: true, message: '请选择转正时间', trigger: 'blur' },
          {
            // 自定义校验转正时间不能小于入职时间，获取两个时间的时间戳进行比较
            validator: (rule, value, callback) => {
              if (this.userInfo.timeOfEntry) {
                if (new Date(this.userInfo.timeOfEntry).getTime() > new Date(value).getTime()) {
                  callback(new Error('转正时间不能小于入职时间'))
                  return
                }
              }
              callback()
            }
          }
        ]
      }
    }
  },
  created() {
    // 点击查看时获取路由参数的中id，id存在获取详情数据
    this.$route.params.id && this.getEmployeeDetail()
    this.getDepartment()
  },
  methods: {
    goBack() {
      this.$router.push('/employee')
    },
    async getDepartment() {
      this.departmentList = await getDepartment()
    },
    saveData() {
      this.$refs.userForm.validate(async valid => {
        if (valid) {
          const department = this.departmentList.find((item) => item.id === this.userInfo.departmentId)
          if (department) {
            this.userInfo.departmentName = department.name
          }
          if (this.$route.params.id) {
            await updateEmployee(this.userInfo)
            this.$message.success('更新员工成功')
          } else {
            await addEmployee(this.userInfo)
            this.$message.success('新增员工成功')
          }

          this.$router.push('/employee')
        }
      })
    },
    async getEmployeeDetail() {
      this.userInfo = await getEmployeeDetail(this.$route.params.id)
    }
  }
}
</script>

    <style scoped lang="scss">
  .edit-form {
    background: #fff;
    padding: 20px;
    .inputWidth {
      width: 380px;
    }
  }
  </style>
