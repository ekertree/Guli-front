<template>
  <div id="aCoursesList" class="bg-fa of">
    <!-- /课程列表 开始 -->
    <section class="container">
      <header class="comm-title">
        <h2 class="fl tac">
          <span class="c-333">全部课程</span>
        </h2>
      </header>
      <section class="c-sort-box">
        <section class="c-s-dl">
          <dl>
            <dt>
              <span class="c-999 fsize14">课程类别</span>
            </dt>
            <dd class="c-s-dl-li">
              <ul class="clearfix">
                <li>
                  <a
                    title="全部"
                    href="javascript:void(0);"
                    :class="{ active: oneIndex == -1 }"
                    @click="searchOne('', -1)"
                    >全 部</a
                  >
                </li>
                <li
                  v-for="(item, index) in subjectNestedList"
                  v-bind:key="index"
                  :class="{ active: oneIndex == index }"
                >
                  <a
                    :title="item.title"
                    href="javascript:void(0);"
                    @click="searchOne(item.id, index)"
                    >{{ item.title }}</a
                  >
                </li>
              </ul>
            </dd>
          </dl>
          <dl>
            <dt>
              <span class="c-999 fsize14" />
            </dt>
            <dd class="c-s-dl-li">
              <ul class="clearfix">
                <li
                  v-for="(item, index) in subSubjectList"
                  v-bind:key="index"
                  :class="{ active: twoIndex == index }"
                >
                  <a
                    :title="item.title"
                    href="javascript:void(0);"
                    @click="searchTwo(item.id, index)"
                    >{{ item.title }}</a
                  >
                </li>
              </ul>
            </dd>
          </dl>
          <div class="clear" />
        </section>
        <div class="js-wrap">
          <section class="fr">
            <span class="c-ccc">
              <i class="c-master f-fM">1</i>/
              <i class="c-666 f-fM">1</i>
            </span>
          </section>
          <section class="fl">
            <ol class="js-tap clearfix">
              <li>
                <a title="关注度" href="#">关注度</a>
              </li>
              <li>
                <a title="最新" href="#">最新</a>
              </li>
              <li class="current bg-orange">
                <a title="价格" href="#"
                  >价格&nbsp;
                  <span>↓</span>
                </a>
              </li>
            </ol>
          </section>
        </div>
        <div class="mt40">
          <!-- /无数据提示 开始-->
          <section class="no-data-wrap" v-if="data.total == 0">
            <em class="icon30 no-data-ico">&nbsp;</em>
            <span class="c-666 fsize14 ml10 vam"
              >没有相关数据，小编正在努力整理 中...</span
            >
          </section>
          <!-- /无数据提示 结束-->
          <article class="comm-course-list" v-if="data.total > 0">
            <ul class="of" id="bna">
              <li v-for="(item, index) in data.items" :key="item.id">
                <div class="cc-l-wrap">
                  <section class="course-img">
                    <img
                      width="100%"
                      height="100%"
                      :src="item.cover"
                      class="img-responsive"
                      :alt="item.title"
                    />
                    <div class="cc-mask">
                      <a
                        :href="'/course/' + item.id"
                        title="开始学习"
                        class="comm-btn c-btn-1"
                        >开始学习</a
                      >
                    </div>
                  </section>
                  <h3 class="hLh30 txtOf mt10">
                    <a
                      :href="'/course/' + item.id"
                      :title="item.title"
                      class="course-title fsize18 c-333"
                      >{{ item.title }}</a
                    >
                  </h3>
                  <section class="mt10 hLh20 of">
                    <span
                      class="fr jgTag bg-green"
                      v-if="Number(item.price) === 0"
                    >
                      <i class="c-fff fsize12 f-fA">免费</i>
                    </span>
                    <span class="fr jgTag bg-red" v-if="Number(item.price) > 0">
                      <i class="c-fff fsize12 f-fA">{{ item.price + "￥" }}</i>
                    </span>
                    <span class="fl jgAttr c-ccc f-fA">
                      <i class="c-999 f-fA" v-if="Number(item.price) > 0">{{ item.buyCount }}人学习 |</i>
                      <i class="c-999 f-fA">{{ countList[index] }}条评论</i>
                    </span>
                  </section>
                </div>
              </li>
            </ul>
            <div class="clear"></div>
          </article>
        </div>
        <!-- 公共分页 开始 -->

        <div>
          <!-- 分页 -->
          <el-pagination
            :current-page="page"
            :page-size="limit"
            :total="total"
            background
            style="padding: 30px 0; text-align: center"
            layout="total, prev, pager, next, jumper"
            @current-change="goToPage"
          />
        </div>
        <!-- 公共分页 结束 -->
      </section>
    </section>
    <!-- /课程列表 结束 -->
  </div>
