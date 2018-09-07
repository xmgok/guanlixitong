<template>
    <div class="right_content_wrap">
        <div class="right_content">
            <div class="overall_balance">
                <div class="card">
                    <ul>
                        <li>可用总积分</li>
                        <li>{{totalDatas.accIntegral}}</li>
                    </ul>
                </div>
                <div class="card">
                    <ul>
                        <li>在途积分</li>
                        <li>{{totalDatas.waitIntegral}}</li>
                    </ul>
                </div>
                <div class="card">
                    <ul>
                        <li>累计获取积分</li>
                        <li>{{totalDatas.sumGain}}</li>
                    </ul>
                </div>
                <div style="background:#ccc;" class="card">
                    <ul>
                        <li>累计消费积分</li>
                        <li>{{totalDatas.sumConsume}}</li>
                    </ul>
                </div>
            </div>

            <div class="touch_balance">
                <div class="search_wrap">
                    <ul>
                        <li>
                            <span>变动日期：</span>
                            <el-date-picker size='mini' clearable v-model="date" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
                            </el-date-picker>
                        </li>
                        <li>
                            <span>
                                变动类型：
                            </span>
                            <el-select v-model="query.changeType" placeholder="请选择">
                                <el-option v-for="item in changeType" :key="item.code" :label="item.name" :value="item.code">
                                </el-option>
                            </el-select>
                        </li>
                        <li>
                            <span>
                                变动原因：
                            </span>
                            <el-select v-model="query.changeReason" placeholder="请选择">
                                <el-option v-for="item in changeReason" :key="item.dKey" :label="item.dValue" :value="item.dKey">
                                </el-option>
                            </el-select>
                        </li>
                        <li>
                            <span>
                                <Button Name="查询" @click.native="getDatas(1)" Search="true"></Button>
                                <Button Name="重置" @click.native="reset" Reset="true"></Button>
                            </span>
                        </li>
                    </ul>
                </div>
                <div class="table-wrap">
                    <el-table :data="datas" border style="width: 100%" align='left'>
                        <el-table-column prop="changeTime" label="变动时间" width="180">
                        </el-table-column>
                        <el-table-column prop="changeType" label="变动类型" width="200">
                        </el-table-column>
                        <el-table-column prop="changeAmount" label="积分变换" width="100">
                        </el-table-column>
                        <el-table-column prop="afterAmount" label="变动后剩余可用积分" width="200">
                        </el-table-column>
                        <el-table-column prop="changeReason" label="变动原因" width="160">
                        </el-table-column>
                        <el-table-column prop="remark" label="备注" width="160">
                        </el-table-column>
                    </el-table>
                    <div class="pagingwidth">
                        <Paging :handleCurrentChange="getDatas" :total="total" />
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import Paging from "@/components/common/Paging";
import Button from "@/components/common/Button"
export default {
    components: {
        Button, Paging
    },
    data() {
        return {
            datas: [],

            query: {
                changeTimeStart: "",
                changeTimeEnd: "",
                changeType: "",
                changeReason: "",
            },

            date: '',

            total: 0,

            //变动类型
            changeType: [
                {
                    code: '0',
                    name: '增加'
                },
                {
                    code: '1',
                    name: '减少'
                },
            ],

            //变动原因
            changeReason: [
                {
                    code: '0',
                    name: '收费'
                },
                {
                    code: '1',
                    name: '消费'
                },
                {
                    code: '2',
                    name: '其他'
                },

            ],

            //日期快捷
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },

            //

            totalDatas: '',
        }
    },

    methods: {

        reset() {
            this.query = {
                changeTimeStart: "",
                changeTimeEnd: "",
                changeType: "",
                changeReason: "",
            };
            this.getDatas()
        },

        getDatas(index) {
            let par = {
                pageNumber: 1,
                pageSize: 10,
                cCode: this.$route.query.code
            }
            if (typeof (index) !== "object" && typeof (index) !== "undefined") {
                par.pageNumber = parseInt(index);
            }
            for (var key in this.query) {
                if (this.query[key] != "") {
                    par[key] = this.query[key];
                }
            }
            if (typeof (this.date) == "object") {
                if (this.date !== null)
                    if (this.date.length > 0) {
                        par.changeTimeStart = this.$dateFormat('yy-MM-dd', this.date[0]);
                        par.changeTimeEnd = this.$dateFormat('yy-MM-dd', this.date[1]);
                    }
            }
            this.$post(this.$host + "/api/order/integralHis/getIntegralHisByCust", par).then(d => {
                if (d.success) {
                    this.datas = d.data.content;
                    this.datas.map(el => {
                        switch (el.changeType) {
                            case 0: el.changeType = '增加';
                                break;
                            case 1: el.changeType = '减少';
                                break;
                        };
                        switch (el.changeReason) {
                            case 0: el.changeReason = '收款';
                                break;
                            case 1: el.changeReason = '消费';
                                break;
                            case 2: el.changeReason = '其他';
                                break;
                        };
                        el.changeTime = this.$dateFormat('yy-MM-dd hh:mm:ss', el.changeTime)
                    })
                    this.total = d.data.total;
                }
            });
        },


    },
    mounted() {
        this.getDatas();
        let par = {
            cCode: this.$route.query.code,

        }

        this.$post(this.$host + "/api/order/integralHis/getIntegralSummary", par).then(d => {
            if (d.success) {
                this.totalDatas = d.data
            }
        });
        this.$post(this.$host + "api/sysmgr/dict/pointBusiType", {}).then(d => {
            if (d.success) {
                this.changeReason = d.data;
            }
        });
    }
}
</script>

<style scoped>
@import "../../../../../static/commonStyle.css";
.overall_balance {
    border: 1px solid #dcdfe6;
    padding: 24px;
    display: inline-block;
    margin-bottom: 40px;
    /* width: 900px; */
    text-align: center;
}
.card {
    display: inline-block;
    width: 160px;
    height: 80px;
    color: #fff;
    border-radius: 4px;
    font-size: 16px;
    text-align: center;
    margin: 12px;
    position: relative;
}
.overall_balance ul {
    width: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.card:nth-child(1) {
    background-color: #74b2e8;
}
.card:nth-child(2) {
    background-color: #a88cd5;
}
.card:nth-child(3) {
    background-color: #5dc292;
}
header {
    border-bottom: 1px solid #dcdfe6;
    line-height: 40px;
    padding: 0 16px;
    color: #1dade6;
    font-size: 18px;
}
.table-wrap {
    padding: 16px;
}
.iconsign::before {
    content: "\E62D";
}
</style>

