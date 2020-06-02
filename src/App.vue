<template>
  <v-app>
    <v-content>
      <router-view v-if="isRouterAlive"></router-view>
      <footerDiv></footerDiv>
    </v-content>
  </v-app>
</template>

<script>
import footerDiv from "./components/Footer";

export default {
  name: "App",
  components: {
    footerDiv
  },
  provide() {
    return {
      reload: this.reload
    };
  },

  data: () => ({
    isRouterAlive: true
  }),

  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => (this.isRouterAlive = true));
    }
  }
};
</script>

<style type="text/css">
a {
  color: #3949ab !important;
}
a:hover {
  color: black !important;
}
</style>
