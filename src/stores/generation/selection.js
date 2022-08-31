import { writable, derived } from 'svelte/store';
import { generationUnits } from './unit';
import { filterItems } from '../../common/filters';

export const searchTerm = writable()
export const selectedGenerationRegions = writable([])
export const selectedGenerationFuelSources = writable([])
export const selectedGenerationTechnologyTypes = writable([])

// TODO: Move this to the other file and all similar I think.. Maybe just all in one file for a bit
export const unitsByGenerationRegionSelection = derived(
    [
        generationUnits,
        selectedGenerationRegions,
    ],
    ([
        $generationUnits,
        $selectedGenerationRegions,
    ]) => {
        return filterItems(
            $generationUnits,
            $selectedGenerationRegions,
            function(value) {return value.region_id}
        )
    },
    []
)

export const unitsByGenerationFuelSourceSelection = derived(
    [
        generationUnits,
        selectedGenerationFuelSources,
    ],
    ([
        $generationUnits,
        $selectedGenerationFuelSources,
    ]) => {
        return filterItems(
            $generationUnits,
            $selectedGenerationFuelSources,
            function(value) {return value.fuel_source}
        )
    },
    []
)

export const unitsByGenerationTechnologyTypeSelection = derived(
    [
        generationUnits,
        selectedGenerationTechnologyTypes,
    ],
    ([
        $generationUnits,
        $selectedGenerationTechnologyTypes,
    ]) => {
        return filterItems(
            $generationUnits,
            $selectedGenerationTechnologyTypes,
            function(value) {return value.technology_type}
        )
    },
    []
)

export const selectedGeneratingUnits = derived(
    [
        unitsByGenerationRegionSelection,
        unitsByGenerationFuelSourceSelection,
        unitsByGenerationTechnologyTypeSelection,
    ],
    ([
        $unitsByGenerationRegionSelection,
        $unitsByGenerationFuelSourceSelection,
        $unitsByGenerationTechnologyTypeSelection,
    ]) => {
        let selected = []
        if ($unitsByGenerationRegionSelection.length > 0) {
            selected = $unitsByGenerationRegionSelection
        }

        if ($unitsByGenerationFuelSourceSelection.length > 0) {
            if (selected.length === 0) {
                selected = $unitsByGenerationFuelSourceSelection
            } else {
                selected = selected.filter((value) => {
                    return $unitsByGenerationFuelSourceSelection.indexOf(value) != -1
                })
            }
        }

        if ($unitsByGenerationTechnologyTypeSelection.length > 0) {
            if (selected.length === 0) {
                selected = $unitsByGenerationTechnologyTypeSelection
            } else {
                selected = selected.filter((value) => {
                    return $unitsByGenerationTechnologyTypeSelection.indexOf(value) != -1
                })
            }
        }
        return selected
    },
    []
)

