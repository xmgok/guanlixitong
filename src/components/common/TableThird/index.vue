<template>
    <li>
        <!-- <div  class="table"> -->
            <!-- <i v-if='isFolder' class="fa " :class="[open?'fa-folder-open':'fa-folder']"></i> -->
   　　　　　<!--isFolder判断是否存在子级改变图标-->
            <!-- <i v-if='!isFolder' class="fa fa-file-text"></i> -->
            <div class="OnHover " :class="{Child:!index,AboutBranch:AboutBranch}">
                <!-- <span v-if="index" :style="{width:'50px',background:(!AboutBranch)&&'#efefef'}">{{index}}</span> -->
                <span @click="Selected(model,Index)" class="firstSpan" :style="{width:TabelHeader[0].width}">
                    <i @click.stop='toggle' v-if='isFolder' class="fa" :class="[open?'fa-folder-open':'fa-folder']"></i>
                    <i :class="model.childsCorpDTO?'iconF':'iconN'" class="icon"></i>
                    {{model.cCode}}
                </span><span @click="Selected(model)" class="secondSpan" :style="{width:TabelHeader[1].width}">{{model.cName}}</span><span class="operation" :style="{width:'200px'}" v-if="NoDo">
                    <Button Name="修改" small="small Btn"   @click.native="update(model.id)" class="button"/><i v-show="!model.childsCorpDTO" class="borderLeft"></i><Button v-show="!model.childsCorpDTO" Name="删除" small="small Btn"  @click.native="deleteItem(model.cCode)" class="button"/>
                </span><span></span>
            </div>
        <!-- </div> -->
        <ul v-show="open" v-if='isFolder' class="Second">
             <items v-for='(cel,index) in model.childsCorpDTO' :Index="Index" :key="cel.cCode" :model='cel' :AboutBranch="AboutBranch" :TabelHeader="TabelHeader" :NoDo="NoDo" :Selected="Selected" :update="update" :deleteItem="deleteItem"></items>
        </ul>
    </li>
</template>
<script>
import Button from "../../common/Button";
export default {
    name: 'items',
    components: { Button },
    data() {
        return {
            open: false,
        }
    },
    props: {
        Selected: {
            type: Function,
            default: () => { }
        },
        AboutBranch:{
            default:false
        },
        NoDo:{
            default:true
        },
        update:{

        },
        deleteItem: {

        },
        model:{
            default:[]
        },
        index:{
            default:""
        },
        TabelHeader:{
            type: Array,
            default: function () {
                return [
                { detail: "部门编号", width: '150px' },
                { detail: "部门名称", width: '82px' }
                ]
            }
        },
        model: {
            default: []
        },
        Index: {
            default: ""
        }
    },
    computed: {
        isFolder: function () {
            return this.model.childsCorpDTO && this.model.childsCorpDTO.length
        }
    },
    methods: {
        toggle: function () {
            if (this.isFolder) {
                this.open = !this.open
            }
        }
    }
   
}
</script>
<style scoped>
    
    .AboutBranch .iconN::before{
        color: #48a7d5;
    }
   
.secondSpan{
    overflow:hidden;

word-break:keep-all;

white-space:nowrap;

text-overflow:ellipsis;
}
.OnHover.AboutBranch span {
    border-left: 1px solid #386b88;
}
.OnHover.AboutBranch span {
    border-left: 1px solid #386b88;
}
.button{
    background: none !important;
    color: #386b88 !important;
}
.OnHover span {
  border-left: 1px solid #cccccc;
}
.button {
  background: none !important;
  color: #386b88 !important;
}
.button:first-child {
  /* border-right: 2px solid #386b88; */
  /* border-radius: 0; */
}

    .OnHover.AboutBranch{
        color: #eeeeee;
        border-bottom: 1px solid #386b88;
        border-right: 1px solid #386b88;
    }
    
    
    .OnHover.Child.AboutBranch{
        border-left: 1px solid #386b88;
    }
    .OnHover.Child span{
        border-left: none;
    }
    /* .OnHover.Child span:first-child{
        margin-left: 49px;
    } */
    .firstSpan{
        overflow: hidden;
text-overflow:ellipsis;
white-space: nowrap;
    }
    .Second>li>.OnHover>.firstSpan{
        padding-left: 50px;
    }
    .Second>li>.OnHover>.firstSpan>.fa{
        left: 30px;
    }
    .Second  .Second>li>.OnHover>.firstSpan{
        padding-left: 70px;
    }
    .Second .Second>li>.OnHover>.firstSpan>.fa{
        left: 50px;
    }
    .Second  .Second  .Second>li>.OnHover>.firstSpan{
        padding-left: 90px;
    }
    .Second .Second .Second>li>.OnHover>.firstSpan>.fa{
        left: 70px;
    }
    .Second .Second  .Second  .Second>li>.OnHover>.firstSpan{
        padding-left: 110px;
    }
    .Second .Second .Second .Second>li>.OnHover>.firstSpan>.fa{
        left: 90px;
    }

.OnHover header span {
  border-top: none;
  background: #efefef;
}
.OnHover.AboutBranch header span{
}

.OnHover.AboutBranch:hover{
    background: rgba(56, 107, 136, 0.4);
}
.fa{
    /* float: left; */
    position: absolute;
    left: 10px;
    top: -4px;
    margin-top: 13px;
    /* width: 10px; */
    /* height: 10px; */
    width: 0;
    height: 0;
    border: 8px solid #999;
    border-right: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-top: 5px solid transparent;
    /* border-left: transparent; */
    /* border-top: transparent; */
    /* border-right: 1px solid #333; */
    /* border-bottom: 1px solid #333; */
    /* transform: rotate(-45deg); */
    transform-origin:0% 50%;
    cursor: pointer;
}
.fa.fa-folder-open {
  transform: rotate(90deg);
  top: -5px;
}
</style>