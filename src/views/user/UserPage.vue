<template>
  <div>
    <navbar></navbar>
    <!-- Hello,{{ user.u_name }} -->
    <v-content style="padding: 0px 0px 0px;">
      <v-container fluid>
        <v-row>
          <v-col cols="12" sm="3" md="3" lg="3" xl="3">
            <v-sheet class="elevation-2" style="width:100%;">
              <v-toolbar dark>
                <v-toolbar-title>{{ user.u_name }}</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-simple-table>
                <tbody>
                  <tr>
                    <td>账户ID</td>
                    <td>{{ user.u_id }}</td>
                  </tr>
                  <tr>
                    <td>邮箱</td>
                    <td>{{ user.u_email }}</td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-sheet>
          </v-col>
          <v-col>
            <div>
              <v-tabs background-color="gray" class="elevation-2" dark>
                <v-tab>历史编辑</v-tab>
                <v-tab>讨论</v-tab>
                <v-tab-item>
                  <v-card flat tile outlined style="padding: 0px 0px 0px 10px;">
                    <v-card-title class="display-2">{{ user.u_name }} 的贡献</v-card-title>
                    <v-card-subtitle
                      class="pb-0"
                    >自 {{user.u_register_time}} 以来 {{ user.u_name }} 一共进行了 {{user_article_history.length}} 次更改。</v-card-subtitle>
                    <v-divider></v-divider>
                    <!-- <v-banner single-line><v-avatar slot="icon" color="blue lighten-1" size="40"><v-icon icon="mdi-tag-faces" color="white">mdi-tag-faces</v-icon></v-avatar>这篇文章需要改进。你可以帮助维基来编辑它。</v-banner> -->
                    <v-timeline v-model="user_article_history">
                      <v-timeline-item
                        align-top
                        fill-dot
                        small
                        v-for="item in user_article_history"
                        :key="item.ah_id"
                      >
                        <span slot="opposite">{{ item.ah_edit_time }}</span>
                        <v-card
                          class="elevation-20"
                          link
                          @click="goHistoryPage(item.article_subject_name, item.article_name, item.ah_id)"
                        >
                          <v-card-title
                            class="headline"
                          >"{{ item.ah_summary }}" 在词条 "{{ item.article_subject_name }}/{{ item.article_name }}"</v-card-title>
                          <v-card-subtitle class="pb-1">{{ item.author_name }}</v-card-subtitle>
                          <v-card-text>{{ item.ah_length }} 字符</v-card-text>
                        </v-card>
                      </v-timeline-item>
                    </v-timeline>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <comment-area :user_center_u_id="user.u_id"></comment-area>
                </v-tab-item>
              </v-tabs>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import navbar from "../../components/Navbar";
import axios from "axios";
import comment_area from "../../components/CommentArea"

//import { timeparse } from "../utils/timeparse";

export default {
  name: "UserPage",
  inject: ["reload"],
  components: {
    navbar,
    "comment-area": comment_area
  },
  data: () => ({
    is_login: sessionStorage.getItem("is_login"),
    user: {
      u_name: null
    },
    user_article_history: {},
    
  }),
  created() {
    this.getInfoFromURL();
    this.getUserInfo();
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
    getInfoFromURL: function() {
      this.user.u_name = this.$route.params.user_name
    },
    getUserInfo: function() {
      axios
        .get(this.GLOBAL.base_url + "/api/users/" + this.user.u_name)
        .then(response => {
          if (response.data) {
            this.user.u_id = response.data["u_id"];
            this.user.u_name = response.data["u_name"];
            this.user.u_email = response.data["u_email"];
            this.user.u_register_time = this.timeParse(
              response.data["u_register_time"]
            );
            axios
              .get(
                this.GLOBAL.base_url + "/api/article_history/user/" +
                  this.user.u_id
              )
              .then(response => {
                this.user_article_history = response.data;
                this.user_article_history.reverse();
                for (
                  var i = 0;
                  i <= this.user_article_history.length - 1;
                  i++
                ) {
                  this.user_article_history[i]["ah_edit_time"] = this.timeParse(
                    this.user_article_history[i]["ah_edit_time"]
                  );
                }
                // console.info(this.user_article_history);
              });
          }
        });
    },
    goHistoryPage: function(subject, title, ah_id) {
      this.$router.push({
        path: "/article/" + subject + "/" + title + "/history/" + ah_id
      });
    }
  }
};
</script>

<style>
</style>