<template>
    <v-card height="100%" :min-width="251">
        <v-sheet :color="classColour" class="d-flex justify-center crt" :max-width="251">
            <v-img :src="classimg"></v-img>
        </v-sheet>
        <v-sheet color="#293838" class="d-flex justify-center crt" :max-width="251" :max-height="251">
            <v-img :src="secimg" :max-width="128" aspect-ratio="1/1"></v-img>
        </v-sheet>
        
        <v-select v-if="classes" v-model="player.class" :items="classNames" label="Character Class" density="compact"></v-select>
        <v-text-field clearable label="Name" v-model="player.name" @blur="nameSecID" @keyup.enter="nameSecID" density="compact"></v-text-field>
        <v-select v-if="classes" v-model="player.secid" :items="secID" label="Section ID" density="compact"></v-select>
        <v-switch class="mx-2" v-model="locksecid" label="Lock Section ID" color="teal-darken-3"></v-switch>
    </v-card>
</template>
  
<script>
import { usePlayerStore } from '@/store/player';
import axios from 'axios';

export default {

    data() {
        return {
            bb: true,
            locksecid: false,
            classes: null,
            player: usePlayerStore(),
            sectionid: null
        }
    },
    methods: {
        async loadData() {
            try {
                let response = await axios.get('src/data/Class.json');
                this.classes = response.data;
                response = await axios.get('src/data/SectionID.json');
                this.sectionid = response.data;
            } catch (error) {
                console.error('Error loading JSON data:', error);
            }
        },
        nameSecID() {
            let tmpValue = 0;
                if (this.player.name !== null && !this.locksecid) {
                    [...this.player.name].forEach(char => {
                        tmpValue += (char.charCodeAt(0) % 10)
                    });
                    

                    if (this.bb) tmpValue += this.player.secidoffset;

                    tmpValue = tmpValue % 10;
                    console.log(tmpValue);
                    this.player.secid = this.sectionid.find(item => item.id === tmpValue)?.name || "";
                }
        }
    },
    computed: {
        classNames() {
            return this.classes ? this.classes.map(item => item.name) : [];
        },
        secID() {
            return this.sectionid ? this.sectionid.map(item => item.name) : [];
        },
        classimg() {

            if (this.player.class !== null) {
                return "src/assets/Class/" + this.player.class + ".webp";
            }
            return "src/assets/Class/blank.webp";
        },
        secimg() {

            if (this.player.secid !== null) {
                return "src/assets/SectionID/" + this.player.secid + ".webp";
            }
            return "src/assets/SectionID/blank.webp";
        },
        classColour() {
            switch (this.player.classgroup) {
                case "HU": return "deep-orange-darken-4";
                case "RA": return "green-darken-3";
                case "FO": return "indigo-lighten-1";
                default: return "grey-lighten-1";                 
            }
        }
    },
    watch: {
        'player.class': {
            handler(newClass, oldClass) {
                let tmpClass = null;
                if (this.player.class !== null) {
                    tmpClass = this.classes.find(item => item.name === this.player.class);
                    this.player.classgroup = tmpClass.group;
                    this.player.gender = tmpClass.gender;
                    this.player.secidoffset = tmpClass.secidoffset;

                    if (this.bb && !this.locksecid) this.nameSecID();
                }
            },
            deep: true,
        },
        'player.secid': {
            handler(newid, oldid) {
                let tmpSecID = null;
                if (this.player.secid !== null) {
                    tmpSecID = this.sectionid.find(item => item.name === this.player.secid);
                    this.player.secidgroup = tmpSecID.group;
                    this.player.fourthevo = tmpSecID.fourthevo;
                }
            },
            deep: true,
        },
    },
    created() {
        this.loadData();
    }
};
</script>