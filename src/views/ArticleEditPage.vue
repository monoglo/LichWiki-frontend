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
              <br />
              <!-- <v-banner single-line><v-avatar slot="icon" color="blue lighten-1" size="40"><v-icon icon="mdi-tag-faces" color="white">mdi-tag-faces</v-icon></v-avatar>这篇文章需要改进。你可以帮助维基来编辑它。</v-banner> -->
              <markdown-editor style="z-index:0; height:700px;" v-model="article.text" codeStyle="dark"></markdown-editor>
            </v-card>
          </v-tab-item>
          <v-tab-item></v-tab-item>
        </v-tabs>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import axios from "axios";
import navbar from "../components/Navbar";
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
export default {
  components: {
    navbar,
    "markdown-editor": mavonEditor
  },
  data: () => ({
    article: {
      name: null,
      text: null
    }
  }),
  created() {
    this.getArticleInfo();
  },
  methods: {
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
    }
  }
};
</script>

<style>

</style>