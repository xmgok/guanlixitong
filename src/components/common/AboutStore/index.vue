<template>
    <div>
        <div class="AboutStore" v-show="show">
            <div @click="closeStore" class="curor">X</div>
            <div class="clearfix">
                <span class="Third">
                        门店编号：<Input arguName="sCode" @sonInput="upInput" :value="sCode" placeholder="请输入门店编号"/>
                </span>
                <span class="Third">
                        门店名称：<Input arguName="sName" @sonInput="upInput" :value="sName" placeholder="请输入门店名称"/>
                </span>
                <span class="Third">
                        地区：<getArea @getAreaCode="getAreaCode" :values="sDistrictCode"/>
                </span>
                <span class="Third">
                        经营性质：<Select :SelecttemData="sOwners" :values="sOwner" arguName="sOwner" :SelecttemDetail="['dKey','dKeyname']" @sonSelect="upSelect" />
                        <!-- <el-select v-model="sOwner" placeholder="请选择">
                            <el-option
                                v-for="(item,index) in sOwners"
                                :label="item.dKeyname"
                                :value="item.dKey">
                            </el-option>
                        </el-select> -->
                        <!-- <Input arguName="sOwner" @sonInput="upInput"/> -->
                </span>
                <span class="Third">
                        门店状态：<Select :SelecttemData="sStatuss" :values="sStatus" arguName="sStatus" :SelecttemDetail="['dKey','dKeyname']" @sonSelect="upSelect" />

                        <!-- <el-select v-model="sStatus" placeholder="请选择">
                                <el-option
                                    v-for="item in sStatuss"
                                    :label="item.dKeyname"
                                    :value="item.dKey">
                                </el-option>
                            </el-select> -->
                        <!-- <Input arguName="sStatus" @sonInput="upInput"/> -->
                </span>
                <span class="Third">
                    <Button Name="重置" @click.native="reset"/>
                    <Button Name="查询" @click.native="demand"/>
                </span>
            </div>
            <Table :datas="datas" :Tbody="Tbody" :TabelHeader="TabelHeader" :NoDO="NoDO" :queryRole="Selected" :widthValue="'66.666667rem'" :Lines="6" :PageNum="PageNum"/>
            <Paging :handleCurrentChange="handleCurrentChange" :total="total"/>
            <p v-if="!Radio">
                <span v-for="item in SelectedData">{{item.sName}}</span>
            </p>
            <Button v-if="!Radio" Name="确定" @click.native="submit"/>
        </div>
    </div>
