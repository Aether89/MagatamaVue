<template>
    <v-sheet class="ma-4 pbbg">
      <v-row>
        <v-col cols="4">
          <ttimg :img="pbimg(2)" size="54" :title="pbname(2)" :text="pbdesc(2)"></ttimg>            
          </v-col>
          <v-col cols="4 mt-8">
            <ttimg :img="pbimg(0)" size="54" :title="pbname(0)" :text="pbdesc(0)"></ttimg>            
          </v-col>
          <v-col cols="4">
            <ttimg :img="pbimg(1)" size="54" :title="pbname(1)" :text="pbdesc(1)"></ttimg>            
          </v-col>

      </v-row>
    </v-sheet>
</template>
  
<script>

import { usePhotonBlastStore } from '../store/photonblast';
const pb = usePhotonBlastStore();
import ttimg from '../components/tt-img.vue';

export default {
  props: ['pbid'],
  components: {
    ttimg,
  },
  data() {
    return {};
  },
  methods: {
    pbimg(num) {
      if (this.pbid !== null) {
        return "src/assets/PhotonBlast/" + this.pbid[num] + ".webp";
      }
      return "src/assets/PhotonBlast/0.webp";
    },
    pbname(num) {
      if (pb.isPBLoaded) {
        return pb.getName(this.pbid[num]);
      } else {
        return null;
      }
    },
    pbdesc(num) {
      if (pb.isPBLoaded) {
        return pb.getDesc(this.pbid[num]);
      } else {
        return null;
      }
    }
  },
  created() {
    pb.loadPB();
  }
};
</script>

<style scoped>
.pbbg {
  background-color: transparent;
}
</style>
