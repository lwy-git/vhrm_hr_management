<template>
  <div class="add-form">
    <el-dialog title="设置" :visible.sync="dialogFormVisible">
      <el-tabs v-model="activeName" style="margin-left:20px" @tab-click="handleClick">
        <el-tab-pane label="出勤设置" name="first">
          <el-form
            ref="dataForm"
            :rules="rules"
            :model="formBase"
            label-position="right"
            label-width="100px"
            style="width:700px;"
            class="titmInfo"
          >
            <el-form-item label="出勤时间：" prop="morningStartTime" style="">
              <el-time-select
                v-model="formBase.morningStartTime"
                :picker-options="{
                  start: '00:00',
                  step: '00:30',
                  end: '14:00'
                }"
                :placeholder="formBase.morningStartTime"
                class="timePicker"
              />
              -
              <el-time-select
                v-model="formBase.afternoonEndTime"
                :picker-options="{
                  start: '14:00',
                  step: '00:30',
                  end: '24:00'
                }"
                :placeholder="formBase.afternoonEndTime"
                class="timePicker"
              />
            </el-form-item>
          </el-form>
          <div class="el-dialog__footer dialog-footer">
            <el-button type="primary" @click="handleAttendance">保存更新</el-button>
            <el-button @click="handleClose">取消</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="扣款设置" name="third">
          <el-form
            ref="deductionsForm"
            :rules="rules"
            :model="deductionsBase"
            label-position="right"
            label-width="80px"
            class="titmInfo"
          />
          <el-table ref="singleTable" :data="stateData" style="width: 100%">
            <el-table-column>
              <template slot-scope="scope">
                <div>
                  {{ scope.row.name }}
                  <el-switch
                    v-model="scope.row.isEnable"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    @change="handleStatus($event,scope.row)"
                  />
                </div>

                <div v-if="scope.row.dedTypeCode==='1'" class="attentInfo">

                  <div>
                    <p>
                      迟到≤
                      <el-input
                        v-model="scope.row.periodUpperLimit"
                        class="inputInfo"
                        value="30"

                        @input.native="handleInput($event)"
                      />分钟，每次扣款
                      <el-input
                        v-model="scope.row.dedPeriodUpper"
                        class="inputInfo"

                        @input.native="handleInput($event)"
                      />元
                    </p>
                  </div>

                  <div>
                    <p>
                      迟到>
                      <el-input v-model="scope.row.periodLowerLimit" class="inputInfo" disabled style="width: 60px;" />分钟，每次扣款
                      <el-input
                        v-model="scope.row.dedPeriodLower"
                        class="inputInfo"

                        @input.native="handleInputPoint($event)"
                      />元
                    </p>
                  </div>
                </div>
                <div v-if="scope.row.dedTypeCode==='2'" class="attentInfo">

                  <div>
                    <p>
                      早退≤
                      <el-input
                        v-model="scope.row.periodUpperLimit"
                        class="inputInfo"

                        value="30"
                        @input.native="handleInput($event)"
                      />分钟，每次扣款
                      <el-input
                        v-model="scope.row.dedPeriodUpper"
                        class="inputInfo"

                        @input.native="handleInput($event)"
                      />元
                    </p>
                  </div>

                  <div>
                    <p>
                      早退>
                      <el-input v-model="scope.row.periodLowerLimit" class="inputInfo" disabled />分钟，每次扣款
                      <el-input
                        v-model="scope.row.dedPeriodLower"
                        class="inputInfo"
                        @input.native="handleInputPoint($event)"
                      />元
                    </p>
                  </div>
                </div>
                <div v-if="scope.row.dedTypeCode==='3'" class="attentInfo">
                  <p>
                    每次矿工扣款
                    <el-input
                      v-model="scope.row.dedAbsence"
                      class="inputInfo"
                      @input.native="handleInput($event)"
                    />元
                  </p>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="el-dialog__footer dialog-footer">
            <el-button type="primary" @click="handleDeductions">保存更新</el-button>
            <el-button @click="handleClose">取消</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import {
  attendanceSave,
  getAttendanceConfig,
  getstateData,
  deductionsSave
} from '@/api/attendance'

export default {
  name: 'AttendanceSet',
  props: [],
  data() {
    return {
      dialogFormVisible: false,
      isShowSelect: false,
      activeName: 'first',
      formBase: {
        morningStartTime: '',
        afternoonEndTime: ''
      },
      deductionsBase: {},
      departmentData: [],
      stateData: [],
      oldNum: '',
      rules: {
        morningStartTime: [
          { required: true, message: '请选择上午开始时间', trigger: 'change' }
        ],
        afternoonEndTime: [
          { required: true, message: '请选择下午结束时间', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    inpNum() {
      return this.oldNum
    }
  },
  async created() {
    this.stateData = []
  },
  methods: {
    async dialogFormV() {
      this.dialogFormVisible = true
      const res = await getAttendanceConfig()
      console.log('res', res)

      this.formBase.morningStartTime = res.morningStartTime
      this.formBase.afternoonEndTime = res.afternoonEndTime
      console.log('this.formBase.morningStartTime', this.formBase.morningStartTime)
      const resData = await getstateData()
      this.stateData = resData
      for (let i = 0; i < this.stateData.length; i++) {
        this.stateData[i].isEnable = Boolean(this.stateData[i].isEnable)
      }
      console.log('resData', resData)
    },
    dialogFormH() {
      this.dialogFormVisible = false
    },
    clearFormDate() {
      this.formBase = {}
    },
    handleClose() {
      this.dialogFormH()
      // this.clearFormDate()
    },
    async handleAttendance() {
      this.$refs.dataForm.validate(async valid => {
        if (valid) {
          const res = await attendanceSave(this.formBase)
          this.$message.success(res)
          this.$emit('dataSearch')
          this.handleClose()
        }
      })
    },
    handleDeductions() {
      this.$refs.deductionsForm.validate(async valid => {
        if (valid) {
          var deductionList = this.stateData
          deductionList.forEach(item => {
            if (item.isEnable) {
              item.isEnable = 1
            } else {
              item.isEnable = 0
            }
          })
          console.log('deductionList', deductionList)

          const res = await deductionsSave(deductionList)
          this.$message.success(res)
          this.$emit('dataSearch')
          this.handleClose()
        }
      })
    },
    handleClick(tab, event) {
      // 移除对部门相关方法的调用
    },
    typeTip(obj) {
      this.$message.error(obj)
    },
    handleInput: function(e) {
      // getInteger(e, this.typeTip)
    },
    handleInputPoint(e) {
      // getIntegerPoint(e)
    },
    handleStatus(e, obj) {
      // 移除对部门相关数据的引用
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.inputInfo{width: 60px;}

.attentInfo {
  p {
    padding: 3px 0;
  }
  .el-input--medium {
    .el-input__inner {
      height: 24px;
      line-height: 24px;
    }
  }
}
.titmInfo {
  .el-date-editor--timerange.el-input__inner {
    width: 280px;
  }
  .el-date-editor .el-range-separator {
    padding: 0 15px 0 0;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.tipInfo {
  p {
    padding: 5px 0;
  }
}
.titInfo {
  border-bottom: 1px solid #dcdfe6;
  height: 30px;
  line-height: 30px;
  padding: 0 0 15px;
}
.attentInfo {
  padding: 30px 15px 15px 80px;
}
</style>
