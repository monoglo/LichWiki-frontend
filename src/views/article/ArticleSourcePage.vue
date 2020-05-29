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
                  <v-card-subtitle class="pb-0">Paradox 于3天前 修改了 此页面</v-card-subtitle>
                  <v-divider></v-divider>
                  <!-- <v-banner single-line><v-avatar slot="icon" color="blue lighten-1" size="40"><v-icon icon="mdi-tag-faces" color="white">mdi-tag-faces</v-icon></v-avatar>这篇文章需要改进。你可以帮助维基来编辑它。</v-banner> -->
                  <div v-html="article.banner"></div>
                  <v-card-text class="text--primary">
                    {{ article.text }}
                  </v-card-text>
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
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
  }),
  created() {
    this.getArticleInfo();
    this.getInfoFromURL();
  },
  methods: {
    test: function() {
      console.info("test active!");
      console.info(this.$route.path.split("/")[1]);
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
          this.article.a_id = res.data["a_id"]
          this.article.subject_id = res.data["subject_id"]
          this.article.subject_name = res.data["subject_name"]
          this.article.author_id = res.data["author_id"]
          this.article.author_name = res.data["author_name"]
          this.article.title = res.data["a_title"]
          this.article.text = res.data["a_text"]
          axios
            .get(
              "https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20200519T074038Z.503a14eb57703888.a49840c93b70b285aee9ef4a95416eaa0246f0d6&lang=en&text=" +
                this.article.title
            )
            .then(res => {
              this.title_en = res.data.text[0]
            });
        });
    },
    getInfoFromURL: function() {
      this.article.category = this.$route.path.split("/")[2];
      this.article.title = this.$route.path.split("/")[3];
    },
    userRegister: function() {
      let postData = {
        u_email: this.registerInfo.u_email,
        u_name: this.registerInfo.u_name,
        u_password: this.registerInfo.u_password
      };
      axios
        .post("http://127.0.0.1:8000/api/users/", postData)
        .then(response => {
          if (response.data) {
            this.snackbarInfo.text = "注册成功！即将刷新页面...";
            this.snackbarInfo.buttonText = "立即刷新";
            this.snackbarInfo.color = "primary";
            this.snackbarInfo.top = true;
            this.snackbarInfo.vertical = true;
            this.snackbarInfo.refresh = true;
            this.snackbarInfo.snackbar = true;

            setTimeout(() => {
              this.reload();
            }, 3000);
          } else {
            this.snackbarInfo.text = "注册失败，请再次尝试！";
            this.snackbarInfo.buttonText = "确定";
            this.snackbarInfo.color = "error";
            this.snackbarInfo.top = true;
            this.snackbarInfo.vertical = true;
            this.snackbarInfo.snackbar = true;
          }
        });
    },
    userLogin: function() {
      let postData = {
        u_name: this.loginInfo.u_name,
        u_password: this.loginInfo.u_password
      };
      axios
        .post("http://127.0.0.1:8000/api/user_login", postData)
        .then(response => {
          console.log(response.data);
          if (response.data["code"] == 1000) {
            sessionStorage.setItem("is_login", true);
            sessionStorage.setItem("u_email", response.data.data.u_email);
            sessionStorage.setItem("u_id", response.data.data.u_id);
            sessionStorage.setItem("u_name", response.data.data.u_name);
            sessionStorage.setItem(
              "u_register_time",
              response.data.data.u_register_time
            );
            this.user = response.data["data"];
            this.user.is_login = true;

            this.snackbarInfo.text = "登录成功！即将刷新页面...";
            this.snackbarInfo.buttonText = "立即刷新";
            this.snackbarInfo.color = "success";
            this.snackbarInfo.top = true;
            this.snackbarInfo.vertical = true;
            this.snackbarInfo.refresh = true;
            this.snackbarInfo.snackbar = true;
            //console.log(this.user)
            //this.reload()
            setTimeout(() => {
              this.reload();
            }, 3000);
          } else {
            this.snackbarInfo.text = "用户名或密码错误！";
            this.snackbarInfo.buttonText = "确定";
            this.snackbarInfo.color = "error";
            this.snackbarInfo.top = true;
            this.snackbarInfo.vertical = true;
            this.snackbarInfo.snackbar = true;
          }
        });
    },
    userLogout: function() {
      //post foo
      let postData = {};
      axios
        .post("http://127.0.0.1:8000/api/user_logout", postData)
        .then(response => {
          if (response.data["code"] == 1000) {
            this.snackbarInfo.text = "已退出！即将刷新页面...";
            this.snackbarInfo.buttonText = "立即刷新";
            this.snackbarInfo.color = "error";
            //this.snackbarInfo.top = true;
            this.snackbarInfo.vertical = true;
            this.snackbarInfo.refresh = true;
            this.snackbarInfo.snackbar = true;

            this.userdrawer = false;
            sessionStorage.clear();

            //console.log(this.user)
            //this.reload()
            setTimeout(() => {
              this.reload();
            }, 3000);
          }
        });
    }
  }
};
</script>