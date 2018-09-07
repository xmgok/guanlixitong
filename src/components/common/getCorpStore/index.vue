<template>
    <div class="get_area" :style="{width:widths}">
        <el-cascader :options="options||CorpDatas" expand-trigger="click" :value="values" @change="handleItemChange" :disabled="disabled" :props="props" change-on-select size="small" :placeholder="placeholder" :clearable='clearable' filterable :show-all-levels="false">
        </el-cascader>
    </div>
</template>

<script>
import {mapState,mapMutations} from "vuex"
export default {
    props: {
        placeholder: {
            default: "请选择"
        },
        disabled: {
            default: false
        },
        clearable: {
            default: true
        },
        values: {
            type: Array,
            default: function () {
                return []
            }
        },
        isMgnStore: {
            default: "",
        },
        CorpDatas:{
            default: "",
        },
        widths: {
            default: '160px'
        },
        Index: {
            default: ''
        },
    },
    data() {
        return {
            aaa: "",
            options:[],
            props: {
                value: 'cCode',
                label: 'cName',
                children: 'childsCorpDTO'
            },
            name:"",
        }
    },
    methods: {
        ...mapMutations(["setDatas"]),
        handleItemChange(val) {
            if(this.Index!==""){
                this.digui(this.options,val[val.length-1]);
            }
            this.$emit("getCorpStore", val, this.Index,this.name)
        },
        digui(arr,val){
            arr.map(el=>{
                if(el.cCode==val){
                    this.name=el.cName;
                    return;
                };
                el.childsCorpDTO&&this.digui(el.childsCorpDTO,val)
            })
        },
        getCorp(){
            let par = {
                isMgnStore: this.isMgnStore,
            }
            this.$post(this.$host + "/api/sysmgr/ccorp/findAll", par).then(d => {
                if (d.success) {
                    this.options= d.data;
                    if (d.data === null) {
                       this.options= [];
                    }
                }
            });
        },
    },
    computed: {
        ...mapState(["corpsvuex"]),
    },
    mounted() {
        if(this.isMgnStore){
            this.getCorp();
        }else if(this.corpsvuex){
            this.options=this.corpsvuex;
        }else if(this.CorpDatas){
            this.options="";
        }
        else{
            this.$post(this.$host + "/api/sysmgr/ccorp/findAll", {}).then(d => {
                if (d.success) {
                    if (d.data === null) {
                       this.options= [];
                    }else{
                        this.options= d.data;
                        this.setDatas({name:"corpsvuex",value:this.options})
                    }
                }
            });
        }
        // if(!this.CorpDatas){
        //     let par = {
        //         isMgnStore: this.isMgnStore,
        //     }
        //     this.$post(this.$host + "/api/sysmgr/ccorp/findAll", par).then(d => {
        //         if (d.success) {
        //             this.options = d.data;
        //             if (d.data === null) {
        //                 this.options = []
        //             }
        //         }
        //     });
        // }else{
        //     this.options = this.CorpDatas;
        // }
    }
}
</script>
<style scoped>
.get_area {
  display: inline-flex;
}
</style>

<style>
.get_area .el-cascader__label {
  line-height: 30px;
  font-size: 12px;
}
/* .get_area  */
.get_area .el-input .el-input__inner {
  height: 26px !important;
  line-height: 26px;
}

.get_area .el-select * {
  vertical-align: top;
}
</style>

