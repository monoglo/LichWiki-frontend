<template>
  <v-app>
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
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    drawer: false,
    userdrawer: false,
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