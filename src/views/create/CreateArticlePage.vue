<template>
  <div>
    <navbar></navbar>
    <!-- This is article edit page. -->
    <v-content style="padding: 0px 0px 0px;">
      <v-container fluid>
        <v-tabs background-color="gray" class="elevation-2" dark>
          <v-tab>页面</v-tab>
          <v-tab-item>
            <v-card flat tile outlined style="padding: 0px 0px 0px 10px;">
              <v-card-title class="display-2">新建条目</v-card-title>
              <v-divider></v-divider>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-select
                  v-model="article.subject_name"
                  :items="subjects"
                  :rules="[v => !!v || '学科分类不能为空！']"
                  label="学科分类"
                  required
                ></v-select>
                <v-text-field
                  label="词条名"
                  v-model="article.title"
                  counter="255"
                  :rules="[rules.required]"
                ></v-text-field>
                <v-btn color="primary" @click="validate" :disabled="!valid">创建页面</v-btn>
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
      <v-btn dark text @click="goArticlePage()">{{ snackbarInfo.buttonText }}</v-btn>
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
    subjects: [],
    subjects_info: {},
    article: {
      name: null,
      text: String(''),
      subject_name: null
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
      required: value => !!value || "词条名不能为空！"
    }
  }),
  created() {
    this.getSessionInfo();
    this.getAllSubjects();
  },
  methods: {
    validate: function() {
      if (this.$refs.form.validate()) {
        console.info("imalive");
        this.postArticleCreate();
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
    getAllSubjects: function() {
      axios.get("http://127.0.0.1:8000/api/subjects/").then(response => {
        if (response.data.results) {
          var items = new Array();
          this.subjects_info = response.data.results;
          console.info(this.subjects_info);
          for (var i = 0; i < response.data.results.length; i++) {
            items.push(response.data.results[i]["s_name"]);
          }
          this.subjects = items;
        }
      });
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
    postArticleCreate: function() {
      console.info(this.article.subject_name);
      var subject_id = -1;
      for (var i = 0; i < this.subjects_info.length; i++) {
        if (this.subjects_info[i]["s_name"] == this.article.subject_name) {
          subject_id = this.subjects_info[i]["s_id"];
        }
      }
      let postData = {
        subject_id: subject_id,
        subject_name: this.article.subject_name,
        author_id: this.user.u_id,
        author_name: this.user.u_name,
        a_title: this.article.title,
        a_text: this.article.text
      };
      if (this.user.is_login) {
        axios
          .post(
            "http://127.0.0.1:8000/api/articles/" + this.article.subject_name,
            postData
          )
          .then(res => {
            console.info(res);
            if (res.data["a_id"]) {
              this.snackbarInfo.text = "创建成功！";
              this.snackbarInfo.buttonText = "跳转到创建的词条页面";
              this.snackbarInfo.color = "success";
              this.snackbarInfo.top = true;
              this.snackbarInfo.vertical = true;
              //this.snackbarInfo.refresh = true;
              this.snackbarInfo.snackbar = true;
            }
          })
          .catch(error => {
            console.log(error)
            this.snackbarInfo.text = "创建失败！连接错误或已经存在同名页面";
            this.snackbarInfo.buttonText = "确定";
            this.snackbarInfo.color = "error";
            this.snackbarInfo.top = true;
            this.snackbarInfo.vertical = true;
            //this.snackbarInfo.refresh = true;
            this.snackbarInfo.snackbar = true;
          });
      }
    }
  }
};
</script>