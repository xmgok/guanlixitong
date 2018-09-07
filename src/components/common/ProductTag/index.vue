<template>
        <div class="Selectcascader" >
            <el-cascader
                :options="options"
                :props="props"
                change-on-select
                clearable
                :value="valuess"
                @change="Change"
                :disabled="disabled"
            ></el-cascader>
        </div>
    </template>
    <script>
        import {mapMutations,mapState} from "vuex"
        export default{
            data(){
                return{
                    datas:[],
                    props:{
                        value:"id",
                        label:"cateName",
                        children:"childs"
                    },
                    values:[],
                    cateCode:"",
                }
            },
            computed: {
                ...mapState(["productcate"]),
                options:function(){
                    if(this.listdata){
                        return this.listdata;
                    }else{
                        return this.datas;
                    }
                },
                valuess:function(){
                    if(this.cateId){
                        this.gui(this.cateId);
                        return this.values;
                    }else{
                        return this.values;
                    }
                }
            },
            props: {
                arguName:{
                    default:""
                },
                disabled:{
                    default:false
                },
                cateId:{
                    default:""
                },
                listdata:{
                    default:""
                },
            },
            methods:{
                ...mapMutations(["setDatas"]),
                Change(e){
                    let id=e[e.length-1];
                    this.$emit("sonProductSelect",id,this.arguName)
                    this.getcode(id);
                    this.$emit("sonSelectcode",this.cateCode,this.arguName)
                },
                getcode(id){
                    this.options.some((el)=>{
                        if(el.id==id){
                            this.cateCode=el.cateCode;
                            console.log(this.cateCode);
                            return true;
                        };
                        el.childs&&this.getcodechild( el.childs,id)
                    })
                },
                getcodechild(arr,id){
                    arr.some(el=>{
                        if(el.id==id){
                            this.cateCode=el.cateCode;
                            console.log(this.cateCode);
                            return true;
                        };
                        el.childs&&this.getcodechild( el.childs,id)
                    })
                },
                digui(data,id){
                    data.map(el=>{
                        if(el.id==id){
                            this.values.unshift(el.id);
                            if(el.cateParent==0){
                                return;
                            }
                            this.gui(el.cateParent);
                        }
                    })
                },
                gui(id){
                    this.options.map(el=>{
                        if(el.id==id){
                            this.values.unshift(el.id);
                            if(el.cateParent==0){
                                return;
                            }
                        }
                        el.childs&&this.digui(el.childs,id)
                    })
                },
            },
            mounted () {
                if(!this.listdata){
                    if(!this.productcate){
                        this.$post(this.$host+"/api/prod/productcate/tree",{}).then(d=>{
                            if(d.success){
                                this.datas=d.list;
                                this.setDatas({name:"productcate",value:this.datas})
                            }
                        })
                    }else{
                        this.datas=this.productcate;
                    }
                    
                }
            }
        }
    </script>
    <style >
        .Selectcascader{
            display: inline-block;
        }
    .Selectcascader .el-cascader{
        width: 160px;
        font-size: 12px;
        line-height: 26px;
    }
     .el-cascader-menu__item{
        font-size: 1rem;
    }
    .Selectcascader .el-input .el-input__inner{
        height: 26px !important;
        padding: 0 .666667rem;
    }
    </style>