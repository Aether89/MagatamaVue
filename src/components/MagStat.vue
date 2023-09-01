<template>
        <v-row class="d-flex">
          <v-col cols="3"><v-label>{{ info.key }}</v-label></v-col>
          <v-col cols="2"><v-label class="text- ">{{ info.stat.value }}
        <v-tooltip activator="parent" location="end">{{ statPlayer }}</v-tooltip>
        </v-label></v-col>
          <v-col class="align-custom">
            <v-tooltip activator="parent" location="end">
              <ul class="attribute-list">
                <li>{{ info.stat.progress }}</li>
              </ul>
            </v-tooltip>
            <v-progress-linear :color="info.stat.color" v-model="info.stat.progress" :height="10"></v-progress-linear></v-col>
        </v-row>
  </template>
    
  <script>
  
  export default {
    props: ['info'],
    data() {
      return {
      }
  
    },
    computed: {
      statPlayer() {
        
        const { key, stat } = this.info;
      switch (key) {
        case "DEF":
          return stat.value + " DFP";
        case "POW":
          return stat.value * 2 + " ATP";
        case "DEX":
          return stat.value * 0.5 + " ATA";
        case "MIND":
          return stat.value * 2 + " MST";
        default:
          return stat.value + " " + key;

        }
      },
    },  
  }
  </script>