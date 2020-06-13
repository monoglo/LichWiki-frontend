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
          <v-col cols="12" sm="9" md="9" lg="9" xl="9">
            <v-tabs background-color="gray" class="elevation-2" dark>
              <v-tab>页面</v-tab>
              <v-tab>讨论</v-tab>
              <v-tab-item>
                <v-card flat tile outlined style="padding: 0px 0px 0px 10px;">
                  <v-card-title class="display-2">{{ article.title }}</v-card-title>
                  <v-card-subtitle class="pb-0">
                    <a
                      @click="goUserPage(article.latest_edit_user_name)"
                    >{{article.latest_edit_user_name}}</a>
                    于{{article.latest_edit_time}}
                    <a
                      @click="goArticleHistoryPage()"
                    >修改了</a> 此页面
                  </v-card-subtitle>
                  <v-divider></v-divider>
                  <!-- <v-banner single-line><v-avatar slot="icon" color="blue lighten-1" size="40"><v-icon icon="mdi-tag-faces" color="white">mdi-tag-faces</v-icon></v-avatar>这篇文章需要改进。你可以帮助维基来编辑它。</v-banner> -->
                  <!-- <div v-html="article.banner"></div> -->
                  <v-card-text class="text--primary">
                    <vue-showdown :markdown="article.text" vueTemplate emoji></vue-showdown>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <comment-area></comment-area>
              </v-tab-item>
            </v-tabs>
          </v-col>
          <v-col>
            <div class="d-none d-sm-flex">
              <v-sheet class="elevation-2" style="width:100%;">
                <v-toolbar dark>
                  <v-toolbar-title>{{ article.title }}</v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-simple-table>
                  <tbody>
                    <tr>
                      <td>中文名</td>
                      <td>{{ article.title }}</td>
                    </tr>
                    <tr>
                      <td>英文名</td>
                      <td>{{ title_en }}</td>
                    </tr>
                    <tr>
                      <td>应用领域</td>
                      <td>{{ article.category }}</td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-sheet>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import axios from "axios";
import navbar from "../../components/Navbar";
import comment_area from "../../components/CommentArea"
import { VueShowdown } from "vue-showdown";

export default {
  inject: ["reload"],
  components: {
    navbar,
    "vue-showdown": VueShowdown,
    "comment-area": comment_area
  },
  data: () => ({
    // 词条信息
    title_en: null,
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
    user: {},
  }),
  created() {
    this.getArticleInfo();
    this.getArticleLatestUpdateInfo();
    this.getInfoFromURL();
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
    goUserPage: function(user_name) {
      this.$router.push({
        path: "/user/" + user_name
      });
    },
    goArticleHistoryPage: function() {
      this.$router.push({
        path:
          "/article/" +
          this.article.category +
          "/" +
          this.article.title +
          "/history/" +
          this.article.latest_edit_history_id
      });
    },
    getArticleInfo: function() {
      axios
        .get(
          this.GLOBAL.base_url +
            "/api/articles/" +
            this.$route.params.category_name +
            "/" +
            this.$route.params.article_name
        )
        .then(res => {
          //console.log(res.data);
          this.article.a_id = res.data["a_id"];
          this.article.subject_id = res.data["subject_id"];
          this.article.subject_name = res.data["subject_name"];
          this.article.author_id = res.data["author_id"];
          this.article.author_name = res.data["author_name"];
          this.article.title = res.data["a_title"];
          this.article.text = res.data["a_text"];
          axios
            .get(
              "https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20200519T074038Z.503a14eb57703888.a49840c93b70b285aee9ef4a95416eaa0246f0d6&lang=en&text=" +
                this.article.title
            )
            .then(res => {
              this.title_en = res.data.text[0];
            });
          this.renderModel();
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
    },
    getArticleLatestUpdateInfo: function() {
      axios
        .get(
          this.GLOBAL.base_url +
            "/api/articles/" +
            this.$route.params.category_name +
            "/" +
            this.$route.params.article_name +
            "/latest"
        )
        .then(res => {
          //console.log(res.data);
          this.article.latest_edit_history_id = res.data["ah_id"];
          this.article.latest_edit_user_name = res.data["author_name"];
          this.article.latest_edit_user_id = res.data["author_id"];
          var date = new Date(res.data["ah_edit_time"]);
          this.article.latest_edit_time = this.formatMsgTime(date.getTime());
        });
    },
    getInfoFromURL: function() {
      this.article.category = this.$route.path.split("/")[2];
      this.article.title = this.$route.path.split("/")[3];
    },
    renderModel: function() {
      let in_str = this.article.text;
      let reg_expression = /\{(\w.*)\|([^}|]*)*\}/g; //$1 (\w.*)  $2 ([^}|]*)
      let results = [...in_str.matchAll(reg_expression)];
      for (var item in results) {
        if (!this.used_models.includes(results[item][1])) {
          this.used_models.push(results[item][1]);
        }
      }

      for (var model in this.used_models) {
        this.model_regex.push(
          "\\{(" + this.used_models[model] + ")\\|([^}|]*)*\\}"
        );
        axios
          .get(
            this.GLOBAL.base_url +
              "/api/models/" +
              this.$route.params["category_name"] +
              "/" +
              this.used_models[model]
          )
          .then(response => {
            if (response.data) {
              in_str = in_str.replace(
                new RegExp(
                  this.model_regex[
                    this.used_models.indexOf(response.data["m_name"])
                  ],
                  "g"
                ),
                response.data["m_text"]
              );
              this.article.text = in_str;
            }
          });
      }
    }
  }
};
</script>