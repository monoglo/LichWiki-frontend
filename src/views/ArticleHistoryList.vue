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
          <v-tab-item></v-tab-item>
        </v-tabs>
      </v-container>
    </v-content>
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
      banner:
        '<div class="v-banner v-sheet v-sheet--tile theme--light v-banner--has-icon v-banner--is-mobile v-banner--single-line"><div class="v-banner__wrapper"><div class="v-banner__content"><div class="v-avatar v-banner__icon" style="height: 40px; min-width: 40px; width: 40px;"><div class="v-avatar blue lighten-1" style="height: 40px; min-width: 40px; width: 40px;"><i aria-hidden="true" icon="mdi-tag-faces" class="v-icon notranslate mdi mdi-tag-faces theme--light white--text"></i></div></div><div class="v-banner__text">这篇文章需要改进。你可以帮助维基来编辑它。</div></div></div></div>'
    },
    article_history: {}
  }),
  created() {
    this.getInfoFromURL();
    this.getArticleInfo();
    this.getArticleHistoryInfo();
  },
  methods: {
    timeParse: function(my_date_time) {
      var date_time_split = my_date_time.split('T')
      var date = date_time_split['0']
      var time = date_time_split['1'].split('.')['0']
      var Y = date.split('-')['0']
      var M = date.split('-')['1']
      var D = date.split('-')['2']
      return Y+ "年" + M + "月" + D + "日" + " " +time
    },
    goHistoryPage: function(ah_id) {
      console.info(this.$route.path)
      this.$router.push({path:this.$route.path + '/' + ah_id})
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
          for (var i = 0; i <= (this.article_history.length - 1); i++) {
            if (parseInt(this.article_history[i]["ah_length"]) >= instant_length) {
              this.article_history[i]["length_change"] =
                "+" +
                String(this.article_history[i]["ah_length"] - instant_length) +
                "字符";
              instant_length = parseInt(this.article_history[i]["ah_length"]);
            } else {
              this.article_history[i]["length_change"] =
                "-" +
                String(instant_length - parseInt(this.article_history[i]["ah_length"])) +
                "字符";
              instant_length = parseInt(this.article_history[i]["ah_length"]);
            }

            this.article_history[i]["ah_edit_time"] = this.timeParse(this.article_history[i]["ah_edit_time"])
          }
          this.article_history.reverse()
          console.log(this.article_history);
        });
    },
  }
};
</script>