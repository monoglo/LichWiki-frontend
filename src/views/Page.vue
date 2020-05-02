<template>
  <v-app id="inspire">
    <div id="navbar">
      <!-- 左侧边栏（词条侧边栏）-->
      <v-navigation-drawer v-model="drawer" app temporary>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title">{{ article.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ article.category }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list dense>
          <v-list-item link>
            <v-list-item-action>
              <v-icon>mdi-code-json</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>查看源代码</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link>
            <v-list-item-action>
              <v-icon>mdi-file-document-edit-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>编辑词条</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link>
            <v-list-item-action>
              <v-icon>mdi-history</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>词条修改历史</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link>
            <v-list-item-action>
              <v-icon>mdi-book-plus-multiple-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>新建词条</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <!-- 右侧边栏（用户侧边栏）-->
      <v-navigation-drawer v-model="userdrawer" app temporary right>
        <template v-slot:prepend>
          <v-list-item two-line>
            <v-list-item-avatar>
              <img src="https://randomuser.me/api/portraits/women/81.jpg" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>Jane Smith</v-list-item-title>
              <v-list-item-subtitle>Logged In</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>

        <v-divider></v-divider>

        <v-list dense>
          <v-list-item v-for="item in items" :key="item.title" link>
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <template v-slot:append>
          <div class="pa-2">
            <v-btn block>Logout</v-btn>
          </div>
        </template>
      </v-navigation-drawer>
      <!-- 顶部导航栏-->
      <v-app-bar app dark hide-on-scroll>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        <v-toolbar-title>LichWiki 大学维基</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-text-field
          class="d-none d-sm-flex"
          flat
          hide-details
          label="在该学科分类下查找"
          prepend-inner-icon="mdi-layers-search"
          solo-inverted
          dense
          clearable
          filled
          rounded
        ></v-text-field>

        <v-btn icon>
          <v-icon @click.stop="userdrawer = !userdrawer">mdi-account-circle</v-icon>
        </v-btn>
      </v-app-bar>
    </div>
    <!-- 主体内容区块-->
    <v-content style="padding: 0px 0px 0px;">
      <v-container fluid>
        <v-row>
          <v-col cols="12" sm="9" md="9" lg="9" xl="9">
            <v-tabs v-model="tab" background-color="gray" class="elevation-2" dark>
              <v-tab :href="tab_article">页面</v-tab>
              <v-tab :href="tab_issue">讨论</v-tab>
              <v-tab-item :value="tab_article">
                <v-card flat tile outlined style="padding: 0px 0px 0px 10px;">
                  <v-card-title class="display-2">{{ article.title }}</v-card-title>
                  <v-card-subtitle class="pb-0">Paradox 于3天前 修改了 此页面</v-card-subtitle>
                  <v-divider></v-divider>
                  <!-- <v-banner single-line><v-avatar slot="icon" color="blue lighten-1" size="40"><v-icon icon="mdi-tag-faces" color="white">mdi-tag-faces</v-icon></v-avatar>这篇文章需要改进。你可以帮助维基来编辑它。</v-banner> -->
                  <div v-html="article.banner"></div>
                  <v-card-text class="text--primary">
                    <span v-html="article.text"></span>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item :value="tab_issue"></v-tab-item>
            </v-tabs>
          </v-col>
          <v-col>
            <div class="d-none d-sm-flex">
              <v-sheet class="elevation-2" style="width:100%;">
                <v-toolbar dark>
                  <v-toolbar-title>{{ article.title }}</v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-simple-table>
                  <tbody>
                    <tr>
                      <td>中文名</td>
                      <td>极限</td>
                    </tr>
                    <tr>
                      <td>英文名</td>
                      <td>Limit</td>
                    </tr>
                    <tr>
                      <td>应用领域</td>
                      <td>微积分</td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-sheet>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
    <!-- 底部信息栏-->
    <v-footer dark absolute padless>
      {{ new Date().getFullYear() }} —
      <strong>Vuetify</strong>
    </v-footer>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  props: {
    source: String
  },

  data: () => ({
    drawer: false,
    userdrawer: false,
    // 词条信息
    article: {
      title: null,
      text: null,
      category: "高等数学",
      create_time: null,
      banner: '<div class="v-banner v-sheet v-sheet--tile theme--light v-banner--has-icon v-banner--is-mobile v-banner--single-line"><div class="v-banner__wrapper"><div class="v-banner__content"><div class="v-avatar v-banner__icon" style="height: 40px; min-width: 40px; width: 40px;"><div class="v-avatar blue lighten-1" style="height: 40px; min-width: 40px; width: 40px;"><i aria-hidden="true" icon="mdi-tag-faces" class="v-icon notranslate mdi mdi-tag-faces theme--light white--text"></i></div></div><div class="v-banner__text">这篇文章需要改进。你可以帮助维基来编辑它。</div></div></div></div>'
    },
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
    this.getArticleInfo();
  },
  methods: {
    getArticleInfo: function() {
      axios
        .get(
          "http://127.0.0.1:8000/api/articles/%E9%AB%98%E7%AD%89%E6%95%B0%E5%AD%A6/%E6%9E%81%E9%99%90"
        )
        .then(res => {
          console.log(res.data);
          this.article.title = res.data['a_title']
          this.article.text = res.data['a_text']
        });
    }
  }
};
</script>