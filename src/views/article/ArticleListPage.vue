<template>
  <div>
    <navbar></navbar>
    <!-- 左侧边栏（词条侧边栏）-->
    <!-- 右侧边栏（用户侧边栏）-->
    <!-- 顶部导航栏-->
    <!-- 主体内容区块-->
    <v-content style="padding: 0px 0px 0px;">
      <v-container fluid>
        <v-row>
          <v-col>
            <v-tabs background-color="gray" class="elevation-2" dark>
              <v-tab>页面</v-tab>
              <v-tab>讨论</v-tab>
              <v-tab-item>
                <v-card flat tile outlined style="padding: 0px 0px 0px 10px;">
                  <v-card-title class="display-2">"{{ category_name }}" 分类下的所有页面</v-card-title>
                  <v-card-subtitle class="pb-0">{{ category_name }} 共有 {{ article_amount }} 个词条页面。</v-card-subtitle>
                  <v-divider></v-divider>
                  <v-card-text class="text--primary">
                    <v-simple-table fixed-header height="300px">
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th class="text-left">词条列表</th>
                            <th class="text-left">词条创建者</th>
                            <th class="text-left">词条创建时间</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="item in article_list" :key="item.a_id">
                            <td>
                              <a @click="goArticlePage(item.a_title)">{{ item.a_title }}</a>
                            </td>
                            <td>
                              {{ item.author_name }}
                            </td>
                            <td>
                              {{ item.a_create_time }}
                            </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <comment-area></comment-area>
              </v-tab-item>
            </v-tabs>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import axios from "axios";
import navbar from "../../components/Navbar";
import comment_area from "../../components/CommentArea";

export default {
  inject: ["reload"],
  components: {
    navbar,
    "comment-area": comment_area
  },
  data: () => ({
    // 词条信息
    title_en: null,
    category_name: null,
    article_amount: 0,
    article_list: [],
    article: {
      title: null,
      text: "载入中...<br />长时间未出现页面请检查网络或者该页面未创建",
      category: null,
      create_time: null,
      banner:
        '<div class="v-banner v-sheet v-sheet--tile theme--light v-banner--has-icon v-banner--is-mobile v-banner--single-line"><div class="v-banner__wrapper"><div class="v-banner__content"><div class="v-avatar v-banner__icon" style="height: 40px; min-width: 40px; width: 40px;"><div class="v-avatar blue lighten-1" style="height: 40px; min-width: 40px; width: 40px;"><i aria-hidden="true" icon="mdi-tag-faces" class="v-icon notranslate mdi mdi-tag-faces theme--light white--text"></i></div></div><div class="v-banner__text">这篇文章需要改进。你可以帮助维基来编辑它。</div></div></div></div>'
    },
    // 词条使用中的模板
    used_models: new Array(), // 已使用的模板
    model_regex: new Array(),
    model_text: new Array(),
    // 用户信息
    user: {}
  }),
  created() {
    this.getInfoFromURL();
    this.getArticleList();
  },
  methods: {
    test: function() {
      //console.info("test active!");
      //console.info(this.$route.path.split("/")[1]);
    },
    timeParse: function(my_date_time) {
      var date_time_split = my_date_time.split("T");
      var date = date_time_split["0"];
      var time = date_time_split["1"].split(".")["0"];
      var Y = date.split("-")["0"];
      var M = date.split("-")["1"];
      var D = date.split("-")["2"];
      return Y + "年" + M + "月" + D + "日" + " " + time;
    },
    getInfoFromURL: function() {
      this.category_name = this.$route.path.split("/")[2];
    },
    goArticlePage: function(article_title) {
      this.$router.push({
        path:
          "/article/" + this.$route.params.category_name + "/" + article_title
      });
    },
    getArticleList: function() {
      axios
        .get(
          this.GLOBAL.base_url +
            "/api/articles/" +
            this.$route.params.category_name
        )
        .then(res => {
          if (res.data.count > 0) {
            this.article_amount = res.data.count;
            this.article_list = res.data.results;
            for(var i = 0; i < res.data.count; i++){
              this.article_list[i].a_create_time = this.timeParse(this.article_list[i].a_create_time)
            }
          }
        });
    },
    formatMsgTime: function(timespan) {
      var dateTime = new Date(timespan);

      var year = dateTime.getFullYear();
      var month = dateTime.getMonth() + 1;
      var day = dateTime.getDate();
      var hour = dateTime.getHours();
      var minute = dateTime.getMinutes();
      //var second = dateTime.getSeconds();
      var now = new Date();
      var now_new = Math.round(new Date()); //typescript转换写法
      var milliseconds = 0;
      var timeSpanStr;

      milliseconds = now_new - timespan;

      if (milliseconds <= 1000 * 60 * 1) {
        timeSpanStr = "刚刚";
      } else if (
        1000 * 60 * 1 < milliseconds &&
        milliseconds <= 1000 * 60 * 60
      ) {
        timeSpanStr = Math.round(milliseconds / (1000 * 60)) + "分钟前";
      } else if (
        1000 * 60 * 60 * 1 < milliseconds &&
        milliseconds <= 1000 * 60 * 60 * 24
      ) {
        timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + "小时前";
      } else if (
        1000 * 60 * 60 * 24 < milliseconds &&
        milliseconds <= 1000 * 60 * 60 * 24 * 15
      ) {
        timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + "天前";
      } else if (
        milliseconds > 1000 * 60 * 60 * 24 * 15 &&
        year == now.getFullYear()
      ) {
        timeSpanStr = month + "-" + day + " " + hour + ":" + minute;
      } else {
        timeSpanStr =
          year + "-" + month + "-" + day + " " + hour + ":" + minute;
      }
      return timeSpanStr;
    }
  }
};
</script>