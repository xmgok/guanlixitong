<template>
    <div class="Payment">
        <div class="Paymentbody clearfix" >
            <div class="left" >
                <ul>
                        <li v-if="remainingShow">
                                <div class="pay remaining">
                                    实付余额
                                    <p>￥{{accCurAmount.toFixed(2)}}可用</p>
                                </div>
                            </li>
                            <li v-if="remainingShow">
                                <div class="pay remaining">
                                    赠送余额
                                    <p>￥{{accCurCashcou.toFixed(2)}}可用</p>
                                </div>
                            </li>
                </ul>
                <header>
                    添加支付方式<span> (支持多选)</span>
                </header>
                <ul>
                    
                    <li>
                        <div class="pay" @click="addcard('支付宝')">
                            <img src="../../../../static/img/pay/alipay.png" alt="">
                        </div>
                    </li>
                    <li>
                        <div class="pay" @click="addcard('微信')">
                            <img src="../../../../static/img/pay/wx.png" alt="">
                        </div>
                    </li>
                    <li>
                        <div class="pay" @click="addcard('POS刷卡')">
                            <img src="../../../../static/img/pay/card.png" alt="">
                        </div>
                    </li>
                    <li>
                        <div class="pay" @click="addcard('现金')">
                            <img src="../../../../static/img/pay/cash.png" alt="">
                        </div>
                    </li>
                    <li>
                        <div class="pay" @click="addcard('转账')">
                            <img src="../../../../static/img/pay/transfer.png" alt="">
                        </div>
                    </li>
                    <li>
                        <div class="pay" @click="addcard('聚合支付')">
                            <img src="../../../../static/img/pay/together.png" alt="">
                        </div>
                    </li>
                    <li>
                        <div class="pay" @click="addcard('支票支付')">
                            <img src="../../../../static/img/pay/cheque.png" alt="">
                        </div>
                    </li>
                </ul>
            </div>
            <div class="right" >
                <header>
                    <p>
                        已付：<span>￥{{actualMoney.toFixed(2)}}</span>
                    </p>
                    <!-- <span v-if="remainingShow">
                            本次应收金额：<i>￥{{this.amount.toFixed(2)}}</i>
                    </span> -->
                </header>
                <ul >
                    <li>
                        <ul class="Cell clearfix head">
                            <li>支付方式</li>
                            <li>支付金额</li>
                        </ul>
                    </li>
                    <li v-for="(item,index) in defaultpayedDatas">
                        <ul class="Cell clearfix">
                            <li>{{item.pName}}</li>
                            <li>
                                金额：<Input placeholder="￥0.00" :value="item.amount" :arguName="index" @sonInput="defaultupInput" :onkeyup="onkeyup"/>
                            </li>
                            <li>
                                <Button Name="确定" @click.native="defaultPaying(item,index)"/>
                            </li>
                        </ul>
                    </li>
                    <li v-for="(item,index) in payingDatas">
                        <ul class="Cell clearfix">
                            <li>{{item.pName}}</li>
                            <li>
                                金额：<Input placeholder="￥0.00" :value="item.amount" :arguName="index" @sonInput="upInput"/>
                            </li>
                            <li>
                                <Button Name="确定" @click.native="Paying(item,index)"/>
                            </li>
                            <li>
                                <i class="icon closeicon" @click="deletePaying(item,index)"></i>
                            </li>
                        </ul>
                    </li>
                </ul>
                <ul class="clearfix payed">
                    <li>
                        <ul class="clearfix header">
                            <li>支付方式</li>
                            <li>支付金额</li>
                            <li>当前状态</li>
                            <li>备注</li>
                        </ul>
                    </li>
                    <li v-for="item in payedDatas">
                        <ul class="clearfix body">
                            <li>{{item.pName}}</li>
                            <li class="status">￥{{item.amount}}</li>
                            <li class="status">{{item.pstatus}}</li>
                            <li>招商银行</li>
                        </ul>
                    </li>
                    <li v-show="payedDatas.length==0">
                        <div class="moren">暂无已支付</div>
                    </li>
                </ul>
                <div class="sud" v-show="remainingShow">本次支付需扣款{{amount.toFixed(2)}}</div>
                <div class="footer">
                    <Button buttonClass="None" Name="仅保存，下次再补签" @click.native="onlysubmit"/>
                    <Button  Name="保存并签字确认" @click.native="submit"/>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Input from "../../common/Input"
    import Button from "../../common/Button"
    import {mapMutations} from "vuex"
    export default{
        name:"Payment",
        components: {
            Input,Button
        },
        data(){
            return{
                remainingShow:true,
                rcptNo:"",//订单号
                actualMoney:0,//实收金额
                payedDatas:[
                    // {pName:"微信",amount:"3000.00",pstatus:"支付成功"},
                    // {pName:"支付宝",amount:"3000.00",pstatus:"支付成功"},
                ],//已支付的列表
                defaultpayedDatas:[
                    {pName:"微信",amount:"",pstatus:"支付成功"},
                    {pName:"支付宝",amount:"",pstatus:"支付成功"},
                    {pName:"POS刷卡",amount:"",pstatus:"支付成功"},
                ],//默认的支付的列表
                payingDatas:[],//未支付的列表
                resurl:"",
                jsondata:[],
                amount:0,
                id:"",//客户id
                accCurAmount:0,//账户可用余额
                accCurCashcou:0,//账户可用赠送余额
                cCode:"",//客户账户code
                canpay:true,
            }
        },
        methods: {
            ...mapMutations(["updateAlives","setDatas"]),
            onkeyup(value){
                value.target.value = value.target.value.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符   
                value.target.value = value.target.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的   
                value.target.value = value.target.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");  
                value.target.value = value.target.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数   
                if(value.target.value.indexOf(".")< 0 && value.target.value !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
                    value.target.value= parseFloat(value.target.value);  
                }  
            },
            // 仅保存，下次再补签
            onlysubmit(){
                if(this.$stop()){return}//阻止双击的调用。
                // if(this.payedDatas.length==0){
                //     this.$message({
                //         type:"info",
                //         message:"请先支付，再保存"
                //     });
                //     return
                // }
                console.log(this.amount)
                console.log(this.accCurAmount)
                console.log(this.accCurCashcou)
                if(this.amount){
                    if(this.amount>(this.accCurAmount+this.accCurCashcou)){
                        this.$message({
                            type:"info",
                            message:"账户余额必须大于应收金额"
                        });
                        return;
                    }
                }
                this.rcptpayover();
                if(this.resurl){
                    if(this.resurl=="/NavDetail/OpenCard"){//开卡支付
                        this.$post(this.$host+"/api/order/ord/createOrder",this.jsondata).then(d=>{
                            if(d.success){
                                this.$message({
                                    type:"success",
                                    message:"开卡成功"
                                });
                                this.$router.push({
                                    path:this.resurl
                                });
                                this.$clearCookie("jsondata");
                                
                            }
                        })
                    }else if(this.resurl=="/NavDetail/Order"){
                        let update=this.$route.query.update||"";
                        if(update){
                            this.$post(this.$host+"/api/order/consume/updateConsemeBill",this.jsondata).then(d=>{
                                if(d.success){
                                    if(d.data.billNo=="1"){
                                        this.$message({
                                            type:"info",
                                            message:"账户余额必须大于应收金额"
                                        });
                                        return;
                                    }else if(d.data.billNo){
                                        this.$message({
                                            type:"success",
                                            message:"点单消费成功"
                                        });
                                        this.$router.push({
                                            path:this.resurl
                                        })
                                        this.$clearCookie("jsondata");
                                    }
                                }
                            })
                        }else{
                            this.$post(this.$host+"/api/order/consume/createConsemeBill",this.jsondata).then(d=>{
                                if(d.success){
                                    if(d.data.billNo=="1"){
                                        this.$message({
                                            type:"info",
                                            message:"账户余额必须大于应收金额"
                                        });
                                        return;
                                    }else if(d.data.billNo){
                                        this.$message({
                                            type:"success",
                                            message:"点单消费成功"
                                        });
                                        this.$router.push({
                                            path:this.resurl
                                        })
                                        this.$clearCookie("jsondata");
                                    }
                                }
                            })
                        }
                    }else{
                        this.$router.push({
                            path:this.resurl
                        })
                        this.$clearCookie("jsondata");
                        
                    }
                }else{
                    this.$message({
                        type:"success",
                        message:"预存收款成功"
                    });
                    this.$router.push({
                        path:"/NavDetail/Receipt"
                    })
                    this.$clearCookie("jsondata");
                    
                }
            },
            // 保存并签字确认
            submit(){
                if(this.$stop()){return}//阻止双击的调用。
                if(this.amount){
                    if(this.amount>(this.accCurAmount+this.accCurCashcou)){
                        this.$message({
                            type:"info",
                            message:"账户余额必须大于应收金额"
                        });
                        return;
                    }
                }else{
                    this.$message({
                        type:"info",
                        message:"空单就别签名啦"
                    });
                }
                this.rcptpayover();
                if(this.resurl){
                    if(this.resurl=="/NavDetail/OpenCard"){//开卡支付
                        this.$post(this.$host+"/api/order/ord/createOrder",this.jsondata).then(d=>{
                            if(d.success){
                                this.$message({
                                    type:"success",
                                    message:"开卡成功"
                                });
                                this.$router.push({
                                    path:"/NavDetail/sureReceipt",
                                    query:{
                                        resurl:this.resurl,
                                        rcptNo:this.rcptNo
                                    }
                                })
                                this.$clearCookie("jsondata");
                                
                            }
                        })
                    }else if(this.resurl=="/NavDetail/Order"){//点单支付
                        let update=this.$route.query.update||"";
                        if(update){
                            this.$post(this.$host+"/api/order/consume/updateConsemeBill",this.jsondata).then(d=>{
                                if(d.success){
                                    if(d.data.billNo=="1"){
                                        this.$message({
                                            type:"info",
                                            message:"账户余额必须大于应收金额"
                                        });
                                        return;
                                    }else if(d.data.billNo){
                                        this.$message({
                                            type:"success",
                                            message:"点单消费成功"
                                        });
                                        this.$router.push({
                                            path:"/NavDetail/sureReceipt",
                                            query:{
                                                resurl:this.resurl,
                                                billNo:d.data.billNo
                                            }
                                        })
                                        this.$clearCookie("jsondata");
                                    }
                                }
                            })
                        }else{
                            this.$post(this.$host+"/api/order/consume/createConsemeBill",this.jsondata).then(d=>{
                                if(d.success){
                                    if(d.data.billNo=="1"){
                                        this.$message({
                                            type:"info",
                                            message:"账户余额必须大于应收金额"
                                        });
                                        return;
                                    }else if(d.data.billNo){
                                        this.$message({
                                            type:"success",
                                            message:"点单消费成功"
                                        });
                                        this.$router.push({
                                            path:"/NavDetail/sureReceipt",
                                            query:{
                                                resurl:this.resurl,
                                                billNo:d.data.billNo
                                            }
                                        })
                                        this.$clearCookie("jsondata");
                                    }
                                }
                            })
                        }
                    }else{
                        this.$router.push({
                            path:this.resurl
                        })
                        this.$clearCookie("jsondata");
                        
                    }
                }else{
                    this.$message({
                        type:"success",
                        message:"预存收款成功"
                    });
                    this.$router.push({
                        path:"/NavDetail/sureReceipt",
                        query:{
                            rcptNo:this.rcptNo
                        }
                    });
                    this.$clearCookie("jsondata");
                    
                }
                
            },
            rcptpayover(){
                if(this.rcptNo){
                    this.$post(this.$host+"/api/order/receiptbill/rcptpayover",{rcptNo:this.rcptNo}).then(d=>{
                        if(d.success){
                            
                        }
                    })
                }
            },
            defaultupInput(value,arguName){
                this.defaultpayedDatas[arguName]["amount"]=value;
            },
            upInput(value,arguName){
                this.payingDatas[arguName]["amount"]=value;
                console.log(this.payingDatas[arguName]["amount"])
            },
            // 默认的支付
            defaultPaying(item,index){
                // if(item.amount==""){
                //     this.$message({
                //         type:"info",
                //         message:"支付金额不能为空"
                //     });
                //     return;
                // }
                if (this.$stop()) { return }
                if(!this.canpay){
                    this.$message({
                        type:'info',
                        message:"正在支付，请稍后"
                    });
                    return;
                }
                this.canpay=false;
                let reg=/(^[1-9](\d+)?(\.\d{1,2})?$)|(^(0){1}$)|(^\d\.\d{1,2}?$)/g;
                if(!reg.test(item.amount)||item.amount<=0){
                    this.$message({
                        type:"info",
                        message:"请输入正确的金额，最多保留两位小数"
                    })
                    return;
                }
                let data={
                    rcptNo:this.rcptNo,
                    amount:item.amount,
                    cCode:this.cCode
                }
                this.$post(this.$host+"/api/order/payflow/payincash",data,{timeout:0}).then(d=>{
                    this.canpay=true;
                    if(d.success){
                        this.$message({
                            type:"success",
                            message:"支付成功"
                        });
                        item.pstatus="支付成功";
                        this.getidDetail()
                        let newobj=new Object();
                        newobj.pName=item.pName;
                        newobj.amount=item.amount;
                        newobj.pstatus=item.pstatus;
                        this.payedDatas.push(newobj);
                        let moneys=0;
                        this.payedDatas.map(el=>{
                            moneys+=parseFloat(el.amount);
                        });
                        this.actualMoney=moneys;
                        item.amount="";
                        item.pstatus="支付失败";
                        if(d.rcptNo){
                            this.rcptNo=d.rcptNo;
                        }
                    }
                })
            },
            // 支付
            Paying(item,index){
                // if(item.amount==""){
                //     this.$message({
                //         type:"info",
                //         message:"支付金额不能为空",
                //     });
                //     return;
                // }
                if (this.$stop()) { return }
                if(!this.canpay){
                    this.$message({
                        type:'info',
                        message:"正在支付，请稍后"
                    });
                    return;
                }
                this.canpay=false;
                let reg=/(^[1-9](\d+)?(\.\d{1,2})?$)|(^(0){1}$)|(^\d\.\d{1,2}?$)/g;
                if(!reg.test(item.amount)||item.amount<=0){
                    this.$message({
                        type:"info",
                        message:"请输入正确的金额，最多保留两位小数"
                    })
                    return;
                }
                let data={
                    rcptNo:this.rcptNo,
                    amount:item.amount,
                    cCode:this.cCode
                }
                this.$post(this.$host+"/api/order/payflow/payincash",data,{timeout:0}).then(d=>{
                    this.canpay=true;
                    if(d.success){
                        this.deletePaying(item,index);
                        this.getidDetail()
                        this.$message({
                            type:"success",
                            message:"支付成功"
                        });
                        item.pstatus="支付成功";
                        this.payedDatas.push(item);
                        let moneys=0;
                        this.payedDatas.map(el=>{
                            moneys+=parseFloat(el.amount);
                        });
                        this.actualMoney=moneys;
                        if(d.rcptNo){
                            this.rcptNo=d.rcptNo;
                        }
                    }
                })
            },
            // 去除一条未支付
            deletePaying(item,index){
                this.payingDatas.splice(index,1);
            },
            // 增加一条涮卡方式
            addcard(Name){
                this.payingDatas.push({pName:Name,amount:""});
            },
            getidDetail(){
                if(!this.id){
                    return;
                }
                if(this.id=="sanke"){
                    this.$post(this.$host+"/api/cust/customer/acctshow",{cCode:this.cCode}).then(d=>{
                        if(d.success){
                            this.accCurAmount=parseFloat(d.accCurAmount)||0;
                            this.accCurCashcou=parseFloat(d.accCurCashcou)||0;
                            this.cCode=d.cCode;
                        }
                    });
                    return;
                }
                this.$post(this.$host+"/api/cust/customer/acctshow",{id:this.id}).then(d=>{
                    if(d.success){
                        this.accCurAmount=parseFloat(d.accCurAmount)||0;
                        this.accCurCashcou=parseFloat(d.accCurCashcou)||0;
                        this.cCode=d.cCode;
                    }
                })
            }
        },
        beforeRouteLeave(to, from, next) {
            if(to.path=="/NavDetail/addOrder"){
                this.updateAlives({name:"addOrder",key:1})
            }else if(to.path=="/NavDetail/addReceipt"){
                this.updateAlives({name:"addReceipt",key:1})
            }else if(to.path=="/NavDetail/Order"){
                this.setDatas({name:"newOrder",value:true})
            }else if(to.path=="/NavDetail/Receipt"){
                this.setDatas({name:"newReceipt",value:true})
            }else if(to.path=="/NavDetail/OpenCard"){
                this.setDatas({name:"newOpenCard",value:true})
            }
            console.log(to)
            console.log(from)
            next()
        },
        mounted () {
            this.rcptNo=this.$route.query.rcptNo||"";
            this.resurl=this.$route.query.resurl||"";
            this.id=this.$route.query.id||"";
            if(this.id){
                if(this.id=="sanke"){
                    this.cCode=this.$getCookie("belongOrg")+this.$getCookie("belongShop")+"000000";
                }
                this.getidDetail();
                
            }
            // let jsondata=this.$route.query.jsondata||"";
            let jsondata=this.$getCookie("jsondata")||"";
            if(jsondata){
                this.jsondata=JSON.parse(jsondata);
            }
            this.amount=parseFloat(this.$route.query.amount)||0;
            if(this.rcptNo){
                this.remainingShow=false;
            }
        }
    }
