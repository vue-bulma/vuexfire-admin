<template>
  <div>
    <div class="block">
      <label class="label">Title</label>
      <p class="control">
        <input v-model="title" @keyup="setNewNote({title,newNoteContents})" class="input is-large" type="text" placeholder="Add a title to your note">
      </p>
      <label class="label">Note</label>
      <div>
        <!-- <textarea v-model="text" @keyup="setNewNote({title,text})" class="textarea" placeholder="Type your note"></textarea> -->

        <quill ref="qc" :options="{ theme: 'snow' }">
        </quill>
      </div>
      <br >
      <p class="control">
        <button class="button is-default" @click="convertDelta()">Preview</button>
        <button class="button is-primary" @click="addNote()">Submit</button>
        <button class="button is-link" @click="clear()">Cancel</button>
      </p>
    </div>
    <div v-if="preview === true" v-show="title" class="block">
      <hr />
      <p><strong>Preview</strong></p>
      <div class="box content">
        <p v-if="title" class="title is-1">{{ title }}</p>
        <div v-if="newNoteContents" >
        <div v-html="newNoteContents"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Quill from 'vue-bulma-quill'
import QuillDeltaToHtmlConverter from 'quill-delta-to-html'
import { mapActions, mapGetters } from 'vuex'

export default {
  props: ['preview'],
  data () {
    return {
      title: '',
      text: ' '
    }
  },
  components: {
    Quill
  },
  methods: {
    clear () {
      this.title = ''
    },
    convertDelta () {
      var deltaOps = this.delta

      var cfg = {}

      var converter = new QuillDeltaToHtmlConverter(deltaOps, cfg)

      var html = converter.convert()

      this.setNoteContents(html)
    },
    ...mapActions([
      'setNewNote',
      'addNote',
      'setNoteContents'
    ])
  },
  computed: {
    'delta': function () {
      // return this.$refs.qc.editor.getContents().ops
      return this.$refs.qc.editor.getContents().ops
    },
    ...mapGetters({
      newNote: 'newNote',
      newNoteContents: 'newNoteContents'
    })
  }
}
</script>

<style lang="styl">
@import "~quill/assets/snow"
@import "~quill/assets/bubble"

</style>
