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
              <v-tab>源代码</v-tab>
              <v-tab-item>
                <v-card flat tile outlined style="padding: 0px 0px 0px 10px;">
                  <v-card-title class="display-2">{{ article.title }} 的源代码页面</v-card-title>
                  <v-card-subtitle
                    class="pb-0"
                  ><a @click="goUserPage(article.latest_edit_user_name)">{{article.latest_edit_user_name}}</a> 于{{article.latest_edit_time}} <a @click="goArticleHistoryPage()">修改了</a> 此页面</v-card-subtitle>
                  <v-divider></v-divider>
                  <v-card-text class="text--primary">{{ article.text }}</v-card-text>
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
    title_en: null,
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
    article: {
      title: null,
      text: null,
      category: null,
      create_time: null,
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
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
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
    getArticleInfo: function() {
      axios
        .get(
          this.GLOBAL.base_url + "/api/articles/" +
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
        });
    },
    getInfoFromURL: function() {
      this.article.category = this.$route.path.split("/")[2];
      this.article.title = this.$route.path.split("/")[3];
    },
    goUserPage: function(user_name) {
      this.$router.push({
        path:
          "/user/" +
          user_name
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
          this.GLOBAL.base_url + "/api/articles/" +
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
    }
  }
};
</script>