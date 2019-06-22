<template>
    <div id="map-tab">
        <canvas id="map"></canvas>

        <div v-if=" config!=null && map!=null">
            <img :src="config.config.assetsUrl+'/backgrounds/'+map.id+'.jpg'" alt="yo">
        </div>
    </div>
</template>

<script>
    import MapViewer from "./tabs/map/mapviewer.js"
    import Consts from "./../core/constList.js"
    export default {
        data() {
            return {
                map: null,
                config: null,
                canvas: null,
                tile_size: 30,
            }
        },
        props: ["loadedMap", "loadedConfig"],
        watch: {
            loadedMap: function (val) {
                this.map = val
            },
            loadedConfig: function (val) {
                this.config = val
            }
        },
        methods: {
            drawIsometricMap: function (c) {
                for (let x = 0; x < Consts.MAP_WIDTH; x++) {
                    for (let y = 0; y < Consts.MAP_HEIGHT; y++) {
                        this.drawIsometricTile(x * this.tile_size + this.canvas.width / 2, y * this.tile_size, c)
                    }
                }
            },
            cartesianToIso: function (position) {
                return {
                    x: position.x - position.y,
                    y: (position.x + position.y) / 2
                }
            },
            drawIsometricTile: function (x, y, c) {
                var positions = [
                    this.cartesianToIso({
                        x: x,
                        y: y
                    }),
                    this.cartesianToIso({
                        x: x + this.tile_size,
                        y: y
                    }),
                    this.cartesianToIso({
                        x: x + this.tile_size,
                        y: y + this.tile_size
                    }),
                    this.cartesianToIso({
                        x: x,
                        y: y + this.tile_size
                    }),
                ]
                c.beginPath()
                c.moveTo(positions[0].x, positions[0].y)
                for (let i = 1; i < positions.length; i++)
                    c.lineTo(positions[i].x, positions[i].y)
                c.stroke()

            }
        },
        mounted() {
            this.canvas = document.querySelector("#map")
            this.canvas.height = window.innerHeight
            this.canvas.width = window.innerWidth

            this.drawIsometricMap(this.canvas.getContext("2d"))


        },

    }
</script>

<style lang="scss" scoped>
    #map-tab {

        padding-bottom: 20px;

        #map {
            border: 1px solid rgba(0, 0, 0, .5);
            box-shadow: 0 0 10px rgba(0, 0, 0, .3);
            border-radius: 10px;
        }
    }
</style>