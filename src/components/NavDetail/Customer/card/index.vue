<template>
    <div class="right_content_wrap">
        <div class="right_content">
            <div class="overall_balance">
                <div class="card">
                    <ul>
                        <li>
                            可用套卡余额</li>
                        <li>￥{{totalSurplusAmount}}</li>
                    </ul>
                </div>
                <div class="card">
                    <ul>
                        <li>累计开卡金额</li>
                        <li>￥{{sumTotalSalePrice}}</li>
                    </ul>
                </div>

            </div>

            <div class="touch_balance">
                <div class="table-wrap">
                    <el-table :data="datas" border style="width: 100%" align='left'>
                        <el-table-column prop="psCode" label="卡号" width="180">
                        </el-table-column>
                        <el-table-column prop="psName" label="套卡名称" width="200">
                        </el-table-column>
                        <el-table-column prop="createTime" label="开卡时间" width="140">
                        </el-table-column>
                        <el-table-column prop="totalStreetAmount" label="实际开卡金额" width="140">
                        </el-table-column>
                        <el-table-column prop="actDate" label="激活日期" width="140">
                        </el-table-column>
                        <el-table-column prop="validDate" label="有效截止日期" width="140">
                        </el-table-column>
                        <el-table-column prop="remainingDays" label="剩余有效时间" width="150">
                            <template slot-scope="scope">
                                <span v-if='scope.row.remainingDays'>
                                    {{scope.row.remainingDays}}天
                                </span>
                            </template>

                        </el-table-column>
                        <el-table-column prop="surplusAmount" label="剩余价值" width="130">
                        </el-table-column>
                        <el-table-column prop="debitMode" label="扣款方式" width="160">
                        </el-table-column>
                    </el-table>
                    <div class="pagingwidth">
                        <!-- <Paging :handleCurrentChange="getDatas" :total="total" /> -->
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

            date: '',

            total: 0,
            totalSurplusAmount: '',
            sumTotalSalePrice: '',

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
        },

        getDatas(index) {
            let par = {
                pageNumber: parseInt(index),
                pageSize: 10,
                cCode: this.$route.query.code
            }

            this.$post(this.$host + "/api/order/ord/findCustomeTkList", par).then(d => {
                if (d.success) {
                    this.datas = d.data.info;
                    this.datas.map(el => {
                        el.createTime = this.$dateFormat('yy-MM-dd', el.createTime)
                    });
                    this.totalSurplusAmount = d.data.totalSurplusAmount;
                    this.sumTotalSalePrice = d.data.sumTotalSalePrice;
                    this.total = d.data.total;
                }
            });
        },


    },
    mounted() {
        this.getDatas(1)
    }
}
</script>

<style  lang="css" scoped>
@import "../../../../../static/commonStyle.css";
.overall_balance {
  border: 1px solid #dcdfe6;
  padding: 24px;
  display: inline-block;
  margin-bottom: 40px;
  width: 900px;
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
/* header {
  border-bottom: 1px solid #dcdfe6;
  line-height: 40px;
  padding: 0 16px;
  color: #1dade6;
  font-size: 18px;
} */
.table-wrap {
  padding: 16px;
}
.iconsign::before {
  content: "\E62D";
}
</style>

