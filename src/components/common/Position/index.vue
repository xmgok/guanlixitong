<template>
    <el-cascader
        :style="{width:widths}"
        size="mini"
        :options="options"
        :props="props"
        :value="PostPosition"
        clearable
        @change="change">
    </el-cascader>
</template>

<script>
import {mapMutations,mapState} from "vuex"
export default {
    data(){
        return{
            options:[],
            props:{
                value:"jobs",
                label:"jName",
                children:"posts",
            },
        }
    },
    computed: {
        ...mapState(["statposttree"]),
    },
    mounted(){
        if(this.isShopStat==1){
            this.$post(this.$host+'/api/store/emppost/statposttree',{isShopStat:this.isShopStat}).then(d=>{
                if(d.success){
                    d.data.map(e=>{
                        e.posts.map(el=>{
                            el.jobs = el.position; el.jName = el.pName
                        })
                    })
                    this.options = d.data;
                }
            });
            return;
        }
        if(!this.statposttree){
            this.$post(this.$host+'/api/store/emppost/statposttree',{}).then(d=>{
                if(d.success){
                    d.data.map(e=>{
                        e.posts.map(el=>{
                            el.jobs = el.position; el.jName = el.pName
                        })
                    })
                    this.options = d.data;
                    this.setDatas({name:"statposttree",value:this.options})
                }
            });
        }else{
            this.options = this.statposttree;
        }
        
        
    },
    props:{
        PostPosition:{
            type:Array,
            default:()=>{
                return[]
            }
        },
        arguName:{
            type:Array,
            default:()=>{
                return[]
            }
        },
        Index:{
            default:""
        },
        widths: {
            default: '160px'
        },
        isShopStat:{
            default:""
        }
    },
    methods:{
        ...mapMutations(["setDatas"]),
        change(e){
            let newArr=[];
            if(!e){return}
            this.options.map(el=>{
                if(e[0]==el.jobs){
                    let newobj=new Object();
                    newobj.id=el.jobs;
                    newobj.name=el.jName;
                    newArr.push(newobj)
                    el.posts&&el.posts.map(val=>{
                        if(e[1]==val.jobs){
                            let newobj=new Object();
                            newobj.id=val.jobs;
                            newobj.name=val.jName;
                            newArr.push(newobj)
                        }
                    })
                }
            })
            this.$emit("sonPostPosition",e,this.arguName[0],this.arguName[1])
            this.$emit("IndexPostPosition",newArr,this.Index)
        },
    }
}
</script>

<style scoped>
/* .el-cascader{
    line-height: 2.5rem;
} */
.el-cascader-menu__item:focus:not(:active),.el-cascader-menu__item.is-active{
    background-color: #f5f7fa!important;
}
</style>
