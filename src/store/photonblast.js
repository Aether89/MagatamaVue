// store/photonblast.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const usePhotonBlastStore = defineStore('photonblast', {
  state: () => ({
    pb: [],
    loaded: false,
  }),
  actions: {
    async loadPB() {
      try {
        const response = await axios.get('src/data/PhotonBlast.json');
        this.pb = response.data;
        this.loaded = true; // Set loaded to true when data is successfully loaded
      } catch (error) {
        console.error('Error loading PhotonBlast.JSON data:', error);
      }
    },
    getName(id) {
      if (this.isPBLoaded) {
        return this.pb.find(item => item.id === id)?.name;
      }
      return null; // Or some default value when data is not loaded
    },
    getDesc(id) {
      if (this.isPBLoaded) {
        return this.pb.find(item => item.id === id)?.desc;
      }
      return null; // Or some default value when data is not loaded
    }
  },
  getters: {
    isPBLoaded() {
      return this.loaded;
    }
  }
});
