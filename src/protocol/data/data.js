import {
    remote
} from 'electron'
import {
    join
} from 'path'
import dataUrl from "./../../core/constList"
import DataTypes from './datatypes'
import {
    existsAsync,
    mkdirRecursive,
    readFileAsync,
    writeFileAsync,
} from './../../utils/fsasync'

const axios = require('axios')
export default class DataManager {
    static async get(
        type,
        assetsVersion,
        ...ids
    ) {
        const myArray = []
        const newIds = []
        for (const id of ids) {
            const filePath = await DataManager.getFilePath(
                DataManager.getDataFromType(type),
                assetsVersion,
                id
            )


            if (await existsAsync(filePath)) {
                const file = await readFileAsync(
                    filePath,
                    'utf8'
                )
                myArray.push(JSON.parse(file))
            } else {
                newIds.push(id)
            }
        }
        if (
            newIds.length === 0 &&
            ids.length > 0
        ) {
            return myArray
        }
        const params = {
            lang: 'fr',
            v: assetsVersion,
        }
        const response = await axios.post(
            `${dataUrl.constant_main_uri}/data/map?lang=${
                params.lang
            }&v=${params.v}`, {
                class: DataManager.getDataFromType(type),
                ids: newIds,
            }
        )

        for (const item of Object.values(response.data)) {
            myArray.push(item)

            const filePath = await DataManager.getFilePath(
                DataManager.getDataFromType(type),
                assetsVersion,
                item.id
            )
            await writeFileAsync(
                filePath,
                JSON.stringify(item)
            )
        }

        return myArray
    }
    static getDataFromType(type) {
        for (let data of Object.entries(
                DataTypes
            ))
            if (data[1] == type) return data[0]
        return undefined
    }

    static async getFilePath(
        type,
        assetsVersion,
        id
    ) {

        const folderPath = join(
            remote.app.getPath('userData'),
            'assets',
            assetsVersion,
            'data',
            'fr',
            type
        )

        if (!(await existsAsync(folderPath))) {

            mkdirRecursive(folderPath)
        }

        return join(folderPath, `${id}.json`)
    }
}