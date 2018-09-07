<template>
        <div class="BG">
            <div class="addContact">
                <header class="header">{{headerdata}}详情</header>
                <ul class="Tbody">
                    <li v-for="item in datas">
                        <span class="left">{{item.label}}:</span>
                        <span>{{item.value}}</span>
                    </li>
                    <li class="footer">
                        <Button Name="同意" @click.native="agree"/>
                        <Button Name="驳回" @click.native="reject"/>
                    </li>
                </ul>
            </div>
            <div class="model" v-show="remarkShow">
                <div class="Cell clearfix">
                    <header class="left">{{agreeData}}意见：</header>
                    <Textarea class="right" arguName="remark" @sonTextarea="upTextarea"/>
                </div>
                <Button Name="确定" class="BTN" @click.native="remarkEvent(agreeStatus)"/>
                <Button Name="取消" class="BTN" @click.native="cancleEvent"/>
            </div>
            <MTK v-show="remarkShow"/>
        </div>
    </template>
    <script>
        import {mapMutations} from "vuex";
        import Input from "../../../../common/Input";
        import Button from "../../../../common/Button";
        import Select from "../../../../common/Select";
        import MTK from "../../../../common/Mtk";
        // import AboutBranch from "../../common/AboutBranch"
        export default{
            components: {
                Input,Button,Select,AboutBranch:(resolve)=>{require(["../../../../common/AboutBranch"],resolve)},MTK
            },
            data(){
                return {
                    remarkShow:false,
                    datas:[],
                    headerdata:"",
                    remarkId:0,
                    remark:"",
                    agreeData:""
                }
            },
            methods:{
                // 取消
                cancleEvent(){
                    this.remarkShow=false;
                },
                upTextarea(value,arguName){
                    this[arguName]=value;
                    console.log(
                        this.remark
                    )
                },
                //确定同意或驳回
                remarkEvent(agreeStatus){
                    if(agreeStatus){//同意
                        let data={
                            id:this.remarkId,
                            remark:this.remark
                        }
                        this.$post(this.$host+"/api/sysmgr/flowTaskHistory/accept",data).then(d=>{
                            if(d.success){
                                this.$message({
                                    type:"success",
                                    message:"同意成功",
                                    duration:"800"
                                })
                            }
                        })
                    }else{
                        let data={
                            id:this.remarkId,
                            remark:this.remark
                        }
                        this.$post(this.$host+"/api/sysmgr/flowTaskHistory/reject",data).then(d=>{
                            if(d.success){
                                this.$message({
                                    type:"success",
                                    message:"驳回成功",
                                    duration:"800"
                                })
                            }
                        })
                    }
                    
                },
                agree(){//同意
                    this.remarkShow=true;
                    this.agreeStatus=true;
                    this.agreeData="同意";
                },
                reject(){//驳回
                    this.remarkShow=true;
                    this.agreeStatus=true;
                    this.agreeData="驳回";
                }
            },
            mounted () {
                let headerdata=this.$route.query.Name||"";
                this.headerdata=headerdata;
                let flowHistoryId=this.$route.query.id||"";
                this.remarkId=flowHistoryId;
                 this.$post(this.$host+"/api/sysmgr/formDataInfo/getByHistoryId/"+flowHistoryId,{}).then(d=>{
                    if(d.success){
                        let str=d.data.jsonData;
                        str=JSON.parse(str)
                        console.log(str)
                        this.datas=str;
                    }
                })
            }
        }
    </script>
    <style scoped>
        .model{
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
            background: #d4eaf6;
            padding: 20px 10px;
            text-align: center;
            border: solid 1px #ebfdfd;
            border-radius: 4px;
            min-width: 540px;
            min-height: 200px;
            z-index: 1000;
        }

        .waring::before{
            content: "\e6ab";
            color: #fc1433;
        }
        .AboutBranch{
        position: absolute;
        left: 0%;
        top: 1.833333rem;
        z-index: 1000;
        background: #fff;
        }
        .BG .StoreSelect{
        position: absolute;
        left: 8.2rem;
        top: 0px;
        width:8px;
        height: 8px;
        border-right: 1px solid #cccccc;
        border-bottom: 1px solid #cccccc;
        transform: rotate(45deg);
        cursor: pointer;
        transition: all 0.2s linear;
        transform-origin: 75% 75%;
    }
    .BG .StoreSelect.Cliked{
        transform: rotate(-135deg);
    }
        select{
            width: 15rem;
            height: 2.5rem;
            border-radius: .333333rem;
            border: solid 1px #ccc;
            padding:  0 .666667rem;
            font-size: 1.166667rem !important;
            color: #444;
        }
        .BG{
            background: #fff;
            height: 100vh;
        }
        .Tbody>li{
            margin: 0 auto;
            margin-bottom: .833333rem;
        }
        .Tbody>li>span{
            position: relative;
        }
        .footer{
            padding-top: 4.166667rem;
            text-align: center;
            padding-right: 10rem;
        }
        .addContact{
            width: 45rem;
            min-width:540px;
            margin-left: 2rem;
            padding-bottom: 4.166667rem;
        }
        .addContact>div{
            margin: 5px 0;
        }
        span.left{
            display: inline-block;
            width: 30%;
            text-align: right;
            margin-right: 2rem;
        }
        .header{
            font-size: 2rem;
            text-align: center;
            color: #386b88;
            padding: 2rem 0;
        }
        .Logo{
            width: 100px;
            height: 50px;
        }
        input.file{
            width: 80px;
        }
       
        button{
            background: #d5d5d5;
            padding: 5px 20px;
            text-align: center;
            line-height: 20px;
            font-size: 14px !important;
            border-radius: 8px;
            cursor:pointer;
            margin-left: 4.166667rem;
        }
        button:hover{
            background:#e6e6e6;
        }
    </style>