</script>
<style scoped>
    .Payment{
         padding-top:2rem;
         padding-left:2rem;
         padding-bottom:2rem;
         background: #fff;
    }
    .sud{
        padding: 1rem 0 0 1rem;
    }
    .Paymentbody{
        border:1px solid #ccc;
        width: max-content;
    }
    .moren{
        text-align: center;
        border-bottom: 1px solid #cccccc;
        height: 30px;
        line-height: 30px;
        color: #666;
    }
    .border{
        width: 1px;
        background: #ccc;
    }
    .payed{
        margin-top: 130px;
    }
    .payed .header li{
        float: left;background: #f3f3f6;
        width: 200px;
        height: 30px;
        line-height: 30px;
        color: #666;
        font-size: 14px;
        text-align: center;
        border-top: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        border-right: 1px solid #ccc;
    }
    .payed .header li:last-child,.payed .body li:last-child{
        border-right: none;
    }
    .payed .body li{
        float: left;
        background: #fff;
        font-size: 12px;
        color: #666;
        text-align: center;
        height: 30px;
        line-height: 30px;
        width: 200px;
        border-bottom: 1px solid #ccc;
        border-right: 1px solid #ccc;
        
    }
    .payed .body li.status{
        color: #ffa847;
    }
    .Paymentbody>.left{
        float: left;
        padding: 1rem;
        border-right:none; 
    }
    .Paymentbody>.left>header{
        font-size: 20px;
        color: #2cbcc8;
    }
    .Paymentbody>.left>header span{
        font-size:14px;
        color:#666;
    }
    .Paymentbody>.left>span{
        font-size: 12px;
        color: #666666;
    }
    .Cell.head{
        background:#fff;
    }
    .Cell.head li{
        background:#fff;
        color:#2cbcc8;
        font-size:16px;
    }
    .footer{
        text-align: center;
        padding-top: 40px;
        padding-bottom: 40px;
    }
    .footer button:last-child{
        margin-left: 24px;
    }
    .Paymentbody>.left ul{
        margin-top: 2rem;
    }
    .Paymentbody>.left ul li{
        margin-bottom: 1rem;
    }
    .Paymentbody>.left ul li .pay{
        box-shadow: 0px 2px 2px #efefef;
        width: 60%;
        margin: 0 auto;
        border-radius: 4px;
        cursor: pointer;
        border: 1px solid #efefef;
        
    }
    .Paymentbody>.left ul li .pay img{
        width: 100%;
    }
    .Paymentbody>.left ul li .pay.remaining{
        width: 122px;
        height: 72px;
        text-align: center;
        font-size: 20px;
        padding-top: 10px;
        background: #F6F6F6;
    }
    .Paymentbody>.left ul li .pay.remaining p{
        font-size: 14px;
        color: #ffa847;
    }
    .Paymentbody>.left ul li .pay:hover{
        border: 1px solid #2cbcc8;
    }
    .Paymentbody>.right{
        border-left: 1px solid #cccccc;
        float: left;
        min-height: 666px;
    }
    .Paymentbody>.right>header{
        text-align:center;
        padding:2rem 0;
    }
    .Paymentbody>.right>header p{
        font-size:20px;
        padding-bottom:0.5rem;
    }
    .Paymentbody>.right>header p span{
        font-size:14px;
        color:#ffa847;
    }
    .Paymentbody>.right>header>span i{
        color:#ffa847;
    }
    .iconadd{
        float: right;
    }
    .iconadd::before{
        content: "\e752";
        cursor: pointer;
    }
    .Cell{
        background: #f3f3f6;
        margin-top: 16px;
    }
    .Cell li{
        float: left;
        width: 200px;
        text-align:center;
        height: 40px;
        line-height: 40px;
        color:#666;
    }
    .closeicon::before{
        content: "\e61a";
        cursor: pointer;
    }
</style>