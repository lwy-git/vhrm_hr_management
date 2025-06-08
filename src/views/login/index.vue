<template>
  <div class="login-container">
    <div class="logo" />
    <div class="form">
      <h1>{{ isLogin ? "登录" : "注册" }}</h1>
      <el-card shadow="never" class="login-card">
        <!--登录/注册表单-->
        <el-form ref="form" :model="formData" :rules="formRules">
          <el-form-item prop="mobile">
            <el-input v-model="formData.mobile" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="formData.password"
              show-password
              placeholder="请输入密码"
            />
          </el-form-item>
          <el-form-item v-if="!isLogin" prop="confirmPassword">
            <el-input
              v-model="formData.confirmPassword"
              show-password
              placeholder="请确认密码"
            />
          </el-form-item>
          <el-form-item v-if="!isLogin || isLogin" prop="imageCode">
            <div style="display: flex">
              <el-input
                v-model="formData.imageCode"
                placeholder="请输入验证码"
                style="width: 250px; margin-right: 10px"
              />
              <img
                id="captchaImage"
                src="/api/checkCode"
                alt="验证码"
                style="height: 40px; width:90px; cursor: pointer"
                @click="loadCaptcha(0)"
              >
            </div>
          </el-form-item>
          <el-form-item prop="isAgrge">
            <el-checkbox v-model="formData.isAgrge">
              <el-button type="text" @click.stop="showAgreement">用户平台使用协议</el-button>
            </el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button
              style="width: 350px"
              type="primary"
              @click="handleSubmit"
            >
              {{ isLogin ? "登录" : "注册" }}
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="text" @click="toggleMode">
              {{ isLogin ? "没有账号?立即注册" : "已有账号?立即登录" }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- Move dialog inside the root div -->
    <el-dialog
      title="用户平台使用协议"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <div class="agreement-content">
        <h3>用户平台使用协议</h3>
        <div v-for="(section, index) in agreementSections" :key="index">
          <h4>{{ index + 1 }}. {{ section.title }}</h4>
          <p v-for="(item, idx) in section.content" :key="idx">
            {{ index + 1 }}.{{ idx + 1 }} {{ item }}
          </p>
          <ul v-if="section.list">
            <li v-for="(listItem, listIdx) in section.list" :key="listIdx">
              {{ listItem }}
            </li>
          </ul>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'Login',
  data() {
    // 密码确认校验
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.formData.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      isLogin: true,
      imageCodeUrl: '/api/user/imageCode', // 验证码图片地址
      formData: {
        mobile: process.env.NODE_ENV === 'development' ? '18881353791' : '',
        password: process.env.NODE_ENV === 'development' ? 'abcd@1234' : '',
        confirmPassword: '',
        imageCode: '', // 新增验证码字段
        isAgrge: process.env.NODE_ENV === 'development'
      },
      formRules: {
        mobile: [
          {
            required: true,
            message: '手机号不能为空',
            trigger: 'blur'
          },
          {
            pattern: /^1[3-9]\d{9}/,
            message: '手机号格式不正确',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 16,
            message: '密码格式不正确',
            trigger: 'blur'
          }
        ],
        confirmPassword: [
          {
            required: true,
            message: '请确认密码',
            trigger: 'blur'
          },
          {
            validator: validateConfirmPassword,
            trigger: 'blur'
          }
        ],
        imageCode: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
          }
        ],
        isAgrge: [
          {
            validator: (rule, value, callback) => {
              value
                ? callback()
                : callback(new Error('您必须勾选用户平台使用协议'))
            }
          }
        ]
      },
      dialogVisible: false, // 添加对话框显示状态
      agreementSections: [
        {
          title: '总则',
          content: [
            '本协议是用户（"您"）与我们平台（以下简称"平台"）之间就平台服务等相关事宜所订立的契约。',
            '请您仔细阅读本协议，您点击"同意"、"注册"按钮后，本协议即构成对双方有约束力的法律文件。'
          ]
        },
        {
          title: '服务内容',
          content: ['平台向您提供以下服务：'],
          list: [
            '信息浏览、搜索及使用',
            '信息发布及传播',
            '账号管理服务',
            '其他相关服务'
          ]
        },
        {
          title: '账号注册与安全',
          content: ['您承诺以下事项：'],
          list: [
            '提供真实、准确、完整的个人资料',
            '及时更新注册资料，保证其真实性、准确性和完整性',
            '妥善保管账号及密码，不得将账号借给他人使用'
          ]
        },
        {
          title: '用户行为规范',
          content: ['您在使用平台服务时须遵守以下规定：'],
          list: [
            '遵守中华人民共和国相关法律法规',
            '不得发布违法、违规或侵犯他人权益的内容',
            '不得从事任何可能损害平台系统、数据的行为',
            '不得利用平台服务从事任何违法或不当的活动'
          ]
        },
        {
          title: '隐私保护',
          content: ['我们重视用户的隐私保护，承诺：'],
          list: [
            '对您的个人信息进行严格保密',
            '未经您同意，不向第三方披露您的个人信息',
            '采取合理措施保护您的个人信息安全'
          ]
        }
      ]
    }
  },
  created() {
    this.loadCaptcha(0)
  },
  methods: {
    toggleMode() {
      this.isLogin = !this.isLogin
      this.$refs.form.resetFields()
    },
    handleSubmit() {
      this.$refs.form.validate(async(isOk) => {
        if (isOk) {
          try {
            // 先校验验证码
            const valid = await this.validateImageCode()
            if (!valid) {
              this.$message.error('验证码错误')
              this.loadCaptcha(0)
              return
            }

            if (this.isLogin) {
              // 登录逻辑
              await this.$store.dispatch('user/login', {
                mobile: this.formData.mobile,
                password: this.formData.password,
                imageCode: this.formData.imageCode,
                isAgrge: this.formData.isAgrge
              })
              this.$router.push('/')
            } else {
              // 注册逻辑
              const res = await this.$store.dispatch('user/register', {
                mobile: this.formData.mobile,
                password: this.formData.password,
                confirmPassword: this.formData.confirmPassword,
                isAgrge: this.formData.isAgrge,
                imageCode: this.formData.imageCode
              })
              debugger
              console.log('res', res)

              this.$message.success('注册成功，请登录')
              this.isLogin = true
              this.formData = {
                mobile: res.mobile,
                password: res.password,
                confirmPassword: '',
                imageCode: '',
                isAgrge: false
              }
            }
          } catch (error) {
            this.$message.error(error.message || (this.isLogin ? '登录失败' : '注册失败'))
          }
        }
      })
    },
    // 添加验证码校验方法

    async validateImageCode() {
      try {
        const response = await axios.post('/api/verifyCode', {
          imageCode: this.formData.imageCode
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        return response.data // 返回布尔值，表示是否验证通过
      } catch (error) {
        console.error('验证码验证失败:', error)
        return false
      }
    },

    // 动态加载验证码图片
    loadCaptcha(type) {
      var img = document.getElementById('captchaImage')
      var url = '/api/checkCode?type=' + type // 传递 type 参数

      // 防止浏览器缓存
      var timestamp = new Date().getTime()
      url = url + '&t=' + timestamp // 加上时间戳来防止缓存
      // 使用 Axios 请求验证码
      axios.get(url, { responseType: 'arraybuffer' })
        .then(function(response) {
          // 将后端返回的图片数据处理成可显示的图片
          var base64 = btoa(String.fromCharCode(...new Uint8Array(response.data)))
          img.src = 'data:image/jpeg;base64,' + base64 // 更新验证码图片
        })
        .catch(function(error) {
          console.error('验证码错误:', error)
          this.loadCaptcha(0)
        })
    },
    showAgreement(e) {
      e.preventDefault() // 防止触发checkbox
      this.dialogVisible = true
    }
  }
}
</script>
<style lang="scss">
.login-container {
  display: flex;
  align-items: stretch;
  height: 100vh;
  .logo {
    flex: 3;
    background: rgba(38, 72, 176) url(../../assets/common/bg5.jpg) no-repeat
      center / cover;
    border-top-right-radius: 60px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    padding: 0 100px;
    p {
      color: #fff;
      font-size: 18px;
      margin-top: 20px;
      width: 300px;
      text-align: center;
    }
  }
  .form {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 176px;
    .el-card {
      border: none;
      padding: 0;
    }
    h1 {
      padding-left: 20px;
      font-size: 24px;
    }
    .el-input {
      width: 350px;
      height: 44px;
      .el-input__inner {
        background: #f4f5fb;
      }
    }
    .el-checkbox {
      color: #606266;
    }
  }
}

.agreement-content {
  max-height: 400px;
  overflow-y: auto;
  padding: 20px;
  line-height: 1.6;

  h3 {
    text-align: center;
    margin-bottom: 20px;
  }

  p {
    margin-bottom: 10px;
  }
}
</style>
