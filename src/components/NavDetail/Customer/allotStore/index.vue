<template>
    <div class="allotStore"  ref="p">
        <div class="StoreList">
            <header>
                已选中的客户
            </header>
            <Table  :TabelHeader="TabelHeader" :Tbody="Tbody"   :datas="datas"   :widthValue="'700px'" />
        </div>
        <div class="chooseStore">
            <header>分配归属门店</header>
            <Select :SelecttemData="SelecttemData" :values="storeCode" class="select" arguName="storeCode"  :SelecttemDetail="['storeCode','storeName']" @sonSelect="upInput" />
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
                storeCode:"",
                SelecttemData:[],
                TabelHeader:[
                    {detail:"客户编号",width:"150px"},
                    {detail:"姓名",width:"200px"},
                    {detail:"手机号",width:"150px"},
                    {detail:"所属门店",width:"200px"},
                ],
                Tbody:["custCode","custName","phone","storeName"],
                NoDo:true,
                datas:[]
            }
        },
        computed: {
            isHeight(){
                return (document.documentElement.clientHeight-60)+"px";
            }
        },
        methods: {
            ...mapMutations(['setDatas']),
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
                if(this.storeCode==""){
                    this.$message({
                        type:"info",
                        message:"请选择分配的门店",
                    });
                    return;
                }
                let selected=this.$route.query.selected||"";
                selected=JSON.parse(selected);
                let data={
                    custIds:selected,
                    cStore:this.storeCode
                }
                this.$post(this.$host + "/api/cust/customer/custAllot",data).then(d=>{
                    if(d.success){
                        this.$message({
                            type:"success",
                            message:"分配成功",
                            duration:"800",
                            onClose:()=>{
                                this.setDatas({ name: "newCustomer", value: true })
                                this.cancle()
                            }
                        });
                    }
                });
            }
        },
        mounted () {
            let data=this.$route.query.selected||"";
            data=JSON.parse(data);
            this.$post(this.$host + "/api/cust/customer/custByIds",{custIds:data}).then(d=>{
                if(d.success){
                    this.datas=d.data;
                }
            });
            this.$post(this.$host + "/api/store/store/findByCurDept",{}).then(d=>{
                if(d.success){
                    this.SelecttemData=d.data;
                }
            });
        }
    }
</script>
<style scoped>
    .allotStore{
        background: #fff;
        padding-top: 1rem;
        padding-left: 2rem;
    }
    .allotStore .StoreList{
        margin-bottom: 2rem;
    }
    .allotStore .footer{
        margin-top: 4rem;
        padding-left: 4rem;
    }
    .allotStore .chooseStore .select{
        margin-left: 4rem;
    }
    .allotStore .StoreList header,.allotStore .chooseStore header{
        font-size: 16px;
        margin-bottom: 1rem;
    }
</style>