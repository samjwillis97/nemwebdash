<script>
    import MultiFilter from '../components/multiFilter.svelte';
    import List from '../components/list.svelte';
    import Textfield from '../components/textfield.svelte';
    import { 
        generationRegions,
        generationFuelSources,
        generationTechnologyTypes,
        selectedGenerationRegions,
        selectedGenerationFuelSources,
        selectedGenerationTechnologyTypes,
        selectedGeneratingUnits,
        searchTerm
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

    let search = ""
    function onSearch() {searchTerm.set(search)}
</script>

<!-- <div style="display:block; width:100%; height:450px;"> -->
<div style="display:block;" class="w-full h-full"> 
    <!-- Filters -->
    <div class="w-full pb-1 pt-2">Filters</div>
    <!-- Region -->
    <div class="px-2 py-0.5">
        <MultiFilter bind:items={regions} placeholder="Region" bind:selected={regionSelection} callback={onRegionSelection}></MultiFilter>
    </div>
    <!-- Technology Type -->
    <div class="px-2 py-0.5">
        <MultiFilter bind:items={technologyTypes} placeholder="Technology Type" bind:selected={technologyTypeSelection} callback={onTechnologyTypeSelection}></MultiFilter>
    </div>
    <!-- Fuel Sources-->
    <div class="px-2 py-0.5">
        <MultiFilter items={fuelSources} placeholder="Fuel Source" bind:selected={fuelSourceSelection} callback={onFuelSourceSelection}></MultiFilter>
    </div>
    <!-- Search -->
    <div class="p-2">
        <Textfield placeholder="Search..." bind:value={search} onInput={onSearch}></Textfield>
    </div>
    <div class="h-36 px-2">
        <List items={$selectedGeneratingUnits} titleProperty="duid" subtitleProperty="staion_name"></List>
    </div>
</div>

<style>
</style>

