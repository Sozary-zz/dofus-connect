<template>
    <div class="page-container">
        <md-app md-mode="fixed">
            <md-app-toolbar class="md-primary">
                <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
                    <menu-icon />
                </md-button>
                <span class="md-title">Dofus Connect</span>
            </md-app-toolbar>

            <md-app-drawer :md-active.sync="menuVisible">
                <md-toolbar class="md-transparent" md-elevation="0">Menu</md-toolbar>

                <md-list-item>
                    <face-icon />
                    <span class="md-list-item-text">Connection de compte</span>

                </md-list-item>

            </md-app-drawer>


            <md-app-content></md-app-content>
        </md-app>
    </div>
</template>

<script>
    import MenuIcon from 'vue-material-design-icons/Menu.vue'
    import FaceIcon from 'vue-material-design-icons/Face.vue'

    export default {
        name: "Index",
        components: {
            MenuIcon,
            FaceIcon
        },
        data() {
            return {
                menuVisible: false
            };
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

    .md-app-drawer {
        height: 50vh;
    }
</style>