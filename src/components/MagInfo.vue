<template>
  <v-card :width="251" class="ma-1" height="100%">
    <v-card-title class="bgHeader">{{ info.mag.name }}
</v-card-title>
<v-sheet color="#04604e" class="d-flex justify-center crt">
            <ttimg :img="magimg" size="64" :text="info.mag.name"></ttimg>
        </v-sheet>
    <v-divider />

    <v-card-item>
      <v-row class="d-flex">
        <v-col cols="3"><v-label class="text-right">Level</v-label></v-col>
        <v-col cols="1"><v-label class="text-right">{{ info.level }}</v-label></v-col>
      </v-row>
      <v-row class="d-flex">
        <v-col cols="3"><v-label class="text-right">SYNC</v-label></v-col>
        <v-col cols="1"><v-label class="text-right">{{ info.mag.Sync }}</v-label></v-col>
      </v-row>
      <v-row class="d-flex">
        <v-col cols="3"><v-label class="text-right">IQ</v-label></v-col>
        <v-col cols="1"><v-label class="text-right">{{ info.mag.IQ }}</v-label></v-col>
      </v-row>
    </v-card-item>

    <v-divider></v-divider>
    <v-card-item v-for="(stat, key) in info.mag.Stats" :key="key">
      <mag-stat :info ="{ stat, key }"></mag-stat>
    </v-card-item>
    
    <v-divider></v-divider>
    <triggerlist :trigger="info.mag.triggers"></triggerlist>
    <v-divider></v-divider>
    <pbinfo :pbid="info.mag.PhotonBlast"></pbinfo>
  </v-card>
</template>
  
<script>
import { useMagStore } from '../store/mag'
import { useSettingStore } from '../store/settings'
import pbinfo from '../components/PhotonBlastInfo.vue';
import triggerlist from '../components/TriggersList.vue';
import ttimg from '../components/tt-img.vue';
import MagStat from '../components/MagStat.vue';

const setting = useSettingStore();

export default {
  components: {
    pbinfo,
    triggerlist,
    ttimg,
    MagStat
  },
  data() {
    return {
      info: useMagStore(),
    }

  },
  computed: {
    tooltip() {
      return setting.tooltip;
    },
    magimg() {
      if (this.info.mag.id !== null) {
        return "src/assets/Mag/" + this.info.mag.id + ".webp";
      }
      return "src/assets/Mag/0.png";
    },
    magPB() {
      
    }
  },  
}
</script>