<template>
  <v-app>
    <v-content>
      <router-view v-if="isRouterAlive"></router-view>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  provide(){
    return {
      reload:this.reload
    }
  },
  
  data: () => ({
    isRouterAlive: true
  }),

  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(() => (this.isRouterAlive = true))
    }
  }
};
</script>
