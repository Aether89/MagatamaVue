// Utilities
import { defineStore } from 'pinia';
import axios from 'axios';

export const usePlayerStore = defineStore('player', {
    state: () => ({
        "name": null,
        "namevalue": null,
        "class": "FOmar",
        "classgroup": "FO",
        "gender": "M",
        "secidoffset": 5,
        "secid": "Pinkal",
        "secidgroup": "B",
        "fourthevo": "C"
    }),
    getters: {
    },
    actions: {
    },
});