</template>
<script>
import courseApi from "@/api/course";
import commentApi from "@/api/comment";
export default {
  data() {
    return {
      page: 1,
      limit: 8,
      total: 0,
      data: {},
      subjectNestedList: {}, // 一级分类列表
      subSubjectList: [], // 二级分类列表
      queryObj: {}, // 查询表单对象
      oneIndex: -1,
      twoIndex: -1,
      buyCountSort: "",
      gmtCreateSort: "",
      priceSort: "",
      countList: [],
    };
  },
  created() {
    this.initSubject();
    this.initCourseFirst();
  },
  methods: {
    //初始化课程列表
    initCourseFirst() {
      var items;
      var courseIds = "";
      var that = this;
      courseApi.getCourseList(1, this.limit, this.queryObj).then((response) => {
        this.data = response.data.data;
        this.total = response.data.data.total;
        items = response.data.data.items;
        if (items != undefined && items.length > 0) {
          for (var i = 0; i < items.length; i++) {
            if (i == 0) {
              courseIds = courseIds + items[i].id;
            } else {
              courseIds = courseIds + "," + items[i].id;
            }
          }
          commentApi.getCommentCounts(courseIds).then((res) => {
            that.countList = res.data.data.countList;
          });
        }
      });
    },
    //初始化课程分类
    initSubject() {
      courseApi.getAllSubject().then((response) => {
        this.subjectNestedList = response.data.data.list;
      });
    },
    //分页切换
    goToPage(page) {
      this.page = page;
      var items;
      var courseIds = "";
      var that = this;
      courseApi
        .getCourseList(page, this.limit, this.queryObj)
        .then((response) => {
          this.data = response.data.data;
          this.total = response.data.data.total;
          items = response.data.data.items;
          if (items != undefined && items.length > 0) {
            for (var i = 0; i < items.length; i++) {
              if (i == 0) {
                courseIds = courseIds + items[i].id;
              } else {
                courseIds = courseIds + "," + items[i].id;
              }
            }
            commentApi.getCommentCounts(courseIds).then((res) => {
              that.countList = res.data.data.countList;
            });
          }
        });
    },
    //点击一个一级分类，查询对应的二级分类
    searchOne(subjectParentId, index) {
      //让选中样式生效
      this.oneIndex = index;
      //将一级分类的id复制给封装查询对象
      this.queryObj.subjectParentId = subjectParentId;
      //清空
      this.twoIndex = -1;
      this.queryObj.subjectId = "";
      this.subSubjectList = [];
      //进行查询
      this.goToPage(1);
      //用点击的分类的id 和所有一级分类进行比较
      //如果id相同，从一级分类中取出二级分类
      for (let i = 0; i < this.subjectNestedList.length; i++) {
        //获取每个一级分类
        var oneObject = this.subjectNestedList[i];
        if (subjectParentId == oneObject.id) {
          this.subSubjectList = oneObject.children;
        }
      }
    },
    //点击二级分类，进行查询
    searchTwo(subjectId, index) {
      //让选中样式生效
      this.twoIndex = index;
      //将二级分类的id赋值给查询封装对象
      this.queryObj.subjectId = subjectId;
      //进行查询
      this.goToPage(1);
    },
  },
};
</script>
<style scoped>
.active {
  background: #bdbdbd;
}
.hide {
  display: none;
}
.show {
  display: block;
}
</style>
