<script>
    import MultiFilter from '../components/multiFilter.svelte';
    import { generationRegions, generationFuelSources, generationTechnologyTypes } from '../stores/generation/unit.js';
    import { selectedGenerationRegions, selectedGenerationFuelSources, selectedGenerationTechnologyTypes, selectedGeneratingUnits } from '../stores/generation/selection';


    let regions = []
    let regionSelection = []
    generationRegions.subscribe((value) => {regions = value})
    function onRegionSelection() {selectedGenerationRegions.set(regionSelection)}

    let fuelSources = []
    let fuelSourceSelection = []
    generationFuelSources.subscribe((value) => {fuelSources = value})
    function onFuelSourceSelection() {selectedGenerationFuelSources.set(fuelSourceSelection)}

    let technologyTypes = []
    let technologyTypeSelection = []
    generationTechnologyTypes.subscribe((value) => {technologyTypes = value})
    function onTechnologyTypeSelection() {selectedGenerationTechnologyTypes.set(technologyTypeSelection)}

    selectedGeneratingUnits.subscribe((value) => {console.log(value)})
</script>

<div style="display:block; width:100%; height:450px;">
    <!-- Filters -->
    <div class="w-full pb-1 pt-2">Filters</div>
    <!-- Region -->
    <div class="px-2 py-0.5">
        <MultiFilter items={regions} placeholder="Region" bind:selected={regionSelection} callback={onRegionSelection}></MultiFilter>
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

