<template>
    <div class="BackMessage">
        BackMessage
    </div>
</template>

<script>
import Input from '../../common/Input'
import Button from '../../common/Button'
import Textarea from '../../common/Textarea'
export default {
    components:{Input,Button,Textarea},
    data(){
        return{
            eventName:'',
            remark:[],
            isOpen:false,
            tmptName:'',
            cont:'',
        }
    },
    mounted(){
        this.$post(this.$host+"api/sys/msg/querySysmsgTemplateOne", {id:this.$route.query.id}).then(d => {
            if(d.success) {
                this.eventName = d.data.eventName
                d.data.isOpen==1?this.isOpen=true:this.isOpen=false;
                this.tmptName = d.data.tmptName                
                this.cont = d.data.cont                
            }
        });
    },
    methods:{},
}
</script>

<style>

</style>
