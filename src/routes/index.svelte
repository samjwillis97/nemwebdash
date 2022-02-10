<script>
	import * as Pancake from '@sveltejs/pancake';
	import { testData } from './testdata';
	import Select from 'svelte-select';
	import { DateInput } from 'date-picker-svelte';
	import { onMount } from 'svelte';

	let baseURL = 'http://localhost:3006'

	let units = [];
	$: filteredUnits = [];

	let functionList = ['mean', 'last'];
	let functionSelection = 'mean'

	let windowSelection = {
		label: 'min',
		value: 'm',
	}
	let windowUnit = [
		{
			label: 'min',
			value: 'm',
		},
		{
			label: 'hr',
			value: 'h',
		}
	]
	let windowNumber = 20

	let endDate = new Date();
	let startDate= new Date();
	let tempDate = endDate.getDate() - 7;
	startDate.setDate(tempDate)

	let rooftop = true
	let demand = false

	let regionList = null
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
			regionList = [...new Set(json.map(v => {
				return v.region_id
			}))]
			technologyList= [...new Set(json.map(v => {
				return v.technology_type
			}))]
			sourceList = [...new Set(json.map(v => {
				return v.fuel_source
			}))]
		})
	})

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

	function filterUnits() {
		let filtered = units

		if (regionSelection != null) {
			filtered = filtered.filter((v) => {
				let filter = false
				for (let i=0; i <regionSelection.length; i++) {
					if (regionSelection[i] == v.region_id) {
						filter = true
						break
					}
				}
				return filter
			})
		}

		if (technologySelection!= null) {
			filtered = filtered.filter((v) => {
				let filter = false
				for (let i=0; i <technologySelection.length; i++) {
					if (technologySelection[i] == v.technology_type) {
						filter = true
						break
					}
				}
				return filter
			})
		}

		if (sourceSelection!= null) {
			filtered = filtered.filter((v) => {
				let filter = false
				for (let i=0; i <sourceSelection.length; i++) {
					if (sourceSelection[i] == v.fuel_source) {
						filter = true
						break
					}
				}
				return filter
			})
		}

		if (search != null && search != "") {
			filtered = filtered.filter((v) => {
				return (
					v.duid.toUpperCase().match(search.toUpperCase()) != null
					|| v.staion_name.toUpperCase().match(search.toUpperCase()) != null
					)
			})
		}

		filteredUnits = filtered
		getData()
	}


	let data = testData;

	function getData() {
		preProcessData()
		calcMinMax()
		console.log(points)
	}

	function preProcessData() {
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

	// PANCAKE PLOT

	let xMin = +Infinity;
	let xMax = -Infinity;
	let yMin = +Infinity;
	let yMax = -Infinity;

	function calcMinMax() {
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
			unit: unit.unit
		})));
	}, []);

</script>

<!-- Checkboxes for -> Rooftop, Demand -->
<!-- Range will be a numeric field with dropdown for h/m/s/d/w/mo -->
<!-- Dropdowns for Aggregate and Function  -->
<!-- -->

<!-- Responsive Grid -->
<div class="flex flex-wrap content-center justify-center h-screen">
	<!-- Left Side Menu -->
	<div class="w-full md:w-3/12 place-content-center">
		<!-- Aggregation -->
		<div class="flex flex-wrap">
			<!-- Left Side -->
			<div class="flex w-full md:w-5/12">Aggregation</div>
			<!-- Right Side -->
			<div class="flex w-full md:w-7/12">Window Period</div>
		</div>
		<div class="flex flex-wrap">
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
					/>
				</div>
			</div>
			<!-- Right Side -->
			<div class="flex w-full md:w-3/12">
				<input class="w-full" type="number" bind:value={windowNumber}/>
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
					/>
				</div>
			</div>

		</div>
		<!-- DateTime -->
		<div class="flex flex-wrap">
			<!-- Left Side -->
			<div class="flex w-full md:w-6/12">Start Date</div>
			<!-- Right Side -->
			<div class="flex w-full md:w-6/12">End Date</div>
		</div>
		<div class="flex flex-wrap">
			<!-- Left Side -->
			<div class="flex w-full md:w-6/12 text-xs">
				<DateInput bind:value={startDate}/>
			</div>
			<!-- Right Side -->
			<div class="flex w-full md:w-6/12 text-xs">
				<DateInput bind:value={endDate}/>
			</div>
		</div>
		<!-- Rooftop + Demand Filter-->
		<div class="w-full">Include:</div>
		<div class="flex flex-wrap">
			<div class="w-full md:w-1/2">
				<input type="checkbox" class="mx-1" bind:value={rooftop}/> Rooftop
			</div>
			<div class="w-full md:w-1/2">
				<input type="checkbox" class="mx-1" bind:value={demand}/> Demand
			</div>
		</div>
		<!-- Filters -->
		<div class="w-full">Filters:</div>
		<!-- Region -->
		<div class="w-full">
			<Select
				items={regionList}
				value={regionSelection}
				placeholder="Region"
				isClearable={true}
				isMulti={true}
				isSearchable={true}
				showIndicator={true}
				on:select={onRegionSelect}
			/>
		</div>
		<!-- Technology -->
		<div class="w-full">
			<Select
				items={technologyList}
				value={technologySelection}
				placeholder="Technology"
				isClearable={true}
				isMulti={true}
				isSearchable={true}
				showIndicator={true}
				on:select={onTechnologySelect}
			/>
		</div>
		<!-- Fuel Source -->
		<div class="w-full">
			<Select
				items={sourceList}
				value={sourceSelection}
				placeholder="Fuel Source"
				isClearable={true}
				isMulti={true}
				isSearchable={true}
				showIndicator={true}
				on:select={onFuelSourceSelect}
			/>
		</div>
		<!-- Search -->
		<div class="w-full">
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
				placeholder="Search"
				bind:value={search}
				on:input={filterUnits}
			/>
		</div>
		<div class="flex flex-wrap h-48 border rounded border-gray-200 place-content-center justify-center ">
			{#if filteredUnits.length > 0}
			<div class="w-full overflow-auto h-48">
				{#each filteredUnits as item}
				<div class="border-b border-gray-300">
					<div>{item.duid}</div>
					<div>{item.staion_name}</div>
				</div>
				{/each}
			</div>
			{:else}
			<div>
				No Content Found :(
			</div>
			{/if}
		</div>
		<!-- Search Results -->
		<!-- Show the Unit ID and the Station Name-->
	</div>
	<!-- Main Plot -->
	<div class="w-full md:w-7/12 border border-gray-400 rounded">
		<div class="chart">
			<Pancake.Chart x1={xMin} x2={xMax} y1={yMin} y2={yMax}>
				<Pancake.Grid horizontal count={10} let:value>
					<div class="grid-line horizontal"><span>{value}</span></div>
				</Pancake.Grid>

				<Pancake.Grid vertical count={5} let:value>
					<span class="x-label">{value}</span>
				</Pancake.Grid>

				<Pancake.Svg>
					{#each data as unit}
						<Pancake.SvgLine data={unit.data} let:d>
							<path class="data" {d}></path>
						</Pancake.SvgLine>
					{/each}
				</Pancake.Svg>
				
			</Pancake.Chart>
		</div>
	</div>
</div>

<style>
	.chart {
		height: 400px;
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
		bottom: -22px;
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
		stroke: #ff3e00;
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
		background-color: #ff3e00;
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