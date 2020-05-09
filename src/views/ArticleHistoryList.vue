<template>
  <div>
    <navbar></navbar>
    <h1>This is an article history page</h1>
  </div>
</template>

<script>
import axios from "axios";
import navbar from "../components/Navbar";

export default {
  components: {
    navbar
  },
  data: () => ({
    drawer: false,
    userdrawer: false,
    overlay: false,
    article: {
      title: null,
      text: null,
      category: "高等数学",
      create_time: null,
      banner:
        '<div class="v-banner v-sheet v-sheet--tile theme--light v-banner--has-icon v-banner--is-mobile v-banner--single-line"><div class="v-banner__wrapper"><div class="v-banner__content"><div class="v-avatar v-banner__icon" style="height: 40px; min-width: 40px; width: 40px;"><div class="v-avatar blue lighten-1" style="height: 40px; min-width: 40px; width: 40px;"><i aria-hidden="true" icon="mdi-tag-faces" class="v-icon notranslate mdi mdi-tag-faces theme--light white--text"></i></div></div><div class="v-banner__text">这篇文章需要改进。你可以帮助维基来编辑它。</div></div></div></div>'
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
          this.article.title = res.data["a_title"];
          this.article.text = res.data["a_text"];
        });
    }
  }
};
</script>