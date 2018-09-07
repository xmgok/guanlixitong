<template>
    <div class="Station">
        <header class="search-wraps">
            <ul>
                <li>
                    <span>商家名称：</span>
                    <Input placeholder="商家名称" :value="codeOrName" arguName="codeOrName" @sonInput="upInput" :widths="'160px'" />
                </li>
                <li>
                    <span>商家类型：</span>
                    <Select :SelecttemData="SelecttemData" :values="cateCode" arguName="cateCode" :SelecttemDetail="['cateCode','cateValue']" @sonSelect="upInput" :widths="'160px'"/>
                </li>
                <li>
                    <span>商家状态：</span>
                    <Select :SelecttemData="SelecttemDataStatus" :values="psStatus" arguName="psStatus" :SelecttemDetail="['key','value']" @sonSelect="upInput" :widths="'160px'"/>
                </li>
                <li>
                    <Button Name="查询" @click.native="demand" buttonClass="header" Search="true"/>
                </li>
            </ul>
        </header>
        <div class="Stations " >
            <div class="addStation">
                <Button Name="新增" @click.native="addStation" :iconadd="true"/>
            </div>
                <el-table :data="datas" border style="width:100%">
                    <el-table-column  prop="pName" label="商家名称" width="120"></el-table-column>
                    <el-table-column  prop="pCates" label="类型" width="120"></el-table-column>
                    <el-table-column  prop="statuss" label="状态" width="120"></el-table-column>
                    <el-table-column  label="操作" width="120">
                        <template slot-scope="scope" class="" >
                            <div class="">
                                <Button Name="修改" buttonClass="Btn"   @click.native="update(scope.row,scope.$index)"/>
                                <i class="borderLeft" ></i>
                                <Button Name="删除" buttonClass="Btn"  @click.native="deleteItem(scope.row,scope.$index)"/>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column  ></el-table-column>
                </el-table>
            <Paging :handleCurrentChange="handleCurrentChange" :total="total"  class="pagingwidth" :pageSize="20"/>
            <div class="model" v-show="modelShow">
                <header class="Header clearfix">
                    <div class="left">{{modelHeader}}</div>
                    <div class="right"><i class="icon iconclose" @click="cancleStation"></i></div>
                </header>
                <div class="modelBox">
                    <div class="row clearfix">
                        <span >商家名称：</span>
                        <Input :value="pName" arguName="pName" @sonInput="upInput" :readonlys="readonlys"/>
                    </div>
                    <div class="row clearfix">
                        <span >商家类型：</span>
                        <Select :SelecttemData="SelecttemData" :values="pstStatType" arguName="pstStatType" :SelecttemDetail="['cateCode','cateValue']" @sonSelect="upInput" :disabled="readonlys"/>
                    </div>
                    <div class="row clearfix">
                        <span >商家状态：</span>
                        <Select :SelecttemData="SelecttemDataStatus" :values="pstStatus" arguName="pstStatus" :SelecttemDetail="['key','value']" @sonSelect="upInput" :disabled="readonlys"/>
                    </div>
                    <div class="row Footer">
                        <Button Name="取消" @click.native="cancleStation" buttonClass="None"/>
                        <Button :Name="ButtonName" @click.native="sureStation"/>
                    </div>
                </div>
            </div>
            <MTK v-show="modelShow"/>
        </div>
    </div>
    </template>
    <script>
        import Table from "../../common/Table"
        import Button from "../../common/Button"
        import Input from "../../common/Input"
        import MTK from "../../common/Mtk"
        import Textarea from "../../common/Textarea"
        import Select from "../../common/Select"
        import Paging from "../../common/Paging"
        export default {
            components: {
                Table,Button,Input,MTK,Textarea,Select,Paging
            },
            data(){
                return{
                    psStatus:"",//商家状态
                    cateCode:"",//商家类型
                    codeOrName:"",//商家名称
                    widths:"120px",
                    SelecttemStatus:[
                        {key:1,value:"有效"},
                        {key:0,value:"无效"},
                    ],
                    readonlys:false,
                    modelHeader:"商家详情",
                    SelecttemData:[],//商家数据
                    SelecttemDataStatus:[
                        {key:1,value:"有效"},
                        {key:0,value:"无效"},
                    ],//状态数据
                    pstStatType:"",//商家类型
                    pstStatus:1,//商家状态
                    pstStatId:"",//商家id
                    pName:"",//商家名称
                    isHeight:"100%",
                    ButtonName:"保存",
                    modelShow:false,
                    status:0,//0是新增，1是查看，2是修改
                    datas:[],
                    PageNum:"",
                    TabelHeader:[
                        {detail:"商家名称",width:"200px"},
                        {detail:"类型",width:"200px"},
                        {detail:"状态",width:"50px"},
                        {detail:"",width:"150px"},
                    ],
                    Tbody:["pName","pCates","statuss"],
                    total:10,
                }
            },
            methods: {
                //过滤查询
                demand(){
                    let data={
                        "pageNumber":1,
                        "pageSize":20,
                        pName:this.codeOrName,
                        cateCode:this.cateCode,
                        status:this.psStatus
                    }
                    this.$post(this.$host+"/api/cust/partners/page",data).then(d=>{
                        if(d.success){
                            let content=d.data.content;
                            content.map(el=>{
                                if(el.status==0){
                                    el.statuss="无效";
                                }else if(el.status==1){
                                    el.statuss="有效";
                                }
                            });
                            this.datas=content;
                            this.total=d.data.total;
                        }
                    })
                },
                upInput(value,arguName){
                    this[arguName]=value;
                },
                // 新增
                addStation(){
                    this.modelShow=true;
                    this.status=0;
                    this.modelHeader="商家新增";
                    this.pstStatId="";
                    this.readonlys=false;
                },
                // 取消
                cancleStation(){
                    this.pName="";
                    this.pstStatId="";
                    this.pstStatus=1;
                    this.pstStatType="";
                    this.modelShow=false;
                },
                // 保存
                sureStation(){
                    if(this.status==0){//新增
                        let data={
                            pName:this.pName,
                            pCates:this.pstStatType,
                            status:this.pstStatus
                        }
                        this.$post(this.$host+"/api/cust/partners/add",data).then(d=>{
                            if(d.success){
                                this.handleCurrentChange(this.PageNum+1);
                                this.$message({
                                    type: 'success',
                                    message: '保存成功!',
                                    duration:"800",
                                    onClose:()=>{
                                        this.pName="";
                                        this.pstStatId="";
                                        this.pstStatus=1;
                                        this.pstStatType="";
                                        this.modelShow=false;
                                    }
                                });
                            }
                        })
                    }else if(this.status==2){//修改
                        let data={
                            id:this.pstStatId,
                            pName:this.pName,
                            pCates:this.pstStatType,
                            status:this.pstStatus,
                        }
                        this.$post(this.$host+"/api/cust/partners/update",data).then(d=>{
                            if(d.success){
                                this.handleCurrentChange(this.PageNum+1);
                                this.$message({
                                    type: 'success',
                                    message: '保存成功!',
                                    duration:"800",
                                    onClose:()=>{
                                        this.pName="";
                                        this.pstStatId="";
                                        this.pstStatus=1;
                                        this.pstStatType="";
                                        this.modelShow=false;
                                    }
                                });
                            }
                        })
                    }
                },
                // 修改
                update(item,index){
                    this.pName=item.pName;
                    this.pstStatId=item.id;
                    this.pstStatus=item.status;
                    this.SelecttemData.map(el=>{
                        if(el.cateValue==item.pCates){
                            this.pstStatType=el.cateCode;
                        }
                    })
                    this.modelShow=true;
                    this.status=2;
                    this.ButtonName="保存";
                    this.modelHeader="商家修改";
                    this.readonlys=false;
                },
                // 删除
                deleteItem(item,index){
                    let that=this;
                    this.$messagebox.confirm('确定删除'+item.pName+'?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$post(this.$host+"/api/cust/partners/delete",{ id:item.id}).then((d) => {
                            if (d.success) {
                                this.handleCurrentChange(this.PageNum+1);
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!',
                                });
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                },
                //查询商家
                getAllStation(){
                    let data={
                        "pageNumber":1,
                        "pageSize":20,
                        status:1
                    }
                    this.$post(this.$host+"/api/cust/partners/page",data).then(d=>{
                        if(d.success){
                            let content=d.data.content;
                            content.map(el=>{
                                if(el.status==0){
                                    el.statuss="无效";
                                }else if(el.status==1){
                                    el.statuss="有效";
                                }
                            });
                            this.datas=content;
                            this.total=d.data.total;
                        }
                    })
                    // 查询商家类型
                    this.$post(this.$host+"/api/cust/partners/pcates",{}).then(d=>{
                        if(d.success){
                            this.SelecttemData=d.data;
                        }
                    })
                },
                handleCurrentChange(index){
                    let data={
                        "pageNumber":index,
                        "pageSize":20,
                        pName:this.codeOrName,
                        cateCode:this.cateCode,
                        status:this.psStatus
                    }
                    this.$post(this.$host+"/api/cust/partners/page",data).then(d=>{
                        if(d.success){
                            let content=d.data.content;
                            content.map(el=>{
                                if(el.status==0){
                                    el.statuss="无效";
                                }else if(el.status==1){
                                    el.statuss="有效";
                                }
                            });
                            this.total=d.data.total;
                            this.datas=content;
                             // 处理分页的序号问题
                             if (index > 1) {//第二页
                                this.PageNum = index - 1;
                            } else {//第一页
                                this.PageNum = 0;
                            }
                        }
                    })
                }
            },
            mounted () {
                this.getAllStation();
            }
        }
    </script>
    <style scoped>
        .Header{
            font-size: 1.166667rem;
            padding-top: 16px;
            padding-bottom: 10px;
            border-bottom: 1px solid #efefef;
        }
        .Header .Cell{
            float: left;
            margin-right: 1rem;
            height: 30px;
            line-height: 30px;
        }
        .addStation{
            padding-bottom: 1rem;
        }
        .model{
            width: 33.333333rem;
        }
        .model .modelBox{
            margin: 0 auto;
            width: 225px;
        }
        .model .modelBox .row{
            padding-bottom: 1rem;
        }
        .model .modelBox .row.Footer{
            margin: 1.5rem 0;
            padding-left: 1rem;
        }
        .model .modelBox .row.Footer button{
            margin-left: 24px;
        }
    </style>