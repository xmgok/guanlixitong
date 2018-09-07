<template>
    <div class="Approve_task">
            <el-table :data="datas" border style="width:100%" >
                <el-table-column  prop="flowName" label="审批名称" width="200"></el-table-column>
                <el-table-column  prop="creatorName" label="发起人" width="120"></el-table-column>
                <el-table-column  prop="createTime" label="发起时间" width="120"></el-table-column>
                <el-table-column  label="操作" width="250">
                    <template slot-scope="scope" class="" >
                        <div class="">
                            <Button Name="查看进度" buttonClass="Btn"   @click.native="gotoplan(scope.row,scope.$index)"/>
                            <i class="borderLeft" ></i>
                            <Button Name="查看详情" buttonClass="Btn"   @click.native="gotoDetail(scope.row,scope.$index)"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column ></el-table-column>
            </el-table>
        <Paging :handleCurrentChange="handleCurrentChange" :total="total"  class="pagingwidth" />
        <div class="model" v-show="progressShow">
            <header class="Header clearfix">
                <div class="left">审批进度</div>
                <div class="right"><i class="icon iconclose" @click="cancleprogress"></i></div>
            </header>
            <div class="modelBox">
                <ul  class="Detail clearfix" :style="{width:isWidth}">
                    <li v-for="(item,index) in detaildata">
                        <div class="header">
                            <i class="icon" :class="'F'+item.checkStatus"></i>
                            <p :class="'F'+item.checkStatus">{{(item.checkStatus=="1"&&"待审批")||(item.checkStatus=="2"&&"审批通过")||(item.checkStatus=="3"&&"驳回")}}</p>
                            <i class="xuxian"></i>
                        </div>
                        <!-- <div class="footer ">
                            <div class="clearfix">
                                <span class="left">审批人：</span>
                                <div class="right">{{item.operator.slice(0,item.operator.indexOf(":"))||"暂无"}}</div>
                            </div>
                            <div class="clearfix">
                                <span class="left">审批理由：</span>
                                <div class="right">{{detailStatus[index]?(detailStatus[index].remark?detailStatus[index].remark:"暂无"):"暂无"}}</div>
                            </div>
                        </div> -->
                    </li>
                </ul>
            </div>
        </div>
        <div class="model details" v-show="detailShow">
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
        <Mtk v-show="progressShow"/>
        <Mtk v-show="detailShow"/>
    </div>
    </template>
    <script>
        import Vue from "vue";
        import Table from "../../../common/Table"
        import Button from "../../../common/Button"
        import Mtk from "../../../common/Mtk"
        import Paging from "../../../common/Paging";
        export default{
            data(){
                return{
                    progressShow:false,
                    yesDetail:true,
                    TabelHeader: [
                        { detail: "审批名称", width: "150px" },
                        { detail: "发起人", width: "150px" },
                        { detail: "发起时间", width: "100px" },
                        { detail: "审批进度", width: "100px" },
                    ],
                    Tbody: ["flowName", "creatorName", "createTime"],
                    datas:[],
                    detaildata:[],
                    detailStatus:[],
                    PageNum:"",
                    total:1,
                    detailShow:false,
                    detaildatas:[],
                    headerdata:"",
                }
            },
            computed: {
                isWidth(){
                    return this.detaildata.length*200+"px"
                }  
            },
            components: {
                Button,Table,Paging,Mtk  
            },
            methods:{
                cancleprogress(){
                    this.progressShow=false;
                },
                hideDetail(){
                    this.detailShow=false;
                },
                // 查看详情
                gotoDetail(item){
                    this.$post(this.$host+"/api/sysmgr/formDataInfo/getByHistoryId/"+item.id,{}).then(d=>{
                        if(d.success){
                            let str=d.data.jsonData;
                            str=JSON.parse(str)
                            console.log(str)
                            let canShow=true;
                            if(str[0]['approveType']=="refund"){//退款的详情页
                                this.$router.push({
                                    path:"/NavDetail/refund/seeRefund",
                                    query:{
                                        flowDataId:d.data.id,
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
                // 查看一个任务的进度
                gotoplan(item){
                    this.$post(this.$host+"/api/sysmgr/flowHistory/getProgress/"+item.id,{}).then(d=>{
                        if(d.success){
                           this.progressShow=true;
                           this.detaildata=d.data;
                        }
                    });
                    this.$post(this.$host+"/api/sysmgr/flowTaskHistory/listTasks/"+item.id,{}).then(d=>{
                        if(d.success){
                            this.detailStatus=d.data;
                        }
                    })
                },
                handleCurrentChange(index){
                    let data={
                        "pageNumber":parseInt(index),
                        "pageSize":20
                    }
                    this.$post(this.$host+"/api/sysmgr/flowHistory/list",data).then(d=>{
                        if(d.success){
                            let content=d.data.content;
                            content.map(el=>{
                                el.createTime=this.$dateFormat("yy-MM-dd",el.createTime);
                            })
                            this.datas=d.data.content;
                            this.total=d.data.total;
                            // 处理分页的序号问题
                            if (index > 1) {//第二页
                                this.PageNum = index-1;
                            } else {//第一页
                                this.PageNum = "";
                            }
                        }
                    })
                }
            },
            mounted () {
                let data={
                    "pageNumber":1,
                    "pageSize":20
                }
                this.$post(this.$host+"/api/sysmgr/flowHistory/list",data).then(d=>{
                    if(d.success){
                        let content=d.data.content;
                        content.map(el=>{
                            el.createTime=this.$dateFormat("yy-MM-dd",el.createTime);
                        })
                        this.datas=d.data.content;
                        this.total=d.data.total;
                    }
                })
            }
        }
    </script>
    <style scoped>
        .model{
            width: 600px;
        }
        .model.details {
            width: 400px;
        }
        .model.details .modelBox {
            width: 300px;
            margin: 0 auto;
        }
        .model.details .modelBox .left {
            float: left;
            width: 100px;
            text-align: right;
        }
        .model.details .modelBox .right{
            float: left;
            width: 170px;
            text-align: left;
        }
        .footerBTN {
            text-align: center;
            padding-bottom: 24px;
            margin-top: 24px;
        }
        .Approve_task{
        }
        .modelBox{
            overflow-x: auto;
        }
        .Approve_task .Detail .icon{
            font-size: 48px;
            color: #888;
        }
        .Approve_task .xuxian{
            display: inline-table;
            border-top: 2px dashed #888;
            width: 10rem;
            position: absolute;
            right: -4.833333rem;
            top: 20px;
        }
        .Approve_task li:last-child .xuxian{
            display: none;
        }
        /* 待审核 */
        .Approve_task .icon.F1::before{
            content: "\e62c";
        }
        /* 已审核 */
        .Approve_task .icon.F2::before{
            content: "\e624";
            color:#2cbcc8;
        }
        .Approve_task p.F2{
            color:#2cbcc8;
        }
         /* 已驳回 */
         .Approve_task .icon.F3::before{
            content: "\e68d";
        }
        .Detail .header{
            text-align: center;
        }
        .Detail .header>p{
            margin-top: 24px;
        }
        .process{
            position: absolute;
            width: 800px;
            left: 600px;
            top: 60px;
        }
        .Approve_task .Detail{
            padding: 24px 0;
            margin: 0 auto;
        }
       
        .Approve_task .Detail .footer{
            border-top: 1px solid #cccccc;
            padding-top: 1.5rem;
            margin-top: 1.5rem;
        }
        .Approve_task .Detail .footer .clearfix{
            margin-bottom: .833333rem;
        }
        .Approve_task .Detail .footer .left{
            float: left;
            display: inline-block;
            width: 8.333333rem;
            text-align: right;
        }
        .Approve_task .Detail .footer .right{
            float: right;
            display: inline-block;
            width: 8.333333rem;
            padding-right: 1.25rem;
        }
        .Detail>li{
            display: inline-table;
            width: 16.666667rem;
            float: left;
            position: relative;
        }
        li>p{
            width: 5rem;
            text-align: center;
        }
        li.Tbody .left{
            height: 6.416667rem;
            line-height: 6.416667rem;
        }
        li.Tbody .right .el-steps{
            /* padding:  .833333rem 0 .833333rem 1.666667rem; */
            /* margin: 10px 0; */
        }
    </style>