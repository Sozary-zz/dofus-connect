<template>
    <div class="page-container">
        <md-app md-mode="fixed">
            <md-app-toolbar class="md-primary">
                <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
                    <menu-icon/>
                </md-button>
                <span class="md-title">Connect</span>
            </md-app-toolbar>

            <md-app-drawer :md-active.sync="menuVisible">
                <md-toolbar class="md-transparent" md-elevation="0">Menu</md-toolbar>

                <md-list-item>
                    <span class="md-list-item-text">
                        <md-button
                            to="/components/tabs"
                            @click="connectionPromptActive = true"
                        >Connexion</md-button>
                    </span>
                </md-list-item>
            </md-app-drawer>

            <md-app-content>code</md-app-content>
        </md-app>
    </div>
</template>

<script>
import MenuIcon from "vue-material-design-icons/Menu.vue";
import GameConst from "./../connection/gameConst.js";
import Account from "./../account/account.js";
import Frames from "./../frames/frames";
import { networkInterfaces } from "os";
export default {
    name: "Index",
    components: {
        MenuIcon
    },
    data() {
        return {
            connectionPromptActive: false,
            menuVisible: false
        };
    },
    async mounted() {
        let consts = new GameConst();
        let frames = null;
        let account = null;
        let config = null;

        config = await consts.init(); // on charge les constantes

        frames = new Frames(config);

        account = new Account(
            [
                {
                    username: "krapastagnette",
                    password: "krapazor84",
                    server: "Herdegrize",
                    other: "prout"
                }
            ],
            config,
            frames
        );

        await account.connect();
    }
};
</script>

<style lang="scss" scoped>
.md-list-item {
    list-style-type: none;
}

.md-app-content {
    height: 100vh;
}
</style>