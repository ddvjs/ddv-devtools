<template>
  <div class="popups-nav-box">
    <a :href="optionsUrl" target="_blank">选项</a>
  </div>
</template>

<script>
export default {
  name: 'PopupsNav',
  data () {
    var rootUrl
    rootUrl = chrome.extension.getURL('')
    rootUrl += rootUrl.charAt(rootUrl.length-1)==='/' ? '' : '/'
    return {
      rootUrl
    }
  },
  computed: {
    optionsUrl() {
      return this.rootUrl + 'index.html#/options'
    }
  }
}
</script>

<style scoped>
.popups-nav-box{
  width: 100%;
  height: 34px;
  background-color: #f0f0f0;
  padding: 20px 13px;
  /* display: -webkit-flex; */
  /* align-items: center; */
  box-sizing: border-box;
}
</style>
