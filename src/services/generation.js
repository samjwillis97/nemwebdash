import { loading } from '../stores/state.js'
import { baseURL } from './config.js';
import { setupDefaultConfig } from './helpers.js';

export async function getUnitGenerationData(
    config,
    units,
    regions,
    fuels,
    techs,
) {

    config = setupDefaultConfig(config)

    let query = (
        '?range.start=' + config.startDate.toISOString()
        + '&range.end=' + config.endDate.toISOString()
        + '&aggregate.every=' + config.windowNumber + config.windowSelection
        + '&aggregate.fn=' + config.aggregateFn
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

export async function getGroupedGenerationData(
    config,
    regions,
    groupByRegion,
    fuels,
    groupByFuel,
    techs,
    groupByTech,
) {
    config = setupDefaultConfig(config)

    let query = (
        '?range.start=' + config.startDate.toISOString()
        + '&range.end=' + config.endDate.toISOString()
        + '&aggregate.every=' + config.windowNumber + config.windowSelection
        + '&aggregate.fn=' + config.aggregateFn 
    )

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
    if (groupByRegion) {
        query += '&group.eq=region'
    }
    if (groupByFuel) {
        query += '&group.eq=fuel'
    }
    if (groupByTech) {
        query += '&group.eq=technology'
    }

    loading.set(true)

    const data = await fetch(baseURL + '/data/generation/grouped' + query, {
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
