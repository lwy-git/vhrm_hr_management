<template>
  <el-dialog
    width="500px"
    title="考勤信息导入"
    :visible="showExcelDialog"
    @close="$emit('update:showExcelDialog', false)"
  >
    <el-row type="flex" justify="center">
      <div class="upload-excel">
        <input
          ref="excel-upload-input"
          class="excel-upload-input"
          type="file"
          accept=".xlsx, .xls"
          @change="uploadChange"
        >
        <div class="drop" @dragover="handleDragOver" @drop="handleDrop">
          <i class="el-icon-upload" />
          <el-button type="text" @click="downLoadTemplate">下载导入模板</el-button>
          <span>将文件拖到此处或
            <el-button type="text" @click="btnUpload">点击上传</el-button>
          </span>
        </div>
      </div>
    </el-row>
    <el-row type="flex" justify="end">
      <!-- update:props属性名，值 直接修改 .sync修饰符的属性值 -->
      <el-button
        size="mini"
        type="primary"
        @click="$emit('update:showExcelDialog', false)"
      >取消</el-button>
    </el-row>
  </el-dialog>
</template>
<script>
import { uploadAttendanceExcel, getAttendanceTemplate } from '@/api/attendance'
import FileSaver from 'file-saver'
export default {
  props: {
    showExcelDialog: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 新增方法，阻止dragover默认行为
    // 该方法用于阻止浏览器在拖拽文件时执行默认的行为，例如显示一个默认的拖拽效果。
    handleDragOver(event) {
      event.preventDefault() // 阻止默认行为，以便触发drop事件
    },

    // 新增方法，处理drop事件
    // 该方法在拖拽文件放到指定区域时触发，处理文件上传的逻辑。
    handleDrop(event) {
      event.preventDefault() // 阻止默认行为，防止浏览器默认处理拖拽内容

      // 获取拖拽的文件列表
      const files = event.dataTransfer.files

      // 如果有文件被拖放，调用上传处理方法
      if (files.length > 0) {
        // 模拟input change事件，调用文件上传处理方法
        this.uploadChange({ target: { files }})
      }
    },
    btnUpload() {
      // this.$refs.属性名 和 this.$refs[属性名] 等价
      this.$refs['excel-upload-input'].click()
    },
    async uploadChange(event) {
      console.log('event.target.files', event.target.files)
      // 调用上传接口
      const files = event.target.files // input的文件列表
      if (files.length > 0) {
        // 上传excel
        const data = new FormData()
        // file: file类型
        data.append('file', files[0]) // 将文件参数加入到formData中
        try {
          // 调用上传接口
          const res = await uploadAttendanceExcel(data) // 参数  form-data 需要文件file
          this.$emit('uploadSuccess')// 通知父组件上传成功
          console.log('res', res)
          this.$message.success(res)
          this.$emit('update:showExcelDialog', false) // 关闭对话框
        // eslint-disable-next-line no-empty
        } catch (error) {
        } finally {
          // 不论成功或者失败都会清空文件选择器中的内容
          this.$refs['excel-upload-input'].value = ''
        }
      }
    },
    async downLoadTemplate() {
      const data = await getAttendanceTemplate()
      FileSaver.saveAs(data, '考勤导入模版.xlsx')
    }
  }
}
</script>

<style scoped lang="scss">
.upload-excel {
  display: flex;
  justify-content: center;
  margin: 20px;
  width: 360px;
  height: 180px;
  align-items: center;
  color: #697086;
  .excel-upload-input {
    display: none;
    z-index: -9999;
  }
  .btn-upload,
  .drop {
    border: 1px dashed #dcdfe6;
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 160px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .drop {
    line-height: 40px;
    color: #bbb;
    i {
      font-size: 60px;
      display: block;
      color: #c0c4cc;
    }
     /* 调整按钮样式，避免点击区域重叠 */
     el-button {
      padding: 0 10px;
    }
  }
}
</style>
