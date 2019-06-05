<template>
    <form @submit.prevent="connectAccount">
        <md-card class="md-layout-item md-size-50 md-small-size-100">
            <md-card-header>
                <div class="md-title">Account</div>
            </md-card-header>
            <md-card-content>
                <div class="md-layout md-gutter">
                    <div class="md-layout-item md-small-size-100">
                        <md-field>
                            <label for="username">Username</label>
                            <md-input name="username" id="username" v-model="account.username"/>
                        </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100">
                        <md-field>
                            <label for="password">Password</label>
                            <md-input
                                name="password"
                                id="password"
                                type="password"
                                v-model="account.password"
                            />
                        </md-field>
                    </div>
                </div>

                <div class="md-layout md-gutter">
                    <div class="md-layout-item md-small-size-100">
                        <md-field>
                            <label for="gender">Server</label>
                            <md-select name="server" id="server" v-model="account.server" md-dense>
                                <md-option></md-option>
                                <md-option value="Herdegrize">Herdegrize</md-option>
                            </md-select>
                        </md-field>
                    </div>

                    <div class="md-layout-item md-small-size-100">
                        <md-field>
                            <label for="character">Character name</label>
                            <md-input name="character" id="character" v-model="account.character"/>
                        </md-field>
                    </div>
                </div>
            </md-card-content>
            <md-card-actions>
                <md-button @click="sendDefault()" class="md-default">Default account</md-button>
                <md-button type="submit" class="md-primary">Connect this account</md-button>
            </md-card-actions>
        </md-card>
    </form>
</template>

<script>
export default {
    data() {
        return {
            account: {}
        };
    },
    methods: {
        connectAccount: function() {
            this.$emit("connect_account", this.account);
        },
        sendDefault: function() {
            this.account = {
                username: "krapastagnette",
                password: "krapazor84",
                server: "Herdegrize",
                character: "Dark-aro"
            };
        }
    },
    mounted() {}
};
</script>