<template>
  <div>
    <navbar></navbar>
    <v-content style="padding: 0px 0px 0px;">
      <v-container fluid>
        <v-row>
          <v-col cols="12" sm="9" md="9" lg="9" xl="9">
            <v-tabs background-color="gray" class="elevation-2" dark>
              <v-tab>页面</v-tab>
              <v-tab>讨论</v-tab>
              <v-tab-item>
                <v-card flat tile outlined style="padding: 0px 0px 0px 10px;">
                  <v-card-title
                    class="display-2"
                  >"{{ article_history.title }}" 的历史页面查看 - "{{ article_history.summary }}"</v-card-title>
                  <v-card-subtitle class="pb-0">
                    <a
                      @click="goUserPage(article_history.author_name)"
                    >{{ article_history.author_name }}</a>
                    于 {{ article_history.edit_time }} ({{article_history.edit_time_count}}) 进行了本次修改
                  </v-card-subtitle>
                  <v-divider></v-divider>
                  <!-- <v-banner single-line><v-avatar slot="icon" color="blue lighten-1" size="40"><v-icon icon="mdi-tag-faces" color="white">mdi-tag-faces</v-icon></v-avatar>这篇文章需要改进。你可以帮助维基来编辑它。</v-banner> -->

                  <v-card-text class="text--primary">
                    <vue-showdown :markdown="article_history.text" vueTemplate emoji></vue-showdown>
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
                  <v-toolbar-title>{{ article_history.title }}</v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-simple-table>
                  <tbody>
                    <tr>
                      <td>中文名</td>
                      <td>极限</td>
                    </tr>
                    <tr>
                      <td>英文名</td>
                      <td>Limit</td>
                    </tr>
                    <tr>
                      <td>应用领域</td>
                      <td>微积分</td>
                    </tr>
                  </tbody>
                </v-simple-table>
                <v-btn color="primary" @click="postArticleEdit()">回滚词条到本历史记录</v-btn>
              </v-sheet>
            </div>
          </v-col>
        </v-row>
      </v-container>
      <!-- snackbar 提示框-->
      <v-snackbar
        v-model="snackbarInfo.snackbar"
        :bottom="snackbarInfo.bottom"
        :color="snackbarInfo.color"
        :left="snackbarInfo.left"
        :multi-line="snackbarInfo.multi_line"
        :right="snackbarInfo.right"
        :timeout="6000"
        :top="snackbarInfo.top"
        :vertical="snackbarInfo.vertical"
      >
        {{ snackbarInfo.text }}
        <v-btn dark text @click="goArticlePage">{{ snackbarInfo.buttonText }}</v-btn>
      </v-snackbar>
    </v-content>
  </div>
</template>

<script>
import axios from "axios";
import navbar from "../../components/Navbar";
import comment_area from "../../components/CommentArea";
import { VueShowdown } from "vue-showdown";

export default {
  inject: ["reload"],
  components: {
    navbar,
    VueShowdown,
    "comment-area": comment_area
  },
  data: () => ({
    article_history: {
      title: null,
      text: "加载中",
      summary: null,
      edit_time: null,
      author_name: null,
      banner:
        '<div class="v-banner v-sheet v-sheet--tile theme--light v-banner--has-icon v-banner--is-mobile v-banner--single-line"><div class="v-banner__wrapper"><div class="v-banner__content"><div class="v-avatar v-banner__icon" style="height: 40px; min-width: 40px; width: 40px;"><div class="v-avatar blue lighten-1" style="height: 40px; min-width: 40px; width: 40px;"><i aria-hidden="true" icon="mdi-tag-faces" class="v-icon notranslate mdi mdi-tag-faces theme--light white--text"></i></div></div><div class="v-banner__text">这篇文章需要改进。你可以帮助维基来编辑它。</div></div></div></div>'
    },
    snackbarInfo: {
      snackbar: false,
      bottom: false,
      color: "success",
      left: false,
      multi_line: false,
      right: false,
      timeout: "6000",
      top: false,
      vertical: false
    },
    // 词条使用中的模板
    used_models: new Array(), // 已使用的模板
    model_regex: new Array(),
    model_text: new Array()
  }),
  created() {
    this.getArticleHistorySingalInfo();
  },
  methods: {
    timeParse: function(my_date_time) {
      var date_time_split = my_date_time.split("T");
      var date = date_time_split["0"];
      var time = date_time_split["1"].split(".")["0"];
      var Y = date.split("-")["0"];
      var M = date.split("-")["1"];
      var D = date.split("-")["2"];
      return Y + "年" + M + "月" + D + "日" + " " + time;
    },
    goArticlePage: function() {
      if (this.snackbarInfo.color == "success") {
        this.$router.push({
          path:
            "/article/" + this.$route.params['category_name'] + "/" + this.$route.params['article_name']
        });
        this.reload();
      } else {
        this.snackbarInfo.snackbar = false;
      }
    },
    goUserPage: function(user_name) {
      this.$router.push({
        path: "/user/" + user_name
      });
    },
    getArticleHistorySingalInfo: function() {
      axios
        .get(
          this.GLOBAL.base_url +
            "/api/articles/" +
            this.$route.params["category_name"] +
            "/" +
            this.$route.params["article_name"] +
            "/history/" +
            this.$route.params["article_history_id"]
        )
        .then(response => {
          if (response.data) {
            this.article_history.ah_id = response.data["ah_id"];
            this.article_history.summary = response.data["ah_summary"];
            this.article_history.title = response.data["ah_title"];
            this.article_history.text = response.data["ah_text"];
            this.article_history.length = response.data["ah_length"];
            this.article_history.edit_time = this.timeParse(
              response.data["ah_edit_time"]
            );
            var date = new Date(response.data["ah_edit_time"]);
            this.article_history.edit_time_count = this.formatMsgTime(
              date.getTime()
            );
            this.article_history.article_id = response.data["article_id"];
            this.article_history.author_id = response.data["author_id"];
            this.article_history.author_name = response.data["author_name"];
            //console.info(this.article_history)
            this.renderModel();
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
          this.article.latest_edit_user_name = res.data["author_name"];
          this.article.latest_edit_user_id = res.data["author_id"];
        });
    },
    renderModel: function() {
      let in_str = this.article_history.text;
      let reg_expression = /\{(\w.*)\|([^}|]*)*\}/g;
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
              this.article_history.text = in_str;
            }
          });
      }
    },
    postArticleEdit: function() {
      let postData = {
        ah_id: this.article_history.ah_id,
        u_id: sessionStorage.getItem("u_id")
      };
      if (sessionStorage.getItem("is_login")) {
        axios
          .post(
            this.GLOBAL.base_url +
              "/api/rollback_article_history",
            postData
          )
          .then(res => {
            if (res.data["ah_id"]) {
              this.snackbarInfo.text = "回滚成功！";
              this.snackbarInfo.buttonText = "确定";
              this.snackbarInfo.color = "success";
              this.snackbarInfo.top = true;
              this.snackbarInfo.vertical = true;
              //this.snackbarInfo.refresh = true;
              this.snackbarInfo.snackbar = true;
            }
          });
      } else {
        this.snackbarInfo.text = "权限不足回滚失败！";
        this.snackbarInfo.buttonText = "确定";
        this.snackbarInfo.color = "error";
        this.snackbarInfo.top = true;
        this.snackbarInfo.vertical = true;
        //this.snackbarInfo.refresh = true;
        this.snackbarInfo.snackbar = true;
      }
    }
  }
};
</script>