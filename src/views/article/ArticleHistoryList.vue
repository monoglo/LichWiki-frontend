<template>
  <div>
    <navbar></navbar>
    <v-content style="padding: 0px 0px 0px;">
      <v-container fluid>
        <v-tabs background-color="gray" class="elevation-2" dark>
          <v-tab>页面</v-tab>
          <v-tab>讨论</v-tab>
          <v-tab-item>
            <v-card flat tile outlined style="padding: 0px 0px 0px 10px;">
              <v-card-title class="display-2">{{ article.title }} 的历史修改记录</v-card-title>
              <v-card-subtitle class="pb-0">5 名用户进行了 {{ article_history.length }} 次更改。</v-card-subtitle>
              <v-divider></v-divider>
              <!-- <v-banner single-line><v-avatar slot="icon" color="blue lighten-1" size="40"><v-icon icon="mdi-tag-faces" color="white">mdi-tag-faces</v-icon></v-avatar>这篇文章需要改进。你可以帮助维基来编辑它。</v-banner> -->
              <v-timeline v-model="article_history">
                <v-timeline-item
                  align-top
                  fill-dot
                  small
                  v-for="item in article_history"
                  :key="item.ah_id"
                >
                  <span slot="opposite">{{ item.ah_edit_time }}</span>
                  <v-card class="elevation-20" link @click="goHistoryPage(item.ah_id)">
                    <v-card-title class="headline">{{ item.ah_summary }}</v-card-title>
                    <v-card-subtitle class="pb-1">{{ item.author_name }}</v-card-subtitle>
                    <v-card-text>{{ item.ah_length }} 字符 ({{ item.length_change }})</v-card-text>
                  </v-card>
                </v-timeline-item>
              </v-timeline>
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

export default {
  inject: ["reload"],
  components: {
    navbar
  },
  data: () => ({
    drawer: false,
    userdrawer: false,
    overlay: false,
    article: {
      banner:
        '<div class="v-banner v-sheet v-sheet--tile theme--light v-banner--has-icon v-banner--is-mobile v-banner--single-line"><div class="v-banner__wrapper"><div class="v-banner__content"><div class="v-avatar v-banner__icon" style="height: 40px; min-width: 40px; width: 40px;"><div class="v-avatar blue lighten-1" style="height: 40px; min-width: 40px; width: 40px;"><i aria-hidden="true" icon="mdi-tag-faces" class="v-icon notranslate mdi mdi-tag-faces theme--light white--text"></i></div></div><div class="v-banner__text">这篇文章需要改进。你可以帮助维基来编辑它。</div></div></div></div>'
    },
    article_history: {},
    // 评论相关
    is_login: sessionStorage.getItem("is_login"),
    url: null,
    comment: null,
    comments: [],
    comment_label: "在此处输入评论",
    father_comment_id: null,
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
    }
  }),
  created() {
    this.getInfoFromURL();
    this.getArticleInfo();
    this.getArticleHistoryInfo();
    this.getCommentByURL();
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
    goHistoryPage: function(ah_id) {
      console.info(this.$route.path);
      this.$router.push({ path: this.$route.path + "/" + ah_id });
    },
    getInfoFromURL: function() {
      this.article.category = this.$route.path.split("/")[2];
      this.article.title = this.$route.path.split("/")[3];
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
        });
    },
    getArticleHistoryInfo: function() {
      axios
        .get(
          "http://127.0.0.1:8000/api/articles/" +
            this.$route.params.category_name +
            "/" +
            this.$route.params.article_name +
            "/history"
        )
        .then(res => {
          this.article_history = res.data;
          var instant_length = 0;
          for (var i = 0; i <= this.article_history.length - 1; i++) {
            if (
              parseInt(this.article_history[i]["ah_length"]) >= instant_length
            ) {
              this.article_history[i]["length_change"] =
                "+" +
                String(this.article_history[i]["ah_length"] - instant_length) +
                "字符";
              instant_length = parseInt(this.article_history[i]["ah_length"]);
            } else {
              this.article_history[i]["length_change"] =
                "-" +
                String(
                  instant_length -
                    parseInt(this.article_history[i]["ah_length"])
                ) +
                "字符";
              instant_length = parseInt(this.article_history[i]["ah_length"]);
            }

            this.article_history[i]["ah_edit_time"] = this.timeParse(
              this.article_history[i]["ah_edit_time"]
            );
          }
          this.article_history.reverse();
          console.log(this.article_history);
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
    }
  }
};
</script>