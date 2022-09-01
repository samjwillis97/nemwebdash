import { writable, derived } from 'svelte/store';
import { getUniqueItems, filterItems } from '../../common/filters';

export const generationUnits = writable([])

export const searchTerm = writable()
export const selectedGenerationRegions = writable([])
export const selectedGenerationFuelSources = writable([])
export const selectedGenerationTechnologyTypes = writable([])

export const selectedGeneratingUnitsNoRegions = writable([])
export const selectedGeneratingUnitsNoFuelSources = writable([])
export const selectedGeneratingUnitsNoTechnologyTypes = writable([])

export const unitsByGenerationRegionSelection = derived(
    [
        generationUnits,
        selectedGenerationRegions,
    ],
    ([
        $generationUnits,
        $selectedGenerationRegions,
    ]) => {
        if ($selectedGenerationRegions.length == 0) {
            return $generationUnits
        }
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
        if ($selectedGenerationFuelSources.length == 0) {
            return $generationUnits
        }
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
        if ($selectedGenerationTechnologyTypes.length == 0) {
            return $generationUnits
        }
        return filterItems(
            $generationUnits,
            $selectedGenerationTechnologyTypes,
            function(value) {return value.technology_type}
        )
    },
    []
)

export const unitsBySearchTerm = derived(
    [
        generationUnits,
        searchTerm,
    ],
    ([
        $generationUnits,
        $searchTerm,
    ]) => {
        if (!$searchTerm) return $generationUnits
        return filtered = $generationUnits.filter((v) => {
            return (
                v.duid.toUpperCase().match(search.toUpperCase()) != null
                || v.staion_name.toUpperCase().match(search.toUpperCase()) != null
                )
        })
    },
    []
)

export const selectedGeneratingUnits = derived(
    [
        unitsByGenerationRegionSelection,
        unitsByGenerationFuelSourceSelection,
        unitsByGenerationTechnologyTypeSelection,
        unitsBySearchTerm
    ],
    ([
        $unitsByGenerationRegionSelection,
        $unitsByGenerationFuelSourceSelection,
        $unitsByGenerationTechnologyTypeSelection,
        $unitsBySearchTerm
    ]) => {
        let selected = []
        let noRegions = []
        let noFuelSources = []
        let noTechnologyTypes = []


        if ($unitsBySearchTerm) {
            selected = $unitsBySearchTerm
            noRegions = $unitsBySearchTerm
            noFuelSources = $unitsBySearchTerm
            noTechnologyTypes = $unitsBySearchTerm
        }

        if ($unitsByGenerationRegionSelection.length > 0) {
            if (selected.length === 0) {
                selected = $unitsByGenerationRegionSelection
            } else {
                selected = selected.filter((value) => $unitsByGenerationRegionSelection.indexOf(value) != -1)
                noFuelSources = noFuelSources.filter((value) => $unitsByGenerationRegionSelection.indexOf(value) != -1)
                noTechnologyTypes = noTechnologyTypes.filter((value) => $unitsByGenerationRegionSelection.indexOf(value) != -1)
            }
        }

        if ($unitsByGenerationFuelSourceSelection.length > 0) {
            if (selected.length === 0) {
                selected = $unitsByGenerationFuelSourceSelection
                noRegions = $unitsByGenerationFuelSourceSelection
                noTechnologyTypes = $unitsByGenerationTechnologyTypeSelection
            } else {
                selected = selected.filter((value) => $unitsByGenerationFuelSourceSelection.indexOf(value) != -1)
                noRegions = noRegions.filter((value) => $unitsByGenerationFuelSourceSelection.indexOf(value) != -1)
                noTechnologyTypes = noTechnologyTypes.filter((value) => $unitsByGenerationFuelSourceSelection.indexOf(value) != -1)
            }
        }

        if ($unitsByGenerationTechnologyTypeSelection.length > 0) {
            if (selected.length === 0) {
                selected = $unitsByGenerationTechnologyTypeSelection
                noRegions = $unitsByGenerationTechnologyTypeSelection
            } else {
                selected = selected.filter((value) => $unitsByGenerationTechnologyTypeSelection.indexOf(value) != -1)
                noRegions = noRegions.filter((value) => $unitsByGenerationFuelSourceSelection.indexOf(value) != -1)
                noFuelSources = noFuelSources.filter((value) => $unitsByGenerationRegionSelection.indexOf(value) != -1)
            }
        }

        selectedGeneratingUnitsNoRegions.set(noRegions)
        selectedGeneratingUnitsNoFuelSources.set(noFuelSources)
        selectedGeneratingUnitsNoTechnologyTypes.set(noTechnologyTypes)

        return selected
    },
    []
)

export const generationRegions = derived(
    [
        generationUnits,
        selectedGeneratingUnitsNoRegions,
    ],
    ([
        $generationUnits,
        $selectedGeneratingUnitsNoRegions
    ]) => {
        if ($selectedGeneratingUnitsNoRegions.length > 0) {
            return getUniqueItems($selectedGeneratingUnitsNoRegions, function(value) {return value.region_id})
        } 
        return getUniqueItems($generationUnits, function(value) {return value.region_id})
    },
    []
)

export const generationFuelSources = derived(
    [
        generationUnits,
        selectedGeneratingUnitsNoFuelSources,
    ],
    ([
        $generationUnits,
        $selectedGeneratingUnitsNoFuelSources
    ]) => {
        if ($selectedGeneratingUnitsNoFuelSources.length > 0) {
            return getUniqueItems($selectedGeneratingUnitsNoFuelSources, function(value) {return value.fuel_source})
        } 
        return getUniqueItems($generationUnits, function(value) {return value.fuel_source})
    },
    []
)

export const generationTechnologyTypes= derived(
    [
        generationUnits,
        selectedGeneratingUnitsNoTechnologyTypes,
    ],
    ([
        $generationUnits,
        $selectedGeneratingUnitsNoTechnologyTypes
    ]) => {
        if ($selectedGeneratingUnitsNoTechnologyTypes.length > 0) {
            return getUniqueItems($selectedGeneratingUnitsNoTechnologyTypes, function(value) {return value.technology_type})
        } 
        return getUniqueItems($generationUnits, function(value) {return value.technology_type})
    },
    []
)

