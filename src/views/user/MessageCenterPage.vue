<template>
  <div>
    <navbar ref="navbar"></navbar>
    <v-container fluid>
      <v-tabs background-color="gray" class="elevation-2" dark>
        <v-tab>全部消息</v-tab>
        <v-tab>
          <v-badge
            :value="Boolean(unread_notification_amount)"
            :content="unread_notification_amount"
            :key="change"
            color="blue"
            overlap
            small
          >未读消息</v-badge>
        </v-tab>
        <v-tab>已读消息</v-tab>
        <v-tab-item>
          <div :key="loaddata">
            <div v-for="(items,key) in all_notifications" :key="key">
              <v-subheader>{{ key }}</v-subheader>
              <v-expansion-panels multiple popout hover>
                <v-expansion-panel v-for="(item,key) in items" :key="key">
                  <v-expansion-panel-header
                    @click="readNotification(item.n_id);item.n_has_read = true"
                  >
                    <span :class="{strong:!item.n_has_read}" :key="change">{{item.n_title}}</span>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-subheader>来自 {{item.n_sender_user_name}} - {{ item.n_create_time }}</v-subheader>
                    <vue-showdown :markdown="item.n_text" vueTemplate emoji></vue-showdown>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </div>
        </v-tab-item>
        <v-tab-item>
          <div :key="loaddata">
            <div v-for="(items,key) in unread_notifications" :key="key">
              <v-subheader>{{ key }}</v-subheader>
              <v-expansion-panels multiple popout hover>
                <v-expansion-panel v-for="(item,key) in items" :key="key">
                  <v-expansion-panel-header
                    @click="readNotification(item.n_id);item.n_has_read = true"
                  >
                    <span :class="{strong:!item.n_has_read}" :key="change">{{item.n_title}}</span>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-subheader>来自 {{item.n_sender_user_name}} - {{ item.n_create_time }}</v-subheader>
                    <vue-showdown :markdown="item.n_text" vueTemplate emoji></vue-showdown>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </div>
        </v-tab-item>

        <v-tab-item>
          <div :key="loaddata">
            <div v-for="(items,key) in has_read_notifications" :key="key">
              <v-subheader>{{ key }}</v-subheader>
              <v-expansion-panels multiple popout hover>
                <v-expansion-panel v-for="(item,key) in items" :key="key">
                  <v-expansion-panel-header
                    @click="readNotification(item.n_id);item.n_has_read = true"
                  >
                    <span :class="{strong:!item.n_has_read}" :key="change">{{item.n_title}}</span>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-subheader>来自 {{item.n_sender_user_name}} - {{ item.n_create_time }}</v-subheader>
                    <vue-showdown :markdown="item.n_text" vueTemplate emoji></vue-showdown>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </div>
        </v-tab-item>
      </v-tabs>
    </v-container>
  </div>
</template>

<script>
import navbar from "../../components/Navbar";
import axios from "axios";
import { VueShowdown } from "vue-showdown";
export default {
  components: {
    navbar,
    "vue-showdown": VueShowdown
  },
  data: () => ({
    loaddata: false,
    change: false,
    unread_notification_amount: 0,
    user: {},
    all_notifications: {},
    unread_notifications: {},
    has_read_notifications: {}
  }),
  created() {
    this.getSessionInfo();
    this.updateUnreadNotificationsAmount()
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
    getSessionInfo: function() {
      // 预处理，获取session信息，登录相关
      if (sessionStorage.getItem("is_login")) {
        this.user.is_login = sessionStorage.getItem("is_login");
        this.user.u_email = sessionStorage.getItem("u_email");
        this.user.u_id = sessionStorage.getItem("u_id");
        this.user.u_name = sessionStorage.getItem("u_name");
        this.user.u_register_time = sessionStorage.getItem("u_register_time");
        this.getNotifications();
      }
    },
    updateUnreadNotificationsAmount: function() {
      axios
        .get(
          this.GLOBAL.base_url + "/api/notifications/user/" +
            this.user.u_name +
            "/amount"
        )
        .then(response => {
          this.unread_notification_amount = response.data
          this.$refs.navbar.unread_notification_amount = response.data;
        });
    },
    readNotification: function(n_id) {
      axios
        .get(this.GLOBAL.base_url + "/api/notifications/id/" + n_id)
        .then(response => {
          console.info(response);
          this.updateUnreadNotificationsAmount();
          this.change = !this.change;
        });
    },
    getNotifications: function() {
      axios
        .get(this.GLOBAL.base_url + "/api/notifications/user/" + this.user.u_name)
        .then(response => {
          /*
          {
              "2020年5月10日":[
                {
                  "n_create_time":"2020-05-29T14:07:28.391588+08:00",
                  "n_has_read":false,
                  "n_id":4,
                  "n_receiver_user_id":1,
                  "n_receiver_user_id":1,
                  "n_title":"asd"
                },
              ],
              "2020年5月11日":[
                {
                  "n_create_time":"2020-05-29T14:07:28.391588+08:00",
                  "n_has_read":false,
                  "n_id":4,
                  "n_receiver_user_id":1,
                  "n_receiver_user_id":1,
                  "n_title":"asd"
                },
              ]
          }
          */
          if (response.data) {
            var notifications = response.data;
            notifications.reverse();
            //info(notifications);
            // 转化时间格式
            for (var item in notifications) {
              notifications[item].n_create_time = this.timeParse(
                notifications[item].n_create_time
              );
              if (
                this.all_notifications[
                  notifications[item].n_create_time.split(" ")[0]
                ] != null
              ) {
                this.all_notifications[
                  notifications[item].n_create_time.split(" ")[0]
                ].push(notifications[item]);
              } else {
                this.all_notifications[
                  notifications[item].n_create_time.split(" ")[0]
                ] = new Array();
                this.all_notifications[
                  notifications[item].n_create_time.split(" ")[0]
                ].push(notifications[item]);
              }

              if (notifications[item].n_has_read == false) {
                if (
                  this.unread_notifications[
                    notifications[item].n_create_time.split(" ")[0]
                  ] != null
                ) {
                  this.unread_notifications[
                    notifications[item].n_create_time.split(" ")[0]
                  ].push(notifications[item]);
                } else {
                  this.unread_notifications[
                    notifications[item].n_create_time.split(" ")[0]
                  ] = new Array();
                  this.unread_notifications[
                    notifications[item].n_create_time.split(" ")[0]
                  ].push(notifications[item]);
                }
              } else {
                if (
                  this.has_read_notifications[
                    notifications[item].n_create_time.split(" ")[0]
                  ] != null
                ) {
                  this.has_read_notifications[
                    notifications[item].n_create_time.split(" ")[0]
                  ].push(notifications[item]);
                } else {
                  this.has_read_notifications[
                    notifications[item].n_create_time.split(" ")[0]
                  ] = new Array();
                  this.has_read_notifications[
                    notifications[item].n_create_time.split(" ")[0]
                  ].push(notifications[item]);
                }
              }
            }
            //console.info(this.all_notifications);
            //console.info(this.has_read_notifications);
            //console.info(this.unread_notifications);
            this.loaddata = true;
          }
        });
    }
  }
};
</script>

<style>
.strong {
  font-weight: bold;
}
</style>