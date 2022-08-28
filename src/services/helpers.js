import {
    defaultEndDate,
    defaultStartDate,
    defaultAggregateFn,
    defaultWindowNumber,
    defaultWindowSelection,
} from './config.js';

export function setupDefaultConfig(config) {
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
    config.endDate = endDate
    config.startDate = startDate
    config.windowNumber = windowNumber
    config.windowSelection = windowSelection
    config.aggregateFn = aggregateFn

    return config
}
