<template>
  <div>
    <navbar></navbar>
    <!-- Hello,{{ user.u_name }} -->
    <v-content style="padding: 0px 0px 0px;">
      <v-container fluid>
        <v-row>
          <v-col cols="12" sm="3" md="3" lg="3" xl="3">
            <v-sheet class="elevation-2" style="width:100%;">
              <v-toolbar dark>
                <v-toolbar-title>{{ user.u_name }}</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-simple-table>
                <tbody>
                  <tr>
                    <td>账户ID</td>
                    <td>{{ user.u_id }}</td>
                  </tr>
                  <tr>
                    <td>邮箱</td>
                    <td>{{ user.u_email }}</td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-sheet>
          </v-col>
          <v-col>
            <div>
              <v-tabs background-color="gray" class="elevation-2" dark>
                <v-tab>历史编辑</v-tab>
                <v-tab>讨论</v-tab>
                <v-tab-item>
                  <v-card flat tile outlined style="padding: 0px 0px 0px 10px;">
                    <v-card-title class="display-2">{{ user.u_name }} 的贡献</v-card-title>
                    <v-card-subtitle
                      class="pb-0"
                    >自 {{user.u_register_time}} 以来 {{ user.u_name }} 一共进行了 {{user_article_history.length}} 次更改。</v-card-subtitle>
                    <v-divider></v-divider>
                    <!-- <v-banner single-line><v-avatar slot="icon" color="blue lighten-1" size="40"><v-icon icon="mdi-tag-faces" color="white">mdi-tag-faces</v-icon></v-avatar>这篇文章需要改进。你可以帮助维基来编辑它。</v-banner> -->
                    <v-timeline v-model="user_article_history">
                      <v-timeline-item
                        align-top
                        fill-dot
                        small
                        v-for="item in user_article_history"
                        :key="item.ah_id"
                      >
                        <span slot="opposite">{{ item.ah_edit_time }}</span>
                        <v-card
                          class="elevation-20"
                          link
                          @click="goHistoryPage(item.article_subject_name, item.article_name, item.ah_id)"
                        >
                          <v-card-title
                            class="headline"
                          >"{{ item.ah_summary }}" 在词条 "{{ item.article_subject_name }}/{{ item.article_name }}"</v-card-title>
                          <v-card-subtitle class="pb-1">{{ item.author_name }}</v-card-subtitle>
                          <v-card-text>{{ item.ah_length }} 字符</v-card-text>
                        </v-card>
                      </v-timeline-item>
                    </v-timeline>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-sheet elevation="12" class="pa-12">
                    <v-form ref="form" lazy-validation>
                      <v-textarea v-model="comment" clearable :label="comment_label" required :disabled="!Boolean(is_login)"></v-textarea>
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
                      <v-btn text color="deep-purple accent-4" @click="replyComment(comment.c_user_name, comment.c_user_id)">回复评论</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-tab-item>
              </v-tabs>
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
import navbar from "../../components/Navbar";
import axios from "axios";
//import { timeparse } from "../utils/timeparse";

export default {
  name: "UserPage",
  inject: ["reload"],
  components: {
    navbar
  },
  data: () => ({
    is_login: sessionStorage.getItem("is_login"),
    url: null,
    comment: null,
    comments: [],
    comment_label: '在此处输入评论',
    father_comment_id: null,
    user: {
      u_name: null
    },
    user_article_history: {},
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
    this.getCommentByURL();
    this.getUserInfo();
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
    postComment: function() {
      var postData = {
        c_url: this.url,
        c_text: this.comment,
        c_user_id: sessionStorage.getItem("u_id"),
        c_father_comment_id: this.father_comment_id
      };
      // console.info(postData);
      axios
        .post(this.GLOBAL.base_url + "/api/comments/", postData)
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
      this.comment_label = '回复@' + user_name + ":"
      this.father_comment_id = comment_id
    },
    getCommentByURL: function() {
      var url = this.$route.path;
      if (url.charAt(url.length - 1) != "/") {
        url = url + "/";
      }
      this.url = url;
      // console.info(url);
      axios
        .get(this.GLOBAL.base_url + "/api/comments/?c_url=" + url)
        .then(response => {
          var comments = response.data;
          this.comments = comments.reverse();
          // console.info(comments);
        });
    },
    getInfoFromURL: function() {
      this.user.u_name = this.$route.path.split("/")[2];
    },
    getUserInfo: function() {
      axios
        .get(this.GLOBAL.base_url + "/api/users/" + this.user.u_name)
        .then(response => {
          if (response.data) {
            this.user.u_id = response.data["u_id"];
            this.user.u_name = response.data["u_name"];
            this.user.u_email = response.data["u_email"];
            this.user.u_register_time = this.timeParse(
              response.data["u_register_time"]
            );
            axios
              .get(
                this.GLOBAL.base_url + "/api/article_history/user/" +
                  this.user.u_id
              )
              .then(response => {
                this.user_article_history = response.data;
                this.user_article_history.reverse();
                for (
                  var i = 0;
                  i <= this.user_article_history.length - 1;
                  i++
                ) {
                  this.user_article_history[i]["ah_edit_time"] = this.timeParse(
                    this.user_article_history[i]["ah_edit_time"]
                  );
                }
                // console.info(this.user_article_history);
              });
          }
        });
    },
    goHistoryPage: function(subject, title, ah_id) {
      this.$router.push({
        path: "/article/" + subject + "/" + title + "/history/" + ah_id
      });
    }
  }
};
</script>

<style>
</style>