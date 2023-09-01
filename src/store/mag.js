// Utilities
import { defineStore } from 'pinia';
import { usePlayerStore } from '@/store/player';
const player = usePlayerStore();
import axios from 'axios';

export const useMagStore = defineStore('mag', {
  state: () => ({
    allMag: [],
    mag: {
      id: 0,
      name: "Mag",
      stage: 0,
      Sync: 0,
      IQ: 10,
      table: 0,
      PhotonBlast: [],
      Stats: {
        DEF: {
          value: 5,
          progress: 0,
          color: "blue-darken-2",
        },
        POW: {
          value: 0,
          progress: 0,
          color: "red-darken-2",
        },
        DEX: {
          value: 0,
          progress: 0,
          color: "yellow-darken-2",
        },
        MIND: {
          value: 0,
          progress: 0,
          color: "green-darken-2",
        },
      },
      triggers: {
        activation: 0,
        pbfilled: 0,
        lowhp: 0,
        boss: 0,
        death: 0
      }
    }
  }),
  getters: {
    level: (state) => Object.values(state.mag.Stats).reduce((sum, stat) => sum + stat.value, 0),
  },
  actions: {
    feed(input, value) {
      let stat = this.mag.Stats[input];
      let tmpValue = stat.progress + value;
      if (tmpValue >= 100) {
        stat.progress = tmpValue % 100;
        stat.value += Math.floor(tmpValue / 100);
      } else if (tmpValue < 0) {
        stat.progress = 0;
      } else {
        stat.progress = Math.max(tmpValue, 0);
      }
    },
    feedSyncIQ(input, value, max) {
      let tmpValue = this.mag[input] + value;

      if (value > 0 && tmpValue > max) {
        tmpValue = max;
      } else if (value < 0 && tmpValue < 0) {
        tmpValue = 0;
      }

      this.mag[input] = tmpValue

    },
    feedItem(item) {
      this.feedSyncIQ("IQ", item.IQ, 200);
      this.feedSyncIQ("Sync", item.Sync, 120);
      this.feed("DEF", item.DEF);
      this.feed("POW", item.POW);
      this.feed("DEX", item.DEX);
      this.feed("MIND", item.MIND);
      (this.mag.stage < 4) ? this.evoCheck() : null;
    },
    async loadMags() {
      try {
        const response = await axios.get('src/data/mag.json');
        this.allMag = response.data;

      } catch (error) {
        console.error('Error loading mag.JSON data:', error);
      }
    },
    async loadEvoList(file) {
      try {
        const response = await axios.get('src/data/Evolutions/stage_' + file + '.json');
        return response.data;

      } catch (error) {
        console.error('Error loading mag.JSON data:', error);
      }
    },
    evoCheck() {
      let evolutionOccurred = false;

      if (this.mag.stage == 3 && this.level >= 100 && this.level % 10 === 0) {
        evolutionOccurred = this.stage4Evo();
      }

      if (!evolutionOccurred && (this.mag.stage == 2 || this.mag.stage == 3) && this.level >= 50 && this.level % 5 === 0) {
        this.stage3Evo();
        evolutionOccurred = true;
      }

      if (!evolutionOccurred && this.mag.stage == 0 && this.level >= 10) {
        this.stage1Evo();
        evolutionOccurred = true;
      }

      if (!evolutionOccurred && this.mag.stage == 1 && this.level >= 35) {
        this.stage2Evo();
      }
    },
    async evolve(id) {
      await this.loadMags();
      const evo = await this.allMag.find(item => item.id === id);
      this.mag.id = evo.id;
      this.mag.name = evo.name;
      this.mag.table = evo.table;
      this.mag.stage = evo.stage;

      this.mag.triggers.activation = evo.activation;
      this.mag.triggers.pbfilled = evo.pbfilled;
      this.mag.triggers.lowhp = evo.lowhp;
      this.mag.triggers.boss = evo.boss;
      this.mag.triggers.death = evo.death;

      if (evo.PhotonBlast !== 0 && this.mag.PhotonBlast.length < 3) {
        if (!this.mag.PhotonBlast.includes(evo.pb)) {
          this.mag.PhotonBlast.push(evo.pb)
        }
      }

    },
    async stage1Evo() {
      const classGroup = player.classgroup;
      const evo = await this.loadEvoList(1);
      this.evolve(evo[classGroup]);
    },
    async stage2Evo() {
      const classGroup = this.stage2Class();
      const evo = await this.loadEvoList(2);
      const POW = this.mag.Stats.POW.value;
      const DEX = this.mag.Stats.DEX.value;
      const MIND = this.mag.Stats.MIND.value;

      const statEvo = this.findStatEvo2(POW, DEX, MIND);
      this.evolve(evo[classGroup][statEvo]);

    },
    stage2Class() {
      switch (this.mag.id) {
        case 1:
          return "HU";
        case 2:
          return "RA";
        case 3:
          return "FO";
        default:
          return player.classgroup;
      }
    },
    async stage3Evo() {
      const evo = await this.loadEvoList(3);
      const classGroup = player.classgroup;
      const secId = player.secidgroup;
      const POW = this.mag.Stats.POW.value;
      const DEX = this.mag.Stats.DEX.value;
      const MIND = this.mag.Stats.MIND.value;

      let statEvo = "";

      if (classGroup === "FO" && this.mag.Stats.DEF.value >= 45) {
        statEvo = "DEF" + this.findStatEvo2(POW, DEX, MIND);
      } else {
        statEvo = this.findStatEvo3(POW, DEX, MIND);
      }
      this.evolve(evo[classGroup][secId][statEvo]);
    },
    async stage4Evo() {
      const evo = await this.loadEvoList(4);
      const classGroup = player.classgroup;
      const gender = player.gender;
      const fourthEvo = player.fourthevo;

      const DEF = this.mag.Stats.DEF.value;
      const POW = this.mag.Stats.POW.value;
      const DEX = this.mag.Stats.DEX.value;
      const MIND = this.mag.Stats.MIND.value;

      const statEvo = fourthEvo === "A" && DEF + DEX === POW + MIND
        ? "DEFDEX-POWMIND"
        : fourthEvo === "B" && DEF + MIND === POW + DEX
          ? "DEFMIND-POWDEX"
          : fourthEvo === "C" && DEF + POW === DEX + MIND
            ? "DEFPOW-DEXMIND"
            : "";

      if (statEvo !== "") {
        this.evolve(evo[classGroup][gender][statEvo])
        return true;
      }
      return false;
    },
    findStatEvo2(POW, DEX, MIND) {
      if (POW > DEX && POW > MIND) {
        return "POW";
      } else if (DEX > POW && DEX > MIND) {
        return "DEX";
      } else if (MIND > POW && MIND > DEX) {
        return "MIND";
      } else {
        switch (player.classgroup) {
          case "HU":
            return "POW";
          case "RA":
            return "DEX";
          case "FO":
            return "MIND";
          default:
            return "POW";
        }
      }
    },
    findStatEvo3(POW, DEX, MIND) {
      const primaryStat = this.findStatEvo2(POW, DEX, MIND);

      switch (primaryStat) {
        case "POW":
          return (DEX >= MIND) ? "POWDEXMIND" : "POWMINDDEX";
        case "DEX":
          return (MIND >= POW) ? "DEXMINDPOW" : "DEXPOWMIND";
        case "MIND":
          return (POW >= DEX) ? "MINDPOWDEX" : "MINDDEXPOW";
        default: // to use if there a Tie         
          return (DEX >= MIND) ? "POWDEXMIND" : "POWMINDDEX";
      }
    },
  }
});