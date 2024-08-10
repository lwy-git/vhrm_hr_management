<template>
  <!-- 关键声明： id  和 width 和  height 都会影响图表的展示-->
  <div>
    <div
      id="demo"
      style="width: 500px;height:400px;"
    />
    <button
      @click="changeType"
    >xxx</button>
  </div></template>

<script>

export default {
  name: 'HelloWord',
  data() {
    return {
      xData1: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      yData1: [140, 150, 80, 200, 400, 500],
      yData2: [180, 250, 10, 300, 600, 200],
      type: 'line',
      isshow: true,
      radius: [],
      center: []
    }
  },
  mounted() {
    // 进入页面就执行一次
    this.changeType()
    this.drawChart()
  },
  methods: {
    changeType() {
      if (this.type === 'line') {
        this.type = 'pie'
        this.radius = ['40%', '70%']
        this.center = ['50%', '70%']
      } else if (this.type === 'pie') {
        this.type = 'line'
      }

      this.isshow = !this.isshow
      console.log(this.type)
      this.drawChart()
    },
    drawChart() {
      // 2. 基于准备好的dom，初始化echarts实例
      // 此处的意思就是，对 demo 元素 进行图表初始化的相关操作
      var myChart = this.$echarts.init(document.getElementById('demo'))
      // 3. 指定图表的配置项和数据
      // 该处就是图表内容，在官网的示例里面，要复制过来到项目里面的也是这一块内容
      var option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          data: ['数据1', '数据2']
        },
        // toolbox: {
        //   show: true,
        //   feature: {
        //     magicType: { show: true, type: ['pie', 'line'], title: { line: '切换为折线图', pie: '切换为柱状图图' }}
        //   }
        // },
        calculable: true,
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.xData1,
          show: this.isshow // 隐藏 X 轴

        },
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '数据1',
            type: this.type, // 形状为折线图
            data: this.yData1,
            itemStyle: {
              color: '#5087EC'
            },
            label: {
              // 柱状图上方文本标签，默认展示数值信息
              show: true,
              position: 'top'
            },
            radius: this.radius,
            center: this.center,
            startAngle: 180,
            endAngle: 360
          },
          {
            name: '数据2',
            type: this.type, // 形状为柱状图
            data: this.yData2,
            radius: this.radius,
            center: this.center,
            startAngle: 180,
            endAngle: 360,
            itemStyle: {
              colors: ['#68BBC4', 'red', 'blue']
            },
            label: {
              // 柱状图上方文本标签，默认展示数值信息
              show: true,
              position: 'top'
            }
          }
        ]
      }
      // 4.使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
      // myChart.on('legendselectchanged', function(params) {
      //   console.log('图例项被点击:', params)

      //   // 在这里可以根据选中的图例项执行自定义逻辑
      //   if (params.name === '数据1') {
      //     // alert('你点击了数据1的图例项')
      //     this.changeType()
      //   } else if (params.name === '数据2') {
      //     alert('你点击了数据2的图例项')
      //   }
      // })
    }
  }

}
</script>

<style scoped>

</style>