</template>
<script>
    import Table from "../Table";
    import Paging from "../Paging";
    import Button from "../Button";
    import Input from "../Input";
    import getArea from "../getArea";
    import Select from "../Select";
    export default{
        components:{
            Table,Paging,Button,Input,getArea,Select
        },
        data(){
            return{
                show:true,
                TabelHeader:[
                    {detail:"门店编号",width:"12.5rem"},
                    {detail:"门店简称",width:"12.5rem"},
                    {detail:"所在地区",width:"12.5rem"},
                    {detail:"经营性质",width:"12.5rem"},
                    {detail:"门店状态",width:"12.5rem"}
                    ],
                Tbody:["sCode","sShortName","sDistrict","sOwner","sStatus"],
                NoDO:true,
                SelectedData:[],//选中的人
                sCode:null,//门店编号
                sName:null,//门店名称
                sDistrictCode:"",//地区编号
                sOwner:null,//经营性质
                sOwners:[],
                sStatus:null,//门店状态
                sStatuss:[],
                PageNum:""
            }
        },
        methods:{
            upSelect(value,arguName){
                this[arguName]=value;
            },
            reset(){
                this.sCode="";
                this.sName="";
                this.sDistrictCode="";
                this.sOwner="";
                this.sStatus="";
            },
            upInput(value,arguName){
                this[arguName]=value;
            },
            getAreaCode(value){
                this.sDistrictCode=value;
            },
            // 选中
            Selected(index,item){
                if(this.Radio&&this.Index>=0){
                    this.AboutStoreSelected(item,this.Index)
                }else{
                    let that=this;                
                    this.datas.map((v,i)=>{
                        v.active=false;
                        if(i==index){
                            v.active=true;
                            let objUser=new Object();
                            objUser.sName=v.sName;
                            objUser.sCode=v.sCode;
                            //sCode相同的不添加
                            let canPush=true;
                            this.SelectedData.map(el=>{
                                if(el.sCode==v.sCode){canPush=false;}
                            });
                            canPush&&this.SelectedData.push(objUser);
                        }
                    })
                }
                
            },
            // 确定
            submit(){
                this.show=false;
                //这里插入你传入的函数
                this.AboutStoreSelected(this.SelectedData)
            },
            // 分页查询方法
            handleCurrentChange(index){
                let data={
                    pageNumber:index,
                    pageSize:6,
                    sCode:this.sCode,//门店编号
                    sName:this.sName,//门店名称
                    sDistrictCode:this.sDistrictCode,//地区编号
                    sOwner:this.sOwner,//经营性质
                    sStatus:this.sStatus//门店状态
                }
                this.$post(this.$host+"/api/store/store/query/page",data).then(d=>{
                    if(d.success){
                        let content=d.pageData.content.map(e=>{
                            e.active=false;
                            return e;
                        })
                        this.datas=content;
                        this.total=d.pageData.total;
                         // 处理分页的序号问题
                        if (index > 1) {//第二页
                            this.PageNum = index - 1;
                        } else {//第一页
                            this.PageNum = "";
                        }
                    }
                })
            },
            // 查询方法
            demand(){
                if(!this.sCode&&!this.sName&&!this.sDistrictCode&&!this.sOwner&&!this.sStatus){
                    this.$message({
                        type:"info",
                        message:"请输入最少一个查询条件"
                    });
                    return;
                }
                let data={
                    pageNumber:1,
                    pageSize:6,
                    sCode:this.sCode,//门店编号
                    sName:this.sName,//门店名称
                    sDistrictCode:this.sDistrictCode,//地区编号
                    sOwner:this.sOwner,//经营性质
                    sStatus:this.sStatus//门店状态
                }
                this.$post(this.$host+"/api/store/store/query/page",data).then(d=>{
                    if(d.success){
                        let content=d.pageData.content.map(e=>{
                            e.active=false;
                            return e;
                        })
                        this.datas=content;
                        this.total=d.pageData.total;
                    }
                })
            }
        },
        props:{
            // true单选
            Radio:{
                default:false
            },
            datas:{
                type:Array,
                default:function () {
                    return[]
                  }
            },
            total:{
                default:1
            },
            Index:{
                default:""
            },
            AboutStoreSelected:{
                type:Function,
                default:()=>{}
            },
            closeStore:{
                type:Function,
                default:()=>{}
            }
        },
        mounted () {
            // let data={
            //     pageNumber:1,
            //     pageSize:6
            // }
            // this.$post(this.$host+"/api/store/store/query/page",data).then(d=>{
            //     if(d.success){
            //         let content=d.pageData.content.map(e=>{
            //              e.active=false;
            //              return e;
            //         })
            //         this.datas=content;
            //         this.total=d.pageData.total;
            //     }
            // });
            // 经营性质
            this.$post(this.$host+"/api/sysmgr/dict/getCSPCDict/D012",{}).then(d=>{
                if(d.success){
                    this.sOwners=d.data;
                }
            })
            // 门店状态
            this.$post(this.$host+"/api/sysmgr/dict/getCSPCDict/D013",{}).then(d=>{
                if(d.success){
                    this.sStatuss=d.data;
                }
            })
        }
    }
</script>
<style scoped>
    .AboutStore{
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        z-index: 1000;
        border: 1px solid #ddd;
        padding: 1.666667rem;
        background: #fff;
    }
    .curor{
        cursor: pointer;
    }
    .AboutStore .table{
    width: 100% !important;
}
    .AboutStore span.Third{
        display: inline-block;
        width: 33%;
        float: left;
        margin-bottom: .833333rem;
    }
    .AboutStore .el-select,.AboutStore .el-cascader--small{
        width: 120px;
    }
    .AboutStore .el-input__inner{
        border: 1px solid #cccccc;
    }
    .AboutStore .clearfix{
        width: 66.6667rem;
    }
</style>