<script>

	import * as Pancake from '@sveltejs/pancake';
	import Select from 'svelte-select';
	import { DateInput } from 'date-picker-svelte';
	import { onMount } from 'svelte';

	let baseURL = 'https://api.aemodash.com'

	let units = [];
	$: filteredUnits = [];

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
	let functionSelection = 'mean'

	let windowSelection = {
		label: 'min',
		value: 'm',
	}
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
	let windowNumber = 20

	let endDate = new Date();
	let startDate= new Date();
	let tempDate = endDate.getDate() - 7;
	startDate.setDate(tempDate)

	// let rooftop = true
	// let demand = false

	let regionList = null
	let regionFilteredList = null
	let regionSelection = null
	let technologyList = null
	let technologySelection = null
	let sourceList = null
	let sourceSelection = null

	let search = null

	onMount(async() => {
		await fetch(baseURL + '/units',{
			mode: 'cors',
		}).then(function (a) {
			return a.json();
		}).then(function (json) {
			units = json
			filteredUnits = json
			updateRegionSelections(units)
			updateTechSelections(units)
			updateSourceSelections(units)
		})
	})

	function onAggFnChange(event) {
		if (event.detail != null) {
			functionSelection = event.detail.value
		}
	}

	function onAggWindowPeriodChange(event) {
		if (event.detail != null) {
			windowSelection = event.detail
		}
	}

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

	function updateRegionSelections(units) {
			regionList = [...new Set(units.map(v => {
				return v.region_id
			}))]
	}

	function updateTechSelections(units) {
			technologyList= [...new Set(units.map(v => {
				return v.technology_type
			}))]
	}

	function updateSourceSelections(units) {
			sourceList = [...new Set(units.map(v => {
				return v.fuel_source
			}))]
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


	function filterUnits() {
		let filtered = units

		let regionFiltered = regionSelectFilter(filtered)
		let techFiltered = techSelectFilter(filtered)
		let sourceFiltered = fuelSelectFilter(filtered)
		let searchFiltered = searchFilter(filtered)

		// Update Region Selections
		if (filtered.length == techFiltered.length == sourceFiltered.length == searchFiltered.length) {
			updateRegionSelections(units)
		} else {
			updateRegionSelections(intersectMultiple(searchFiltered, techFiltered, sourceFiltered))
		}

		// Update Tech Selections
		if (filtered.length == regionFiltered.length == sourceFiltered.length == searchFiltered.length) {
			updateTechSelections(units)
		} else {
			updateTechSelections(intersectMultiple(searchFiltered, regionFiltered, sourceFiltered))
		}

		// Update Soruce Selections
		if (filtered.length == regionFiltered.length == techFiltered.length == searchFiltered.length) {
			updateSourceSelections(units)
		} else {
			updateSourceSelections(intersectMultiple(searchFiltered, regionFiltered, techFiltered))
		}
		
		filteredUnits = intersectMultiple(regionFiltered, techFiltered, sourceFiltered, searchFiltered)
	}

	function plotUnits() {
		if (!loading) {
			getData()
		}
	}

	function handleKeydown(event) {
		if (event.key == "Enter") {
			plotUnits()
		}
	}

	// let data = testData;
	let data = [];

	async function getData() {
		let toPlot = filteredUnits.map((v) => {
			return v.duid
		})

		let query = (
			'?duid=' + toPlot.join('&duid=')
			+ '&range.start=' + startDate.toISOString()
			+ '&range.end=' + endDate.toISOString()
			+ '&aggregate.every=' + windowNumber + windowSelection.value
			+ '&aggregate.fn=' + functionSelection
		)

		loading = true

		await fetch(baseURL + '/data/generation' + query, {
			mode: 'cors',
		}).then(function(a) {
			return a.json();
		}).then(function(a) {
			data = a
			preProcessData()
			calcMinMax()
		})

		loading = false
	}

	function preProcessData() {
		console.log("Start Pre process")
		data = data.map(unit => {
			unit.data = unit.data.map(d => {
				if (typeof d.time == "string") {
					return {
						x: Date.parse(d.time),
						y: d.value,
					}
				} else {
					return d
				}
			})
			return unit
		})
	}

	function getUnitStationName(unit) {
		return (units.filter((v) => {
			return v.duid == unit
		})[0].staion_name)
	}

	// PANCAKE PLOT

	let closest;
	$: loading = false

	$: xMin = +Infinity;
	$: xMax = -Infinity;
	$: yMin = +Infinity;
	$: yMax = -Infinity;

	function calcMinMax() {
		xMin = +Infinity;
		xMax = -Infinity;
		yMin = +Infinity;
		yMax = -Infinity;
		data.forEach(unit=> {
			unit.data.forEach(d => {
				if (d.x < xMin) xMin = d.x;
				if (d.x > xMax) xMax = d.x;
				if (d.y < yMin) yMin = d.y;
				if (d.y > yMax) yMax = d.y;
			})
		})
	}

	$: points = data.reduce((points, unit) => {
		return points.concat(unit.data.map(d => ({
			x: d.x,
			y: d.y,
			unit
		})));
	}, []);

</script>

<svelte:head>
	<title>
		AEMO Dashboard
	</title>
</svelte:head>

<svelte:window on:keydown={handleKeydown}/>
<!-- Checkboxes for -> Rooftop, Demand -->
<!-- Range will be a numeric field with dropdown for h/m/s/d/w/mo -->
<!-- Dropdowns for Aggregate and Function  -->
<!-- -->

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
		<div class="w-full p-2">
			<input
				type="text"
				class="
					form-control
					block
					w-full
					px-3
					py-1.5
					my-2
					text-base
					font-normal
					text-gray-700
					bg-white bg-clip-padding
					border border-solid border-gray-300
					rounded
					transition
					ease-in-out
					m-0
					focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
				"
				placeholder="Search..."
				bind:value={search}
				on:input={filterUnits}
			/>
		</div>
		<div class="flex flex-wrap p-2 h-48 border rounded border-gray-200 place-content-center justify-center ">
		<!-- Search Results -->
		<!-- Show the Unit ID and the Station Name-->
			{#if filteredUnits.length > 0}
			<div class="w-full overflow-auto h-48">
				{#each filteredUnits as item}
				<div class="w-full border-b border-gray-300">
					<div class="text-sm font-semibold">{item.duid}</div>
					<div class="text-xxs text-gray-400">{item.staion_name}</div>
				</div>
				{/each}
			</div>
			{:else}
			<div>
				No Content Found :(
			</div>
			{/if}
		</div>
		<div class="w-full py-2 px-3">
			<button
				on:click={plotUnits}
				class="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-2 px-4 rounded"
				disabled={loading}>
				{loading ? "Loading" : "Plot"}
			</button>
		</div>
	</div>
	<!-- Main Plot -->
	{#if data.length == 0}
	<div class="flex flex-wrap border md:w-7/12 place-content-center text-gray-600 justify-center rounded">
		<div>
			{loading ? "Loading" : "No Plot Yet  :("}
		</div>
	</div>
	{:else}
	<div class="w-full md:w-7/12 rounded">
		<div class="w-full h-full py-5 pb-12 pl-10">
			<Pancake.Chart x1={xMin} x2={xMax} y1={yMin} y2={yMax}>
				<Pancake.Grid horizontal count={10} let:value>
					<div class="grid-line horizontal">
						<span class="">{value}</span>
					</div>
				</Pancake.Grid>

				<Pancake.Grid vertical count={5} let:value>
					<div class="grid-line vertical"></div>
					<span class="x-label">{
						new Date(value).toLocaleString("en-gb", {
							hour12: false,
							hour: "2-digit",
							minute: "2-digit",
							second: "2-digit",
						}) + "\n" + 
						new Date(value).toLocaleString("en-gb", {
							day: "numeric",
							month: "2-digit",
							year: "2-digit",
						})
					}</span>
				</Pancake.Grid>

				<Pancake.Svg>
					{#each data as unit}
						<Pancake.SvgLine data={unit.data} let:d>
							<path class="data" {d}></path>
						</Pancake.SvgLine>
					{/each}

					{#if closest}
						<Pancake.SvgLine data={closest.unit.data} let:d>
							<path class="highlight" {d}></path>
						</Pancake.SvgLine>
					{/if}
				</Pancake.Svg>

				{#if closest}
					<Pancake.Point x={closest.x} y={closest.y}>
						<span class="annotation-point"></span>
						<div class="annotation" style="transform: translate(-{100 * ((closest.x - xMin)/(xMax-xMin))}%,0)">
							<div class="font-bold">{closest.unit.unit}</div>
							<div class="text-xs font-light text-gray-400 pb-0.5">{getUnitStationName(closest.unit.unit)}</div>
							<span class="font-light">{new Date(closest.x).toLocaleString("en-gb", {
								day: "numeric",
								month: "2-digit",
								year: "2-digit",
							})}</span>
							<span class="font-light">{new Date(closest.x).toLocaleString("en-gb", {
								hour12: false,
								hour: "2-digit",
								minute: "2-digit",
								second:"2-digit"
							})}: {Math.round(closest.y)}MW</span>
						</div>
					</Pancake.Point>
				{/if}

				<Pancake.Quadtree data={points} bind:closest/>
				
			</Pancake.Chart>
		</div>
	</div>
	{/if}
</div>

<style>
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
