<template>
    <div class="Prodlabel">
        <header class="ProdlabelHeader">
            <Button Name="新增" :iconadd="true"  @click.native.stop="Addlabel"/>
        </header>
        <template>
            <el-table :data="content" style="width:100%" border >
                <el-table-column label="标签名称" prop="tagName" width="200"></el-table-column>
                 <el-table-column label="可选值" prop="tagValue" width="400"></el-table-column>
                <el-table-column label="选择模式" width="100">
                    <template slot-scope="scope">
                        <span> {{ (scope.row.tagMode==1&&'复选')||(scope.row.tagMode==0&&'单选') }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作"  width="150" fixed="right">
                    <template slot-scope="scope">
                        <Button Name="修改" class="Btn" @click.native.stop="Modify(scope.$index,scope.row)"/>
                        <i class="borderLeft"></i>
                        <Button Name="删除" class="Btn" @click.native.stop="Delete(scope.$index,scope.row)"/>
                    </template>
                </el-table-column>
                <el-table-column min-width="1" fixed="right"></el-table-column>
            </el-table>
        </template>
        <Paging :handleCurrentChange="ToPage" :total="total"  class="pagingwidth"/>
        <Mtk v-if="IsShow"/>
        <div v-if="IsShow" class="ProdConent">
            <header class="ProdTitle ProdCan">{{ID?'修改标签':'添加标签'}}<i class="icon Fork Postion" @click.stop="Cancel"></i></header>
            <div class="ProdCan">
                <span class="ProdTxt"><i class="icon waring"></i>标签名称：</span>
                <Input :value="tagName"  widths="13.333333rem" arguName="tagName" @sonInput="getInptval"/>
            </div>
            <div class="ProdCan">
                <span class="ProdTxt"><i class="icon waring"></i>标签值选择模式：</span>
                <span class="ProdRadio"  @click="Radio(0)"><i class="icon unradio MarginRight" :class="{'radio':tagMode===0}"></i>单选</span>
                <span class="ProdRadio" @click="Radio(1)"><i class="icon unradio MarginRight" :class="{'radio':tagMode===1}"></i>复选</span>
            </div>
            <div class="ProdTowCan">
                    <div class="ProdTxt"><i class="icon waring"></i>标签可选值：</div>
                    <div class="TagBtn">
                        <Input :value="Value"  widths="13.333333rem" arguName="Value" @sonInput="getInptval" :focus="focus" :onkeyup="ValueOnkeyup" :blur="blur"/>
                        <i class="icon Addto" :class="{active:active}" @click.stop="Append"></i>
                        <!-- <span  class="TagBtnAdd">
                            <Button small="Btn small" Name="添加" />
                        </span> -->
                    </div>
            </div>
            <div class="conentList">
                    <div class="TagLabel" v-for="(item,index) in TagValue" :key="index"> {{item}}<i class="icon Fork" @click.stop="DeleteTag(item,index)"></i></div>
                        <!-- <i class="icon Del TagDel" @click.stop="DeleteTag(item,index)"></i> -->
            </div>
            <div class="ProdBtn">
                <Button Name="取消" class="None" @click.native="Cancel"/>
                <Button Name="确认" @click.native="Confirm"/>
            </div>
        </div>
    </div>
</template>

<script>
import Paging from "../../common/Paging"
import Button from "../../common/Button"
import Input from "../../common/Input"
import Mtk from '../../common/Mtk'
export default {
    components:{Paging,Button,Input,Mtk},
    data(){
        return{
            pageNumber:"",
            total:0,
            pageSize:20,
            content:[],
            IsShow:false,
            ID:"",//修改标签ID
            tagName:"",
            tagMode:1,
            TagValue:[],
            Value:"",
            active:false,
        }
    },
    mounted(){
        this.ToPage(1)
    },
    methods:{
        getInptval(value,arguName){
                this[arguName]=value;
        },
        Addlabel(){
            this.IsShow = true
            this.$refs.Table.clearSelection();
        },
        ToPage(index){
            let _data ={
                pageSize:this.pageSize,
                pageNumber:parseInt(index),
            }
            this.$post(this.$host+"/api/prod/producttag/page",_data).then(d=>{
                if(d.success){
                    this.content = d.data.content
                    this.total = d.data.total
                    this.pageNumber = d.data.pageNumber
                }
            })
        },
        Modify(index,item){
            this.ID = item.id
            this.tagName = item.tagName
            this.tagMode = item.tagMode
            this.TagValue = item.tagValue.split(",")
            this.IsShow = true
            // this.$refs.Table.clearSelection();
            // this.$refs.Table.toggleRowSelection(item,true)
            // this.ThCheckAll = false
        },
        Delete(index,item){
            // this.$refs.Table.clearSelection();
            // this.$refs.Table.toggleRowSelection(item,true)
            this.$messagebox.confirm('此操作将永久删除该产品标签, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                  }).then(() => {
                        this.$post(this.$host+"/api/prod/producttag/delete", {id:item.id}).then(d => {
                            if (d.success) {
                                    this.$message({
                                        type: 'success',
                                        message: '删除成功!',
                                        duration:"1000",
                                    });
                                    this.ToPage(this.pageNumber)
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
        Confirm(){
            if(!this.tagName){
                this.$message({
                    type: 'info',
                    message: '请定义产品名称！',
                    duration:"1000",
                });
                return
            }
            if(!(this.tagMode === 0) && !(this.tagMode === 1)){
                this.$message({
                    type: 'info',
                    message: '请选择标签值选择模式！',
                    duration:"1000",
                });
                return
            }
            if(this.TagValue.length <= 0){
                this.$message({
                    type: 'info',
                    message: '标签值不能为空！',
                    duration:"1000",
                });
                return
            }
            let _data = {
                tagName:this.tagName,
                tagMode:this.tagMode,
                tagValue:this.TagValue.join(','),
                accessToken:this.accessToken
            }
            if(this.ID){
                _data.id = this.ID
                this.$post(this.$host+"/api/prod/producttag/update",_data).then(d=>{
                    if(d.success){
                        this.$message({
                            type: 'success',
                            message: '修改成功!',
                            duration:"1000",
                        });
                        this.content.map(e=>{
                            if(e.id == this.ID){
                                e.tagValue = this.TagValue.join(','); e.tagName = this.tagName; e.tagMode = this.tagMode
                            }
                        })
                        this.Cancel()
                    }
                })
            }else{
                this.$post(this.$host+"/api/prod/producttag/add",_data).then(d=>{
                    if(d.success){
                        this.$message({
                            type: 'success',
                            message: '添加成功!',
                            duration:"1000",
                        });
                        this.ToPage(this.pageNumber)
                        this.Cancel()                        
                    }
                })
            }
        },
        Radio(num){
            num === 0?this.tagMode = 0:this.tagMode = 1;
        },
        Cancel(){
            this.IsShow = false;
            this.ID = "";
            this.tagName="";
            this.tagMode=1;
            this.TagValue = [];
        },
        focus(){
            this.active = true
        },
        blur(){
            this.active = false
        },
        ValueOnkeyup(value){
            if(value.keyCode==13){//回车事件
                this.Append();
            }
        },
        Append(){
            if(!this.Value)return
            if(!/^[\u4e00-\u9fa50-9A-Za-z]+$/.test(this.Value)){
                this.$message({
                    type: 'info',
                    message: '标签值不可带标点符号！',
                    duration:"1000",
                }); 
                return
            }
            this.TagValue.push(this.Value)
            this.Value = ""
        },
        DeleteTag(item,index){
            this.TagValue.splice(index,1)
        }
    }
}
</script>

<style scoped>
.Prodlabel .Postion{
    position: absolute;
    right: 1.5rem;
    top: 1.5rem;
}
.Prodlabel .ProdlabelHeader button{
  margin:0 2rem 1rem 0;
}
.ProdBody{
    width: 100%;
    max-width: 75rem;
}
.ProdBody .ProdPage{
    right: 0;
}

.ProdConent{
    width: 33.333333rem;
	height: 33.333333rem;
    border-radius: 4px;
    background: #fff;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    overflow: hidden;
    z-index: 1000;
}
.ProdConent .ProdTitle{
    font-size:1.166667rem;
    color: #5d717c;
    margin: 0 1.5rem 1.5rem 1.5rem;
    padding: 1.333333rem 0 .833333rem 0;
    border-bottom: solid 1px #efefef;
}
.ProdConent  .ProdCan{
    margin-bottom: 1rem;
}
.ProdTowCan{
    position: relative;    
    margin-bottom: 1.5rem;
}
.ProdRadio{
    margin-right: 2rem;
    font-size: 1rem;
    color: #666666;
    cursor:pointer;     
}

.conentList{
    width: 25rem;
	height: 13.3rem;
    margin: 0 auto;
    padding: .8rem  1rem;
    border:#efefef solid 1px;
    overflow-y: scroll;
    overflow-x: auto;
}
.ProdConent .TagLabel{
    background-color: #fafafa;
    border:1px solid #efefef;
    border-radius: 2px;
    height: 2rem;
    line-height: 2rem;
    padding: 0 .5rem;
    margin: 0 1.5rem .666667rem 0;
    display: inline-block;
    position: relative;
    cursor:pointer; 
    font-size: 1rem;
    color: #999;
}
.ProdConent .TagLabel:hover{
    border-color: #cae5ff;
    color: #1dade2;
}
.ProdConent .TagLabel:hover .Fork::before{
    color: #1dade2;
}

.TagBtn{
    display: inline-block;
    position: relative;
}
.Prodlabel .Addto::before{
    position: absolute;
    top:2px;
    right:  10px;
    width: 24px;
    height: 24px;
    text-align: center;
    background: #fafafa;
    border-left:solid 1px #dcdfe6;
}
.Prodlabel .active::before{
    border-color: #2cbcc8;
    background: #ecf6ff;
    color: #2cbcc8;
}
.Prodlabel .Fork::before{
    margin-left: .5rem;
}
.ProdConent .ProdTxt{
    display: inline-block;
    width: 40%;
    text-align: right;
    font-size: 1rem;
    color: #666666;
}
.ProdConent  .MarginRight{
    margin-right: .5rem;
}
.ProdConent .ProdBtn{
    text-align: center;
    margin-top: 1rem;
}
.ProdConent .ProdBtn button:first-child{
    margin-right: 2rem;
}
</style>
