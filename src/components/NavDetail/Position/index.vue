<template>
    <div class="Station" :style="{minHeight:isHeight}" ref="p">
        <div class="addStation">
            <Button Name="新增" @click.native="addStation" :iconadd="true"/>
        </div>
        <el-table :data="datas" border style="width:100%">
            <el-table-column  prop="pstName" label="职位名称" width="200"></el-table-column>
            <el-table-column  label="操作" width="120">
                <template slot-scope="scope" class="" >
                    <div class="">
                        <!-- <Button Name="查看" buttonClass="Btn"   @click.native="demandFuncId(scope.row,scope.$index)"/>
                        <i class="borderLeft" ></i> -->
                        <Button Name="修改" buttonClass="Btn"   @click.native="update(scope.row,scope.$index)"/>
                        <i class="borderLeft" ></i>
                        <Button Name="删除" buttonClass="Btn"   @click.native="deleteItem(scope.row,scope.$index)"/>
                    </div>
                </template>
            </el-table-column>
            <el-table-column  ></el-table-column>
        </el-table>
        <!-- <Table  :TabelHeader="TabelHeader" :Tbody="Tbody" :demandShow="demandShow" :demandFunc="demandFuncId" amend="修改" :datas="datas" :update="update" :deleteItem="deleteItem" :NoDo="true" :widthValue="'450px'" :PageNum="PageNum" /> -->
        <div class="model" v-show="modelShow">
            <header class="Header clearfix">
                <div class="left">{{modelHeader}}</div>
                <div class="right"><i class="icon iconclose" @click="cancleStation"></i></div>
            </header>
            <div class="modelBox">
                <div class="row clearfix">
                    <span ><i class="waring icon" ></i>职位名称：</span>
                    <Input :value="pstName" arguName="pstName"  :onkeyup="onkeyup" :readonlys="readonlys"/>
                    <i  class="pleft" v-show="pstNameShow">必填</i>
                </div>
                <div class="row clearfix">
                    <span ><i class="waring icon" ></i>所属岗位：</span>
                    <Select :SelecttemData="SelecttemData" :values="pstStatId" arguName="pstStatId" :SelecttemDetail="['id','statName']" @sonSelect="upInput" :disabled="readonlys" :widths="'160px'"/>
                    <i  class="pleft" v-show="pstStatIdShow">必填</i>
                </div>
                <div class="row clearfix">
                    <span >职位描述：</span>
                    <Textarea :values="pstRemark" arguName="pstRemark" @sonTextarea="upInput" :readonlys="readonlys"/>
                </div>
                <div class="row footer" v-show="isdemand">
                    <Button Name="确定" @click.native="cancleStation"/>
                </div>
                <div class="row Footer" v-show="!isdemand">
                    <Button Name="取消" @click.native="cancleStation" buttonClass="None"/>
                    <Button :Name="ButtonName" @click.native="sureStation"/>
                </div>
            </div>
        </div>
        <MTK v-show="modelShow"/>
    </div>
