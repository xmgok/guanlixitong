<template>
    <div class="allotStore"  ref="p">
        <div class="StoreList">
            <header>
                已选中的客户
            </header>
            <!-- <Table  :TabelHeader="TabelHeader" :Tbody="Tbody"   :datas="datas"   :widthValue="'700px'" /> -->
            <el-table :data="datas" border style="width:100%">
                <el-table-column prop="custCode" label="客户编号" width="120"></el-table-column>
                <el-table-column prop="custName" label="姓名" width="120"></el-table-column>
                <el-table-column prop="phone" label="手机号" width="120"></el-table-column>
                <el-table-column prop="storeName" label="所属门店" width="200"></el-table-column>
                <el-table-column min-width="1"></el-table-column>
            </el-table>
        </div>
        <div class="chooseStore tableH">
            <header>分配跟进员工</header>
            <!-- <Select :SelecttemData="SelecttemData" :values="empMR" class="select" arguName="empMR"  :SelecttemDetail="['id','empName']" @sonSelect="upInput" /> -->
            <el-table :data="flowEmpList" border style="width:100%">
                <el-table-column label="员工" width="160">
                    <template slot-scope="scope">
                        <Select :SelecttemData="SelecttemData" :values="scope.row.workNo" :arguName="scope.$index"  :SelecttemDetail="['workNo','empName']" @sonSelectobj="upSelect" :clearable="false"/>
                    </template>  
                </el-table-column>
                <el-table-column prop="pstName" label="职位" width="120"></el-table-column>
                <el-table-column prop="flowType" label="跟进类型" width="160">
                     <template slot-scope="scope">
                        <Select :SelecttemData="flowTypeData" :values="scope.row.flowType" :arguName="scope.$index"  :SelecttemDetail="['key','value']" @sonSelect="upSelectflow" :clearable="false"/>
                    </template>  
                </el-table-column>
                <el-table-column prop="isMain" label="是否主跟人" width="120">
                    <template  slot-scope="scope">
                        <i class="icon checkedan" :class="{active:scope.row.isMain}" @click="sureMain(scope.$index)"></i>是
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                    <template slot-scope="scope" class="">
                        <div >
                            <Button Name="取消跟进" buttonClass="Btn" @click.native="deleteItem(scope.$index)" />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column min-width="1"></el-table-column>
            </el-table>
            <Button Name="添加跟进员工" buttonClass="Btn"  @click.native="addItem" :iconadd="iconadd"/>
        </div>
        <div class="footer">
            <Button Name="取消" buttonClass="None" @click.native="cancle"/>
            <Button Name="保存" @click.native="submit"/>
        </div>
    </div>
</template>
<script>
    import Table from "../../../common/Table"
    import Select from "../../../common/Select"
    import Button from "../../../common/Button"
    import { mapState, mapMutations } from "vuex"
    export default {
        components: {
            Table,Select,Button
        },
        data(){
            return{
                iconadd:true,
                empMR:"",
                empKH:"",
                SelecttemData:[],
                TabelHeader:[
                    {detail:"客户编号",width:"150px"},
                    {detail:"姓名",width:"200px"},
                    {detail:"手机号",width:"150px"},
                    {detail:"所属门店",width:"200px"},
                ],
                Tbody:["custCode","custName","phone","storeName"],
                NoDo:true,
                datas:[],
                flowEmpList:[],
                flowTypeData:[
                    {key:1,value:"跟进技师"},
                    {key:2,value:"跟进顾问"},
                ],
            }
        },
        computed: {
            isHeight(){
                return (document.documentElement.clientHeight-60)+"px";
            }
        },
        methods: {
            ...mapMutations(['setDatas']),
            // 选择主跟进人
            sureMain(index){
                this.flowEmpList.map(el=>{
                    el.isMain=0;
                })
                this.flowEmpList[index].isMain=1;
            },
            // 跟进类型选择
            upSelectflow(e,arguName){
                this.flowEmpList[arguName].flowType=e;
            },
            // 员工选择
            upSelect(obj,e,arguName){
                console.log(obj)
                console.log(e)
                console.log(arguName)
                this.flowEmpList[arguName].workNo=e;
                this.flowEmpList[arguName].curPost=obj.pstId;
                this.flowEmpList[arguName].pstName=obj.pstName;
                this.flowEmpList[arguName].empName=obj.empName;
            },
            // 取消跟进
            deleteItem(index){
                this.flowEmpList.splice(index,1)
            },
            // 添加一条跟进
            addItem(){
                let newobj=new Object();
                newobj.workNo="";
                newobj.curPost="";
                newobj.flowType=1;
                newobj.isMain=0;
                this.flowEmpList.push(newobj);

            },
            upInput(value,arguName){
                this[arguName]=value;
            },
            cancle(){
                this.$router.push({
                    path:"/NavDetail/Customer"
                })
            },
            // 保存
            submit(){
                let custCodes=[];
                this.datas.map(el=>{
                    custCodes.push(el.custCode)
                })
                let newflowEmpList=[];
                this.flowEmpList.map(el=>{
                    if(el.curPost){
                        let newobj=new Object();
                        newobj.curPost=el.curPost;
                        newobj.empName=el.empName;
                        newobj.flowType=el.flowType;
                        newobj.isMain=el.isMain;
                        newobj.workNo=el.workNo;
                        newflowEmpList.push(newobj);
                    }
                })
                console.log(this.flowEmpList)
                if(newflowEmpList.length==0){
                    this.$message({
                        type:"info",
                        message:"请分配跟进员工"
                    });
                    return;
                }
                let data={
                    custCodes:custCodes,
                    flowEmpList:newflowEmpList
                }
                this.$post(this.$host + "/api/cust/customer/custAllotEmp",data).then(d=>{
                    if(d.success){
                        this.setDatas({ name: "newCustomer", value: true })
                        this.$message({
                            type:"success",
                            message:"分配成功",
                            duration:"800",
                            onClose:()=>{
                                this.cancle()
                            }
                        });
                    }
                });
            }
        },
        mounted () {
            let data=this.$route.query.selected||"";
            if(data){
                data=JSON.parse(data);
                // 获取列表
                this.$post(this.$host + "/api/cust/customer/custByIds",{custIds:data}).then(d=>{
                    if(d.success){
                        this.datas=d.data;
                    }
                });
            }
            // 获取员工可选值
            this.$post(this.$host + "/api/store/employee/findByStore",{}).then(d=>{
                if(d.success){
                    this.SelecttemData=d.data;
                }
            });
        }
    }
</script>
<style scoped>
    .checkedan{
        margin-right: .25rem;
        font-size: 14px;
        cursor: pointer;
    }
    .checkedan::before{
        content: "\E7D4";
        color: #dcdfe6;
    }
    .checkedan.active::before {
        content: "\E65F";
        color: #2cbcc8;
    }
    .allotStore{
        background: #fff;
        padding-top: 1rem;
        padding-left: 2rem;
    }
    .allotStore .StoreList{
        margin-bottom: 2rem;
    }
    .allotStore .footer{
        margin: 4rem 0;
        padding-left: 4rem;
    }
    .allotStore .footer button:last-child{
        margin-left: 24px;
    }
    .allotStore .chooseStore .select{
        margin-left: 4rem;
    }
    .allotStore .chooseStore{
        margin-bottom: 2rem;
    }
    .allotStore .StoreList header,.allotStore .chooseStore header{
        font-size: 16px;
        margin-bottom: 1rem;
    }
    .allotStore .chooseStore button{
        margin-top: 12px;
    }
</style>