<template>
  <div>
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
      <v-card-title><a @click="goUserPage(comment.c_user_name)">{{comment.c_user_name}}</a></v-card-title>
      <v-card-subtitle>{{timeParse(comment.c_create_time)}}</v-card-subtitle>
      <v-card-text>
        <span v-if="comment.c_father_comment_user_name">回复@{{comment.c_father_comment_user_name}}:</span>
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
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "comment_area",
  inject: ["reload"],
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
    // 用户信息
    user: {},
    // 评论相关
    is_login: sessionStorage.getItem("is_login"),
    url: null,
    comment: null,
    comments: [],
    comment_label: "在此处输入评论",
    father_comment_id: null
  }),
  created() {
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
    goUserPage: function(user_name) {
      this.$router.push({
        path: "/user/" + user_name
      });
      this.reload()
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
        .post(this.GLOBAL.base_url + "/api/comments/", postData)
        .then(response => {
          //console.info(response);
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
        .get(this.GLOBAL.base_url + "/api/comments/?c_url=" + url)
        .then(response => {
          var comments = response.data;
          this.comments = comments.reverse();
          // console.info(comments);
        });
    },
  }
};
</script>

<style>
</style>