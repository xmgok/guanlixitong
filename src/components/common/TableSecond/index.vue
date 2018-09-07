<template>
    <ul class="borderTop" >
        <div class="table" :class="{AboutBranch:AboutBranch}">
            <div class="OnHeader ">
                <span v-for="Th in TabelHeader" :style="{width:Th.width}">{{Th.detail}}</span>
            </div>
        </div>
        <Table v-for='(model,index) in datas' :Index="Index" :key="index" :AboutBranch="AboutBranch" :model='model' :TabelHeader="TabelHeader" :index="index+1" :NoDo="NoDo"  :update="update" :Selected="Selected" :deleteItem="deleteItem"/>
    </ul>
</template>
<script>
    import Table from "../TableThird"
    export default{
        components:{Table},
        data(){
            return{
            }
        },
        props:{
            Selected:{
                type:Function,
                default:()=>{}
            },
            NoDo:{
                default:true
            },
            datas:{
                default:[]
            },
            TabelHeader:{

            },
            AboutBranch:{
                default:false
            },
            update:{
                type:Function,
                default:()=>{}
            },
            deleteItem:{
                type:Function,
                default:()=>{}
            },
            Index:{
                default:""
            }
        },
        methods:{
            
        },
        mounted () {
            console.log(this.datas)
        }
    }
</script>
<style scoped>
    .borderTop{
        border-radius: 4px;
        min-width: 750px;
    }
    .table .cCode1{
    padding-left: 40px;
}
    
     
    .table.AboutBranch {
        border-bottom: 1px solid #386b88;
        border-top: 1px solid #386b88;
        border-right: 1px solid #386b88;
        border-collapse: separate;
        border-left: 0;
        font-size: 0;
    }
    
    
    .table span {
    border-left: 1px solid #cccccc;
}
.table.AboutBranch span {
    border-left: 1px solid #386b88;
}
.table span {
    vertical-align: top;
    font-size: 14px;
    display: inline-table;
    /* width: 14.28%; */
    /* width: 30%; */
    text-align: center;
    height: 2.5rem;
    line-height: 2.5rem;

}
.table span:first-child{
    width: 20%;
}
.table header span{
    border-top:none;
    background: #efefef;
}
.AboutBranch.table .OnHeader span{
    background: #82a9bf;

}

.AboutBranch.table .OnHeader{
    background: #82a9bf;
}
</style>