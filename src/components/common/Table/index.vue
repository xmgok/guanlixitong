<template>
    <div class="Border" :class="{AboutStore:AboutStore}" :style="{width:widthValue}">
        <table class="Tablesdf" :class="{AboutStore:AboutStore}">
            <thead>
                <tr>
                    <!-- <th style="width:4rem">{{Nmu}}</th> -->
                    <th v-if="TheadCheck" style="width:4rem">
                        <i :class="[{'icon':true},{'unchecked':true},{'checked':ThCheckAll}]" @click.stop="CheckAll"></i>
                    </th>
                    <th v-for="(item,index) in TabelHeader" :key="index" :style="{width:item.width}">{{item.detail}}</th>
                    <!-- <th v-for="(item,index) in TabelHeader" :style="{width:item.width}" v-html="(item.detail=='ThCheck' && ThCheck)||item.detail"></th> -->
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item,index) in datas" :key="index" @click.stop="queryRole(index,item)" :class="{OnHover:true,active:item.active}">
                    <!-- <td>{{PageNum*Lines+(index+1)}}</td> -->
                    <td v-if="TbodyCheck">
                        <i :class="[{'icon':true},{'unchecked':true},{'checked':item.checked}]" @click.stop="checkBox(index,item)"></i>
                    </td>
                    <td v-for="Tbs in Tbody">
                        {{(Tbs=="tagMode"&&item[Tbs]=="1"&&'复选')||(Tbs=="tagMode"&&item[Tbs]=="0"&&'单选')||(Tbs=="uSex"&&item[Tbs]=="1"&&'男')||(Tbs=="uSex"&&item[Tbs]=="0"&&'女')||(item[Tbs]===""||item[Tbs]==null?"无":item[Tbs])}}
                    </td>
                    <td v-if="NoDo">
                        <!-- //查看demandShow -->
                        <Button :Name="demandName" small="Btn small" v-on:click.native.stop="demandFunc(item,index)" v-if="demandShow" />
                        <i class="cut_off_rule" v-if="demandShow"></i>
                        <Button :Name="amend" small="Btn small" v-on:click.native.stop="update(item,index)" v-if="amendShow" />
                        <i class="cut_off_rule" v-if="amendShow"></i>
                        <!-- //上下架editShow -->
                        <Button :Name="item.editName" small="Btn small" v-on:click.native.stop="editFunc(item,index)" v-if="editShow" />
                        <i class="cut_off_rule" v-if="editShow"></i>
                        <Button :Name="deleteName" small="Btn small" v-on:click.native.stop="deleteItem(item,index)" v-if="deleteShow" />
                        <i class="cut_off_rule" v-if="deleteShow"></i>
                        <Button :Name="Allots" small="Btn small" v-on:click.native.stop="assign(item,index)" v-if="Not" />
                    </td>
                    <td v-if="yesDetail">
                        <Button :Name="Detail" small="Btn small" v-on:click.native="gotoDetail(item,index)" />
                    </td>
                </tr>
                <tr v-if="datas.length<Lines&&datas.length>0&&showKong" v-for="(item,index) in (Lines-datas.length)>0?(Lines-datas.length):0">
                    <!-- <td></td> -->
                    <td v-if="TbodyCheck"></td>
                    <td v-for="Tbs in Tbody"></td>
                    <td v-if="NoDo">
                    </td>
                    <td v-if="yesDetail">
                    </td>
                </tr>
            </tbody>
        </table>
        <div v-if="!datas.length" class="NoDatas">暂无数据</div>
    </div>
