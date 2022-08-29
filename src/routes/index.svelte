<script>
    import Checkbox from '../components/checkbox.svelte';
    import Textfield from '../components/textfield.svelte';
    import Plot from '../components/plot.svelte';
    import List from '../components/list.svelte';
    import MultiFilter from '../components/multiFilter.svelte';
	import Select from 'svelte-select';
	import { DateInput } from 'date-picker-svelte';
	import { Tab, Tabs, TabPanel, TabList } from 'svelte-tabs';
	import { onMount } from 'svelte';
    import { intersectMultiple } from '../common/array.js';
    import { getGroupedGenerationData, getUnitGenerationData } from '../services/generation.js';
    import { loading } from '../stores/state.js';
    import { units } from '../stores/unit.js';
    import { getAllUnits } from '../services/units';
    import { aggregateFnList, windowUnitList } from '../common/influxdb.js';
    import { 
        defaultEndDate,
        defaultStartDate,
        defaultAggregateFn,
        defaultWindowNumber,
        defaultWindowSelection,
    } from '../services/config.js'
import { filterItems, getUniqueItems } from '../common/filters';

    let isLoading = false;
    loading.subscribe(value => {
        isLoading = value;
    })

    let allUnits = []
    units.subscribe(value => {
        if (value && value.length > 0) {
            allUnits = value
            filteredUnits = value
            regionList = getUniqueItems(value, function(value) {return value.region_id})
            sourceList= getUniqueItems(value, function(value) {return value.fuel_source})
            technologyList = getUniqueItems(value, function(value) {return value.technology_type})
        }
    })

	/* UNITS DATA */
    let data = null
	$: filteredUnits = [];	// units that have been filtered by filterUnits()

    function getQueryConfig() {
        return {
            "endDate": endDate,
            "startDate": startDate,
            "windowNumber": windowNumber,
            "windowSelection": windowSelection.value,
            "aggregateFn": functionSelection,
        }

    }

	function filterUnits() {
		let filtered = allUnits

		/* let regionFiltered = regionSelectFilter(filtered) */
		let regionFiltered = filterItems(filtered, regionSelection, function(value) {return value.region_id})
		let techFiltered = filterItems(filtered, technologySelection, function(value) {return value.technology_type})
		let sourceFiltered = filterItems(filtered, sourceSelection, function(value) {return value.fuel_source})
		let searchFiltered = searchFilter(filtered)

		// Update Region Selections
		if (filtered.length === techFiltered.length === sourceFiltered.length === searchFiltered.length) {

            regionList = getUniqueItems(allUnits, function(value) {return value.region_id})
		} else {
            regionList = getUniqueItems(
                intersectMultiple(searchFiltered, techFiltered, sourceFiltered),
                function(value) {return value.region_id}
            )
		}

		// Update Tech Selections
		if (filtered.length === regionFiltered.length === sourceFiltered.length === searchFiltered.length) {
            technologyList = getUniqueItems(allUnits, function(value) {return value.technology_type})
		} else {
            technologyList = getUniqueItems(
                intersectMultiple(searchFiltered, regionFiltered, sourceFiltered),
                function(value) {return value.technology_type}
            )
		}

		// Update Soruce Selections
		if (filtered.length === regionFiltered.length === techFiltered.length === searchFiltered.length) {
            sourceList = getUniqueItems(allUnits, function(value) {return value.fuel_source})
		} else {
            sourceList = getUniqueItems(
                intersectMultiple(searchFiltered, regionFiltered, techFiltered),
                function(value) {return value.fuel_source}
            )
		}

		filteredUnits = intersectMultiple(regionFiltered, techFiltered, sourceFiltered, searchFiltered)
	}

	async function plotUnits() {
		if (!isLoading) {
            data = await getUnitGenerationData(
                getQueryConfig(),
                filterUnits,
                regionSelection,
                sourceSelection,
                technologySelection,
            )
		}
	}

	async function plotGrouped() {
		if (!isLoading) {
            data = await getGroupedGenerationData(
                getQueryConfig(),
                regionSelection,
                regionGroup,
                sourceSelection,
                fuelGroup,
                technologySelection,
                techGroup
            )
		}
	}


	/* TIME RANGE */
	let endDate = defaultEndDate
	let startDate= defaultStartDate

	/* AGGREGATION FUNCTION */
	// all potential function options for flux query
	let functionSelection = defaultAggregateFn

	function onAggFnChange(event) {
		if (event.detail != null) {
			functionSelection = event.detail.value
		}
	}

	/* WINDOW PERIOD */
	// default window period selection
	let windowNumber = defaultWindowNumber
	let windowSelection = defaultWindowSelection

	// all available window periods
	function onAggWindowPeriodChange(event) {
		if (event.detail != null) {
			windowSelection = event.detail
		}
	}

	/* REGION FILTER */
	let regionList = null		
	let regionSelection = null

	/* TECHNOLOGY FILTER */
	let technologyList = null
	let technologySelection = null

	/* FUEL SOURCE FILTER */
	let sourceList = null
	let sourceSelection = null

	/* SEARCH FILTER */
	let search = null

	function searchFilter(units) {
		let filtered = units
		if (search != null && search != "") {
			filtered = units.filter((v) => {
				return (
					v.duid.toUpperCase().match(search.toUpperCase()) != null
					|| v.staion_name.toUpperCase().match(search.toUpperCase()) != null
					)
			})
		}
		return filtered
	}

	function handleKeydown(event) {
		if (event.key == "Enter") {
			plotUnits()
		}
	}

	/* PLOTTING DATA */
    let regionGroup = true
    let fuelGroup = false
    let techGroup = false

	/* MAIN */
	onMount(async() => {
        await getAllUnits()
	})

