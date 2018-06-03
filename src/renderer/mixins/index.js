import { getFileStateFromData } from '../store/help.js'
import { message } from '../notice'

export const tabsMixins = {
  methods: {
    selectFile (file) {
      if (file.id !== this.currentFile.id) {
        this.$store.dispatch('UPDATE_CURRENT_FILE', file)
      }
    },
    removeFileInTab (file) {
      const { isSaved } = file
      if (isSaved) {
        this.$store.dispatch('REMOVE_FILE_IN_TABS', file)
      } else {
        // todo
      }
    }
  }
}

export const fileMixins = {
  methods: {
    handleFileClick () {
      const { data, isMarkdown, pathname, id } = this.file
      if (!isMarkdown || this.currentFile.pathname === pathname) return
      const { isMixed, filename, lineEnding } = data
      const isOpened = this.tabs.filter(file => file.pathname === pathname)[0]
      console.log(isOpened)
      const fileState = isOpened || getFileStateFromData(id, data)

      this.$store.dispatch('UPDATE_CURRENT_FILE', fileState)

      if (isMixed && !isOpened) {
        message(`${filename} has mixed line endings which are automatically normalized to ${lineEnding.toUpperCase()}.`, 20000)
      }
    }
  }
}
