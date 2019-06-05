<template>
    <div class="page-container">
        <div class="spinner" v-if="loading">
            <transition name="fade">
                <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
            </transition>
        </div>
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
                        <md-button>Menu</md-button>
                    </span>
                </md-list-item>
            </md-app-drawer>

            <md-app-content>
                <transition name="fade" mode="out-in">
                    <md-tabs>
                        <md-tab id="tab-connect" md-label="Connection">
                            <Connection @connect_account="connect_account"></Connection>
                        </md-tab>
                        <md-tab id="tab-map" md-label="Map" exact>
                            <MapViewer></MapViewer>
                        </md-tab>
                        <md-tab id="tab-settings" md-label="Settings">
                            <Settings></Settings>
                        </md-tab>
                    </md-tabs>
                </transition>
            </md-app-content>
        </md-app>
    </div>
</template>

<script>
import MenuIcon from "vue-material-design-icons/Menu.vue";
import GameConst from "./../connection/gameConst.js";
import Account from "./../account/account.js";
import Frames from "./../frames/frames";
import Settings from "./Settings";
import MapViewer from "./MapViewer";
import Connection from "./Connection";

import { networkInterfaces } from "os";
export default {
    name: "Index",
    components: {
        MenuIcon,
        Settings,
        MapViewer,
        Connection
    },
    data() {
        return {
            connectionPromptActive: false,
            menuVisible: false,
            loading: false,
            frames: null,
            account: null,
            config: null
        };
    },
    methods: {
        connect_account: async function(accountConfig) {
            this.loading = true;
            this.account = new Account(
                [
                    {
                        username: accountConfig.username,
                        password: accountConfig.password,
                        server: accountConfig.server,
                        character: accountConfig.character
                    }
                ],
                this.config,
                this.frames
            );

            await this.account.connect();
            this.loading = false;
        }
    },
    async mounted() {
        this.config = await new GameConst().init(); // on charge les constantes

        this.frames = new Frames(this.config);
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
.spinner {
    position: absolute;
    z-index: 2;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid rgb(56, 56, 56);
    background-color: rgb(66, 66, 66);
    box-shadow: 0 0 10px rgb(48, 48, 48);
    padding: 20px;
    border-radius: 100%;
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.fade-leave,
.fade-enter-to {
    opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 300ms;
}
</style>