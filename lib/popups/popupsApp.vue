<template>
  <div id="app">
    <popups-nav></popups-nav>
  </div>
</template>

<script>
import PopupsNav from './components/PopupsNav'

export default {
  name: 'popups-app',
  components: {
    PopupsNav
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
