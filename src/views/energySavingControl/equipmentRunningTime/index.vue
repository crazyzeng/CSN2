<!-- 设备累计运行时长 -->
<template>
    <section class="container_warp">
        <section class="container_box">
            <el-divider class="curDivider" direction="vertical" />
            <wl-main-title data-title="设备累计运行时长">
                <el-form :inline="true" :model="formData" class="demo-form-inline">
                    <el-form-item label="设备名称">
                        <el-input v-model="formData.equipmentName" placeholder="请输入设备名称"></el-input>
                    </el-form-item>
                    <el-form-item label="设备编号">
                        <el-input v-model="formData.equipmentNumber" placeholder="请输入设备编号"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
                        <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
                    </el-form-item>
                    <el-form-item style="float: right; margin-right: 0">
                        <el-upload ref="upload" class="_uplaod-div" name="file" :show-file-list="false" :action="url"
                            :before-upload="beforeUpload" :on-success="uploadSuccess" :on-error="uploadFail" :limit="1"
                            accept=".xls, .xlsx">
                            <el-button slot="trigger" class="border-btn b-b-b" icon="el-icon-upload2">导入</el-button>
                            <div slot="tip" class="el-upload__tip"></div>
                        </el-upload>
                        <el-button class="border-btn b-b-b" icon="el-icon-download" @click="handleExport">导出</el-button>
                    </el-form-item>
                </el-form>
            </wl-main-title>
            <section style="padding: 0 20px 0 20px; height: calc(100% - 120px)">
                <el-table :data="tableData" :key="Math.random()" height="calc(100%)" border style="width: 100%">
                    <el-table-column align="center" type="index" label="序号" width="80"></el-table-column>
                    <el-table-column align="center" prop="equipmentId" label="ID" width="100"></el-table-column>
                    <el-table-column align="center" prop="equipmentName" label="设备名称" width="250"></el-table-column>
                    <el-table-column align="center" prop="equipmentNumber" label="设备编号"></el-table-column>
                    <el-table-column align="center" prop="equipmentLocation" label="建筑分区"></el-table-column>
                    <el-table-column align="center" prop="installLocation" label="安装位置"></el-table-column>
                    <el-table-column align="center" prop="" label="累计运行时长(h)">
                        <template #default="{ row }">{{ formatHours(row.runTime) }}</template>
                    </el-table-column>
                    <el-table-column align="center" prop="runTimeThreshold" label="运行时长提醒设定(h)"> </el-table-column>
                    <el-table-column align="center" prop="status" label="状态" width="80"></el-table-column>
                    <el-table-column align="center" prop="" label="备注"></el-table-column>
                    <el-table-column align="center" prop="" label="操作" width="120">
                        <template slot-scope="scope">
                            <el-link class="blue-link" @click="edit(scope.row)"> 编辑 </el-link>
                            <!-- <el-button type="text" icon="el-icon-edit-outline" @click="edit(scope.row)" class="edit_btn">编辑</el-button> -->
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination style="float: right; margin-top: 20px" background
                    layout="total, sizes, prev, pager, next, jumper" @current-change="pageChange"
                    :current-page="paging.pageNo" :page-size="paging.pageSize" @size-change="handleSizeChange"
                    :page-sizes="[10, 20, 50, 100, 500]" :total="paging.total">
                </el-pagination>
            </section>
        </section>
    </section>
</template>

