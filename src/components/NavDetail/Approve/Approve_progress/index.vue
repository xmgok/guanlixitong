<template>
    <div class="layout">
    <el-table :data="datas" border style="width:100%">
        <el-table-column  prop="flowConfigName" label="审批名称" width="200"></el-table-column>
        <el-table-column  prop="fromUser" label="发起人" width="200">
            <template slot-scope="scope" class="" >
                {{scope.row.creatorName+"("+scope.row.creator+")"}}
            </template>    
        </el-table-column>
        <el-table-column  prop="createTime" label="发起时间" width="200"></el-table-column>
        <el-table-column  label="审批意见" width="120">
            <template slot-scope="scope" class="" >
                <div class="">
                    <Button Name="同意" buttonClass="Btn"  @click.native="agree(scope.row,scope.$index)"/>
                    <i class="borderLeft" ></i>
                    <Button Name="驳回" buttonClass="Btn"  @click.native="reject(scope.row,scope.$index)"/>
                </div>
            </template>
        </el-table-column>
        <el-table-column  label="详情" width="120">
            <template slot-scope="scope" class="" >
                <div class="">
                    <Button Name="查看" buttonClass="Btn"  @click.native="gotoDetail(scope.row,scope.$index)"/>
                </div>
            </template>
        </el-table-column>
        <el-table-column  ></el-table-column>
    </el-table>
    <!-- <Table :TabelHeader="TabelHeader" :datas="datas" :Tbody="Tbody" :NoDo="true" :PageNum="PageNum" :yesDetail="true" amend="同意" deleteName="驳回" :update="agree" :deleteItem="reject" :gotoDetail="gotoDetail" widthValue="700px"/> -->
    <div class="model" v-show="remarkShow">
        <header class="Header clearfix">
            <div class="left">{{agreeData}}详情</div>
            <div class="right"><i class="icon iconclose" @click="cancleEvent"></i></div>
        </header>
        <div class="modelBox">
            <Textarea  arguName="remark" @sonTextarea="upTextarea" class="TextArea" :minRows="4"/>
        </div>
        <div class="footerBTN">
            <Button Name="取消" class="BTN"  @click.native="cancleEvent" Btn="None" buttonClass=""/>
            <Button Name="确定"  class="BTN" @click.native="remarkEvent(agreeStatus)"/>
        </div>
    </div>
    <div class="model" v-show="detailShow">
        <header class="Header clearfix">
            <div class="left">{{headerdata}}意见</div>
            <div class="right"><i class="icon iconclose" @click="hideDetail"></i></div>
        </header>
        <ul class="modelBox">
            <li v-for="item in detaildatas" class="clearfix">
                <span class="left">{{item.label}}：</span>
                <span class="right">{{item.value}}</span>
            </li>
            <li class="footerBTN">
                <Button Name="确定" @click.native="hideDetail"/>
            </li>
        </ul>
    </div>
    <MTK v-show="remarkShow"/>
    <MTK v-show="detailShow"/>
    <Paging :handleCurrentChange="handleCurrentChange" :total="total"  v-show="total>10"/>
    </div>
    </template>
    <script>
        import Paging from "../../../common/Paging";
        import Button from "../../../common/Button";
        import Approve_progress_detail from "./Approve_progress_detail";
        import Table from "../../../common/Table";
        import MTK from "../../../common/Mtk";
        import Textarea from "../../../common/Textarea";
        export default{
            components:{
                Button,Approve_progress_detail,Table,MTK,Textarea,Paging
            },
            data(){
                return {
                    agreeData:"",//同意或驳回
                    agreeStatus:false,//false为驳回，true为同意
                    datas:[],
                    detaildatas:[],//详情数据
                    detailShow:false,
                    headerdata:"",
                    TabelHeader:[
                        {detail:"审批名称",width:"100px"},
                        {detail:"发起人",width:"150px"},
                        {detail:"发起时间",width:"150px"},
                        {detail:"审批意见",width:"150px"},
                        {detail:"详情",width:"100px"},
                    ],
                    Tbody:["flowConfigName","fromUser","createTime"],
                    remark:"不同意",
                    remarkShow:false,
                    remarkId:"",
                    total:10,
                    PageNum:""
                }
            },
            methods:{
                hideDetail(){
                    this.detailShow=false;
                },
                upTextarea(value,arguName){
                    this[arguName]=value;
                    console.log(
                        this.remark
                    )
                },
                // 同意
                agree(item){
                    // this.remarkShow=true;
                    this.remarkId=item.id;
                    // this.agreeStatus=true;
                    // this.agreeData="同意";
                    let data={
                        id:this.remarkId
                    }
                    this.$post(this.$host+"/api/sysmgr/flowTaskHistory/accept",data).then(d=>{
                        if(d.success){
                            this.remarkShow=false;
                            this.remark="";
                            let newDatas=this.datas.filter((el)=>{
                                return el.id!=this.remarkId;
                            });
                            this.datas=newDatas;
                            this.remarkId="";
                            this.$message({
                                type:"success",
                                message:"同意成功",
                                duration:"800"
                            })
                        }
                    })
                },
                agreeRvent(){
                    
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
                                this.remarkShow=false;
                                this.remark="";
                                let newDatas=this.datas.filter((el)=>{
                                    return el.id!=this.remarkId;
                                });
                                this.datas=newDatas;
                                this.remarkId="";
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
                                this.remarkShow=false;
                                this.remark="";
                                let newDatas=this.datas.filter((el)=>{
                                    return el.id!=this.remarkId;
                                });
                                this.datas=newDatas;
                                this.remarkId="";
                                this.$message({
                                    type:"success",
                                    message:"驳回成功",
                                    duration:"800"
                                })
                            }
                        })
                    }
                    
                },
                // 驳回
                reject(item){
                    this.remarkShow=true;
                    this.remarkId=item.id;
                    this.agreeStatus=false;
                    this.agreeData="驳回";
                },
                // 取消
                cancleEvent(){
                    this.remarkShow=false;
                },
                // 查看详情
                gotoDetail(item){
                    let flowHistoryId=item.flowHistoryId;
                    this.$post(this.$host+"/api/sysmgr/formDataInfo/getByHistoryId/"+flowHistoryId,{}).then(d=>{
                        if(d.success){
                            let str=d.data.jsonData;
                            str=JSON.parse(str)
                            console.log(str)
                            let canShow=true;
                            if(str[0]['approveType']=="refund"){//退款的详情页
                                this.$router.push({
                                    path:"/NavDetail/refund/seeRefund",
                                    query:{
                                        flowDataId:d.data.id
                                    }
                                });
                                canShow=false;
                            }
                            if(canShow){
                                this.detaildatas=str;
                                this.detailShow=true;
                                this.headerdata=item.flowConfigName;
                            }
                            
                        }
                    })
                },
                handleCurrentChange(index){
                    let data={
                        "pageNo":parseInt(index),
                        "pageSize":10
                    }
                    this.$post(this.$host+"/api/sysmgr/flowTaskHistory/listTasks",data).then(d=>{
                        if(d.success){
                            this.datas=d.data.content;
                            this.total=d.data.total;
                             // 处理分页的序号问题
                            if (index > 1) {//第二页
                                this.PageNum = index - 1;
                            } else {//第一页
                                this.PageNum = "";
                            };
                        }
                    })
                }
            },
            mounted () {
                let data={
                    "pageNo":1,
                    "pageSize":10
                }
                this.$post(this.$host+"/api/sysmgr/flowTaskHistory/listTasks",data).then(d=>{
                    if(d.success){
                        let content=d.data.content;
                        content.map(el=>{
                            el.createTime=this.$dateFormat("yy-MM-dd hh:mm:ss",el.createTime);
                        })
                        this.datas=content;
                        this.total=d.data.total;
                    }
                })
            }
        }
    </script>
    <style scoped>
        .Paging{
            text-align: right;
        }
        .BTN:last-child{
            margin-left: 24px;
        }
        .Cell{
            overflow:hidden;
        }
        .model{
            width:400px;
        }
        .model .modelBox{
            width: 300px;
            margin: 0 auto;
        }
        .model .modelBox .left{
            float: left;
            width: 100px;
            text-align: right;
        }
        .model .modelBox .right{
            float: left;
            width: 170px;
            text-align: left;
        }
        .TextArea{
            width: 100%;
        }
        .remarkmodel{
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
            background: #ffffff;
            padding: 20px 30px;
            z-index: 1000;
            font-size: 1.166667rem;
            color: #444444;
            width: 33.333333rem;
        }
        .remarkmodel header{
            margin-bottom: 1rem;
        }
        .footerBTN{
            text-align: center;
            padding-bottom:24px;
            margin-top: 24px;
        }
        .table-bordered {
            border: 1px solid #ddd;
            border-collapse: separate;
            border-left: 0;
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            border-radius: 4px;
        }
        .table-bordered th, .table-bordered td {
        border-left: 1px solid #ddd;
    }
    .table th, .table td {
        padding: 8px;
        line-height: 20px;
        text-align: left;
        vertical-align: top;
        border-top: 1px solid #ddd;
        font-size: 16px;
    }
    .table th{
        border-top:none;
    }
    </style>