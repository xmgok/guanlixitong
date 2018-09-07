<template>
    <div>
        <router-link :to="{path:'/NavDetail/refundTotal'}">退款汇总</router-link>
        <router-link :to="{path:'/NavDetail/refundTotaldetail'}">退款明细</router-link>
    <div  id="myChart" :style="{height: '300px'}"></div>
    <div  id="myCircle" :style="{ height: '200px'}">
    </div>
    <ul class="mycircleName clearfix">
        <li>支付宝</li>
        <li>支付宝</li>
        <li>支付宝</li>
        <li>支付宝</li>
        <li>支付宝</li>
    </ul>
    <!-- <ve-line :data="chartData" :settings="chartSettings" :data-zoom="dataZoom"></ve-line> -->
    <el-progress type="circle" :percentage="0"></el-progress>
    <div class="progress">
        <el-progress type="circle" :percentage="25.45"></el-progress>
        <span class="progressName">微信</span>
        <span class="progressPrice">￥4000.00</span>
    </div>
<el-progress type="circle" :percentage="80" color="#8e71c7"></el-progress>
<el-progress type="circle" :percentage="100" status="success"></el-progress>
<el-progress type="circle" :percentage="50" status="exception"></el-progress>
</div>
    
</template>
<script>
    // 引入基本模板
    // let echarts = require('echarts/lib/echarts')
    // 引入柱状图组件
    // require('echarts/lib/chart/line')
    // require('echarts/lib/chart/pie')
    // // 引入提示框和title组件
    // require('echarts/lib/component/tooltip')
    // require('echarts/lib/component/title')
    // import "echarts/lib/component/toolbox";
    export default {
        name: 'hello',
        data() {
            return {
                msg: 'Welcome to Your Vue.js App',
                chartData:{},
                chartSettings:{},
                dataZoom:[],
            }
        },
        mounted() {
            this.drawLine();
            this.drawcircle();
            this.drawVLine();
        },
        methods: {
            drawLine() {
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(document.getElementById('myChart'))
                // 绘制图表
                myChart.setOption({
                    title: {
                        text: '堆叠区域图'
                    },
                    tooltip : {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    legend: {
                        data:['邮件营销']
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            axisLine: {onZero: false},
                            data : ['2018-04-01','2018-04-02','2018-04-03','2018-04-04','2018-04-05','2018-04-06','2018-04-07']
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            axisLabel: {
                                formatter: '{value} 元'
                            }
                        }
                    ],
                    series : [
                        {
                            name:'',
                            type:'line',
                            // stack: '总量',
                            smooth:true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            // areaStyle: {normal: {}},
                            data:[120, 132, 101, 134, 90, 230, 210,215]
                        },
                    ],
                })
            },
            drawcircle() {
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(document.getElementById('myCircle'))
                var labelTop = {
                    normal : {
                        label : {
                            show : true,
                            position : 'center',
                            formatter : '{b}',
                            textStyle: {
                                baseline : 'bottom'
                            }
                        },
                        labelLine : {
                            show : false
                        }
                    }
                };
                var labelFromatter = {
                    normal : {
                        label : {
                            formatter : function (params){
                                return 100 - params.value + '%'
                            },
                            textStyle: {
                                baseline : 'top'
                            }
                        }
                    },
                };
                var labelBottom = {
                    normal : {
                        color: '#ccc',
                        label : {
                            show : true,
                            position : 'center'
                        },
                        labelLine : {
                            show : false
                        }
                    },
                    emphasis: {
                        color: 'rgba(0,0,0,0)'
                    }
                };
                var radius = [40, 55];
                let options = {
                    legend: {
                        data:[
                        ]
                    },
                    title : {
                        text: 'The App World',
                        subtext: 'from global web index',
                        x: 'center'
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            dataView : {show: true, readOnly: false},
                            magicType : {
                                show: true, 
                                type: ['pie', 'funnel'],
                                option: {
                                    funnel: {
                                        width: '20%',
                                        height: '30%',
                                        itemStyle : {
                                            normal : {
                                                label : {
                                                    formatter : function (params){
                                                        return 'other\n' + params.value + '%\n'
                                                    },
                                                    textStyle: {
                                                        baseline : 'middle'
                                                    }
                                                }
                                            },
                                        } 
                                    }
                                }
                            },
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    series : [
                        {
                            type : 'pie',
                            center : ['10%', '50%'],
                            radius : radius,
                            x: '0%', // for funnel
                            itemStyle : labelFromatter,
                            data : [
                                {name:'other', value:46, itemStyle : labelBottom},
                                {name:'￥450000.00', value:54,itemStyle : labelTop}
                            ]
                        },
                        {
                            type : 'pie',
                            center : ['30%', '50%'],
                            radius : radius,
                            x:'20%', // for funnel
                            itemStyle : labelFromatter,
                            data : [
                                {name:'other', value:56, itemStyle : labelBottom},
                                {name:'Facebook', value:44,itemStyle : labelTop}
                            ]
                        },
                        {
                            type : 'pie',
                            center : ['50%', '50%'],
                            radius : radius,
                            x:'40%', // for funnel
                            itemStyle : labelFromatter,
                            data : [
                                {name:'other', value:65, itemStyle : labelBottom},
                                {name:'Youtube', value:35,itemStyle : labelTop}
                            ]
                        },
                        {
                            type : 'pie',
                            center : ['70%', '50%'],
                            radius : radius,
                            x:'60%', // for funnel
                            itemStyle : labelFromatter,
                            data : [
                                {name:'other', value:70, itemStyle : labelBottom},
                                {name:'Google+', value:30,itemStyle : labelTop}
                            ]
                        },
                        {
                            type : 'pie',
                            center : ['90%', '50%'],
                            radius : radius,
                            x:'80%', // for funnel
                            itemStyle : labelFromatter,
                            data : [
                                {name:'other', value:73, itemStyle : labelBottom},
                                {name:'Weixin', value:27,itemStyle : labelTop}
                            ]
                        },
                    ]
                };
                myChart.setOption(options);
            },
            drawVLine(){
                this.chartData={
                    columns: ['日期', '成本', '利润', '占比', '其他'],
                    rows: [
                        { '日期': '1月1日', '成本': 1523, '利润': 1523, '占比': 0.12, '其他': 100 },
                        { '日期': '1月2日', '成本': 1223, '利润': 1523, '占比': 0.345, '其他': 100 },
                        { '日期': '1月3日', '成本': 2123, '利润': 1523, '占比': 0.7, '其他': 100 },
                        { '日期': '1月4日', '成本': 4123, '利润': 1523, '占比': 0.31, '其他': 100 },
                        { '日期': '1月5日', '成本': 3123, '利润': 1523, '占比': 0.12, '其他': 100 },
                        { '日期': '1月6日', '成本': 7123, '利润': 1523, '占比': 0.65, '其他': 100 },
                        { '日期': '1月7日', '成本': 7123, '利润': 1523, '占比': 0.65, '其他': 100 },
                        { '日期': '1月8日', '成本': 7123, '利润': 1523, '占比': 0.65, '其他': 100 },
                        { '日期': '1月9日', '成本': 7123, '利润': 1523, '占比': 0.65, '其他': 100 },
                        { '日期': '1月10日', '成本': 7123, '利润': 1523, '占比': 0.65, '其他': 100 },
                        { '日期': '1月11日', '成本': 7123, '利润': 1523, '占比': 0.65, '其他': 100 },
                        { '日期': '1月12日', '成本': 7123, '利润': 1523, '占比': 0.65, '其他': 100 },
                        { '日期': '1月13日', '成本': 7123, '利润': 1523, '占比': 0.65, '其他': 100 },
                        { '日期': '1月13日', '成本': 7123, '利润': 1523, '占比': 0.65, '其他': 100 },
                        { '日期': '1月13日', '成本': 7123, '利润': 1523, '占比': 0.65, '其他': 100 },
                        { '日期': '1月13日', '成本': 7123, '利润': 1523, '占比': 0.65, '其他': 100 },
                        { '日期': '1月13日', '成本': 7123, '利润': 1523, '占比': 0.65, '其他': 100 },
                        { '日期': '1月13日', '成本': 7123, '利润': 1523, '占比': 0.65, '其他': 100 },
                        { '日期': '1月13日', '成本': 7123, '利润': 1523, '占比': 0.65, '其他': 100 },
                    ]
                };
                this.chartSettings={
                    stack: { '售价': ['成本', '利润'] },
                    area: true
                }
                this.dataZoom = [
                    {
                    type: 'slider',
                    start: 0,
                    end: 20
                    }
                ]
            }
        }
    }
</script>
<style scoped>
    .mycircleName li{
        float: left;
        width: 20%;
        text-align: center;
    }
    .progress{
        position: relative;
        display: inline-block;
    }
    .progressName{
        position: absolute;
        left: 0;
        top: 28px;
        width: 100%;
        text-align: center;
    }
    .progressPrice{
        position: absolute;
        left: 0;
        bottom: 30px;
        width: 100%;
        text-align: center;
    }
</style>