<template>
  <div>
    <!-- 底部信息栏-->
    <v-footer dark absolute padless>
      {{ new Date().getFullYear() }} —
      <strong>LichWiki</strong>
    </v-footer>
  </div>
</template>

<script>
export default {
  name: 'footerDiv'
}
</script>