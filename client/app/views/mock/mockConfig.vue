<template>
<div class="mockConfig">
    <div class="form">
        <div class="form-row">
            <label class="from-title">端口号</label>
            <span class="form-input">
                    <input type="text" v-model="vport"/>
                </span>
        </div>
        <div class="form-row">
            <label class="from-title">服务状态</label>
            <span class="form-input">
                    {{this.status?"开启":"停止"}}
                </span>
        </div>
        <div class="form-row">
            <label class="from-title">http地址</label>
            <span class="form-input">
                    {{this.url}}
                    <button class="btnCancel" @click="preview()">预览</button>
                    <button class="btnCancel" ref="btnCopy">复制</button>
                </span>
        </div>
        <div class="form-action">
            <button class="btn bigBtn" @click="start()">{{!this.status?"开启":"停止"}}</button>
        </div>
    </div>
</div>
</template>

<script>
import store from "store/store";
import renderer from "renderer";
import common from "utils/common";
import { MOCK_START } from "./actionTypes";

export default {
  name: "mockConfig",
  data() {
    return {
      vport:store.state.mock.port
    };
  },
  computed: {
    port() {
      return store.state.mock.port;
    },
    url() {
      return "http://" + this.address + ":" + this.vport;
    },
    address() {
      return renderer.getIPAdress();
    },
    status() {
      return store.state.mock.status;
    }
  },
  mounted() {
    common.copy(
      this.$refs.btnCopy,
      () => {
        return this.url;
      },
      this.valert
    );
  },
  methods: {
    start() {
      store.dispatch({
        type: MOCK_START,
        data: {
          port: this.vport,
          url: this.url,
          status: store.state.mock.status
        }
      });
    },
    preview() {
      let status = store.state.mock.status;
      if (!status) {
        this.valert({ content: "mock服务未启动，请开启服务后预览." });
      } else {
        renderer.openUrl(this.url);
      }
    }
  }
};
</script>
