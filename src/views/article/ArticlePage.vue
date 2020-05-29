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
            <v-tabs v-model="tab" background-color="gray" class="elevation-2" dark>
              <v-tab>页面</v-tab>
              <v-tab>讨论</v-tab>
              <v-tab-item>
                <v-card flat tile outlined style="padding: 0px 0px 0px 10px;">
                  <v-card-title class="display-2">{{ article.title }}</v-card-title>
                  <v-card-subtitle class="pb-0">Paradox 于3天前 修改了 此页面</v-card-subtitle>
                  <v-divider></v-divider>
                  <!-- <v-banner single-line><v-avatar slot="icon" color="blue lighten-1" size="40"><v-icon icon="mdi-tag-faces" color="white">mdi-tag-faces</v-icon></v-avatar>这篇文章需要改进。你可以帮助维基来编辑它。</v-banner> -->
                  <!-- <div v-html="article.banner"></div> -->
                  <v-card-text class="text--primary">
                    <vue-showdown :markdown="article.text" vueTemplate emoji></vue-showdown>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-sheet elevation="12" class="pa-12">
                  <v-form ref="form" lazy-validation>
                    <v-textarea
                      v-model="comment"
                      clearable
                      :label="comment_label"
                      required
                      :disabled="!Boolean(is_login)"
                    ></v-textarea>
                    <v-btn color="primary" @click="postComment" :disabled="!comment">发送</v-btn>
                  </v-form>
                </v-sheet>
                <v-card v-for="comment in comments" :key="comment.c_id" style="padding:10px">
                  <v-card-title>{{comment.c_user_name}}</v-card-title>
                  <v-card-subtitle>{{timeParse(comment.c_create_time)}}</v-card-subtitle>
                  <v-card-text>
                    <span
                      v-if="comment.c_father_comment_user_name"
                    >回复@{{comment.c_father_comment_user_name}}:</span>
                    {{comment.c_text}}
                  </v-card-text>
                  <v-card-actions>
                    <v-btn
                      text
                      color="deep-purple accent-4"
                      @click="replyComment(comment.c_user_name, comment.c_user_id)"
                    >回复评论</v-btn>
                  </v-card-actions>
                </v-card>
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
          <v-btn dark text @click="reload()">{{ snackbarInfo.buttonText }}</v-btn>
        </v-snackbar>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import axios from "axios";
import navbar from "../../components/Navbar";
import { VueShowdown } from "vue-showdown";

export default {
  inject: ["reload"],
  components: {
    navbar,
    "vue-showdown": VueShowdown
  },
  data: () => ({
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
    // 注册信息
    registerInfo: {},
    // 登陆信息
    loginInfo: {},
    // 用户信息
    user: {},
    items: [
      { title: "Home", icon: "mdi-home-city" },
      { title: "My Account", icon: "mdi-account" },
      { title: "Users", icon: "mdi-account-group-outline" }
    ],
    tab: null,
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    // 评论相关
    is_login: sessionStorage.getItem("is_login"),
    url: null,
    comment: null,
    comments: [],
    comment_label: "在此处输入评论",
    father_comment_id: null
  }),
  created() {
    this.getArticleInfo();
    this.getInfoFromURL();
    this.getCommentByURL();
  },
  methods: {
    test: function() {
      console.info("test active!");
      console.info(this.$route.path.split("/")[1]);
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
    getArticleInfo: function() {
      axios
        .get(
          "http://127.0.0.1:8000/api/articles/" +
            this.$route.params.category_name +
            "/" +
            this.$route.params.article_name
        )
        .then(res => {
          console.log(res.data);
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
        });
    },
    // 评论相关
    postComment: function() {
      var postData = {
        c_url: this.url,
        c_text: this.comment,
        c_user_id: sessionStorage.getItem("u_id"),
        c_father_comment_id: this.father_comment_id
      };
      // console.info(postData);
      axios
        .post("http://127.0.0.1:8000/api/comments/", postData)
        .then(response => {
          console.info(response);
          if (response.data) {
            this.snackbarInfo.text = "评论发送成功！";
            this.snackbarInfo.buttonText = "确定";
            this.snackbarInfo.color = "primary";
            this.snackbarInfo.top = true;
            this.snackbarInfo.vertical = true;
            //this.snackbarInfo.refresh = true;
            this.snackbarInfo.snackbar = true;
          }
        })
        .catch(error => {
          console.info(error);
        });
    },
    replyComment: function(user_name, comment_id) {
      this.$vuetify.goTo(0);
      this.comment_label = "回复@" + user_name + ":";
      this.father_comment_id = comment_id;
    },
    getCommentByURL: function() {
      var url = this.$route.path;
      if (url.charAt(url.length - 1) != "/") {
        url = url + "/";
      }
      this.url = url;
      // console.info(url);
      axios
        .get("http://127.0.0.1:8000/api/comments/?c_url=" + url)
        .then(response => {
          var comments = response.data;
          this.comments = comments.reverse();
          // console.info(comments);
        });
    },
    getInfoFromURL: function() {
      this.article.category = this.$route.path.split("/")[2];
      this.article.title = this.$route.path.split("/")[3];
    }
  }
};
</script>