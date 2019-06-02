import CharacterStats from "./characterstats"
import Mount from "./mount/mount"
import Jobs from "./jobs/jobs"
import Inventory from './inventory/inventory'
import PlayerStatusEnum from './playerstatus'
import DataManager from "./../../protocol/data/data"
import PlayerLifeStatusEnum from './playerlifestatus'
import DataTypes from './../../protocol/data/datatypes'
export default class Character {
    constructor(account) {
        this.account = account
        this.id = 0
        this.stats = new CharacterStats()
        this.spells = []
        this.mount = new Mount(account)
        this.jobs = new Jobs(account)
        this.inventory = new Inventory(account)
    }
    getSkinUrl(
        mode,
        orientation,
        width,
        height,
        zoom
    ) {
        // let text = "http://staticns.ankama.com/dofus/renderer/look/7";
        let text =
            "https://s.ankama.com/www/static.ankama.com/dofus/renderer/look/7";
        text += "b3";
        let num = 0;
        if (!this.look) {
            return "";
        }
        const array = `${this.look.bonesId}`.split("");
        const array2 = array;
        for (const c of array2) {
            const num2 = num;
            num = num2 + 1;
            text += `${c}`;
            const flag = num >= array.length;
            if (flag) {
                text += "7";
            } else {
                text += "3";
            }
        }
        let num3 = 0;
        let num4 = 0;
        for (const current of this.look.skins) {
            let num2 = num3;
            num3 = num2 + 1;
            text += "c3";
            const array3 = `${current}`.split("");
            const array4 = array3;
            for (const c2 of array4) {
                num2 = num4;
                num4 = num2 + 1;
                text += `${c2}`;
                const flag2 = num4 >= array3.length && num3 < this.look.skins.length;
                if (flag2) {
                    text += "2";
                    num4 = 0;
                } else {
                    const flag3 = num4 < array3.length && num3 <= this.look.skins.length;
                    if (flag3) {
                        text += "3";
                    }
                }
            }
            const flag4 = num3 >= this.look.skins.length;
            if (flag4) {
                text += "7";
            }
        }
        let num5 = 0;
        for (const current2 of this.look.indexedColors) {
            let num2 = num5;
            num5 = num2 + 1;
            text = text.concat("c3", `${num5}`, "3d3");
            num4 = 0;
            const array5 = `${current2}`.split("");
            const array6 = array5;
            for (const c3 of array6) {
                num2 = num4;
                num4 = num2 + 1;
                text += `${c3}`;
                const flag5 =
                    num4 >= array5.length && num5 < this.look.indexedColors.length;
                if (flag5) {
                    text += "2";
                    num4 = 0;
                } else {
                    const flag6 =
                        num4 < array5.length && num5 <= this.look.indexedColors.length;
                    if (flag6) {
                        text += "3";
                    }
                }
            }
            const flag7 = num5 >= this.look.indexedColors.length;
            if (flag7) {
                text += "7";
            }
        }
        let num6 = 0;
        for (const current3 of this.look.scales) {
            let num2 = num6;
            num6 = num2 + 1;
            text += "c3";
            num4 = 0;
            const array7 = `${current3}`.split("");
            const array8 = array7;
            for (const c4 of array8) {
                num2 = num4;
                num4 = num2 + 1;
                text += `${c4}`;
                const flag8 = num4 >= array7.length && num6 < this.look.scales.length;
                if (flag8) {
                    text += "2";
                    num4 = 0;
                } else {
                    const flag9 = num4 < array7.length && num6 <= this.look.scales.length;
                    if (flag9) {
                        text += "3";
                    }
                }
            }
            const flag10 = num6 >= this.look.scales.length;
            if (flag10) {
                text += "7";
            }
        }
        text = text.concat(
            "d/",
            mode,
            "/",
            `${orientation}`,
            "/",
            `${width}`,
            "_",
            `${height}`,
            "-",
            `${zoom}`,
            ".png"
        );
        return text;
    }

    async UpdateCharacterSelectedSuccessMessage(
        message
    ) {
        this.id = message.infos.id
        this.name = message.infos.name
        this.level = message.infos.level
        this.breed = message.infos.breed
        this.sex = message.infos.sex
        this.look = message.infos.entityLook
        this.skinUrl = this.getSkinUrl(
            'full',
            1,
            128,
            256,
            0
        )
        const breedResponse = await DataManager.get(
            DataTypes.Breeds,
            this.account.constConfig.appVersion,
            message.infos.breed
        )
        this.breedData = breedResponse[0]
        this.status =
            PlayerStatusEnum.PLAYER_STATUS_AVAILABLE
        this.lifeStatus =
            PlayerLifeStatusEnum.STATUS_ALIVE_AND_KICKING

        await this.account.config.load()
        await this.account.stats.load()
        await this.account.extensions.fights.config.load()

        this.account.stats.connected = true

        this.isSelected = true
    }
}