<script>
    import Checkbox from '../components/checkbox.svelte';
    import Textfield from '../components/textfield.svelte';
    import Plot from '../components/plot.svelte';
    import List from '../components/list.svelte';
	import Select from 'svelte-select';
	import { DateInput } from 'date-picker-svelte';
	import { Tab, Tabs, TabPanel, TabList } from 'svelte-tabs';
	import { onMount } from 'svelte';
    import { getUnitGenerationData } from '../services/generation.js';
    import { baseURL } from '../services/config.js';
    import { loading } from '../stores/state.js';
    import { units } from '../stores/unit.js';

    let isLoading = false;
    loading.subscribe(value => {
        isLoading = value;
    })


	/* UNITS DATA */
    let data = null
	$: filteredUnits = [];	// units that have been filtered by filterUnits()

	function filterUnits() {
		let filtered = $units

		let regionFiltered = regionSelectFilter(filtered)
		let techFiltered = techSelectFilter(filtered)
		let sourceFiltered = fuelSelectFilter(filtered)
		let searchFiltered = searchFilter(filtered)

        console.log("filter")

		// Update Region Selections
		if (filtered.length === techFiltered.length === sourceFiltered.length === searchFiltered.length) {
			updateRegionSelections($units)
		} else {
			updateRegionSelections(intersectMultiple(searchFiltered, techFiltered, sourceFiltered))
		}

		// Update Tech Selections
		if (filtered.length === regionFiltered.length === sourceFiltered.length === searchFiltered.length) {
			updateTechSelections($units)
		} else {
			updateTechSelections(intersectMultiple(searchFiltered, regionFiltered, sourceFiltered))
		}

		// Update Soruce Selections
		if (filtered.length === regionFiltered.length === techFiltered.length === searchFiltered.length) {
			updateSourceSelections($units)
		} else {
			updateSourceSelections(intersectMultiple(searchFiltered, regionFiltered, techFiltered))
		}

		const filteredUnits = intersectMultiple(regionFiltered, techFiltered, sourceFiltered, searchFiltered)
	}

	async function plotUnits() {
		if (!isLoading) {
            const config = {
                "endDate": endDate,
                "startDate": startDate,
                "windowNumber": windowNumber,
                "windowSelection": windowSelection.value,
                "aggregateFn": functionSelection,
            }
			/* getUnitData() */
            data = await getUnitGenerationData(
                config,
                filterUnits,
                regionSelection,
                sourceSelection,
                technologySelection,
            )
		}
	}

	function plotGrouped() {
		if (!isLoading) {
			getGroupedData()
		}
	}


	// let rooftop = true
	// let demand = false


	/* TIME RANGE */
	let endDate = new Date();		// final date to query for
	let startDate= new Date();		// first date to query for
	let tempDate = endDate.getDate() - 7;	// used as a temporary store to set startdate as a week before now()
	startDate.setDate(tempDate)		// sets startDate by default to a week prior to now


	/* AGGREGATION FUNCTION */
	// all potential function options for flux query
	let functionList = [
		'mean',
		"median",
		"min",
		"max",
		"first",
		'last',
		"sum",
		"unique",
		"distinct",
	];
	let functionSelection = 'mean'	// selected function by default

	function onAggFnChange(event) {
		if (event.detail != null) {
			functionSelection = event.detail.value
		}
	}


	/* WINDOW PERIOD */
	// default window period selection
	let windowNumber = 20
	let windowSelection = {
		label: 'min',
		value: 'm',
	}
	// all available window periods
	let windowUnit = [
		{
			label: 'sec',
			value: 's',
		},
		{
			label: 'min',
			value: 'm',
		},
		{
			label: 'hr',
			value: 'h',
		},
		{
			label: 'day',
			value: 'd',
		},
		{
			label: 'week',
			value: 'w',
		},
		{
			label: 'month',
			value: 'mo',
		},
	]

	function onAggWindowPeriodChange(event) {
		if (event.detail != null) {
			windowSelection = event.detail
		}
	}


	/* REGION FILTER */
	let regionList = null		// It is assigned the value of all currently plotted units regions
	let regionSelection = null	// it is assigned the current selection of regions 

	// bound to the region filter selection
	// if there is a selection made, sets the region selection to the selected values
	// if no selection/cleared regionSelection is then set back to default (null)
	function onRegionSelect(event) {
		if (event.detail != null) {
			regionSelection = (event.detail.map((v) => {
				return v.value
			}))
		} else {
			regionSelection = null
		}
		filterUnits()
	}

	// filters the given units using the current value of the selected regions (regionSelection)
	function regionSelectFilter(units) {
		let filtered = units
		if (regionSelection != null) {
			filtered = units.filter((v) => {
				let filter = false
				for (let i=0; i < regionSelection.length; i++) {
					if (regionSelection[i] == v.region_id) {
						filter = true
						break
					}
				}
				return filter
			})
		}
		return filtered
	}

	// updates the regionList to all the unique regions in the given units
	function updateRegionSelections(units) {
		regionList = [...new Set(units.map(v => {
			return v.region_id
		}))]
	}


	/* TECHNOLOGY FILTER */
	let technologyList = null
	let technologySelection = null

	function onTechnologySelect(event) {
		if (event.detail != null) {
			technologySelection = (event.detail.map((v) => {
				return v.value
			}))
		} else {
			technologySelection = null
		}
		filterUnits()
	}

	function techSelectFilter(units) {
		let filtered = units
		if (technologySelection != null) {
			filtered = units.filter((v) => {
				let filter = false
				for (let i=0; i < technologySelection.length; i++) {
					if (technologySelection[i] == v.technology_type) {
						filter = true
						break
					}
				}
				return filter
			})
		}
		return filtered
	}

	function updateTechSelections(units) {
			technologyList= [...new Set(units.map(v => {
				return v.technology_type
			}))]
	}


	/* FUEL SOURCE FILTER */
	let sourceList = null
	let sourceSelection = null

	function onFuelSourceSelect(event) {
		if (event.detail != null) {
			sourceSelection = (event.detail.map((v) => {
				return v.value
			}))
		} else {
			sourceSelection = null
		}
		filterUnits()
	}

	function fuelSelectFilter(units) {
		let filtered = units
		if (sourceSelection != null) {
			filtered = units.filter((v) => {
				let filter = false
				for (let i=0; i < sourceSelection.length; i++) {
					if (sourceSelection[i] == v.fuel_source) {
						filter = true
						break
					}
				}
				return filter
			})
		}
		return filtered
	}

	function updateSourceSelections(units) {
			sourceList = [...new Set(units.map(v => {
				return v.fuel_source
			}))]
	}


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


	function intersection (arr1, arr2) {
		const res = []
		for (let i=0; i < arr1.length; i++) {
			if (!arr2.includes(arr1[i])) {
				continue;
			}
			res.push(arr1[i])
		}
		return res
	}

	function intersectMultiple (...arrs) {
		let res = arrs[0].slice();
		for (let i=1; i < arrs.length; i++) {
			res = intersection(res, arrs[i])
		}
		return res
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

	async function getGroupedData() {
		let query = (
			'?range.start=' + startDate.toISOString()
			+ '&range.end=' + endDate.toISOString()
			+ '&aggregate.every=' + windowNumber + windowSelection.value
			+ '&aggregate.fn=' + functionSelection
		)

        // Base just off the filters
        if (regionSelection && regionSelection.length > 0) {
            regionSelection.forEach((region) => {
                query += '&region_id.eq=' + region
            })
        }
        if (sourceSelection && sourceSelection.length > 0) {
            sourceSelection.forEach((fuel) => {
                query += '&fuel_source.eq=' + fuel
            })
        }
        if (technologySelection && technologySelection.length > 0) {
            technologySelection.forEach((tech) => {
                query += '&technology_type.eq=' + tech
            })
        }
        if (regionGroup) {
            query += '&group.eq=region'
        }
        if (techGroup) {
            query += '&group.eq=fuel'
        }
        if (fuelGroup) {
            query += '&group.eq=technology'
        }


		loading.set(true)

		await fetch(baseURL + '/data/generation/grouped' + query, {
			mode: 'cors',
		}).then(function(a) {
			return a.json();
		}).then(function(a) {
			data = a
			preProcessData()
			calcMinMax()
		}).catch(() => {
            loading.set(false)
        })

        loading.set(false)
	}

	/* MAIN */

	onMount(async() => {
		await fetch(baseURL + '/units',{
			mode: 'cors',
		}).then(function (a) {
			return a.json();
		}).then(function (json) {
            units.set(json)
			filteredUnits = json
			updateRegionSelections(json)
			updateTechSelections(json)
			updateSourceSelections(json)
		})
	})

</script>

<svelte:head>
	<title>
		AEMO Dashboard
	</title>
</svelte:head>

<svelte:window on:keydown={handleKeydown}/>

<!-- Aggregation + Range on Top of Plot-->
<!-- Remove Aggregatio - Leave Windowing Period -->
<!-- Filters + Search on Left -->
<!-- Extra axis on the right hand side for totals that can be toggled off-->
<!-- Totals include, All Generation/Selected/Rooftop/Demand -->

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
						items={functionList}
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
						items={windowUnit}
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
		<!-- Rooftop + Demand Filter-->
		<!-- <div class="w-full">Include:</div>
		<div class="flex flex-wrap">
			<div class="w-full md:w-1/2">
				<input type="checkbox" class="mx-1" bind:value={rooftop}/> Rooftop
			</div>
			<div class="w-full md:w-1/2">
				<input type="checkbox" class="mx-1" bind:value={demand}/> Demand
			</div>
		</div> -->
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
                    <div class="w-full px-2 py-0.5">
                        <Select
                            items={regionList}
                            placeholder="Region"
                            isClearable={true}
                            isMulti={true}
                            isSearchable={true}
                            showIndicator={true}
                            on:select={onRegionSelect}
                        />
                    </div>
                    <!-- Technology -->
                    <div class="w-full px-2 py-0.5">
                        <Select
                            items={technologyList}
                            placeholder="Technology"
                            isClearable={true}
                            isMulti={true}
                            isSearchable={true}
                            showIndicator={true}
                            on:select={onTechnologySelect}
                        />
                    </div>
                    <!-- Fuel Source -->
                    <div class="w-full px-2 py-0.5">
                        <Select
                            items={sourceList}
                            placeholder="Fuel Source"
                            isClearable={true}
                            isMulti={true}
                            isSearchable={true}
                            showIndicator={true}
                            on:select={onFuelSourceSelect}
                        />
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
                    <div class="w-full px-2 py-0.5">
                        <Select
                            items={regionList}
                            placeholder="Region"
                            isClearable={true}
                            isMulti={true}
                            isSearchable={true}
                            showIndicator={true}
                            on:select={onRegionSelect}
                        />
                    </div>
                    <!-- Technology -->
                    <div class="w-full px-2 py-0.5">
                        <Select
                            items={technologyList}
                            placeholder="Technology"
                            isClearable={true}
                            isMulti={true}
                            isSearchable={true}
                            showIndicator={true}
                            on:select={onTechnologySelect}
                        />
                    </div>
                    <!-- Fuel Source -->
                    <div class="w-full px-2 py-0.5">
                        <Select
                            items={sourceList}
                            placeholder="Fuel Source"
                            isClearable={true}
                            isMulti={true}
                            isSearchable={true}
                            showIndicator={true}
                            on:select={onFuelSourceSelect}
                        />
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
    .fixed-tab-panel {
        display:block;
        width:100%;
        height:70px;
        background-color:#475;
        overflow:scroll;
    }
	.chart {
		padding: 3em 0 2em 2em;
		margin: 0 0 36px 0;
	}

	input {
		font-size: inherit;
		font-family: inherit;
		padding: 0.5em;
	}

	.grid-line {
		position: relative;
		display: block;
	}

	.grid-line.horizontal {
		width: calc(100% + 2em);
		left: -2em;
		border-bottom: 1px dashed #ccc;
	}

	.grid-line.vertical {
		height: 100%;
		border-left: 1px dashed #ccc;
	}

	.grid-line span {
		position: absolute;
		left: 0;
		bottom: 2px;
		font-family: sans-serif;
		font-size: 14px;
		color: #999;
	}

	.x-label {
		position: absolute;
		width: 4em;
		left: -2em;
		bottom: -60px;
		font-family: sans-serif;
		font-size: 14px;
		color: #999;
		text-align: center;
	}

	path.data {
		stroke: rgba(0,0,0,0.2);
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-width: 1px;
		fill: none;
	}

	.highlight {
		stroke: #3b82f6;
		fill: none;
		stroke-width: 2;
	}

	.annotation {
		position: absolute;
		white-space: nowrap;
		bottom: 1em;
		line-height: 1.2;
		background-color: rgba(255,255,255,0.9);
		padding: 0.2em 0.4em;
		border-radius: 2px;
	}

	.annotation-point {
		position: absolute;
		width: 10px;
		height: 10px;
		background-color: #3b82f6;
		border-radius: 50%;
		transform: translate(-50%,-50%);
	}

	.annotation strong {
		display: block;
		font-size: 20px;
	}

	.annotation span {
		display: block;
		font-size: 14px;
	}
</style>