</template>
<script>
import Button from "../../common/Button"
export default {
    data() {
        return {
            Nmu: `序号`
        }
    },
    components: { Button },
    props: {
        demandFunc: {
            type: Function,
            default: () => { }
        },
        showKong: {
            default: true
        },
        editFunc: {
            type: Function,
            default: () => { }
        },
        demandName: {
            default: "查看"
        },
        demandShow: {
            default: false
        },
        amendShow: {
            default: true
        },
        deleteShow: {
            default: true
        },
        editShow: {
            default: false
        },
        editName: {
            default: ""
        },
        Lines: {
            default: 10
        },
        PageNum: {
            default: 0
        },
        AboutStore: {
            default: false
        },
        widthValue: {
            default: ""
        },
        deleteName: {
            default: "删除"
        },
        Detail: {
            default: "查看详情"
        },
        yesDetail: {
            default: false
        },
        TheadCheck: {
            default: false  //thead选择显示隐藏
        },
        ThCheckAll: {
            default: false  //表头全选值
        },
        TbodyCheck: {
            default: false  //tbody选择显示隐藏
        },
        CheckAll: {  //表头全选方法
            type: Function,
            default: () => { }
        },
        checkBox: {
            type: Function,
            default: () => { }
        },
        NoDo: {
            default: false
        },
        Not: {
            default: false
        },
        TabelHeader: {
            type: Array,
            default: function () {
                return []
            }
        },
        datas: {
            type: Array,
            default: function () {
                return []
            }
        },
        Tbody: {
            default: function () {
                return []
            }
        },
        Allots: {
            default: ""
        },
        amend: {
            default: "修改"
        },
        update: {
            type: Function,
            default: () => {
            }
        },
        deleteItem: {
            type: Function,
            default: () => {
            }
        },
        gotoDetail: {
            type: Function,
            default: () => {
            }
        },
        assign: {
            type: Function,
            default: () => {
            }
        },
        queryRole: {
            type: Function,
            default: () => {
            }
        },
        Selected: {
            type: Function,
            default: () => {
            }
        },
    },
    mounted() {
    }
}
</script>
<style scoped>
.table {
  background: #fff;
  width: 100%;
}
.table.AboutStore {
  background: #82a9bf;
  border-right: 1px solid #386b88;
  border-bottom: 1px solid #386b88;
}
.Border {
  overflow-y: auto;
  /* border-left:none; */
}
.table-bordered {
  border-left: 0;
}
.table-bordered th,
.table-bordered td {
  border-left: 1px solid #ccc;
}
.table-bordered.AboutStore th,
.table-bordered.AboutStore td {
  border-left: 1px solid #386b88;
}
.table thead {
  background: #efefef;
}
.table.AboutStore thead {
  background: #82a9bf;
}
/* .table tbody tr td:first-child {
  background: #efefef;
} */
.table.AboutStore tbody tr td:first-child {
  background: #82a9bf;
}
.table.AboutStore tbody tr td {
  color: #eee;
}
.table tr {
  height: 2.5rem;
}
.table th,
.table td {
  border-top: 1px solid #ccc;
  font-size: 1rem;
  text-align: center;
  line-height: 2.5rem;
  /* font-family: SimHei; */
  color: #666666;
  overflow: hidden;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
  -moz-box-sizing: border-box; /* Firefox */
  -webkit-box-sizing: border-box; /* Safari */
}
.table th:first-child,
.table td:first-child {
  border-left: none;
}
.table th {
  font-size: 1.166667rem;
  color: #444;
  font-weight: normal;
}
.table.AboutStore th,
.table.AboutStore td {
  border-top: 1px solid #386b88;
}
.table th {
  border-top: none;
}
.table tbody tr.OnHover:hover {
  background: #d4eaf6 !important;
}
.table tbody tr.OnHover:hover td:first-child {
  background: #d4eaf6 !important;
}
.table.AboutStore tbody tr.OnHover:hover {
  background: #6490a9 !important;
}
.table.AboutStore tbody tr.OnHover:hover td:first-child {
  background: #6490a9 !important;
}
.active {
  background: #d4eaf6 !important;
}
.active td:first-child,
.checked td:first-child {
  /* background: #82a9bf !important; */
}
.table-no-data {
  text-align: center;
  border: 1px solid #ccc;
  border-top: 0;
}
.RoleThtr th:first-child {
  width: 4rem;
}
.AboutStore.Border .NoDatas {
  background: #82a9bf;
  color: #eee;
  border: 1px solid #386b88;
  border-top: none;
}
.NoDatas {
  height: 2.5rem;
  line-height: 2.5rem;
  text-align: center;
  background: #fff;
  border-top: 0;
}
.table tbody tr td button:last-child {
  border-right: none;
}
.Border.AboutStore {
  max-height: 400px;
  overflow-y: auto;
  border: none;
}
.Border.AboutStore::-webkit-scrollbar {
  width: 10px;
}
.Border.AboutStore::-webkit-scrollbar-button {
  background: #6490a9;
  height: 5px;
}
.Border.AboutStore::-webkit-scrollbar-track-piece {
  background: #6490a9;
}
.Border.AboutStore::-webkit-scrollbar-thumb {
  background: #386b88;
  border-radius: 8px;
}

.table .unchecked::before {
  content: "\E68c";
  color: #386b88;
  font-size: 1.166667rem;
  cursor: pointer;
}
.table .checked::before {
  content: "\E67e";
  color: #386b88;
  font-size: 1.166667rem;
}
.cut_off_rule {
  display: inline-block;
  width: 2px;
  height: 1.166667rem;
  background: #4db0e8;
  position: relative;
  top: 0;
  left: 0;
}
button + i.cut_off_rule:last-child {
  display: none;
}
</style>