<template>
    <li class="Border">
        <div class="Conent clearfix" :class="{active:model.active}">
            <span class="Cursor left" :class="isFolder?'MarginOne':'MarginTow'">
                <i v-if="isFolder" class="icon" :class="open?'UPDown':'Arrow'" @click.stop='toggle'></i>
                <i  class="icon" :class="isFolder?'Folder':'File'"></i>
                <span>{{model.cateName}}</span>
            </span>
            <span class="ButtonRight right">
                <Button Name="添加子类" :iconadd="true" class="Btn" @click.native.stop="NewProduct(model,index)"/>
                <Button Name="修改" :Modify="true" class="Btn"  @click.native.stop="Modify(model,index)"/>
                <Button Name="置顶" :Roof="true" class="Btn" :class="{Btndisabled:index==0}" @click.native.stop="Roof(model,index)"/>
                <Button Name="删除" :Delete="true" class="Btn"  @click.native.stop="Delete(model,index)"/>
            </span>
        </div>
        <el-collapse-transition>
            <ul  v-show="open" v-if='isFolder'>
                <items v-for="(son,index) in model.childs" :key="son.id" :model='son' :index='index' :NewProduct="NewProduct" :Modify="Modify" :Roof="Roof" :Delete="Delete"></items>
            </ul>
        </el-collapse-transition>
    </li>
</template>

<script>
import Button from "../../../common/Button"
export default {
    components:{Button},
    name: 'items',
    data(){
        return{
            open: false,
        }
    },
    props:{
        model:{
            default:{}
        },
        index:{
            default:""
        },
        NewProduct: {
            type: Function,
            default: () => { }
        },
        Modify: {
            type: Function,
            default: () => { }
        },
        Roof: {
            type: Function,
            default: () => { }
        },
        Delete: {
            type: Function,
            default: () => { }
        },
    },
    computed: {
        isFolder() {
            return this.model.childs && this.model.childs.length
        }
    },
    methods:{
        toggle() {
            if(this.isFolder) {
                this.open = !this.open
            }
        },
    }
}
</script>

<style scoped>
.Cursor{
    cursor: pointer;
}
.Folder::before{
    margin-left: .5rem;
    margin-right: .5rem;
}
.File::before{
    margin-right: .5rem;
}
.Border{
    border-bottom: 1px solid #EFEFEF;
}
.Border:last-child{
    border-bottom:none;
}
.Border .Border:first-child,.Border .Border .Border:first-child,.Border .Border .Border .Border:first-child,.Border .Border .Border .Border .Border:first-child,.Border .Border .Border .Border .Border .Border:first-child{
    border-top:1px solid #EFEFEF; 
}
.Conent:hover{
    background: #f5f7fa;
}
.active{
    background: #f5f7fa;
}
.ButtonRight{
    margin-right: 10%;
}
.Border .MarginOne{
    margin-left: 2rem;
}
.Border .MarginTow{
    margin-left: 4rem;
}
.Border .Border .MarginOne{
    margin-left: 4rem;
}
.Border .Border .MarginTow{
    margin-left: 6rem;
}
.Border .Border .Border .MarginOne{
    margin-left: 6rem;
}
.Border .Border .Border .MarginTow{
    margin-left: 8rem;
}
.Border .Border .Border .Border .MarginOne{
    margin-left: 8rem;
}
.Border .Border .Border .Border .MarginTow{
    margin-left: 10rem;
}
.Border .Border .Border .Border .Border .MarginOne{
    margin-left: 10rem;
}
.Border .Border .Border .Border .Border .MarginTow{
    margin-left: 12rem;
}
.Border .Border .Border .Border .Border .Border .MarginOne{
    margin-left: 12rem;
}
.Border .Border .Border .Border .Border .Border .MarginTow{
    margin-left: 14rem;
}
</style>
