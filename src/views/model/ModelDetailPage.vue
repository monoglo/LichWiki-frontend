<template>
  <div>
    <navbar></navbar>
    <v-content style="padding: 0px 0px 0px;">
      <v-container fluid>
        <v-row>
          <v-col cols="12" sm="9" md="9" lg="9" xl="9">
            <v-tabs background-color="gray" class="elevation-2" dark>
              <v-tab>页面</v-tab>
              <v-tab>讨论</v-tab>
              <v-tab-item>
                <v-card flat tile outlined style="padding: 0px 0px 0px 10px;">
                  <v-card-title class="display-2">模板: {{ model.name }}</v-card-title>
                  <v-card-subtitle class="pb-0"><a @click="goUserPage(model.author_name)">{{ model.author_name }}</a> 于 {{ model.create_time }} ({{model.create_time_count}}) 创建了此模板</v-card-subtitle>
                  <v-divider></v-divider>
                  <!-- <v-banner single-line><v-avatar slot="icon" color="blue lighten-1" size="40"><v-icon icon="mdi-tag-faces" color="white">mdi-tag-faces</v-icon></v-avatar>这篇文章需要改进。你可以帮助维基来编辑它。</v-banner> -->

                  <v-card-text class="text--primary">
                    <vue-showdown :markdown="model.text" vueTemplate emoji></vue-showdown>
                    <v-divider></v-divider>
                    
                    <v-divider></v-divider>
                    使用方法:   <strong>{<span>{{model.name}}</span>|参数}</strong>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item></v-tab-item>
            </v-tabs>
          </v-col>
          <v-col>
            <div class="d-none d-sm-flex">
              <v-sheet class="elevation-2" style="width:100%;">
                <v-toolbar dark>
                  <v-toolbar-title>{<span>{{model.name}}</span>|参数}</v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-simple-table>
                  <tbody>
                    <tr>
                      <td>模板名</td>
                      <td>{{ model.name }}</td>
                    </tr>
                    <tr>
                      <td>可用范围</td>
                      <td>{{this.$route.params.category_name}}</td>
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
import { VueShowdown } from "vue-showdown";

export default {
  inject: ["reload"],
  components: {
    navbar,
    "vue-showdown": VueShowdown
  },
  data: () => ({
    model: {
      title: null,
      text: "加载中",
      create_time: null,
      author_name: null,
      title_en: null
    }
  }),
  created() {
    this.getModelDetailInfo();
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
    goUserPage: function(user_name) {
      this.$router.push({
        path:
          "/user/" +
          user_name
      });
    },
    getModelDetailInfo: function() {
      axios
        .get(
          this.GLOBAL.base_url + "/api/models/" +
            this.$route.params["category_name"] +
            "/" +
            this.$route.params["model_name"]
        )
        .then(response => {
          if (response.data) {
            console.info(response.data)
            this.model.id = response.data["m_id"];
            this.model.name = response.data["m_name"];
            this.model.text = response.data["m_text"];
            this.model.author_id = response.data["author_id"];
            this.model.author_name = response.data["author_name"];
            this.model.create_time = this.timeParse(response.data["m_create_time"]);
            var date = new Date(response.data["m_create_time"])
            this.model.create_time_count = this.formatMsgTime(date.getTime());
          }
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
    }
  }
};
</script>