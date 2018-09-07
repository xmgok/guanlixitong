<template>
    <div>
        <div class="IsDel">
                <p>确定删除 !</p>
                <span @click="Delete(true)">确定</span>
                <span @click="Delete(false)">取消</span>
        </div>
        <MTK />
    </div>
</template>

<script>
    import MTK from "../../common/Mtk"
export default {
    components: {
        MTK
    },
    props:{
        Delete:{
            type:Function,
            default:()=>{}
        }
    }
}
</script>

<style>
.IsDel{
    /* width: 41.666667rem; */
    /* height: 16.666667rem; */
    min-width: 25rem;
	border: solid 1px #ebfdfd;
    position: fixed;
    z-index: 1000;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    background-color: #d4eaf6;
    border: solid 1px #ebfdfd;
    color: #666666;
}
.IsDel {
    font-size: 16px;
    text-align: center;
    font-family:SimHei; 
}
.IsDel p{
    padding: 4.166667rem 0; 
    border-bottom: 1px solid #ddd;   
}
.IsDel span{
    display: inline-block;
    padding:.416667rem 1rem; 
    margin: .833333rem .833333rem;
    cursor:pointer;
    background: #ddd;
    border-radius: 4px;
}
</style>
