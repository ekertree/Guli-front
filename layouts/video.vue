<template>
  <div class="guli-player">
    <div class="head">
      <a href="#" title="我的谷粒">
        <img class="logo" src="~/assets/img/MyGuLi.png" alt="我的谷粒"
      /></a>
    </div>
    <div class="body">
      <div class="content"><nuxt /></div>
    </div>
  </div>
</template>
<script>
import staApi from "@/api/sta";
export default {
  mounted () {
    this.addVideoView()
  },
  methods: {
    //视频播放量加一
    addVideoView(){
      staApi.addVideoView()
    }
  }
};
</script>
<style>
html,
body {
  height: 100%;
}
</style>
<style scoped>
.head {
  height: 50px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
.head .logo {
  height: 50px;
  margin-left: 10px;
}
.body {
  position: absolute;
  top: 50px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}
</style>