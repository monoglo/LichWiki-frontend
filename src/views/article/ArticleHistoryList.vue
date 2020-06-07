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
              <v-card-subtitle class="pb-0">{{ article_history.editer_amount }} 名用户进行了 {{ article_history.length }} 次更改。</v-card-subtitle>
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
          <v-tab-item>
            <comment-area></comment-area>
          </v-tab-item>
        </v-tabs>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import axios from "axios";
import navbar from "../../components/Navbar";
import comment_area from "../../components/CommentArea"

export default {
  inject: ["reload"],
  components: {
    navbar,
    "comment-area": comment_area
  },
  data: () => ({
    article: {},
    article_history: {},
  }),
  created() {
    this.getInfoFromURL();
    this.getArticleHistoryInfo();
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
    goHistoryPage: function(ah_id) {
      //console.info(this.$route.path);
      this.$router.push({ path: this.$route.path + "/" + ah_id });
    },
    getInfoFromURL: function() {
      this.article.category = this.$route.path.split("/")[2];
      this.article.title = this.$route.path.split("/")[3];
    },
    getArticleHistoryInfo: function() {
      axios
        .get(
          this.GLOBAL.base_url + "/api/articles/" +
            this.$route.params.category_name +
            "/" +
            this.$route.params.article_name +
            "/history"
        )
        .then(res => {
          this.article_history = res.data;
          var instant_length = 0;
          var editors = new Array()
          for (var i = 0; i <= this.article_history.length - 1; i++) {
            if (!(this.article_history[i]["author_id"] in editors)){
              editors.push(this.article_history[i]["author_id"])
            }
            if (
              parseInt(this.article_history[i]["ah_length"]) >= instant_length
            ) {
              this.article_history[i]["length_change"] =
                "+" +
                String(this.article_history[i]["ah_length"] - instant_length) +
                "字符";
              instant_length = parseInt(this.article_history[i]["ah_length"]);
            } else {
              this.article_history[i]["length_change"] =
                "-" +
                String(
                  instant_length -
                    parseInt(this.article_history[i]["ah_length"])
                ) +
                "字符";
              instant_length = parseInt(this.article_history[i]["ah_length"]);
            }

            this.article_history[i]["ah_edit_time"] = this.timeParse(
              this.article_history[i]["ah_edit_time"]
            );
          }
          this.article_history.reverse();
          this.article_history.editer_amount = editors.length
          //console.log(this.article_history);
        });
    },
  }
};
</script>