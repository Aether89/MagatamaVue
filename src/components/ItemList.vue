<template>
  <v-card height="100%" width="200">
    <v-card-title class="bgHeader">Feeding Table {{ magtable }}</v-card-title>
      <v-list id="qtyActivator">

        <v-list-item v-for="(item, key) in items" :key="key" density="compact" nav>
          <v-btn block @click.exact="feedItem(key, this.quantity[key])" @click.shift.exact="showDialogForItem(key)"
            variant="tonal">
            {{ key }} {{ buttonQuantity(key) }}
            <v-tooltip v-if="tooltip" activator="parent" location="end">
              <ul class="attribute-list" v-for="(value, key) in item" :key="key">
                <li>{{ key }}: {{ value }}</li>
              </ul>
            </v-tooltip>
          </v-btn>
        </v-list-item>
      </v-list>

    <v-dialog v-model="showQuantityDialog" width="auto" @click:outside="closeDialogForItem">
      <v-card>
        <v-card-title>Quantity of {{ selectedKey }}</v-card-title>
        <v-card-text>
          <v-text-field v-model="this.quantity[selectedKey]" type="number" label="Qty" min="1" max="100"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="this.quantity[selectedKey] += 5">+5</v-btn>

          <v-btn color="primary" @click="this.quantity[selectedKey] += 20">+20</v-btn>
          <v-btn color="primary" @click="this.quantity[selectedKey] += 50">+50</v-btn>
          <v-spacer></v-spacer>

          <v-btn color="primary" @click="this.quantity[selectedKey] = 1">Reset</v-btn>
          <v-btn color="primary" @click="closeDialogForItem">Close Dialog</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-card>
</template>
<script>

import axios from 'axios';
import { useMagStore } from '../store/mag'
const mag = useMagStore();
import { useSettingStore } from '../store/settings'
const setting = useSettingStore();

export default {

  data() {
    return {
      showQuantityDialog: false,
      quantity: {},
      selectedKey: null,
      items: null
    }

  },
  methods: {
    async feedItem(item, quantity) {
      const timer = ms => new Promise(res => setTimeout(res, ms))
      for (let i = 0; i < quantity; i++) {
        mag.feedItem(this.items[item]);
        await timer(50);
      }
    },
    async loadData() {
      try {
        const response = await axios.get('src/data/FeedingTables/ep2/Table_' + this.magtable + '.json');
        this.items = response.data;

        for (let item in this.items) {
          if (!this.quantity[item] || this.quantity[item] < 1) {
            this.quantity[item] = 1;
          }
        }

      } catch (error) {
        console.error('Error loading JSON data:', error);
      }
    },
    showDialogForItem(key) {
      this.selectedKey = key;
      this.showQuantityDialog = true;
    },
    closeDialogForItem() {
      this.selectedKey = null;
      this.showQuantityDialog = false;
    },
  },
  computed: {
    magtable() {
      return mag.mag.table;
    },
    tooltip() {
      return setting.tooltip;
    },
    buttonQuantity(key) {
      return (key) => {
        const value = this.quantity[key];
        return value > 1 ? "(" + value + ")" : '';
      };
    }
  },
  watch: {
    magtable(newid, oldid) {
      this.loadData();
    }
  },
  created() {
    this.loadData();
  },
}
</script>
  
<style scoped>
.attribute-list {
  list-style-type: none;
  padding: 0;
}
</style>