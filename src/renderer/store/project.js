import { ipcRenderer } from 'electron'
import { addFile, unlinkFile, changeFile, addDirectory, unlinkDirectory } from './treeCtrl'

const width = localStorage.getItem('side-bar-width')
const sideBarWidth = typeof +width === 'number' ? Math.max(+width, 180) : 280

const state = {
  sideBarWidth,
  activeId: null,
  clipboard: null,
  projectTree: null
}

const getters = {
  fileList: state => {
    const files = []
    const travel = folder => {
      files.push(...folder.files.filter(f => f.isMarkdown))
      for (const childFolder of folder.folders) {
        travel(childFolder)
      }
    }

    if (state.projectTree) travel(state.projectTree)
    return files.sort()
  }
}

const mutations = {
  SET_PROJECT_TREE (state, { pathname, name }) {
    state.projectTree = {
      pathname,
      name,
      isDirctory: true,
      isFile: false,
      isMarkdown: false,
      folders: [],
      files: []
    }
  },
  SET_SIDE_BAR_WIDTH (state, width) {
    localStorage.setItem('side-bar-width', Math.max(+width, 180))
    state.sideBarWidth = width
  },
  ADD_FILE (state, change) {
    const { projectTree } = state
    addFile(projectTree, change)
  },
  UNLINK_FILE (state, change) {
    const { projectTree } = state
    unlinkFile(projectTree, change)
  },
  CHANGE_FILE (state, change) {
    const { projectTree } = state
    changeFile(projectTree, change)
  },
  ADD_DIRECTORY (state, change) {
    const { projectTree } = state
    addDirectory(projectTree, change)
  },
  UNLINK_DIRECTORY (state, change) {
    const { projectTree } = state
    unlinkDirectory(projectTree, change)
  },
  SET_ACTIVE_ID (state, id) {
    state.activeId = id
  },
  SET_CLIPBOARD (state, data) {
    state.clipboard = data
  }
}

const actions = {
  LISTEN_FOR_LOAD_PROJECT ({ commit, dispatch }) {
    ipcRenderer.on('AGANI::open-project', (e, { pathname, name }) => {
      commit('SET_PROJECT_TREE', { pathname, name })
      commit('SET_LAYOUT', {
        rightColumn: 'files',
        showToolBar: true,
        showTabBar: false
      })
      dispatch('SET_LAYOUT_MENU_ITEM')
    })
  },
  LISTEN_FOR_UPDATE_PROJECT ({ commit }) {
    ipcRenderer.on('AGANI::update-object-tree', (e, { type, change }) => {
      switch (type) {
        case 'add':
          commit('ADD_FILE', change)
          break
        case 'unlink':
          commit('UNLINK_FILE', change)
          break
        case 'change':
          console.log(change)
          commit('CHANGE_FILE', change)
          break
        case 'addDir':
          commit('ADD_DIRECTORY', change)
          break
        case 'unlinkDir':
          commit('UNLINK_DIRECTORY', change)
          break
        default:
          if (process.env.NODE_ENV === 'development') {
            console.log('unknown directory watch type')
          }
          break
      }
    })
  },
  CHANGE_SIDE_BAR_WIDTH ({ commit }, width) {
    commit('SET_SIDE_BAR_WIDTH', width)
  },
  CHANGE_ACTIVE_ID ({ commit }, id) {
    commit('SET_ACTIVE_ID', id)
  },
  CHANGE_CLIPBOARD ({ commit }, data) {
    commit('SET_CLIPBOARD', data)
  },
  ASK_FOR_OPEN_PROJECT ({ commit }) {
    ipcRenderer.send('AGANI::ask-for-open-project-in-sidebar')
  }
}

export default { state, getters, mutations, actions }
