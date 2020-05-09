<template>
  <div><navbar></navbar>WTF</div>
</template>

<script>
import navbar from '../components/Navbar'
  export default {
    inject: ["reload"],
    components:{
      navbar
    },
    props: {
      source: String,
    },
  }
</script>