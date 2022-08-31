import { writable, derived } from 'svelte/store';
import { getUniqueItems } from '../../common/filters';
import { selectedGeneratingUnits } from './selection';

export const generationUnits = writable([])

export const generationRegions = derived(
    [
        generationUnits,
        selectedGeneratingUnits,
    ],
    ([
        $generationUnits,
        $selectedGeneratingUnits
    ]) => {
        if ($selectedGeneratingUnits.length > 0) {
            return getUniqueItems($selectedGeneratingUnits, function(value) {return value.region_id})
        } 
        return getUniqueItems($generationUnits, function(value) {return value.region_id})
    },
    []
)

export const generationFuelSources = derived(
    generationUnits,
    $generationUnits => getUniqueItems($generationUnits, function(value) {return value.fuel_source}),
    []
)

export const generationTechnologyTypes= derived(
    generationUnits,
    $generationUnits => getUniqueItems($generationUnits, function(value) {return value.technology_type}),
    []
)
