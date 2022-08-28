import { loading } from '../stores/state.js'
import {
    defaultEndDate,
    defaultStartDate,
    defaultAggregateFn,
    defaultWindowNumber,
    defaultWindowSelection,
    baseURL,
} from './config.js';

export async function getUnitGenerationData(
    config,
    units,
    regions,
    fuels,
    techs
) {

    let endDate = defaultEndDate
    let startDate = defaultStartDate
    let windowNumber = defaultWindowNumber
    let windowSelection = defaultWindowSelection
    let aggregateFn = defaultAggregateFn

    if (config) {
        if (config.endDate) {
            endDate = config.endDate
        }
        if (config.startDate) {
            startDate = config.startDate
        }
        if (config.windowNumber) {
            windowNumber = config.windowNumber
        }
        if (config.windowSelection) {
            windowSelection = config.windowSelection
        }
        if (config.aggregateFn) {
            aggregateFn = config.aggregateFn
        }
    }

    let query = (
        '?range.start=' + startDate.toISOString()
        + '&range.end=' + endDate.toISOString()
        + '&aggregate.every=' + windowNumber + windowSelection
        + '&aggregate.fn=' + aggregateFn
    )

    if (units && units.length > 0 ) {
        let toPlot = units.map((v) => {
            return v.duid
        })
        // Generate Units
        query += '&duid=' + toPlot.join('&duid=')
    } else {
        // Base just off the filters
        if (regions && regions.length > 0) {
            regions.forEach((region) => {
                query += '&region_id.eq=' + region
            })
        }
        if (fuels && fuels.length > 0) {
            fuels.forEach((fuel) => {
                query += '&fuel_source.eq=' + fuel
            })
        }
        if (techs && techs.length > 0) {
            techs.forEach((tech) => {
                query += '&technology_type.eq=' + tech
            })
        }
    }

    loading.set(true)


    const data = await fetch(baseURL + '/data/generation' + query, {
        mode: 'cors',
    }).then(function(a) {
        return a.json();
    }).catch((e) => {
        console.log(e)
        loading.set(false)
    })

    loading.set(false)

    return data
}
