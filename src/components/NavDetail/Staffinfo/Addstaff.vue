<template>
    <div class="Addstaff">
         <ul class="staffForm">
            <li class="AddModDatas">
                <div  class="Add_mod"><i class="icon waring"></i>工号：</div>
                <div class="AddstaffInput">
                    <Input :value="workNo" widths="13.333333rem" arguName="workNo" @sonInput="upInput" :maxlength='8' :blur="workNoblur"/>
                    <!-- <i class="error" v-show="workNoDisplay">工号由数字或字母组成</i>                 -->
                    <i class="error" v-show="workNoDisplay">工号由长度为8位的数字字母组合</i>                
                    <i class="error" v-show="workNoShow">必填</i>  
                </div>              
            </li>
            <li class="AddModDatas">
                <div  class="Add_mod"><i class="icon waring"></i>姓名：</div>
                <div class="AddstaffInput">
                    <Input :value="empName" widths="13.333333rem" arguName="empName" @sonInput="upInput" :maxlength='8' :blur="empNameblur"/>
                    <i class="error" v-show="empNameShow">必填</i>
                    <i class="error" v-show="empNameDisplay">姓名不能有特殊字符</i>
                </div>                
            </li>
            <li class="AddModDatas">
                <div  class="Add_mod"><i class="icon waring"></i>岗位/职位：</div>
                <div class="AddstaffInput">
                    <Position :PostPosition='[jobs,Position]' :arguName="['jobs','Position']" @sonPostPosition="sonPostPosition" widths="160px"/>
                    <i class="error" v-show="PositionShow">必填</i>
                </div>
            </li>
            <li class="AddModDatas">
                <div  class="Add_mod"><i class="icon waring"></i>身份证号：</div>
                <div class="AddstaffInput">
                    <Input :value="cardNo" widths="13.333333rem" arguName="cardNo" @sonInput="upInput" :maxlength='18' :blur="cardNoblur"/>
                    <i class="error" v-show="cardNoShow">必填</i>
                    <i class="error" v-show="cardNoDisplay">身份证输入不合法！</i>
                </div>
            </li>
            <li class="AddModDatas">
                <div  class="Add_mod"><i class="icon waring"></i>手机号：</div>
                <div class="AddstaffInput">
                    <Input :value="empTel" widths="13.333333rem" arguName="empTel" @sonInput="upInput" :maxlength='11' :blur="empTelblur"/>
                    <i class="error" v-show="empTelShow">必填</i>
                    <i class="error" v-show="empTelDisplay">手机号码格式错误!</i>
                </div>
            </li>
            <li class="AddModDatas">
                <div class="Add_mod">性别：</div>
                <div class="AddstaffInput">
                    <Select :SelecttemData="Sex" arguName="gender" :values="gender" :SelecttemDetail="['value','key']" @sonSelect="sonSelect" widths="120px"/>
                    <i class="error" v-show="genderShow">必填</i>
                </div>
            </li>
            <li class="AddModDatas">
                <div  class="Add_mod"> 生日：</div>
                <div class="AddstaffInput">
                    <el-date-picker v-model="birthday" type="date" size="mini" value-format="yyyy-MM-dd"  :picker-options="birthdayOptions"></el-date-picker>
                    <!-- <i class="error" v-show="birthdayShow">生日不合法！</i>                    -->
                </div>
            </li>
            <li class="AddModDatas">
                <div  class="Add_mod"><i class="icon waring"></i>入职日期：</div>
                <div class="AddstaffInput">
                    <el-date-picker v-model="abordDate" type="date" size="mini" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
                    <i class="error" v-show="abordDateShow">必填</i>
                </div>
            </li>
            <li class="AddModDatas">
                <!-- <div class="Add_mod"><i class="icon waring"></i>所属部门：</div> -->
                <div class="Add_mod">所属部门：</div>
                <div class="AddstaffInput">
                    <getCorpStore @getCorpStore="getCorpStore"/>
                    <!-- <i class="error" v-show="deptShow">必填</i>  -->
                </div>
            </li>
            <li class="AddModDatas">
                <div class="Add_mod">所属门店：</div>
                <div class="AddstaffInput">
                    <Select :SelecttemData="storeDatas" :values="belongShop" arguName="belongShop" :SelecttemDetail="['sCode','sShortName']" @sonSelect="sonSelect" widths="160px"/>
                    <!-- <i class="error" v-show="belongShopShow">必填</i> -->
                </div>
            </li>
            <li class="AddModDatas">
                <div  class="Add_mod"><i class="icon waring"></i>状态：</div>
                <div class="AddstaffInput">
                    <Select :SelecttemData="allstatus" :values="status" arguName="status" :SelecttemDetail="['eStuCode','eStuValue']" @sonSelect="sonSelect" widths="120px"/>
                    <i class="error" v-show="statusShow">必填</i>
                </div>                        
            </li>
            <li class="AddModDatas">
                <div class="Add_mod">预设角色：</div>
                <div class="AddstaffInput">
                    <el-select v-model="roleIds" multiple size="mini" placeholder="请选择" style="width:160px">
                        <el-option v-for="item in Rcontent" :key="item.id" :label="item.rName" :value="item.id"> </el-option>
                    </el-select>
                </div> 
            </li>
        </ul>
        <div class=" AddModBtn">
                <Button Name="取消" class="None" @click.native="cancel"/>
                <Button Name="保存" @click.native="save"/>                
        </div>
    </div>
