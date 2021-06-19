<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="contaner">
      <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="main" style="width: 700px;height:400px;"></div>
      <div id="box" style="width: 500px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";
import _ from 'lodash'
export default {
  data() {
    return {
      // 需要合并的选项
      options1: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      },
      option2 : {
        title: {
            text: '地区资源占比',
            subtext: '2017-2018',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
            left: 'center',
            top: 'bottom',
            data: ['rose1', 'rose2', 'rose3', 'rose4', 'rose5', 'rose6', 'rose7', 'rose8']
        },
        series: [
            {
                name: '百分比',
                type: 'pie',
                radius: [20, 140],
                center: ['50%', '50%'],
                roseType: 'area',
                itemStyle: {
                    borderRadius: 5
                },
                data: [
                    {value: 30, name: '中国'},
                    {value: 28, name: '美国'},
                    {value: 26, name: '日本'},
                    {value: 24, name: '德国'},
                    {value: 22, name: '法国'},
                    {value: 20, name: '印度'},
                    {value: 18, name: '俄罗斯'},
                    {value: 16, name: '韩国'}
                ]
            }
        ]
    }
    };
  },
  // 页面元素渲染完毕
  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));
    var myChart2 = echarts.init(document.getElementById("box"));
    const {data:res}= await this.$http.get('reports/type/1')
    
    // 合并对象
    const reslut =  _.merge(res.data,this.options1)
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(reslut);
    myChart2.setOption(this.option2)
  }
};
</script>

<style lang="less" scoped>
.contaner {
  div {
    display: inline-block;
  }
}
</style>