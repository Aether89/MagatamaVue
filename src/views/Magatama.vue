<template>


  <v-sheet color="transparent" class="ma-8 d-flex">
    <v-navigation-drawer expand-on-hover rail color="teal-darken-2">
    <v-list>
      <v-list-item prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg" title="Aether89"
        subtitle="me@aether89.com"></v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      
      <v-list-item  prepend-icon="mdi-cog" title="Settings" value="settings">
        
      </v-list-item>
      <v-list-item prepend-icon="mdi-content-save" title="Save" value="save"></v-list-item>
    </v-list>
  </v-navigation-drawer>
    <player-info class="ma-1"></player-info>
    <mag-info class="ma-1"></mag-info>
    <item-list class="ma-1"></item-list>
    <v-switch v-model="setting.tooltip" label="Toggle Tooltips"></v-switch>
  </v-sheet>
</template>

<script>
import ItemList from '../components/ItemList.vue'
import MagInfo from '../components/MagInfo.vue'
import PlayerInfo from '../components/PlayerInfo.vue'
import { useSettingStore } from '../store/settings'

export default {
  components: {
    ItemList,
    PlayerInfo,
    MagInfo,
  },
  data() {
    return {
      setting: useSettingStore(),
    }
  },
  methods: {
    saveData() {
      const jsonData = JSON.stringify(this.mag, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'mydata.json';
      link.click();
    },  
  },
}
</script>

<style>
.attribute-list {
  list-style-type: none;
  padding: 0;
}

.bgHeader {
  background-color: #26A69A;
}

.bgLightHeader {
  background-color: #4DB6AC;
}

.crt {
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%);
  z-index: 2;
  background-size: 100% 4px, 2px 100%;
}
</style>