</template>

<script>
import Input from "../../common/Input";
import Button from "../../common/Button";
import Select from "../../common/Select";
import Position from "../../common/Position"
import getCorpStore from '../../common/getCorpStore'
import {mapState,mapMutations} from 'vuex'
export default {
  components: { Input, Button, Select,Position,getCorpStore},
    data(){
        return{
            workNo: "",
            empName: "",
            Position:"",//职位
            allstatus: [],//状态
            storeDatas:[],
            Sex:[
            {key:"女",value:0},
            {key:"男",value:1},
            ],
            gender: 0,          
            jobs: "",
            cardNo: "",
            empTel:'',//手机号
            belongShop: "",
            dept: "",
            cName:"",
            status: "在职",
            Rcontent:[],
            roleIds:[],
            birthday: "",
            birthdayOptions:{
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
            },
            abordDate: new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate(),
            workNoShow:false,
            workNoDisplay:false,
            // workNoLook:false,
            empTelShow:false,
            empTelDisplay:false,
            empNameShow:false,
            empNameDisplay:false,
            // PosShow:false,
            PositionShow:false,
            cardNoShow:false,
            cardNoDisplay:false,
            genderShow:false,
            // birthdayShow:false,
            abordDateShow:false,
            deptShow:false,            
            // belongShopShow:false,
            statusShow:false,
        }
    },
    watch:{
        abordDate(val){
            if(!val){
                this.abordDateShow = true
            }else{
                this.abordDateShow = false
            }
        }
    },
    computed:{
        ...mapState(['storesvuex','allstatusvuex','employee','employeetotal'])
    },
    mounted() {
        this.getStore()        
        //查询全部状态
        this.getAllstatus()
        this.getroleAll()
    },
    methods:{
        ...mapMutations(['setDatas']),
        //员工状态
        getAllstatus(){
            if(!this.allstatusvuex){
                this.$post(this.$host + "/api/store/employee/allstatus", {}).then(d => {
                    if (d.success) {
                        this.allstatus = d.data;
                        this.setDatas({name:'allstatusvuex',value:this.allstatus})
                    }
                });
            }else{
                this.allstatus = this.allstatusvuex
            }
        },
        //当前用户增加的角色
        getroleAll(){
            this.$post(this.$host+"/api/sysmgr/role/gtisusadedrol",{pageNumber:1,pageSize:100}).then(d=>{    
                if(d.success){
                    this.Rcontent = d.pageData.content
                }
            })
        },
        workNoblur(){
            if(!this.workNo){
                return this.workNoShow = true , this.workNoDisplay = false
            }
            this.workNoDisplay = this.workNoShow = false 
            if(!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8}$/.test(this.workNo)){
                this.workNoDisplay = true ;this.workNoShow = false
                return
            }
            this.workNoDisplay = false
        },
        empTelblur(){
            if(!this.empTel){
                this.empTelDisplay = false
                this.empTelShow = true
                return 
            }
            this.empTelShow = false
            if(!/^[1][3,4,5,7,8][0-9]{9}$/.test(this.empTel)){
                this.empTelDisplay = true
                return
            }
            this.empTelDisplay = false  
        },
        empNameblur(){
            if(!this.empName){
                this.empNameShow = true 
                this.empNameDisplay=false
                return 
            }
            this.empNameShow = false
            if(/[@#\$%\^&\*]+/g.test(this.empName)){
                this.empNameDisplay=true
            }else{
                this.empNameDisplay=false
            }
        },
        cardNoblur(){
            if(!this.cardNo){
                this.cardNoShow = true
                this.cardNoDisplay = false                            
                return 
            }
            this.cardNoShow = false
            if(!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.cardNo)){
                this.cardNoDisplay = true
                return
            }else{
               this.birthday = this.cardNo.substring(6,10)+'-'+this.cardNo.substring(10,12)+'-'+this.cardNo.substring(12,14)
               this.cardNoDisplay = false            
            }
        },
        upInput(value, arguName) {
            this[arguName] = value;
        },
        sonSelect(value, arguName) {
            this[arguName] = value;
            if(value===""){
                this[arguName+"Show"]=true;
            }else{
                this[arguName+"Show"]=false;
            }
        },
        sonPostPosition(value,arguName0,arguName1){
            this[arguName0]=value[0]
            this[arguName1]=value[1]
            if(value.length<1){
                this.PositionShow = true
            }else{
                this.PositionShow = false                            
            }
        },
        // 选择所属部门
        getCorpStore(value) {
            console.log(value)
            if(value.length<1){
                this.deptShow = true
            }else{
                this.deptShow = false                
            }
            if (this.dept != value[value.length-1]) {
                this.dept = value[value.length-1];
                this.belongShop = "";
                this.getStore();
            }
        },
        getStore() {
            let data = {
                pageNumber: 1,
                pageSize: 1000,
                corpCode: this.dept || this.$getCookie("dept") || "",
                queryType:0,
            }
            if(!this.dept){//默认门店（当前部门下的门店）
                if(this.storesvuex){
                    this.storesvuex.map(e=>{
                        e.active=false;
                        return e;
                    })
                    this.storeDatas=this.storesvuex;
                }else{
                    this.$post(this.$host+"/api/store/store/allnamecode",data).then(d=>{
                        if(d.success){
                            let content=d.data.content.map(e=>{
                                e.active=false;
                                return e;
                            })
                            this.storeDatas=content;
                            this.setDatas({name:"storesvuex",value:this.storeDatas})
                        }
                    });
                }
            }else{
                this.$post(this.$host+"/api/store/store/allnamecode",data).then(d=>{
                    if(d.success){
                        let content=d.data.content.map(e=>{
                            e.active=false;
                            return e;
                        })
                        this.storeDatas=content;
                    }
                });
            }
        },
        save(){
            let CanNot = true;//能提交
            if(this.workNo == ""){
                    this.workNoShow = true
                    CanNot = false
            }
            if(this.workNoLook){
                    CanNot = false
            }
            if(this.workNoDisplay){
                    CanNot = false                    
            }
            if(this.empName == ""){
                    this.empNameShow = true
                    CanNot = false
            }
            if(this.empNameDisplay){
                    CanNot = false
            }
            if(this.Position == ""){
                    this.PositionShow = true
                    CanNot = false
            }
            if(this.cardNo == ""){
                    this.cardNoShow = true
                    CanNot = false
            }
            if(this.cardNoDisplay){
                    CanNot = false
            }
            if(!this.empTel){
                    this.empTelShow = true
                    CanNot = false
            }
            if(this.empTelDisplay){
                    CanNot = false
            }
            if(this.gender === ""){
                    this.genderShow = true
                    CanNot = false
            }
            if(this.abordDate == ""){
                    this.abordDateShow = true
                    CanNot = false
            }
            // if(!this.belongShop){
            //         this.belongShopShow = true
            //         CanNot = false
            // }

            // if(!this.dept){
            //         this.deptShow = true
            //         CanNot = false
            // }
            if(this.status == ""){
                    this.statusShow = true
                    CanNot = false
            }
            // if(!this.roleIds){
            //     this.roleIdsShow = ture
            //     CanNot = false
            // }
            if(!CanNot){
               return;
            }
            let _data = {
                workNo: this.workNo,
                empName: this.empName,
                position: this.Position,
                jobs: this.jobs,
                cardNo: this.cardNo,
                roleIds:this.roleIds,                
                empTel:this.empTel,
                gender: this.gender,
                belongShop: this.belongShop,
                dept: this.dept,
                status: this.status=="在职"?3:this.status,
                abordDate: this.abordDate,
                birthday: this.birthday,
            };
            this.$post(this.$host+"/api/store/employee/add",_data).then((c)=>{
                if(c.success){
                    this.$message({
                        type: 'success',
                        message: '添加成功!',
                        duration:"1000",
                        onClose:()=>{
                            this.setDatas({ name: "isShopemployee", value: [] })
                            this.setDatas({ name: "isShopemployeetotal", value: "" })
                            this.setDatas({ name: "employee", value: [] })
                            this.setDatas({ name: "employeetotal", value: "" })
                            this.cancel()
                        }
                    });         
                }
            })
        },
        cancel(){
            this.$router.push({ path:"/NavDetail/Staffinfo"}) 
        },
    }
}
</script>

<style>
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected {
    color: #2cbcc8;
    background-color: #fff;
}
.error{
    font-size:1rem;
    color: #f50;
    margin-left: 1rem;
}
.pleft{
    font-size:1rem;
    color: #999;
    margin-left: 1rem;
}
.staffForm{
    border:1px solid #EFEFEF;
}
.Addstaff .AddModDatas {
    border-bottom: 1px solid #EFEFEF;
    display: flex;
}
.Addstaff .AddModDatas:last-child{
    border-bottom:none;
}
.staffForm .Add_mod{
    width: 20rem;
    background: #FAFAFA;
    padding: 6px 0;
    text-align: right;
    font-size: 1rem;
    color: #666; 
    border-right: 1px solid #EFEFEF;
}
.Addstaff .AddstaffInput{
    padding: .5rem 1rem;
}
.Addstaff .AddModBtn{
   margin-left: 16rem;
   margin-top: 4rem;
}
.Addstaff .AddModBtn button:first-child{
   margin-right: 2rem;
}

</style>
