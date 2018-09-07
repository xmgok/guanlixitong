<template>
  <div class="Customer">
        <div class="CustomerBtn">
            <Button Name="创建标签" :iconadd='true' @click.native="Found" />
        </div>
        <template>
            <el-table :data="content" style="width:100%" border>
                <el-table-column label="标签名" prop="tagName" width="200" fixed></el-table-column>
                <el-table-column label="标签值" prop="tagValue" width="400"></el-table-column>
                <el-table-column label="选择模式" width="100" >
                    <template slot-scope="scope">
                        <span> {{ (scope.row.tagMode==1&&'复选')||(scope.row.tagMode==0&&'单选') }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="200">
                    <template slot-scope="scope">
                        <Button Name="置顶" class="Btn purple" @click.native.stop="Topup(scope.$index,scope.row)"/>
                        <i class="borderLeft"></i>
                        <Button Name="修改" class="Btn purple" @click.native.stop="Modify(scope.$index,scope.row)"/>
                        <i class="borderLeft"></i>
                        <Button Name="删除" class="Btn purple" @click.native.stop="Delete(scope.$index,scope.row)"/>
                    </template>
                </el-table-column>
                <el-table-column min-width="1" fixed="right"></el-table-column>
            </el-table>
        </template>
        <Paging :handleCurrentChange="ToPage" :total="total"  class="pagingwidth"/>
        <Mtk  v-if="Display"/>
        <div  v-if="Display" class="CustomerAddBox">
                <header class="CustTitle CustCan">{{Title}}<i class="icon Fork Postion" @click.stop="cancel"></i></header>
                <div class="CustCan">
                    <span class="CustTxt"><i class="icon waring"></i>标签名：</span>
                    <Input placeholder="请输入标签名" arguName="tagName" :value="tagName" @sonInput="sonInput"  widths="13.333333rem"/>
                </div>
                <div class="CustCan">
                    <span class="CustTxt"><i class="icon waring"></i>选择方式：</span>
                    <span class="CustRadio"  @click="Radio(0)"><i class="icon unradio MarginRight" :class="{'radio':tagMode===0}"></i>单选</span>
                    <span class="CustRadio"  @click="Radio(1)"><i class="icon unradio MarginRight" :class="{'radio':tagMode===1}"></i>复选</span>
                </div>
                <div class="CustTowCan">
                    <span class="CustTxt"><i class="icon waring"></i>标签值：</span>
                    <span  class="TagBtn">
                        <Input arguName="value" :value="value" @sonInput="sonInput"  widths="13.333333rem"  :focus="focus" :onkeyup="ValueOnkeyup" :blur="blur"/>
                        <i class="icon Addto" :class="{active:active}" @click.stop="Append"></i>
                        <!-- <Button small="Btn small" Name="添加" /> -->
                    </span>
                </div>
                <div class="conentList">
                    <div class="TagLabel" v-for="(item,index) in tagValue" :key="index">{{item}}<i class="icon Fork" @click.stop="DeleteTag(item,index)"></i></div>
                </div>
                <div class="CustBtn">
                    <Button Name="取消" class="None" @click.native="cancel"/>
                    <Button Name="保存" @click.native="submit"/>
                </div>
        </div>
  </div>
</template>

<script>
import Button from "../../common/Button"
import Input from "../../common/Input"
import Table from "../../common/Table"
import Paging from "../../common/Paging"
import Mtk from '../../common/Mtk'
export default {
    components:{Button,Input,Table,Paging,Mtk},
    data(){
       return{
            pageNumber:"",
            pageSize:20,
            total:0,
            content:[],
            Display:false,
            Title:"",
            tagName:"",//标签名
            tagMode:1,
            value:"",
            tagValue:[],
            active:false,
            ID:"",
       }
    },
    mounted(){
        this.ToPage(1)
    },
    methods:{
        sonInput(value, arguName){
            this[arguName] = value;
            console.log(arguName,value)
        },
        ToPage(index){
            let _data ={
                pageNumber:parseInt(index),
                pageSize:this.pageSize,
            }
            this.$post(this.$host+'/api/cust/tag/page',_data).then(d=>{
                if(d.success){
                    this.total = d.data.total
                    this.content = d.data.content
                    this.pageNumber = d.data.pageNumber
                }
            })
        },
        Found(){ 
            this.Display = true;
            this.Title = "创建标签"
        },
        Topup(index,item){
            if(index === 0){
                return 
            }
            this.$post(this.$host+"/api/cust/tag/ceil",{id:item.id}).then(d=>{
                if(d.success){
                    this.$message({
                        type: 'success',
                        message: '置顶成功!',
                        duration:"500",
                    });
                    this.content.unshift(this.content.splice(index,1)[0])
                }
            })
        },
        Modify(index,item){
            this.Title = "修改标签"
            this.Display = true
            this.ID = item.id
            this.tagName = item.tagName
            this.tagMode = item.tagMode
            this.tagValue = item.tagValue.split(",")
            this.checkBox(this.content,item)
        },
        Delete(index,item){
            this.$messagebox.confirm('此操作将永久删除该标签, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                  }).then(() => {
                        this.$post(this.$host+"/api/cust/tag/delete", {id:item.id}).then(d => {
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
        Radio(Num){
            Num === 0?this.tagMode = 0:this.tagMode = 1;
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
            if(!this.value)return
            if(!/^[\u4e00-\u9fa50-9A-Za-z]+$/.test(this.value)){
                this.$message({
                    type: 'info',
                    message: '标签值不可带标点符号！',
                    duration:"1000",
                }); 
                return
            }
            this.tagValue.push(this.value)
            this.value = ""
        },
        DeleteTag(item,index){
            this.tagValue.splice(index,1)
        },
        cancel(){
            this.Display = false;
            this.ID = "";
            this.tagName="";
            this.tagMode=1;
            this.tagValue = [];
        },
        submit(){
            if(!this.tagName){
                this.$message({
                    type: 'info',
                    message: '标签名不能为空!',
                    duration:"1000",
                });
                return
            }
            if(this.tagValue.length<1){
                this.$message({
                    type: 'info',
                    message: '标签值不能为空!',
                    duration:"1000",
                });
                return
            }
            let _data = {
                tagName:this.tagName,
                tagMode:this.tagMode,
                tagValue:this.tagValue.join(','),
            }
            if(this.ID){
                _data.id = this.ID
                this.$post(this.$host+"/api/cust/tag/update",_data).then(d=>{
                    if(d.success){
                        this.$message({
                            type: 'success',
                            message: '修改成功!',
                            duration:"1000",
                        });
                        this.content.map(e=>{
                            if(e.id == this.ID){
                                e.tagValue = this.tagValue.join(','); e.tagName = this.tagName; e.tagMode = this.tagMode
                            }
                        })
                        this.cancel()
                    }
                })
            }else{
                this.$post(this.$host+"/api/cust/tag/add",_data).then(d=>{
                    if(d.success){
                        this.$message({
                            type: 'success',
                            message: '添加成功!',
                            duration:"1000",
                        });
                        this.ToPage(this.pageNumber)
                        this.cancel()                        
                    }
                })
            }
        },
    }
}
</script>

<style>

.Customer .Postion{
    position: absolute;
    right: 1.5rem;
    top: 1.5rem;
}
.CustomerBtn button{
    margin: 0 1rem 1rem 0;
}
.CustomerAddBox{
    width: 33.333333rem;
    height: 33.333333rem;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    border-radius: 4px;
    background: #fff;
    z-index: 1000;
}
.CustomerAddBox .CustTitle{
    color: #5d717c;
    font-size: 1.166667rem;
    margin: 0 1.5rem 1rem 1.5rem;
    padding: 1.333333rem 0 .833333rem 0;
    border-bottom: solid 1px #efefef;
}
 .CustCan{
    margin-bottom: .833333rem;
}
.CustomerAddBox  .MarginRight{
    margin-right: .5rem;
}
.CustTowCan{  
    margin-bottom: 1.5rem;
}
.CustomerAddBox .CustTxt{
    display: inline-block;
    width: 35%;
    text-align: right;
    font-size: 1rem;
    color: #666666;
}
.CustRadio{
    margin-right: 2rem;
    font-size: 1rem;
    color: #666666;
    cursor:pointer;     
}
.CustomerAddBox .TagBtn{
    display: inline-block;
    position: relative; 
}
.CustomerAddBox .Addto::before{
    position: absolute;
    top:2px;
    right:  10px;
    width: 24px;
    height: 24px;
    text-align: center;
    background: #fafafa;
    border-left:solid 1px #dcdfe6;
}
.CustomerAddBox .active::before{
    border-color: #2cbcc8;
    background: #ecf6ff;
    color: #2cbcc8;
}
.CustomerAddBox .Fork::before{
    margin-left: .5rem;
}
.CustomerAddBox .conentList{
    width: 25rem;
	height: 13.3rem;
    margin: 0 auto;
    padding: .8rem  1rem;
    border:#efefef solid 1px;
    overflow-y: scroll;
    overflow-x: auto;
}
.CustomerAddBox .TagLabel{
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
.CustomerAddBox .TagLabel:hover{
    border-color: #cae5ff;
    color: #1dade2;
}
.CustomerAddBox .TagLabel:hover .Fork::before{
    color: #1dade2;
}
.CustomerAddBox .CustBtn{
    position: absolute;
    bottom: 1.5rem;
    right: 3rem;
}
.CustomerAddBox .CustBtn button:first-child{
    margin-right: 1rem;
}
</style>
