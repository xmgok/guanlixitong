<template>
    <!-- <img :src="img" alt=""> -->

    <a class="upload" v-loading.fullscreen.lock="loading" element-loading-text="玩命导入中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.6)">
        <i class="icon icondownload"></i>
        <input ref="MyFile" type="file" @change='upload' accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />导入
        <input type="text" style="display:none;" :value="inputValue" @input="inputValue = arguments[0]">
    </a>

</template>

<script>
import Axios from "axios";
export default {
    components: {
    },
    data() {
        return {
            loading: false,
            inputValue: '',
        }

    },
    props: {
        arguName: {
            default: ""
        },
        apiName: {
            default: ""
        },
        id: {
            default: ''
        },
    },
    methods: {

        // 'getData'
        upload(e) {
            this.loading = true;
            let api = ''
            let file = e.target.files[0];
            let fileData = new FormData();
            fileData.enctype = 'multipart/form-data';
            fileData.append('key', file);
            fileData.append('accessToken', this.$getCookie("accessToken"));

            switch (this.apiName) {
                case 'employee': api = '/api/common/excel/import/employee'; break;
                case 'customer': api = '/api/common/excel/import/customer'; break;
                case 'store': api = '/api/common/excel/import/store'; break;
                case 'serv': api = '/api/common/excel/import/serv'; break;
                case "userDefined": api = '/api/mkt/coupon/importCouponNo?batchNo=' + this.id; break;
            }
            let _that = this
            Axios.defaults.retry = 4;
            Axios.defaults.retryDelay = 1000;
            // _that.$post(this.$host + api, fileData, )
            Axios.post(this.$host + api, fileData, { timeout: 0 })
                .then((res) => {
                    // _that.$emit('getData', res.data)
                    _that.loading = false;
                    e.target.value = ''
                    _that.$message({
                        type: 'success',
                        message: '导入完成!',
                        duration: "1000",
                        onClose: () => {
                        }
                    });
                    this.inputValue = res.data;
                    _that.$emit('input', res.data)
                })
        },
    },
    mounted() {

    }
}
</script>

<style scoped>
.upload {
    position: relative;
    overflow: hidden;
    display: inline-block;
    *display: inline;
    *zoom: 1;
    font-size: 1rem !important;
    text-align: center;
    cursor: pointer;
    vertical-align: middle;
    padding: 0 6px;
    border: 1px solid transparent;
    line-height: 22px !important;
    height: 24px;
    background: #2cbcc8;
    color: #fff;
    border-radius: 2px;
}
.icondownload::before {
    content: "\e63a";
    margin-right: 6px;
}
.upload input {
    opacity: 0;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
}

.upload input:hover {
    cursor: pointer;
}
.upload:hover {
    background: #7ad0d8;
    color: #eeeeee;
    border: 1px solid transparent;
    cursor: pointer;
}
</style>

