<template>
    <v-card-item>
        <v-row class="d-flex">
            <v-col cols="5"><v-label class="text-right">Activation: </v-label></v-col>
            <v-col cols="1"><v-label class="text-right">{{ trigger.activation }}%</v-label></v-col>
        </v-row>

        <v-label>Triggers:</v-label>

        <v-row class="d-flex">
            <v-col cols="4"><v-label class="text-right">PB Full: </v-label></v-col>
            <v-col cols="4"><v-label class="text-right">10% HP: </v-label></v-col>
            <v-col cols="4"><v-label class="text-right">Boss: </v-label></v-col>
        </v-row>
        <v-row class="d-flex">
            <v-col cols="4">
                <ttimg :img="imgTrigger(trigger.pbfilled[0])" size="30" :text="triggerPB"></ttimg>
            </v-col>
            <v-col cols="4">
                <ttimg :img="imgTrigger(trigger.lowhp[0])" size="30" :text="triggerLowHP"></ttimg>
            </v-col>
            <v-col cols="4">
                <ttimg :img="imgTrigger(trigger.boss[0])" size="30" :text="triggerBoss"></ttimg>
            </v-col>
        </v-row>

        <v-row class="d-flex text-center">
            <v-col cols="4">
                {{ signPBfilled }}
            </v-col>
            <v-col cols="4">
                {{ signLowHP }}
            </v-col>
            <v-col cols="4">
                {{ signBoss }}
            </v-col>
        </v-row>

        <v-row class="d-flex">
            <v-col cols="5"><v-label class="text-right">Death: </v-label></v-col>
            <v-col cols="1"><v-label class="text-right">{{ triggerDeath }}</v-label></v-col>
        </v-row>

    </v-card-item>
</template>
  
<script>
import axios from 'axios';
import ttimg from '../components/tt-img.vue';
export default {
    props: ['trigger'],
    components: {
        ttimg,
    },

    data() {
        return {
            triggerData: null
        };
    },
    methods: {
        async loadTrigger(file) {
            try {
                const response = await axios.get('src/data/ActivationTrigger.json');
                this.triggerData = response.data;

            } catch (error) {
                console.error('Error loading ActivationTrigger.JSON data:', error);
            }
        },
        imgTrigger(id) {
            if (id !== null && id !== undefined) {
                return "src/assets/Triggers/" + id + ".webp";
            }
            return "src/assets/Triggers/0.webp";
        }
    },
    computed: {
        triggerPB() {

            if (this.triggerData !== null) {
                return this.triggerData.find(item => item.id === this.trigger.pbfilled[0])?.name;
            } else {
                return null;
            }

        },
        triggerLowHP() {
            if (this.triggerData !== null) {
                return this.triggerData.find(item => item.id === this.trigger.lowhp[0])?.name;
            } else {
                return null;
            }
        },
        triggerBoss() {
            if (this.triggerData !== null) {
                return this.triggerData.find(item => item.id === this.trigger.boss[0])?.name;
            } else {
                return null;
            }
        },
        signPBfilled() {
            return (this.trigger.pbfilled[1] > 0)? "+" : (this.trigger.pbfilled[1] < 0)? "-" : null;
        },
        signLowHP() {
            return (this.trigger.lowhp[1] > 0)? "+" : (this.trigger.lowhp[1] < 0)? "-" : null;
        },
        signBoss() {
            return (this.trigger.boss[1] > 0)? "+" : (this.trigger.boss[1] < 0)? "-" : null;
        },
        triggerDeath() {
            if (this.triggerData !== null) {
                return this.triggerData.find(item => item.id === this.trigger.death)?.name;
            } else {
                return null;
            }
        }
    },
    created() {
        this.loadTrigger();
    }
}
</script>