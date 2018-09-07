<template>
  <div class="product">
        <header class="Header">
            <Button Name="新增" :iconadd="true" @click.native="newRoot"/>
        </header>
        <ProductTree :list="list" :NewProduct="NewProduct" :Modify="Modify" :Roof="Roof" :Delete="Delete"/>
        <Mtk v-if="IsShow"/>
        <div v-if="IsShow"  class="productConent">
            <header class="ProdHeader">{{id?'修改产品分类':'添加产品分类'}}<i class="icon Fork Postion" @click.stop="cancel"></i></header>
            <div class="ProdInput">
                <span class="AddProdText"><i class="icon waring"></i>分类名称：</span>
                <Input :value="cateName"  widths="13.333333rem" arguName="cateName" @sonInput="sonInput"/>
            </div>
            <div class="ProdInput">
                <span class="AddProdText">上级分类：</span>
                <span>{{model.cateName}}</span>  
            </div>
            <div class="ProdBtn">
                <Button Name="取消" class="None" @click.native="cancel"/>
                <Button Name="确定" @click.native="confirm"/>                    
            </div>
        </div>
  </div>
</template>
 
<script>
import Button from "../../common/Button"
import Input from "../../common/Input"
import Mtk from '../../common/Mtk'
import ProductTree from '../../common/ProductTree'
import {mapState,mapMutations} from 'vuex'
export default {
    components:{Button,Input,Mtk,ProductTree},
    data(){
        return{
            list:[],            
            IsShow:false,
            model:{
                cateName:'',//分类名称
                cateParent:'',//上级分类id
            },
            cateName:"",//新增修改分类名称            
            id:'',
        }
    },
    computed:{
        ...mapState(['productcate'])
    },
    mounted(){
        this.ToPage()
    },
    methods:{
        ...mapMutations(['setDatas']),
        ToPage(){
            this.$post(this.$host+"/api/prod/productcate/tree",{}).then(d=>{
                if(d.success){
                    this.DataRender(d.list)
                    this.list = d.list
                }
            })
        },
        DataRender(arr){
            if(arr != null){
                arr.map((e,i)=>{
                    e.active = false
                    this.DataRender(e.childs)
                })
            }else{
                return arr
            }
        },
        sonInput(value,arguName){
            this[arguName]=value;
        },
        newRoot(){
            this.IsShow = true
            this.model.cateParent = 0
            this.model.cateName = '根分类'
        },
        NewProduct(model,index){
            this.IsShow = true
            this.model.cateParent = model.id
            this.model.cateName = model.cateName
            this.Active(this.list,model)
        },
        Modify(model,index){
            this.IsShow = true
            this.id = model.id
            this.cateName = model.cateName
            this.model.cateParent = model.cateParent
            if(model.cateParent == 0){
                this.model.cateName = '根分类'
            }else{
                this.getName(this.list,model.cateParent)
            }
            this.Active(this.list,model)
        },
        getName(arr,id){
            if(arr != null){
                arr.map(e=>{
                    if(e.id == id){
                        return this.model.cateName = e.cateName
                    }
                    this.getName(e.childs,id)
                })
            }
        },
        Roof(model,index){
            if(index == 0)return
            this.$post(this.$host+"/api/prod/productcate/ceil",{id:model.id}).then(d=>{
                if(d.success){
                    this.$message({
                        type: 'success',
                        message: '置顶成功!',
                        duration:"500",
                    });
                    this.Moverender(this.list,model.id)
                }
            })
        },
        //置顶请求成功后重新渲染方法
        Moverender(arr,id){
            if(arr != null){
                arr.map((e,i)=>{
                    if(e.id == id){
                        arr.unshift(arr.splice(i,1)[0])
                    }
                    this.Moverender(e.childs,id)
                })
            }
        },
        cancel(){
            this.IsShow = false
            this.model.cateParent = ''
            this.model.cateName = ''
            this.cateName = ''
            this.id = ''
        },
        confirm(){
            if(!this.cateName){
                this.$message({
                    type: 'warning',
                    message: '内容不能为空！',
                    duration:"1000",
                });
                return
            }
            let _data = {
                cateName:this.cateName,
                cateParent:this.model.cateParent
            }
            if(this.id){
                _data.id = this.id
                this.$post(this.$host+"/api/prod/productcate/update",_data).then(d=>{
                    if(d.success){
                        this.$message({
                            type: 'success',
                            message: '修改成功!',
                            duration:"1000",
                        });
                        this.setDatas({name:'productcate',value:''})
                        this.Updaterender(this.list,this.id,this.cateName)
                        this.cancel()
                    }
                })
            }else{
                this.$post(this.$host+"/api/prod/productcate/add",_data).then(d=>{
                    if(d.success){
                        this.$message({
                            type: 'success',
                            message: '添加成功!',
                            duration:"1000",
                        });
                        this.setDatas({name:'productcate',value:''})
                        this.ToPage()
                        this.cancel()
                    }
                })
            }
        },
        //修改后重新渲染
        Updaterender(arr,id,cateName){  
            if(arr != null){
                arr.map((e,i)=>{
                    if(e.id == id){
                        e.cateName = cateName
                    }
                    this.Updaterender(e.childs,id,cateName)
                })
            }else{
                return arr
            }
        },
        Delete(model,index){
            this.$messagebox.confirm('此操作将永久删除该产品类目, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                  }).then(() => {
                        this.$post(this.$host+"/api/prod/productcate/delete", {id:model.id}).then(d => {
                            if (d.success) {
                                    this.$message({
                                        type: 'success',
                                        message: '删除成功!',
                                        duration:"1000",
                                    });
                                    this.setDatas({name:'productcate',value:''})
                                    this.Delrender(this.list,model.id)
                            }
                        });
                  }).catch(() => {
                        this.$message({
                              type: 'info',
                              message: '已取消删除',
                              duration:"1500",
                        });          
                  });
        },
        //删除请求成功后重新渲染方法
        Delrender(arr,id){
            if(arr != null){
                arr.map((e,i)=>{
                    if(e.id == id){
                        return arr.splice(i,1)
                    }
                    this.Delrender(e.childs,id)
                })
            }
        },
        //背景颜色
        Active(arr,model){
            if(arr != null){
                arr.map((e,i)=>{
                    e.id == model.id?e.active = true:e.active = false
                    this.Active(e.childs,model)
                })
            }
        },
    }
}
</script>

<style scoped>
.product .Header button{
    margin:0 2rem 1rem 0;
}
.product .productConent{
    width: 33.333333rem;
    height: 20rem;
    background-color: #fff;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    border-radius: 4px;
    z-index: 1000;
}
.ProdHeader{
    font-size: 1.166667rem;
    color: #5d717c;
    margin: 0 1.5rem 2.5rem 1.5rem;
    padding: 1.333333rem 0 .833333rem 0;
    border-bottom: solid 1px #efefef;
}
.product .Postion{
    position: absolute;
    right: 1rem;
    top: 1rem;
}
.ProdInput{
    margin-top: 1.5rem;
}
.AddProdText{
    width: 40%;
    display: inline-block;
    text-align: right;
    font-size: 1rem;
}
.ProdBtn{
    margin-top: 2rem;
    text-align: center;
}
.ProdBtn button:first-child{
    margin-right: 2rem;
}
</style>
