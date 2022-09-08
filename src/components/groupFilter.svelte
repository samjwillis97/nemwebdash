<script>
    import Checkbox from '../components/checkbox.svelte';
    import MultiFilter from '../components/multiFilter.svelte';
    import { 
        generationRegions,
        generationFuelSources,
        generationTechnologyTypes,
        selectedGenerationRegions,
        selectedGenerationFuelSources,
        selectedGenerationTechnologyTypes,
        regionGroupingSelected,
        fuelSourceGroupingSelected,
        technologyTypesGroupingSelected,
    } from '../stores/generation/unit.js';


    let regions = []
    let regionSelection = []
    generationRegions.subscribe((value) => {regions = value})
    selectedGenerationRegions.subscribe((value) => {regionSelection = value})
    function onRegionSelection() {selectedGenerationRegions.set(regionSelection)}

    let fuelSources = []
    let fuelSourceSelection = []
    generationFuelSources.subscribe((value) => {fuelSources = value})
    selectedGenerationFuelSources.subscribe((value) => {fuelSourceSelection = value})
    function onFuelSourceSelection() {selectedGenerationFuelSources.set(fuelSourceSelection)}


    let technologyTypes = []
    let technologyTypeSelection = []
    generationTechnologyTypes.subscribe((value) => {technologyTypes = value})
    selectedGenerationTechnologyTypes.subscribe((value) => {technologyTypeSelection = value})
    function onTechnologyTypeSelection() {selectedGenerationTechnologyTypes.set(technologyTypeSelection)}
</script>

<!-- <div style="display:block; width:100%; height:450px;"> -->
<div style="display:block;" class="w-full h-full"> 
    <div class="w-full pb-1 pt-2">Group By</div>
    <div class="flex flex-wrap px-2 pb-2 pt-1">
        <Checkbox  bind:checked={$regionGroupingSelected} text="Region"></Checkbox>
        <Checkbox  bind:checked={$technologyTypesGroupingSelected} text="Technology Type"></Checkbox>
        <Checkbox  bind:checked={$fuelSourceGroupingSelected} text="Fuel Source"></Checkbox>
    </div>
    <!-- Filters -->
    <div class="w-full pb-1 pt-2">Filters</div>
    <!-- Region -->
    <div class="px-2 py-0.5">
        <MultiFilter bind:items={regions} placeholder="Region" bind:selected={regionSelection} callback={onRegionSelection}></MultiFilter>
    </div>
    <!-- Technology Type -->
    <div class="px-2 py-0.5">
        <MultiFilter items={technologyTypes} placeholder="Technology Type" bind:selected={technologyTypeSelection} callback={onTechnologyTypeSelection}></MultiFilter>
    </div>
    <!-- Fuel Sources-->
    <div class="px-2 py-0.5">
        <MultiFilter items={fuelSources} placeholder="Fuel Source" bind:selected={fuelSourceSelection} callback={onFuelSourceSelection}></MultiFilter>
    </div>
</div>

<style>
</style>

