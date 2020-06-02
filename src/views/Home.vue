<template>
  <div class="home">
    <h1>HomePage</h1>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  created(){
    this.goDirect()
  },
  methods: {
    goDirect: function() {
      this.$router.push({
        path: "/article/高等数学/极限"
      });
    }
  }
};
</script>
