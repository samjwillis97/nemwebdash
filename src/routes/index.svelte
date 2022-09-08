<script>
    import Plot from '../components/plot.svelte';
	import Select from 'svelte-select';
    import UnitFilter from '../components/unitFilter.svelte';
    import GroupFilter from '../components/groupFilter.svelte';
	import { DateInput } from 'date-picker-svelte';
	import { Tab, Tabs, TabPanel, TabList } from 'svelte-tabs';
	import { onMount } from 'svelte';
    import { getGroupedGenerationData, getUnitGenerationData } from '../services/generation.js';
    import { loading } from '../stores/state.js';
    import { getAllUnits } from '../services/units';
    import { aggregateFnList, windowUnitList } from '../common/influxdb.js';
    import { 
        defaultEndDate,
        defaultStartDate,
        defaultAggregateFn,
        defaultWindowNumber,
        defaultWindowSelection,
    } from '../services/config.js'
    import { 
        selectedGeneratingUnits,
        selectedGenerationRegions,
        selectedGenerationFuelSources,
        selectedGenerationTechnologyTypes,
        regionGroupingSelected,
        fuelSourceGroupingSelected,
        technologyTypesGroupingSelected,
    } from '../stores/generation/unit';

    let isLoading = false;
    loading.subscribe(value => {
        isLoading = value;
    })

	/* UNITS DATA */
    let data = null

    function getQueryConfig() {
        return {
            "endDate": endDate,
            "startDate": startDate,
            "windowNumber": windowNumber,
            "windowSelection": windowSelection.value,
            "aggregateFn": functionSelection,
        }

    }

	async function plotUnits() {
		if (!isLoading) {
            data = await getUnitGenerationData(
                getQueryConfig(),
                $selectedGeneratingUnits,
                $selectedGenerationRegions,
                $selectedGenerationFuelSources,
                $selectedGenerationTechnologyTypes,
            )
		}
	}


	async function plotGrouped() {
		if (!isLoading) {
            data = await getGroupedGenerationData(
                getQueryConfig(),
                $selectedGenerationRegions,
                $regionGroupingSelected,
                $selectedGenerationFuelSources,
                $fuelSourceGroupingSelected,
                $selectedGenerationTechnologyTypes,
                $technologyTypesGroupingSelected,
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

<!-- Responsive Grid -->
<div class="flex flex-wrap content-center justify-center h-screen">
    <!-- Left Side Menu -->
	<div class="pt-16 w-full md:w-3/12 pr-4 place-content-center text-sm text-gray-600">
        <div>
            <Tabs>
                <TabList>
                    <Tab>Units</Tab>
                    <Tab>Grouped</Tab>
                </TabList>
                <TabPanel>
                    <UnitFilter></UnitFilter>
                    <div class="w-full px-2 pt-6">
                        <button
                            on:click={plotUnits}
                            class="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-2 rounded"
                            disabled={isLoading}>
                            {isLoading ? "Loading" : "Plot"}
                        </button>
                    </div>
                </TabPanel>
                <TabPanel>
                    <GroupFilter></GroupFilter>
                    <div class="w-full px-2 pt-6">
                        <button
                            on:click={plotGrouped}
                            class="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-2 rounded"
                            disabled={isLoading}>
                            {isLoading ? "Loading" : "Plot"}
                        </button>
                    </div>
                </TabPanel>
            </Tabs>
        </div>
	</div>
	<!-- Main Plot -->
    <div class="flex flex-wrap w-full md:w-7/12 h-5/6 pb-10 place-content-center">
        <div class="flex flex-wrap mb-3 w-full justify-around content-center text-sm text-gray-600">
            <div class="w-1/6">
                <div class="py-2">Aggregation</div>
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
            <div class="w-1/6">
                <div class="py-2">Window</div>
                <div class="flex">
                    <input class="border rounded w-16 mr-2" type="number" bind:value={windowNumber}/>
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
            <div class="w-1/6">
                <div class="py-2 mb-1.5">Start Date</div>
                <DateInput bind:value={startDate}/>
            </div>
            <div class="w-1/6">
                <div class="py-2 mb-1.5">End Date</div>
                <DateInput bind:value={startDate}/>
            </div>
        </div>
        <Plot data={data}></Plot>
    </div>
</div>

<style>
    :global(body) {
		--date-input-width: 155px;
	}
	input {
		font-size: inherit;
		font-family: inherit;
		padding: 0.5em;
	}
</style>
