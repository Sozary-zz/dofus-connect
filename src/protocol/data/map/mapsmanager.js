import {
    existsAsync,
    mkdirRecursive,
    readFileAsync,
    writeFileAsync,
} from './../../../utils/fsasync'
import Map from "./map"
import axios from 'axios'
import Cell from "./cell"
import {
    remote
} from 'electron'
import {
    join
} from 'path'

export default class MapsManager {
    static async getMap(mapId, consts) {
        const filePath = await this.getFilePath(
            mapId,
            consts.assetsVersion
        )

        if (await existsAsync(filePath)) {

            const file = await readFileAsync(
                filePath
            )

            return this.buildMap(
                JSON.parse(file.toString())
            )
        }

        const response = await axios.get(
            consts.config.assetsUrl +
            '/maps/' +
            mapId +
            '.json'
        )


        const data = response.data

        await writeFileAsync(
            filePath,
            JSON.stringify(data)
        )

        return this.buildMap(data)
    }
    static async getFilePath(id, assetsVersion) {

        const folderPath = join(
            remote.app.getPath('userData'),
            'assets',
            assetsVersion,
            'maps'
        )

        if (!(await existsAsync(folderPath))) {
            mkdirRecursive(folderPath)
        }

        return join(folderPath, `${id}.json`)
    }
    static buildMap(json) {
        const map = new Map(
            json.id,
            json.topNeighbourId,
            json.bottomNeighbourId,
            json.leftNeighbourId,
            json.rightNeighbourId
        )

        for (const cell of json.cells) {
            map.cells.push(
                new Cell(
                    cell.l,
                    cell.f,
                    cell.c,
                    cell.s,
                    cell.z
                )
            )
        }

        for (const key in json.midgroundLayer) {
            if (
                json.midgroundLayer.hasOwnProperty(
                    key
                )
            ) {
                const values =
                    json.midgroundLayer[key]
                for (
                    let i = 0; i < values.length; i++
                ) {
                    values[i] = {
                        ...values[i],
                    }
                }
                map.midgroundLayer.set(
                    parseInt(key, 10),
                    values
                )
            }
        }

        map.atlasLayout.width =
            json.atlasLayout.width
        map.atlasLayout.height =
            json.atlasLayout.height
        for (const key in json.atlasLayout
                .graphicsPositions) {
            if (
                json.atlasLayout.graphicsPositions.hasOwnProperty(
                    key
                )
            ) {
                const gs =
                    json.atlasLayout
                    .graphicsPositions[key]
                map.atlasLayout.graphicsPositions.set(
                    parseInt(key, 10),
                    gs
                )
            }
        }

        return map
    }
}