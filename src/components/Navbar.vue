<template>
  <div>
    <!-- 左侧边栏（词条侧边栏）-->
    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list-item link @click="goChildPage('/')">
        <v-list-item-content>
          <v-list-item-title class="title">{{ article.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ article.category }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list dense>
        <v-list-item link @click="goChildPage('/source')" v-if="is_article_page">
          <v-list-item-action>
            <v-icon>mdi-code-json</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>查看源代码</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="goChildPage('/edit')" v-if="is_article_page">
          <v-list-item-action>
            <v-icon>mdi-file-document-edit-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>编辑词条</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="goChildPage('/history')" v-if="is_article_page">
          <v-list-item-action>
            <v-icon>mdi-history</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>词条修改历史</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="goPage('/create/article')">
          <v-list-item-action>
            <v-icon>mdi-book-plus-multiple-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>新建词条</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="goPage('/create/model')">
          <v-list-item-action>
            <v-icon>mdi-table-plus</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>新建模板</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <!-- 右侧边栏（用户侧边栏）-->
    <v-navigation-drawer v-model="userdrawer" app temporary right>
      <template v-slot:prepend>
        <v-list-item two-line>
          <!--
            <v-list-item-avatar>
              <img src="https://randomuser.me/api/portraits/women/81.jpg" />
            </v-list-item-avatar>
          -->
          <v-list-item-content v-if="!user.is_login">
            <v-list-item-title>游客</v-list-item-title>
            <v-list-item-subtitle>未登录</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-content v-else>
            <v-list-item-title>{{user.u_name}}</v-list-item-title>
            <v-list-item-subtitle>已登录</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
      <v-divider></v-divider>
      <v-list dense v-if="user.is_login">
        <v-list-item link @click="goPage('/user/' + user.u_name)">
          <v-list-item-icon>
            <v-icon>mdi-home-city</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>个人中心</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="goPage('/message')">
          <v-list-item-icon>
            <v-badge
              :value="Boolean(unread_notification_amount)"
              :content="unread_notification_amount"
              color="blue"
              overlap
              small
              v-if="Boolean(unread_notification_amount)"
            >
              <v-icon>mdi-message-processing</v-icon>
            </v-badge>
            <v-icon v-else>mdi-message-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>消息中心</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append v-if="!user.is_login">
        <div class="pa-2">
          <v-btn dark block @click="loginForm = !loginForm">登陆</v-btn>
        </div>
        <div class="pa-2">
          <v-btn color="light-blue lighten-5" block @click="registerForm = !registerForm">注册</v-btn>
        </div>
      </template>
      <template v-slot:append v-else>
        <div class="pa-2">
          <v-btn color="error" block @click="userLogout()">登出</v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <!-- 顶部导航栏-->
    <v-app-bar app dark hide-on-scroll>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>LichWiki 大学维基</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search_bar"
        class="d-none d-sm-flex"
        flat
        hide-details
        :label="search_label"
        prepend-inner-icon="mdi-layers-search"
        solo-inverted
        dense
        clearable
        filled
        rounded
        @keydown.enter="goSearchPage()"
      ></v-text-field>
      <v-badge
        :value="Boolean(unread_notification_amount)"
        :content="unread_notification_amount"
        offset-x="20"
        offset-y="20"
        color="pink"
        overlap
      >
        <v-btn icon @click.stop="userdrawer = !userdrawer">
          <v-icon v-if="user.is_login">mdi-account-check</v-icon>
          <v-icon v-else>mdi-account-cancel</v-icon>
        </v-btn>
      </v-badge>
    </v-app-bar>
    <!-- 登陆表单 -->
    <v-dialog v-model="loginForm" max-width="500">
      <v-card class="elevation-12">
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>用户登录</v-toolbar-title>
          <v-spacer />
        </v-toolbar>
        <v-card-text style="padding:16px;">
          <v-form>
            <v-text-field
              label="用户名"
              name="username"
              prepend-icon="mdi-account"
              type="text"
              v-model="loginInfo.u_name"
            />
            <v-text-field
              id="password"
              label="密码"
              name="password"
              prepend-icon="mdi-lock"
              type="password"
              v-model="loginInfo.u_password"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" v-on:click="userLogin()">登陆</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 注册表单 -->
    <v-dialog v-model="registerForm" max-width="500">
      <v-card class="elevation-12">
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>用户注册</v-toolbar-title>
          <v-spacer />
        </v-toolbar>
        <v-card-text style="padding:16px;">
          <v-form>
            <v-text-field
              label="邮箱"
              name="email"
              prepend-icon="mdi-email"
              type="email"
              v-model="registerInfo.u_email"
            />
            <v-text-field
              label="用户名"
              name="username"
              prepend-icon="mdi-account"
              type="text"
              v-model="registerInfo.u_name"
            />
            <v-text-field
              id="password"
              label="密码"
              name="password"
              prepend-icon="mdi-lock"
              type="password"
              v-model="registerInfo.u_password"
            />
            <v-text-field
              id="re-password"
              label="再次输入密码"
              name="re_password"
              prepend-icon="mdi-lock"
              type="password"
              v-model="registerInfo.u_re_password"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" v-on:click="userRegister()">注册</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      <v-btn dark text @click="skipRefresh()">{{ snackbarInfo.buttonText }}</v-btn>
    </v-snackbar>
    <v-btn
      v-scroll="onScroll"
      v-show="fab"
      fab
      dark
      fixed
      bottom
      right
      color="primary"
      @click="toTop"
    >
      <v-icon>mdi-keyboard-caps</v-icon>
    </v-btn>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "navbar",
  inject: ["reload"],
  data: () => ({
    search_bar: null,
    search_label: "在当前学科分类下查找",
    drawer: false,
    userdrawer: false,
    loginForm: false,
    registerForm: false,
    fab: false,
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
    timeout: null,
    is_article_page: false,
    // 词条信息
    article: {},
    // 注册信息
    registerInfo: {},
    // 登陆信息
    loginInfo: {},
    // 用户信息
    user: {},
    // 未读信息数
    unread_notification_amount: 0,
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
    this.getSessionInfo();
    this.getInfoFromURL();
  },
  methods: {
    test: function() {
      console.info("test active!");
      console.info(this.$route.path.split("/")[1]);
    },
    showDrawer: function() {
      this.$emit("showDrawer");
    },
    getUnreadNotificationsAmount: function() {
      axios
        .get(
          "http://127.0.0.1:8000/api/notifications/user/" +
            this.user.u_name +
            "/amount"
        )
        .then(response => {
          this.unread_notification_amount = response.data;
        });
    },
    getSessionInfo: function() {
      // 预处理，获取session信息，登录相关
      if (sessionStorage.getItem("is_login")) {
        this.user.is_login = sessionStorage.getItem("is_login");
        this.user.u_email = sessionStorage.getItem("u_email");
        this.user.u_id = sessionStorage.getItem("u_id");
        this.user.u_name = sessionStorage.getItem("u_name");
        this.user.u_register_time = sessionStorage.getItem("u_register_time");
        this.getUnreadNotificationsAmount();
      }
    },
    getInfoFromURL: function() {
      var url_split = this.$route.path.split("/");
      if (url_split.length > 2) {
        if (url_split[1] == "article") {
          this.article.category = this.$route.path.split("/")[2];
          this.article.title = this.$route.path.split("/")[3];
          this.search_label = "在" + this.article.category + "学科分类下查找";
          this.is_article_page = true;
        } else if (url_split[1] == "user") {
          this.article.title = "用户:" + this.$route.path.split("/")[2];
        } else if (url_split[1] == "create") {
          this.article.title = "创建:" + this.$route.path.split("/")[2];
        }
      } else if (url_split[1] == "message") {
        this.article.title = "消息中心";
      }
    },
    goSearchPage: function() {
      this.$router.push({
        path:
          "/article/" +
          this.$route.params["category_name"] +
          "/" +
          this.search_bar
      });
    },
    goChildPage: function(url) {
      // 跳转到子页面
      // console.info(this.$route.params['article_name'])
      if (this.$route.params["category_name"]) {
        this.$router
          .push({
            path:
              "/article/" +
              this.$route.params["category_name"] +
              "/" +
              this.$route.params["article_name"] +
              url
          })
          .catch(err => {
            console.info(err);
          });
      } else {
        this.reload();
      }
      this.reload();
    },
    goPage: function(url) {
      // 跳转到指定页面
      this.$router.push({ path: url });
      this.reload();
    },
    skipRefresh: function() {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.reload();
      } else {
        this.snackbarInfo.snackbar = false;
      }
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
            this.snackbarInfo.text = "注册成功！3秒后刷新页面...";
            this.snackbarInfo.buttonText = "立即刷新";
            this.snackbarInfo.color = "primary";
            this.snackbarInfo.top = true;
            this.snackbarInfo.vertical = true;
            //this.snackbarInfo.refresh = true;
            this.snackbarInfo.snackbar = true;
            setTimeout(() => {
              this.snackbarInfo.text = "注册成功！2秒后刷新页面...";
            }, 1000);
            setTimeout(() => {
              this.snackbarInfo.text = "注册成功！1秒后刷新页面...";
            }, 1000);
            this.timeout = setTimeout(() => {
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

            this.snackbarInfo.text = "登录成功！3秒后刷新页面...";
            this.snackbarInfo.buttonText = "立即刷新";
            this.snackbarInfo.color = "success";
            this.snackbarInfo.top = true;
            this.snackbarInfo.vertical = true;
            //this.snackbarInfo.refresh = true;
            this.snackbarInfo.snackbar = true;
            //console.log(this.user)
            //this.reload()
            setTimeout(() => {
              this.snackbarInfo.text = "登录成功！2秒后刷新页面...";
              this.snackbarInfo.snackbar = false;
              this.snackbarInfo.snackbar = true;
            }, 1000);
            setTimeout(() => {
              this.snackbarInfo.text = "登录成功！1秒后刷新页面...";
              this.snackbarInfo.snackbar = false;
              this.snackbarInfo.snackbar = true;
            }, 2000);
            this.timeout = setTimeout(() => {
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
            this.snackbarInfo.text = "已退出！3秒后刷新页面...";
            this.snackbarInfo.buttonText = "立即刷新";
            this.snackbarInfo.color = "error";
            //this.snackbarInfo.top = true;
            this.snackbarInfo.vertical = true;
            //this.snackbarInfo.refresh = true;
            this.snackbarInfo.snackbar = true;

            this.userdrawer = false;
            sessionStorage.clear();

            //console.log(this.user)
            //this.reload()
            setTimeout(() => {
              this.snackbarInfo.text = "已退出！2秒后刷新页面...";
              this.snackbarInfo.snackbar = false;
              this.snackbarInfo.snackbar = true;
            }, 1000);
            setTimeout(() => {
              this.snackbarInfo.text = "已退出！1秒后刷新页面...";
              this.snackbarInfo.snackbar = false;
              this.snackbarInfo.snackbar = true;
            }, 2000);
            this.timeout = setTimeout(() => {
              this.reload();
            }, 3000);
          }
        });
    },
    onScroll(e) {
      if (typeof window === "undefined") return;
      const top = window.pageYOffset || e.target.scrollTop || 0;
      this.fab = top > 20;
    },
    toTop() {
      this.$vuetify.goTo(0);
    }
  }
};
</script>
