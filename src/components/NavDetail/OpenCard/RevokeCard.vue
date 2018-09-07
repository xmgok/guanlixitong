<template>
    <div class="RevokeCard">
        <div class="RevokeCardText "><i class="icon sign"></i>产品信息</div>
        <div class="RevokeCardBox">
            <template>
                <el-table :data="data" style="width:100%" border ref="Table"  @selection-change="change">
                    <el-table-column type="selection" width="50" :reserve-selection="true"></el-table-column>                    
                    <el-table-column label="编号" width="150" prop="psCode"></el-table-column>
                    <el-table-column label="套卡名称" width="230" prop="psName"></el-table-column>
                    <el-table-column label="套卡单价" width="150" prop="streetAmount"></el-table-column>
                    <el-table-column label="开卡数量" width="150" prop="saleNum"></el-table-column>
                    <!-- <el-table-column label="开卡数量" width="220" >
                        <template slot-scope="scope">
                            <el-input-number v-model="scope.row.saleNum" size="mini" :min="1" :max="scope.row.MaxNum"></el-input-number>
                        </template>
                    </el-table-column> -->
                    <el-table-column label="实际开卡价格" width="150" prop="actualAmount"></el-table-column>
                    <el-table-column label="剩余价值" width="150" prop="surplusValue"></el-table-column>
                    <el-table-column label="操作" width="120" fixed="right">
                        <template slot-scope="scope">
                            <Button Name="查看详情" class="Btn" @click.native.stop="SeeInfo(scope.$index,scope.row)"/>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="1" fixed="right"></el-table-column>
                </el-table>
            </template>
        </div>
        <div class="RevokeCardText"><i class="icon sign"></i> 退卡原因</div>
        <Textarea @sonTextarea="sonTextarea" arguName="backReason" widths="41.666667rem" minRows="5" maxRows="8" class="RevokeCardBox"/>
        <div class="RevokeCardText "><i class="icon sign"></i> 退款方式<span class="CardTextColor">(返还到会员账户余额)</span></div>
        <div class="">
            <span class="money">实付余额：
                <span class="moneyWidth">￥{{paymentBalance}}</span>
            </span>
            <span class="money">赠送金额：
                <span class="moneyWidth">￥{{donationAmount}}</span>
            </span>
        </div>
        <div class="RevokeCardBox Notecenter">注：如需退款至客户指定银行账户，请从【客户管理】中找到该客户发起退款申请</div>
        <div class="RevokeCardBtn">
            <Button Name="取消" class="None" @click.native.stop="Cancle" />
            <Button Name="确定" @click.native.stop="Submit" />
        </div>
    </div>
</template>

<script>
import Button from "../../common/Button"
import Textarea from '../../common/Textarea'
import {InputNumber} from 'element-ui'
import Vue from 'vue'
Vue.use(InputNumber)
export default {
    components: { Button, Textarea },
    data() {
        return {
            data: [],
            state:[],//选中的状态存储
            backReason: '',
        }
    },
    mounted() {
        let _data = {}
        if (this.$route.query.orderNo) {
            _data.orderNo = this.$route.query.orderNo;
        } else if(this.$route.query.cCode){
            _data.cCode = this.$route.query.cCode
        }
        this.$post(this.$host + '/api/order/ordBackInfo/findOrdBackInfo',_data).then(d => {
            if (d.success) {
                let data = d.data
                data.map(e=>{e.MaxNum = e.saleNum})
                this.data = data
            }
        })
    },
    computed: {
        paymentBalance() {
            let Total = 0
            this.state.map(e => {
                    Total += e.surplusValue
            })
            return Total
        },
        donationAmount() {
            let Total = 0
            this.state.map(e => {
                    Total += e.donationAmount
            })
            return Total
        },
    },
    methods: {
        sonTextarea(value, arguName) {
            this[arguName] = value
        },
        SeeInfo(index,item) {
            console.log(item)
            this.$router.push({
                path: "/NavDetail/ProductServe/ProductCardAdd",
                query: {
                    id: item.id,
                    detail: "detail",
                }
            })
        },
        Cancle() {
            if(this.$route.query.orderNo){
                this.$router.push({ path: "/NavDetail/OpenCard" })
            }else if(this.$route.query.cCode){
                this.$router.push({ path: "/NavDetail/Customer" })                
            }
        },
        change(rows){
            this.state = rows
            console.log(rows)
        },
        getCardData(Arr,_data) {
            Arr.map(e => {
                _data.cCode = e.cCode
                _data.orderNo = e.orderNo
                let info = {
                    psName: e.psName,
                    psCode: e.psCode,
                    actualAmount: e.actualAmount,
                    surplusValue: e.surplusValue,
                    paymentBalance: e.paymentBalance,
                    donationAmount: e.donationAmount,
                    backReason: this.backReason,
                    saleNum:e.saleNum,
                    pointCutBalance:e.pointCutBalance,
                }
                _data.infoDTOLists.push(info)
            })
        },
        Submit() {
            if (this.state.length == 0) {
                this.$message({
                    type: 'info',
                    message: '请勾选需要退款的卡项!',
                    duration: "1000",
                });
                return
            }
            let _data = {
                cCode:'',
                orderNo:'',
                infoDTOLists:[],
            }
            this.getCardData(this.state, _data)
            this.$post(this.$host + '/api/order/ordBackInfo/ordBackCardProcess',_data).then(d => {
                if (d.success) {
                    this.$router.push({ path: "/NavDetail/OpenCardInfo", query: { orderNo: this.$route.query.orderNo } })
                }
            })
        },
    }
} 
</script>

<style scoped>
.RevokeCardText {
  font-size: 1.166667rem;
  color:#2CBCC8;
  font-weight: 700;
  margin-bottom: .5rem;
}
.RevokeCardBox{
    margin-bottom: 3rem;
}
.money {
  font-size: 1.166667rem;
  color: #ed8617;
  margin-right: 2rem;
}
.money .moneyWidth{
    display: inline-block;
    min-width: 6rem;
}
.CardTextColor {
  color: #666;
  font-size: 1rem;
  font-weight: 400;
}
.Notecenter {
  margin-top: 1rem;
  font-size: 1rem;
  color: #999;
}
.RevokeCardBtn {
  /* text-align: center; */
  margin-left: 7rem;
}
.RevokeCardBtn button:first-child {
  margin-right: 2rem;
}
.RevokeCard .el-table th,.RevokeCard .el-table td{
    height: 40px!important;
}
</style>
