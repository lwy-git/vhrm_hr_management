<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img v-if="avatar" :src="avatar" class="user-avatar">
          <span v-else class="userName">{{ name?.charAt(0) }}</span>
          <span class="name">{{ name }}</span>
          <i class="el-icon-setting" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://gitee.com/longwangyang/lwyhr">
            <el-dropdown-item>项目地址</el-dropdown-item>
          </a>
          <!-- prevent阻止a标签默认事件 -->
          <a target="_blank" @click.prevent="updatePassword">
            <el-dropdown-item>修改密码</el-dropdown-item>
          </a>
          <!-- native修饰符注册组件的根元素的原生事件 -->
          <el-dropdown-item @click.native="logout">
            <span style="display:block;">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- sync
      接受isShow的值 -->
    <el-dialog
      width="500px"
      append-to-body="true"
      title="
    修改密码"
      :visible.sync="isShow"
    >

      <el-form ref="passForm" label-width="120px" :model="passForm" :rules="rules" @close="changeCancel">
        <el-form-item show-password label="旧密码" prop="oldPassword">
          <el-input v-model="passForm.oldPassword" show-password size="small" />
        </el-form-item>
        <el-form-item show-password label="新密码" prop="newPassword">
          <el-input v-model="passForm.newPassword" show-password size="small" />
        </el-form-item>
        <el-form-item show-password label="重置密码" prop="confirmPassword">
          <el-input v-model="passForm.confirmPassword" show-password size="small" />
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="changeConfirm">确认修改</el-button>
          <el-button size="mini" @click="changeCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { updatePass } from '@/api/user'
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      isShow: false,
      passForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }],
        newPassword: [{ required: true, message: '新密码不能为空', trigger: 'blur' }, { min: 6, message: '新密码至少6位', trigger: 'blur' }],
        confirmPassword: [{ required: true, message: '重置密码不能为空', trigger: 'blur' }, { validator: (rule, value, callback) => {
          if (value !== this.passForm.newPassword) {
            callback(new Error('重置密码与新密码不一致'))
          } else {
            callback()
          }
        }, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name'
    ])
  },
  methods: {
    updatePassword() {
      this.isShow = !this.isShow
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    changeConfirm() {
      this.$refs.passForm.validate(async isOk => {
        if (isOk) {
          const id = this.$store.getters.Id // 获取用户id
          console.log('id: ', id)
          debugger
          await updatePass(this.passForm, id)
          this.$message.success('修改密码成功')
          this.$refs.passForm.resetFields()// 重置密码
          this.isShow = false // 关闭弹窗
        }
      })
    },
    changeCancel() {
      this.$refs.passForm.resetFields()// 重置密码
      this.isShow = false // 关闭弹窗
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;
        align-items: center;
        .userName{
          width: 30px;
          height: 30px;
          line-height: 30px;
          border-radius: 50%;
          text-align: center;
          color: #fff;
          background-color: #04c9be;
        }
        .name{
       margin-right: 10px;
       font-size: 16px;
        }
        .el-icon-setting{
          font-size: 20px;
        }
        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
