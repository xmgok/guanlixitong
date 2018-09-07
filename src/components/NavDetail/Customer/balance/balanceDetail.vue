<template>
    <div class="balance_derail right_content_wrap">
        <div class="right_content">
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
                        <el-select v-model="queryData.changeType" placeholder="请选择">
                            <el-option v-for="item in changeType" :key="item.code" :label="item.name" :value="item.code">
                            </el-option>
                        </el-select>
                    </li>
                    <li>
                        <span>
                            变动原因：
                        </span>
                        <el-select v-model="queryData.busiType" placeholder="请选择">
                            <el-option v-for="item in busiType" :key="item.dKey" :label="item.dValue" :value="item.dKey">
                            </el-option>
                        </el-select>
                    </li>
                    <li>
                        <span>
                            <Button Name="查询" @click.native="getData(1)" Search="true"></Button>
                            <Button Name="重置" @click.native="reset" Reset="true"></Button>
                        </span>
                    </li>
                </ul>
            </div>

            <div>
                <el-table :data="datas" border align='left'>
                    <el-table-column prop="changeTime" label="变动时间" width="180">
                    </el-table-column>
                    <el-table-column prop="changeType" label="变动类型" width="120">
                    </el-table-column>
                    <el-table-column prop="changeAmount" label="金额变化" width="120">
                    </el-table-column>
                    <el-table-column prop="afterAmount" label="变动后剩余金额" width="160">
                    </el-table-column>
                    <el-table-column prop="busiType" label="变动原因" width="100">
                    </el-table-column>
                    <el-table-column label="业务单号" width="200" fixed='right'>
                        <template slot-scope="scope">
                            <Button small="Btn small" :Name="scope.row.busiNo" @click.native="seeDetail(scope.row)"></Button>
                        </template>
                    </el-table-column>
                    <el-table-column fixed='right' min-width='1'>
                    </el-table-column>
                </el-table>
                <div class="pagingwidth">
                    <Paging :handleCurrentChange="getData" :total="total" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Button from "@/components/common/Button"
import Paging from "@/components/common/Paging";
export default {
    components: {
        Button, Paging
    },
    data() {
        return {
            datas: [],
            total: 0,

            queryData: {
                "beginTime": "",
                "endTime": "",
                "changeType": "",
                "busiType": ""
            },

            date: [],

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
            busiType: [],

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
        }
    },

    methods: {

        reset() {
            this.queryData = {
                "beginTime": "",
                "endTime": "",
                "changeType": "",
                "busiType": ""
            };
            this.getData(1)
        },

        //查看详情
        seeDetail(el) {

            switch (el.busiType) {
                case 0:
                    this.$router.push({
                        path: "/NavDetail/ReceiptDetail",
                        query: {
                            rcptNo: el.busiNo
                        }
                    });
                    ;
                    break;
                case 1:
                    this.$router.push({
                        path: "/NavDetail/OpenCardInfo",
                        query: {
                            orderNo: el.busiNo
                        }
                    });
                    break;
                case 2: el.busiTypeName = '消费';
                    break;
                case 3: el.busiTypeName = '退款';
                    break;
                case 4: el.busiTypeName = '退卡';
                    break;
                case 5: el.busiTypeName = '转入';
                    break;
                case 6: el.busiTypeName = '转出';
                    break;
                case 7: el.busiTypeName = '扣款';
                    break;
                case 8: el.busiTypeName = '其它';
                    break;
            };
            // this.$router.push({
            //     path: "/NavDetail/refund/seeRefund",
            //     query: {
            //         flowDataId: item.flowDataId
            //     }
            // });
        },


        getData(index) {
            let par = {
                pageNumber: parseInt(index),
                pageSize: 10,
                cCode: this.$route.query.code,
                amountType: this.$route.query.type
            }

            for (var key in this.queryData) {
                if (this.queryData[key] != "") {
                    par[key] = this.queryData[key];
                }
            }
            if (typeof (this.date) == "object") {
                if (this.date !== null)
                    if (this.date.length > 0) {
                        par.beginTime = this.$dateFormat('yy-MM-dd', this.date[0]);
                        par.endTime = this.$dateFormat('yy-MM-dd', this.date[1]);
                    }
            }
            this.$post(this.$host + "/api/cust/accInfo/findBalanceHistPage", par).then(d => {

                if (d.success) {

                    this.total = d.data.total;
                    d.data.content.map(el => {
                        switch (el.changeType) {
                            case 0: el.changeType = '增加';
                                break;
                            case 1: el.changeType = '减少';
                                break;
                        };
                        
                        el.changeTime = this.$dateFormat('yy-MM-dd hh:mm:ss', el.changeTime);
                    })
                    this.datas = d.data.content;
                }
            });
        }

    },
    mounted() {
        this.getData(1);
        this.$post(this.$host + "api/sysmgr/dict/accountBusiType", {}).then(d => {
            if (d.success) {
                this.busiType = d.data;
            }
        });
    }
}
</script>

<style scoped>
@import "../../../../../static/commonStyle.css";
</style>
<style>
.balance_derail .el-select {
    width: 160px;
}

.balance_derail .el-date-editor .el-range-separator {
    padding: 0 15px;
}
.balance_derail .el-input__inner {
    line-height: 0;
}
.balance_derail .el-date-editor .el-range__close-icon {
    width: 20px;
}
.balance_derail .el-table tbody td:last-child .cell {
    text-align: left;
}
</style>
