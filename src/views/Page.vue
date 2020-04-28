<template>
  <v-app id="inspire">
    <!-- 左侧边栏（词条侧边栏）-->
    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">极限</v-list-item-title>
          <v-list-item-subtitle>高等数学</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-contact-mail</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Contact</v-list-item-title>
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
    <v-app-bar
      app
      dark
      hide-on-scroll
    >
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
        <v-icon @click.stop="userdrawer = !userdrawer">mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>
      <!-- 主体内容区块-->
      <v-content id="scrolling-techniques-6" class="overflow-y-auto" max-height="600">
        <v-container class="fill-height" style="height: 1000px;" fluid>
          <v-row align="center" justify="center">
            <v-col class="text-center">
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <v-btn :href="source" icon large target="_blank" v-on="on">
                    <v-icon large>mdi-code-tags</v-icon>
                  </v-btn>
                </template>
                <span>Source</span>
              </v-tooltip>

              <v-tooltip right>
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    large
                    href="https://codepen.io/johnjleider/pen/zgxeLQ"
                    target="_blank"
                    v-on="on"
                  >
                    <v-icon large>mdi-codepen</v-icon>
                  </v-btn>
                </template>
                <span>Codepen</span>
              </v-tooltip>
            </v-col>
          </v-row>
          
        </v-container>
      </v-content>
    <!-- 底部信息栏-->
    <v-footer dark absolute padless>
        {{ new Date().getFullYear() }} — <strong>Vuetify</strong>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  props: {
    source: String
  },

  data: () => ({
    drawer: false,
    userdrawer: false,
    items: [
      { title: "Home", icon: "mdi-home-city" },
      { title: "My Account", icon: "mdi-account" },
      { title: "Users", icon: "mdi-account-group-outline" }
    ]
  })
};
</script>