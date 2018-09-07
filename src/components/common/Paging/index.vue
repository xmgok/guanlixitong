<template>
    <el-pagination
        :class="'Paging'"
        layout="total,prev, pager, next,jumper"
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handleCurrentChange">
    </el-pagination>
</template>
<script>
    import Vue from "vue";
    import {Pagination} from "element-ui"
    Vue.use(Pagination);
    export default {
        props:{
            total:{
                default:1
            },
            pageSize:{
                default:20
            },
            currentPage:{
                default:1
            },
            handleCurrentChange:{
                type:Function,
                default:()=>{}
            }
        }
    }
</script>
<style >
    .Paging.el-pagination.is-background{
        text-align: right;
    margin-top: 14px;
    }
.Paging.el-pagination.is-background .el-pager li.active{
    background-color: #82a9bf;
}
.Paging.el-pagination.is-background .btn-next, .Paging.el-pagination.is-background .btn-prev, .Paging.el-pagination.is-background .el-pager li{
    min-width: 26px;
}
.Paging .el-pager li{
    height: 26px;
    line-height: 26px;
}
.Paging.el-pagination button, .Paging.el-pagination span:not([class*=suffix]){
    height: 26px;
}
.el-pagination__jump .el-pagination__editor .el-input__inner{
    width: 50px;
}
.el-pagination__jump  .el-pagination__editor.el-input .el-input__inner{
    height: 24px !important;
}
.el-pagination__jump .el-pagination__editor.el-input{
    margin: 0 10px;
}
</style>