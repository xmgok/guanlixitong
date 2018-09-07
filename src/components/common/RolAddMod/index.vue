<template>
  <div class="Popup">
        <p>{{rAddMod.Title}}</p>
        <div class="RoleData">
            <div class="RoleDataText">角色名称：</div>
            <Input :value="rAddMod.rName"  @sonInput="upInput" arguName="rName" widths="13.333333rem"/>
        </div>
        <div class="RoleData">
            <div class="RoleDataText">角色说明：</div>
            <Input :value="rAddMod.rRemark"   @sonInput="upInput" arguName="rRemark" widths="13.333333rem"/>
        </div>
        <div class="RoleBtn">
            <Button Name="提交" @click.native="submit(rAddMod.id)"/>
            <Button Name="取消" @click.native="cancel"/>
        </div>
    </div>
</template>

<script>
import Button from "../Button"
import Select from "../Select"
import Input from "../Input"
export default {
    components:{Button,Select,Input},
    props:{
        rAddMod:{
            default:{},
        },
        submit:{
            type:Function,
            default:()=>{}
        },
        cancel:{
            type:Function,
            default:()=>{}
        },
        upInput:{
            type:Function,
            default:()=>{
            }
        }
    }
}
</script>

<style>
.warn::before {
  content: "\e6ac";
  color: #dd5445;
}
 .Popup{
  width: 33.333333rem;
  height: 26.666667rem;
  background:#d4eaf6;
  border: solid 1px #ebfdfd;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 2rem 7rem;
}
 .Popup p{
    font-size:1.833333rem; 
    font-family:SimHei;    
    text-align: center;
    color:#386b88;
    margin-top: 2rem;
    margin-bottom: 2rem;
}
.RoleDataText{
    display: inline-block;
    width: 6.25rem;
    text-align: right;
}
 .Popup .RoleData{
    font-size:1.166667rem; 
    font-family:SimHei;
    color: #666;
    margin-top: 2rem;
    vertical-align:middle;
} 
 .Popup  .RoleBtn{
    margin-top: 3rem;
    text-align: center;
} 
 .Popup  .RoleBtn button:first-child{
     margin-right: 2rem;
 }
</style>
