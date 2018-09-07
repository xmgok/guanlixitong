<template>
    <div>
            <div class="tableShow" :class="{AboutBranch:AboutBranch}">
                <Table :datas='datas' :TabelHeader="TabelHeader" :NoDo="NoDo" :Selected="Selected" :AboutBranch="AboutBranch" :Index="Index"/>
            </div>
    </div>
</template>
    <script>
import Table from "../../common/TableSecond";
import { mapMutations } from "vuex";
export default {
    components: {
        Table
    },
    data() {
        return {
            NoDo: false,
            show: true,
            datas: [],
            transitionName: 'expand',
            TabelHeader: [
                { detail: "部门编号", width: '150px' },
                { detail: "部门名称", width: '200px' }
            ],
            Tbody: ["cCode", "cName", "cShortName", "cAddr", "cLinkman", "cLinkTel"],
            cCode: "",
            index: "",
            child: "",
            cName: "",
            cLinkTel: "",
            sName:"1"
        }
    },
    props: {
        // 选中函数
        Selected: {
            type: Function,
            default: () => { }
        },
        arguName:{
            default:""
        },
        Index:{
            default:""
        },
        AboutBranch:{
            default:true
        }
    },
    mounted() {
        let that=this;
        this.$post(this.$host+"/api/sysmgr/ccorp/findAll", {}).then((d) => {
            if (d.success) {
                let data=d.data;
                data.map((v, i) => {
                    return v.active = false;
                });
                that.datas = data;
                that.datas = data;
                
            }
        })
    }
}
</script>
    <style scoped>
.tableShow {
    max-height: 400px;
    overflow-y: auto;
}
.tableShow.AboutBranch{
    background-color: #82a9bf;
}
/* .tableShow::-webkit-scrollbar{
    width: 10px;
    border:1px solid #cccccc;
}
.tableShow::-webkit-scrollbar-button{
    background:#6490a9;
    height: 5px;
}
.tableShow::-webkit-scrollbar-track-piece{
    background:#6490a9;
}
.tableShow::-webkit-scrollbar-thumb{
    background:#386b88;
    border-radius: 4px;
} */
</style>