</script>

<svelte:head>
	<title>
		AEMO Dashboard
	</title>
</svelte:head>

<svelte:window on:keydown={handleKeydown}/>

<!-- Responsive Grid -->
<div class="flex flex-wrap content-center justify-center h-screen">
	<!-- Left Side Menu -->
	<div class="w-full md:w-3/12 pr-4 place-content-center text-sm text-gray-600">
		<!-- Aggregation -->
		<div class="flex flex-wrap pb-1 pt-2">
			<!-- Left Side -->
			<div class="flex w-full md:w-5/12">Aggregation</div>
			<!-- Right Side -->
			<div class="flex w-full md:w-7/12 pl-6">Windowing Time Period</div>
		</div>
		<div class="flex flex-wrap justify-between px-2 pt-0.5 pb-2">
			<!-- Left Side -->
			<div class="flex w-full md:w-5/12">
				<div class="w-full">
					<Select
						items={aggregateFnList}
						value={functionSelection}
						placeholder="Function"
						isClearable={false}
						isMulti={false}
						isSearchable={true}
						showIndicator={true}
						on:select={onAggFnChange}
					/>
				</div>
			</div>
			<!-- Right Side -->
			<div class="flex w-full md:w-3/12 pl-2 pr-0">
				<input class="w-full ml-3 border rounded" type="number" bind:value={windowNumber}/>
			</div>
			<div class="flex w-full md:w-3/12">
				<div class="w-full">
					<Select
						items={windowUnitList}
						value={windowSelection}
						placeholder="Unit"
						isClearable={false}
						isMulti={false}
						isSearchable={true}
						showIndicator={true}
						on:select={onAggWindowPeriodChange}
					/>
				</div>
			</div>

		</div>
		<!-- DateTime -->
		<div class="flex flex-wrap pb-1 pt-2">
			<!-- Left Side -->
			<div class="flex w-full md:w-6/12">Start Date</div>
			<!-- Right Side -->
			<div class="flex w-full pl-3 md:w-6/12">End Date</div>
		</div>
		<div class="flex flex-wrap px-2 pb-2 pt-0.5">
			<!-- Left Side -->
			<div class="flex w-full md:w-6/12 text-xs">
				<DateInput bind:value={startDate}/>
			</div>
			<!-- Right Side -->
			<div class="flex w-full justify-end md:w-6/12 text-xs">
				<DateInput bind:value={endDate}/>
			</div>
		</div>
        <div>
            <div class="pt-2 border-b border-neutral-300 flex flex-wrap"></div>
            <Tabs>
                <TabList>
                    <Tab>Units</Tab>
                    <Tab>Grouped</Tab>
                </TabList>
                <TabPanel>
                  <div style="display:block; width:100%; height:450px;">
                    <!-- Filters -->
                    <div class="w-full pb-1 pt-2">Filters</div>
                    <!-- Region -->
                    <div class="px-2 py-0.5">
                        <MultiFilter items={regionList} placeholder="Region" bind:selected={regionSelection} callback={filterUnits}></MultiFilter>
                    </div>
                    <!-- Technology -->
                    <div class="px-2 py-0.5">
                        <MultiFilter items={technologyList} placeholder="Technology" bind:selected={technologySelection} callback={filterUnits}></MultiFilter>
                    </div>
                    <!-- Fuel Source -->
                    <div class="px-2 py-0.5">
                        <MultiFilter items={sourceList} placeholder="Fuel Source" bind:selected={sourceSelection} callback={filterUnits}></MultiFilter>
                    </div>
                    <!-- Search -->
                    <div class="p-2">
                        <Textfield placeholder="Search..." bind:value={search} onInput={filterUnits}></Textfield>
                    </div>
                    <!-- Clear Selection -->
                    <div class="h-36 px-2">
                        <List bind:items={filteredUnits} titleProperty="duid" subtitleProperty="staion_name"></List>
                    </div>
                    <div class="w-full pt-2 px-2">
                        <button
                            on:click={plotUnits}
                            class="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-2 rounded"
                            disabled={isLoading}>
                            {isLoading ? "Loading" : "Plot"}
                        </button>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div style="display:block; width:100%; height:450px;">
                    <div class="w-full pb-1 pt-2">Group By</div>
                    <div class="flex flex-wrap px-2 pb-2 pt-0.5">
                        <Checkbox  bind:checked={regionGroup} text="Region"></Checkbox>
                        <Checkbox  bind:checked={techGroup} text="Technology Type"></Checkbox>
                        <Checkbox  bind:checked={fuelGroup} text="Fuel Source"></Checkbox>
                    </div>
                    <!-- Filters -->
                    <div class="w-full pb-1 pt-2">Filters</div>
                    <!-- Region -->
                    <div class="px-2 py-0.5">
                        <MultiFilter items={regionList} placeholder="Region" bind:selected={regionSelection} callback={filterUnits}></MultiFilter>
                    </div>
                    <!-- Technology -->
                    <div class="px-2 py-0.5">
                        <MultiFilter items={technologyList} placeholder="Technology" bind:selected={technologySelection} callback={filterUnits}></MultiFilter>
                    </div>
                    <!-- Fuel Source -->
                    <div class="px-2 py-0.5">
                        <MultiFilter items={sourceList} placeholder="Fuel Source" bind:selected={sourceSelection} callback={filterUnits}></MultiFilter>
                    </div>
                    <div class="w-full pt-2 px-3">
                        <button
                            on:click={plotGrouped}
                            class="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-2 px-4 rounded"
                            disabled={isLoading}>
                            {isLoading? "Loading" : "Plot"}
                        </button>
                    </div>
                  </div>
                </TabPanel>
            </Tabs>
        </div>
	</div>
	<!-- Main Plot -->
    <div class="mt-10 md:w-7/12 h-4/5">
        <Plot data={data}></Plot>
    </div>
</div>

<style>
	input {
		font-size: inherit;
		font-family: inherit;
		padding: 0.5em;
	}
</style>
