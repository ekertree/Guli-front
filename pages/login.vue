<template>
  <client-only>
    <div class="main">
      <div class="title">
        <a class="active" href="/login">登录</a>
        <span>·</span>
        <a href="/register">注册</a>
      </div>
      <div class="sign-up-container">
        <el-form ref="userForm" :model="user">
          <el-form-item
            class="input-prepend restyle"
            prop="mobile"
            :rules="[
              {
                required: true,
                message: '请输入手机号码',
                trigger: 'blur',
              },
              { validator: checkPhone, trigger: 'blur' },
            ]"
          >
            <div>
              <el-input
                type="text"
                placeholder="手机号"
                v-model="user.mobile"
              />
              <i class="iconfont icon-phone" />
            </div>
          </el-form-item>
          <el-form-item
            class="input-prepend"
            prop="password"
            :rules="[
              { required: true, message: '请输入密码', trigger: 'blur' },
            ]"
          >
            <div>
              <el-input
                type="password"
                placeholder="密码"
                v-model="user.password"
              />
              <i class="iconfont icon-password" />
            </div>
          </el-form-item>
          <div class="btn">
            <input
              type="button"
              class="sign-in-button"
              value="登录"
              @click="submitLogin()"
            />
          </div>
        </el-form>
        <!-- 更多登录方式 -->
        <div class="more-sign">
          <h6>社交帐号登录</h6>
          <ul>
            <li>
              <a
                id="weixin"
                class="weixin"
                href="http://localhost:8160/api/ucenter/wx/login"
                ><i class="iconfont icon-weixin"
              /></a>
            </li>
            <li>
              <a id="qq" class="qq" target="_blank" href="#" @click.prevent="pop()"
                ><i class="iconfont icon-qq"
              /></a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </client-only>
</template>
<script>
import "~/assets/css/sign.css";
import "~/assets/css/iconfont.css";
import cookie from "js-cookie";
import loginApi from "@/api/login";
export default {
  layout: "sign",
  data() {
    return {
      user: {
        mobile: "",
        password: "",
      },
      loginInfo: {},
    };
  },
  methods: {
    //登陆
    submitLogin() {
      loginApi.submitLogin(this.user).then((response) => {
        //获取token
        //放到cookies中，第一个cookie名称 第二个参数值  第三个作用范围
        cookie.set("guli_token", response.data.data.token, {
          domain: "localhost",
        });
        //根据token获取用户信息，首页显示
        loginApi.getLoginInfo().then((response) => {
          this.loginInfo = response.data.data.userInfo;
          //将用户信息记录cookie
          cookie.set("guli_ucenter", JSON.stringify(this.loginInfo), {
            domain: "localhost",
          });
          //跳转页面
          if(this.$route.query.backcourse != null && this.$route.query.backcourse != undefined){
            window.location.href = "/course/"+this.$route.query.backcourse;
          }else if(this.$route.query.backuserinfo != null && this.$route.query.backuserinfo != undefined){
            window.location.href = ""+this.$route.query.backuserinfo;
          }else{
            window.location.href = "/";
          }
        });
      });
    },
    checkPhone(rule, value, callback) {
      //debugger
      if (!/^1[34578]\d{9}$/.test(value)) {
        return callback(new Error("手机号码格式不正确"));
      }
      return callback();
    },
    //弹窗 敬请期待
    pop() {
      this.$message({
        showClose: true,
        message: "QQ登陆，敬请期待！",
      });
    },
  },
};
</script>
<style>
.el-form-item__error {
  z-index: 9999999;
}
</style>
