<template>
    <div class="editor-with-tabs">
      <tabs v-show="showTabBar"></tabs>
      <editor
        :theme="theme"
        :markdown="markdown"
        :cursor="cursor"
      ></editor>
      <source-code
        v-if="sourceCode"
        :theme="theme"
        :markdown="markdown"
        :cursor="cursor"
      ></source-code>
    </div>
</template>

<script>
  import Tabs from './tabs.vue'
  import Editor from './editor.vue'
  import SourceCode from './sourceCode.vue'

  export default {
    props: {
      theme: {
        type: String,
        required: true
      },
      markdown: {
        type: String,
        required: true
      },
      cursor: {
        validator (value) {
          return typeof value === 'object'
        },
        required: true
      },
      sourceCode: {
        type: Boolean,
        required: true
      },
      showTabBar: {
        type: Boolean,
        required: true
      }
    },
    components: {
      Tabs,
      Editor,
      SourceCode
    }
  }
</script>

<style scoped>
  .editor-with-tabs {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 22px);
    overflow: hidden;
  }
</style>
