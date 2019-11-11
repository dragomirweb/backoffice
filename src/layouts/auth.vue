<template>
  <q-layout>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
export default {
  name: 'LayoutAuth',
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
    .q-layout {
        background-color: black
    }
</style>
