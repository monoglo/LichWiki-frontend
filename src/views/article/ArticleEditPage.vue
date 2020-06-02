<template>
  <div>
    <navbar></navbar>
    <!-- This is article edit page. -->
    <v-content style="padding: 0px 0px 0px;">
      <v-container fluid>
        <v-tabs background-color="gray" class="elevation-2" dark>
          <v-tab>页面</v-tab>
          <v-tab>讨论</v-tab>
          <v-tab-item>
            <v-card flat tile outlined style="padding: 0px 0px 0px 10px;">
              <v-card-title class="display-2">编辑 "{{ article.title }}"</v-card-title>
              <v-divider></v-divider>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field
                  label="编辑摘要"
                  v-model="article.summary"
                  counter="255"
                  :rules="[rules.required]"
                ></v-text-field>
                <v-btn color="primary" @click="validate" :disabled="!valid">提交更改</v-btn>
              </v-form>
              <br />
              <br />
              <markdown-editor
                style="z-index:0; height:700px;"
                v-model="article.text"
                codeStyle="dark"
                :editable="Boolean(this.user.is_login)"
              ></markdown-editor>
              <br />
              <br />
            </v-card>
          </v-tab-item>
          <v-tab-item></v-tab-item>
        </v-tabs>
      </v-container>
    </v-content>
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
      <v-btn
        dark
        text
        @click="goArticlePage"
      >{{ snackbarInfo.buttonText }}</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import axios from "axios";
import navbar from "../../components/Navbar";
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
export default {
  components: {
    navbar,
    "markdown-editor": mavonEditor
  },
  data: () => ({
    valid: true,
    article: {
      name: null,
      text: String(null),
      summary: null
    },
    user: {
      is_login: false
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
    rules: {
      required: value => !!value || "摘要不能为空！"
    }
  }),
  created() {
    this.getSessionInfo();
    this.getArticleInfo();
  },
  methods: {
    validate: function() {
      if (this.$refs.form.validate()) {
        console.info("imalive");
        this.postArticleEdit();
      }
    },
    getSessionInfo: function() {
      // 预处理，获取session信息，登录相关
      if (sessionStorage.getItem("is_login")) {
        this.user.is_login = sessionStorage.getItem("is_login");
        this.user.u_email = sessionStorage.getItem("u_email");
        this.user.u_id = sessionStorage.getItem("u_id");
        this.user.u_name = sessionStorage.getItem("u_name");
        this.user.u_register_time = sessionStorage.getItem("u_register_time");
      }
    },
    goArticlePage: function() {
      if (this.snackbarInfo.color == "success") {
        this.$router.push({
          path:
            "/article/" + this.article.subject_name + "/" + this.article.title
        });
        this.reload();
      } else {
        this.snackbarInfo.snackbar = false;
      }
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
    postArticleEdit: function() {
      let postData = {
        a_id: this.article.a_id,
        subject_id: this.article.subject_id,
        subject_name: this.article.subject_name,
        author_id: this.user.u_id,
        author_name: this.user.u_name,
        ah_summary: this.article.summary,
        a_title: this.article.title,
        a_text: this.article.text
      };
      if (this.user.is_login) {
        axios
          .put(
            "http://127.0.0.1:8000/api/articles/" +
              this.$route.params.category_name +
              "/" +
              this.$route.params.article_name,
            postData
          )
          .then(res => {
            if (res.data["ah_id"]) {
              this.snackbarInfo.text = "编辑成功！";
              this.snackbarInfo.buttonText = "确定";
              this.snackbarInfo.color = "success";
              this.snackbarInfo.top = true;
              this.snackbarInfo.vertical = true;
              //this.snackbarInfo.refresh = true;
              this.snackbarInfo.snackbar = true;
            }
          });
      }else{
        this.snackbarInfo.text = "未登录用户当前默认无法编辑！";
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

<style>
</style>