</template>
<script>
    import Table from "../../common/Table"
    import Button from "../../common/Button"
    import Input from "../../common/Input"
    import MTK from "../../common/Mtk"
    import Textarea from "../../common/Textarea"
    import Select from "../../common/Select"
    import { mapState, mapMutations } from 'vuex'
    export default {
        components: {
            Table,Button,Input,MTK,Textarea,Select
        },
        data(){
            return{
                pstStatIdShow:false,
                pstNameShow:false,
                isdemand:true,
                readonlys:false,
                modelHeader:"职位详情",
                SelecttemData:[],//岗位数据
                pstStatId:"",//岗位id
                isHeight:"100%",
                ButtonName:"保存",
                modelShow:false,
                status:0,//0是新增，1是查看，2是修改
                datas:[],
                demandShow:true,
                id:"",//职位id
                pstName:"",//id职位名称
                pstRemark:"",//id职位描述
                PageNum:"",
                TabelHeader:[
                    {detail:"职位名称",width:"200px"},
                    {detail:"",width:"250px"},
                ],
                Tbody:["pstName"],
            }
        },
        computed:{
            ...mapState(['Postionvuex'])
        },
        methods: {
            ...mapMutations(['setDatas']),
             onkeyup(value){
                value.target.value = value.target.value.replace(/[^\w\u4E00-\u9FA5]/g,"")
                this.pstName=value.target.value;
            },
            upInput(value,arguName){
                this[arguName]=value;
                if(arguName=="pstName"){
                    if(value===""){
                        this.pstNameShow=true;
                    }else{
                        this.pstNameShow=false;
                    }
                }
                if(arguName=="pstStatId"){
                    if(value==""){
                        this.pstStatIdShow=true;
                    }else{
                        this.pstStatIdShow=false;
                    }
                }
                console.log(value)
                console.log(this.pstStatId)
            },
            // 新增
            addStation(){
                this.modelShow=true;
                this.status=0;
                this.modelHeader="职位新增";
                this.pstStatId="";
                this.readonlys=false;
                this.isdemand=false;
            },
            // 取消
            cancleStation(){
                if(this.status==0){//新增
                    this.pstName="";
                    this.pstRemark="";
                    this.modelShow=false;
                }else if(this.status==2){//修改
                    this.pstName="";
                    this.pstRemark="";
                    this.id="";
                    this.modelShow=false;
                }else if(this.status==1){//查看
                    this.pstName="";
                    this.pstRemark="";
                    this.id="";
                    this.modelShow=false;
                    this.ButtonName="保存";
                    this.readonlys=false;
                }
            },
            // 保存
            sureStation(){
                if(!this.pstName){
                    this.$message({
                        type:"info",
                        message:"请输入职位名称"
                    });
                    return;
                }
                if(!this.pstStatId){
                    this.$message({
                        type:"info",
                        message:"请选择所属岗位"
                    });
                    return;
                }
                if(this.status==0){//新增
                    let data={
                        pstStatId:this.pstStatId,
                        pstName:this.pstName,
                        pstRemark:this.pstRemark
                    }
                    this.$post(this.$host+"/api/store/emppost/add",data).then(d=>{
                        if(d.success){
                            this.getAllStation();
                            this.$message({
                                type: 'success',
                                message: '保存成功!',
                                duration:"800",
                                onClose:()=>{
                                    this.modelShow=false;
                                    this.pstName="";
                                    this.pstRemark="";
                                    this.setDatas({ name: "Postionvuex", value: "" })
                                    this.setDatas({ name: "statposttree", value: "" })
                                    this.setDatas({ name: "isShopemployee", value: [] })
                                    this.setDatas({ name: "isShopemployeetotal", value: "" })
                                    this.setDatas({ name: "employee", value: [] })
                                    this.setDatas({ name: "employeetotal", value: "" })
                                }
                            });
                        }
                    })
                }else if(this.status==2){//修改
                    let data={
                        id:this.id,
                        pstStatId:this.pstStatId,
                        pstName:this.pstName,
                        pstRemark:this.pstRemark
                    }
                    this.$post(this.$host+"/api/store/emppost/update",data).then(d=>{
                        if(d.success){
                            this.setDatas({name:"Postionvuex",value:""})
                            this.setDatas({ name: "statposttree", value: "" })
                            this.setDatas({ name: "isShopemployee", value: [] })
                            this.setDatas({ name: "isShopemployeetotal", value: "" })
                            this.setDatas({ name: "employee", value: [] })
                            this.setDatas({ name: "employeetotal", value: "" })
                            this.getAllStation();
                            this.$message({
                                type: 'success',
                                message: '保存成功!',
                                duration:"800",
                                onClose:()=>{
                                    this.modelShow=false;
                                    this.pstName="";
                                    this.pstRemark="";
                                    this.id="";
                                }
                            });
                        }
                    })
                }else if(this.status==1){//查看时点击修改
                    this.ButtonName="保存";
                    this.status=2;
                    this.modelHeader="职位修改";
                    this.readonlys=false;
                }
            },
            // 查看
            demandFuncId(item,index){
                this.$post(this.$host+"/api/store/emppost/queryone",{id:item.id}).then(d=>{
                    if(d.success){
                        this.pstName=d.pstName;
                        this.pstRemark=d.pstRemark;
                        if(this.pstRemark==""||this.pstRemark==null){
                            this.pstRemark="暂无描述";
                        }
                        this.id=item.id;
                        this.pstStatId=d.pstStatId;
                        this.modelShow=true;
                        this.status=1;
                        this.isdemand=true;
                        this.modelHeader="职位详情";
                        this.readonlys=true;
                    }
                })
            },
            // 修改
            update(item,index){
                this.$post(this.$host+"/api/store/emppost/queryone",{id:item.id}).then(d=>{
                    if(d.success){
                        this.pstName=d.pstName;
                        this.pstRemark=d.pstRemark;
                        
                        this.id=item.id;
                        this.pstStatId=d.pstStatId;
                        this.modelShow=true;
                        this.status=2;
                        this.isdemand=false;
                        this.ButtonName="保存";
                        this.modelHeader="职位修改";
                        this.readonlys=false;
                    }
                })
            },
            // 删除
            deleteItem(item,index){
                let that=this;
                this.$messagebox.confirm('确定删除'+item.pstName+'?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$post(this.$host+"/api/store/emppost/delete",{ id:item.id}).then((d) => {
                        if (d.success) {
                            that.datas.map((v, i) => {
                                if (v.id == item.id) {
                                    that.datas.splice(i, 1);
                                }
                            });
                            this.$message({
                                type: 'success',
                                message: '删除成功!',
                            });
                            this.setDatas({ name: "Postionvuex", value: "" })
                            this.setDatas({ name: "statposttree", value: "" })
                            this.setDatas({ name: "isShopemployee", value: [] })
                            this.setDatas({ name: "isShopemployeetotal", value: "" })
                            this.setDatas({ name: "employee", value: [] })
                            this.setDatas({ name: "employeetotal", value: "" })
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //查询全部职位
            getAllStation(){
                if(!this.Postionvuex){
                    this.$post(this.$host + "/api/store/emppost/idNameQueryAll", {}).then(d => {
                        if (d.success) {
                            this.datas = d.list;
                            this.setDatas({name:"Postionvuex",value:this.datas})
                        }
                    });
                }else{
                    this.datas = this.Postionvuex
                }
            }
        },
        mounted () {
            this.getAllStation();
             // 查询选择的岗位
            this.$post(this.$host+"/api/store/empstat/idnameall",{}).then(d=>{
                if(d.success){
                    this.SelecttemData=d.list;
                }
            })
            this.isHeight=(document.documentElement.clientHeight-this.$refs.p.offsetTop)+"px";
        }
    }
</script>
<style scoped>
  .waring::before {
    content: "\e69b";
    color: #FF5500;
    margin-left: -12px;
    }
    .Station{
    }
    .addStation{
        padding-bottom: 1rem;
    }
    .model{
        width: 33.333333rem;
    }
    .model .Header{
        font-size: 14px;
        color: #5d7c7c;
        line-height: 2.5rem;
        margin: 0 18px 24px 18px;
        padding-top: 16px;
        padding-bottom: 10px;
        border-bottom: 1px solid #efefef;
    }
    .pleft{
    padding-left: 1rem;
    color:#FF5500;
}
    .model .modelBox{
        margin: 0 auto;
        width: 320px;
    }
    .model .modelBox .row{
        padding-bottom: 1rem;
    }
    .model .modelBox .row.Footer,.model .modelBox .row.footer{
        margin: 1.5rem 0;
        text-align: center;
    }
    .model .modelBox .row.Footer button:last-child{
        margin-left: 24px;
    }
</style>