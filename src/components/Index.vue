<template>
    <div class="page-container">
        <md-app md-mode="fixed">
            <md-app-toolbar class="md-primary">
                <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
                    <menu-icon />
                </md-button>
                <span class="md-title">Connect</span>
            </md-app-toolbar>

            <md-app-drawer :md-active.sync="menuVisible">
                <md-toolbar class="md-transparent" md-elevation="0">Menu</md-toolbar>

                <md-list-item>
                    <span class="md-list-item-text">
                        <md-button to="/components/tabs" @click="connectionPromptActive = true">Connexion</md-button>
                    </span>
                </md-list-item>
            </md-app-drawer>

            <md-app-content>
                code
            </md-app-content>
        </md-app>
    </div>
</template>

<script>
    import MenuIcon from "vue-material-design-icons/Menu.vue";
    import HaapiConnection from "./../connection/haapi.js"
    import Kernel from "./../connection/kernel.js"
    import Network from "./../connection/network.js"
    import randomString from "./../utils/random.js"
    import {
        networkInterfaces
    } from 'os';
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
            let kernel = new Kernel()
            let haapi_connect
            let network

            await kernel.main()
            haapi_connect = new HaapiConnection("krapastagnette", "krapazor84", "hezerd", "prout", kernel.getData())
            await haapi_connect.start()
            network = new Network(kernel.getData())
            network.connect(randomString(16))
        },
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