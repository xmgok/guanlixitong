<template>
    <div :class="{upload,up_logo:imgType=='logo'}">
        <el-upload :on-remove="onRemove" :file-list='fileList' ref="upload" class="avatar-uploader" :list-type="listTypes" :show-file-list="multiple" :multiple='multiple' :on-preview="onPreview" :before-upload="beforeUpload" :data='form' action="https://up.qbox.me" :on-success="onSuccess">
            <img v-if="urls&&!multiple" :src="urls" class="avatar">
            <i v-else class="el-icon-plus"></i>
            <el-dialog v-if="showFileList" :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
            <div slot="tip" class="el-upload__tip">只能上传 jpg/png/gif 文件，且不能大于2M</div>
        </el-upload>
    </div>
</template>

<script>
import Button from "../../common/Button";
import * as qiniu from 'qiniu-js';

export default {
    components: {
        Button,
    },
    data() {
        return {
            img: '',
            form: {},
            dialogVisible: false,
            dialogImageUrl: '',
            imgArr: [],

        }

    },
    computed: {

        urls: {
            get: function () {
                return this.url
            },
            set: function () {

            }

        },
        listTypes: {
            get: function () {
                return this.listType
            },
            set: function () {

            }
        }
    },
    props: {

        url: {
            default: ''
        },
        fileList: {
            default: Array
        },
        arguName: {
            default: ""
        },
        multiple: {
            default: false,
        },
        listType: {
            default: "picture-card",
        },
        showFileList: {
            default: false,
        },
        imgType: {
            default: '',
        },

    },
    methods: {
        onRemove(file, fileList) {
            let arr = [];
            fileList.map(el => {
                arr.push(el.url)
            })
            this.$emit("sonInput", arr, this.arguName)
        },
        onPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },

        onSuccess(res, file) {
            let addr = 'http://p3t5upnkj.bkt.clouddn.com/';
            if (this.multiple) {
                let dispose = "?imageView2/1/w/180/h/135"
                let imageUrl = addr + res.key + dispose;
                this.imgArr.push(imageUrl);
                this.$emit("sonInput", this.imgArr, this.arguName)
            } else {
                let dispose = '';
                if (this.imgType == 'logo') {
                    dispose = "?imageView2/1/w/60/h/60";
                } else {
                    dispose = "?imageView2/1/w/180/h/135"
                }
                let imageUrl = addr + res.key + dispose;
                this.imgArr = imageUrl;
                this.$emit("sonInput", this.imgArr, this.arguName)
            }
        },
        beforeUpload(file) {
            let fileAll = file;
            let type = ['image/jpeg', 'image/png', 'image/gif','image/jpg']
            const isJPG = type.some(el => { return el === file.type });
            const isLt2M = file.size / 1024 / 1024 < 5;

            if (!isJPG) {
                this.$message.error('上传图片只能是 jpg/png/gif/jpeg 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 5MB!');
            }
            if (isJPG && isLt2M) {
                return this.$post(this.$host + "/api/sysmgr/getQiNiuToken", { "expireSeconds": "100000000", "bucket": "testpic1" })
                    .then(res => {
                        // let key = ;
                        // let putExtra = {
                        //     fname: "",
                        //     params: {},
                        //     mimeType: [] || null
                        // }
                        // let config = {
                        //     useCdnDomain: false,
                        //     region: qiniu.region.z2
                        // };
                        // let token = res;
                        this.form = {
                            key: `${this.$dateFormat("yyMMddhhmmssSS", new Date())}_${fileAll.name}`,
                            token: res,
                        }
                    })
            } else {
                return false;
            }
        },

        upload(e) {
            let that = this;
            let addr = 'http://p3t5upnkj.bkt.clouddn.com/'
            this.$post(this.$host + "/api/sysmgr/getQiNiuToken", { "expireSeconds": "3600", "bucket": "testpic1" })
                .then(res => {
                    let token = res;
                    let file = e.target.files[0];
                    let key = e.target.files[0].name;
                    let config = {
                        useCdnDomain: false,
                        region: null
                    };
                    let putExtra = {
                        fname: "",
                        params: {},
                        mimeType: [] || null
                    }
                    let observable = qiniu.upload(file, key, token, putExtra, config);
                    let observer = {
                        next(res) {
                            // ...
                        },
                        error(err) {
                            // ...
                        },
                        complete(res) {
                            // ...
                            // that.img = addr + res.key + "?imageView2/2/w/200";
                            let url = addr + res.key;
                            that.$emit("sonInput", url, that.arguName)
                            e.target.value = ''
                        }
                    }
                    let subscription = observable.subscribe(
                        observer
                    );
                })
            //
            // 
        },
    },
    mounted() {
        // console.log(this.imageUrl)
    }
}
</script>

<style scoped>
/* .upload {
  padding: 0 10px;
  position: relative;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 2px;
  overflow: hidden;
  color: #fff;
  display: inline-block;
  *display: inline;
  *zoom: 1;
  width: 70px;
  height: 24px;
  line-height: 24px;
}
.upload input {
  opacity: 0;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  width: 70px;
  height: 24px;
  line-height: 24px;
}

.upload input:hover {
  cursor: pointer;
}
.upload:hover {
  border: 1px solid transparent;
  cursor: pointer;
} */
img {
    vertical-align: top;
}
</style>
<style>
.upload .el-upload-list--picture-card .el-upload-list__item-thumbnail {
    vertical-align: top;
}
.upload .avatar-uploader .avatar-uploader-icon {
    /* width:120px;
    height: 120px; */
    font-size: 28px;
    color: #8c939d;
    width: 180px;
    height: 135px;
    line-height: 135px;
    text-align: center;
}
.upload .el-upload-list--picture-card .el-upload-list__item-status-label i {
    position: absolute;
    top: 0;
    right: 14px;
}
.upload .el-upload-list--picture-card .el-upload-list__item,
.upload .el-upload--picture-card {
    width: 180px;
    height: 135px;
    line-height: 135px;
}
.up_logo .el-upload-list--picture-card .el-upload-list__item,
.up_logo .avatar-uploader .avatar-uploader-icon,
.up_logo .el-upload--picture-card {
    width: 60px;
    height: 60px;
    line-height: 60px;
}
.upload .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.up_logo .el-upload--picture-card i {
    font-size: 14px;
}
.upload .el-upload-list--picture-card .el-upload-list__item {
}
</style>