<script>
import { getEquipmentDuration, updateEquipmentThreshold, exportList } from "@/api/equipment-running-time.js";
import { getUrl } from "@/utils";
export default {
    data() {
        return {
            formData: {
                equipmentName: "",
                equipmentNumber: "",
            },
            tableData: [],
            paging: {
                pageNo: 1,
                pageSize: 10,
                total: 0,
            },
            ws: null,
            timer: null,
        };
    },

    components: {},

    computed: {
        url() {
            let url = getUrl("equipmentStatus/sumRunTime/upload");
            return url;
        },
    },

    mounted() {
        this.init();
    },
    beforeDestroy() {
        if (this.ws) this.ws.close();
        this.ws = null;
        clearInterval(this.timer);
    },
    methods: {
        init() {
            this.getData();
        },
        // 格式化时长
        formatHours(seconds) {
            return (seconds / 3600).toFixed(3);
        },
        realTimeWebSocket() {
            let that = this;
            const tempPoints = this.tableData.map((v) => {
                v.equipmentDuration = "";
                const tempArr = [];
                tempArr.push(v.equipmentDurationPoint);
                return tempArr;
            });
            if (tempPoints.length > 0) {
                // 1. 自动获取当前协议：https 对应 wss，http 对应 ws
                const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

                // 2. 自动获取当前主机名和端口（本地是 localhost:5173，线上是 crazyzeng.github.io）
                const host = window.location.host;

                // 3. 拼接 URL（这里假设你的 WebSocket 服务和前端在同一个域名下）
                // 如果线上后端在别的服务器，可以结合 import.meta.env.VITE_WS_URL 来配置
                const url = `${protocol}//${host}/websocket/cacheThemePointDataWebSocket/-1`;

                // 4. 【重要】如果你想在本地开发时连本地局域网的后端（比如 192.168.2.152），可以加上这段判断：
                // const url = import.meta.env.DEV
                //   ? 'ws://192.168.2.152:908/websocket/cacheThemePointDataWebSocket/-1'
                //   : `${protocol}//${host}/websocket/cacheThemePointDataWebSocket/-1`;             // const url = 'ws://192.168.2.132:908/websocket/cacheThemePointDataWebSocket/-1'
                that.ws = new WebSocket(url);
                that.ws.onopen = function () {
                    that.ws.send(tempPoints.toString(","));
                    that.timer = setInterval(() => {
                        that.ws.send(tempPoints.toString(","));
                    }, 5000);
                };
                that.ws.onmessage = function (res) {
                    const result = JSON.parse(res.data);
                    if (Object.keys(result).length > 0) {
                        for (let k in result) {
                            that.tableData.forEach((v) => {
                                if (k.toString() === v.equipmentDurationPoint) {
                                    v.equipmentDuration = result[k].value;
                                }
                            });
                        }
                    }
                    that.$forceUpdate();
                };
            }
        },
        //查询
        query() {
            this.getData();
        },
        //重置
        reset() {
            this.formData.equipmentName = "";
            this.formData.equipmentNumber = "";
            this.paging.pageNo = 1;
            this.paging.pageSize = 10;
            this.getData();
        },
        edit(val) {
            this.$prompt("请输入告警阈值", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                confirmButtonClass: 'confirm-btn ',
                cancelButtonClass: 'cancel-btn ',
                // center: true,
                inputPattern: /^[0-9]+(.[0-9]{1,2})?$/,
                inputErrorMessage: "格式不正确",
                inputValue: val.runTimeThreshold,
                inputPlaceholder: "单位：h",
            })
                .then(({ value }) => {
                    const tempObj = {
                        equipmentId: val.equipmentId,
                        runTimeThreshold: value,
                    };
                    updateEquipmentThreshold(tempObj).then((res) => {
                        if (res.code === 200) {
                            this.$message.success("修改成功");
                            this.getData();
                        }
                    });
                })
                .catch(() => { });
        },
        getData() {
            const tempObj = Object.assign(this.formData, this.paging);
            getEquipmentDuration(tempObj).then((res) => {
                if (res.code == 200 && Object.keys(res.data).length > 0) {
                    this.tableData = res.data.records;
                    this.paging.total = res.data.total;
                    this.realTimeWebSocket();
                }
            });
        },
        pageChange(e) {
            this.paging.pageNo = e;
            this.getData();
        },
        handleSizeChange(e) {
            this.paging.pageSize = e;
            this.getData();
        },
        //导出列表
        handleExport() {
            exportList(this.formData).then((res) => {
                let data = res;
                if (!data) return;
                let url = window.URL.createObjectURL(new Blob([data]));
                let link = document.createElement("a");
                link.style.display = "none";
                link.href = url;
                link.setAttribute("download", "设备运行时长.xls");
                document.body.appendChild(link);
                link.click();
            });
        },
        beforeUpload() { },
        uploadSuccess(res, file, fileList) {
            if (res.code == 500) {
                this.$message.error(res.msg);
            } else {
                this.$message.success("导入成功！");
                this.query();
            }
            this.$refs.upload.clearFiles();
        },
        uploadFail(err, file, fileList) {
            this.$refs.upload.clearFiles();
            this.$message.error(err.message);
        },
    },
};
</script>
<style lang="scss" scoped>
._uplaod-div {
    display: inline-block;
    margin: 0 10px;
}

::v-deep.el-form-item {
    >.el-form-item__label {
        color: #fff;
    }
}

.el-form {
    margin: 0px 0 0 40px;
}

.container_warp {
    width: 100%;
    height: 100%;
    overflow: auto;
}

::-webkit-scrollbar-track-piece {
    background: transparent;
}

::-webkit-scrollbar {
    width: 6px;
    height: 10px;
}

::-webkit-scrollbar-thumb {
    background: $light-blue;
    border-radius: 20px;
}

::-webkit-scrollbar-corner {
    background: transparent;
}

.edit_btn {
    font-size: 16px;
}

.container_box {
    width: 100%;
    height: 100%;
}

::v-deep {
    .el-message-box__btns {
        text-align: center !important;
    }
}

.el-message-box__btns {
    text-align: center !important;
}
</style>
