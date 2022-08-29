import { baseURL } from "./config"
import { units } from "../stores/unit";

export async function getAllUnits() {
    await fetch(baseURL + '/units', {
        mode: 'cors',
    }).then(function (a) {
        return a.json()
    }).then(function (json) {
        units.set(json)
    })
}
