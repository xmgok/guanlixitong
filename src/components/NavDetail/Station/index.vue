<template>
    <div class="Station" :style="{minHeight:isHeight}" ref="p">
        <div class="addStation">
            <Button Name="新增" @click.native="addStation" :iconadd="true"/>
        </div>
        <el-table :data="datas" border style="width:100%">
            <el-table-column  prop="statName" label="岗位名称" width="200"></el-table-column>
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
            <el-table-column></el-table-column>
        </el-table>
        <!-- <Table  :TabelHeader="TabelHeader" :Tbody="Tbody" :demandShow="demandShow" :demandFunc="demandFuncId" amend="修改" :datas="datas" :update="update" :deleteItem="deleteItem" :NoDo="true" :widthValue="'450px'" :PageNum="PageNum" /> -->
        <div class="model" v-show="modelShow">
            <header class="Header clearfix">
                <div class="left">{{modelHeader}}</div>
                <div class="right"><i class="icon iconclose" @click="cancleStation"></i></div>
            </header>
            <div class="modelBox">
                <div class="row clearfix">
                    <span ><i class="waring icon"></i>岗位名称：</span>
                    <Input :value="statName" arguName="statName"  :onkeyup="onkeyup" :readonlys="readonlys"/>
                    <i  class="pleft" v-show="statNameShow">必填</i>
                </div>
                <div class="row clearfix">
                    <span ><i class="waring icon" ></i>是否服务岗位：</span>
                    <Select :SelecttemData="SelecttemData" :clearable="false" :values="isShopStat" arguName="isShopStat" :SelecttemDetail="['key','value']" @sonSelect="upInput" :disabled="readonlys" :widths="'160px'"/>
                </div>
                <div class="row clearfix">
                    <span >岗位描述：</span>
                    <Textarea :values="statRemark" arguName="statRemark" @sonTextarea="upInput" :readonlys="readonlys"/>
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
    import Select from "../../common/Select"
    import Textarea from "../../common/Textarea"
    import { mapState, mapMutations } from 'vuex'
    export default {
        components: {
            Table,Button,Input,MTK,Textarea,Select
        },
        data(){
            return{
                statNameShow:false,
                SelecttemData:[
                    { value: "是", key: 1 },
                    { value: "否", key: 0 },
                ],
                isShopStat:1,
                isdemand:true,
                readonlys:false,
                modelHeader:"岗位详情",
                isHeight:"100%",
                ButtonName:"保存",
                modelShow:false,
                status:0,//0是新增，1是查看，2是修改
                datas:[],
                demandShow:true,
                id:"",//岗位id
                statName:"",//id岗位名称
                statRemark:"",//id岗位描述
                PageNum:"",
                TabelHeader:[
                    {detail:"岗位名称",width:"200px"},
                    {detail:"",width:"250px"},
                ],
                Tbody:["statName"],
            }
        },
        computed:{
            ...mapState(['statposttree'])
        },
        methods: {
            ...mapMutations(['setDatas']),
            onkeyup(value){
                value.target.value = value.target.value.replace(/[^\w\u4E00-\u9FA5]/g,"")
                this.statName=value.target.value;
            },
            upInput(value,arguName){
                this[arguName]=value;
                 if(arguName=="statName"){
                    if(value===""){
                        this.statNameShow=true;
                    }else{
                        this.statNameShow=false;
                    }
                }
            },
            // 新增
            addStation(){
                this.modelShow=true;
                this.status=0;
                this.modelHeader="岗位新增";
                this.isdemand=false;
                this.isShopStat=1;
            },
            // 取消
            cancleStation(){
                if(this.status==0){//新增
                    this.statName="";
                    this.statRemark="";
                    this.modelShow=false;
                }else if(this.status==2){//修改
                    this.statName="";
                    this.statRemark="";
                    this.id="";
                    this.modelShow=false;
                }else if(this.status==1){//查看
                    this.statName="";
                    this.statRemark="";
                    this.id="";
                    this.modelShow=false;
                    this.ButtonName="保存";
                    this.readonlys=false;
                }
            },
            // 保存
            sureStation(){
                if(!this.statName){
                    this.$message({
                        type:"info",
                        message:"请输入岗位名称"
                    });
                    return;
                }
                if(this.status==0){//新增
                    let data={
                        statName:this.statName,
                        statRemark:this.statRemark,
                        isShopStat:this.isShopStat
                    }
                    this.$post(this.$host+"/api/store/empstat/add",data).then(d=>{
                        if(d.success){
                            this.getAllStation();
                            this.$message({
                                type: 'success',
                                message: '保存成功!',
                                duration:"800",
                                onClose:()=>{
                                    this.modelShow=false;
                                    this.statName="";
                                    this.statRemark="";
                                    this.setDatas({ name: "statposttree", value: "" })
                                    
                                }
                            });
                        }
                    })
                }else if(this.status==2){//修改
                    let data={
                        id:this.id,
                        statName:this.statName,
                        statRemark:this.statRemark,
                        isShopStat:this.isShopStat
                    }
                    this.$post(this.$host+"/api/store/empstat/update",data).then(d=>{
                        if(d.success){
                            this.getAllStation();
                            this.$message({
                                type: 'success',
                                message: '保存成功!',
                                duration:"800",
                                onClose:()=>{
                                    this.modelShow=false;
                                    this.statName="";
                                    this.statRemark="";
                                    this.id="";
                                    this.setDatas({ name: "statposttree", value: "" })
                                    
                                }
                            });
                        }
                    })
                }else if(this.status==1){//查看时点击修改
                    this.ButtonName="保存";
                    this.status=2;
                    this.modelHeader="岗位修改";
                    this.readonlys=false;
                }
            },
            // 查看
            demandFuncId(item,index){
                this.statName=item.statName;
                this.statRemark=item.statRemark;
                this.isShopStat=item.isShopStat;
                this.id=item.id;
                this.modelShow=true;
                this.status=1;
                this.isdemand=true;
                this.ButtonName="修改";
                this.modelHeader="岗位详情";
                this.readonlys=true;
            },
            // 修改
            update(item,index){
                this.statName=item.statName;
                this.statRemark=item.statRemark;
                this.isShopStat=item.isShopStat;
                this.id=item.id;
                this.modelShow=true;
                this.isdemand=false;
                this.status=2;
                this.modelHeader="岗位修改";
            },
            // 删除
            deleteItem(item,index){
                let that=this;
                this.$messagebox.confirm('确定删除'+item.statName+'?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$post(this.$host+"/api/store/empstat/delete",{ id:item.id}).then((d) => {
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
                            this.setDatas({ name: "statposttree", value: "" })
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            getAllStation(){
                this.$post(this.$host+"/api/store/empstat/queryall",{}).then(d=>{
                    if(d.success){
                        this.datas=d.list;
                    }
                })
            }
        },
        mounted () {
            this.getAllStation();
            this.isHeight=(document.documentElement.clientHeight-this.$refs.p.offsetTop)+"px";
        }
    }
</script>
<style scoped>
   .pleft{
    padding-left: 1rem;
    color:#FF5500;
}
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
    .model .modelBox{
        width: 340px;
        margin:  0 auto;
    }
    .model .modelBox .row{
        padding-bottom: 1rem;
    }
    .model .modelBox .row>span{
        display:inline-block;
        width:85px;
        text-align:right;
    }
    .model .modelBox .row.Footer,.model .modelBox .row.footer{
        margin: 1.5rem 0;
        text-align: center;
    }
    .model .modelBox .row.Footer button:last-child{
        margin-left: 24px;
    }
</style>