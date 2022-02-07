<script>
	import Select from 'svelte-select';
	import { DateInput } from 'date-picker-svelte';
	import { onMount } from 'svelte';

	let baseURL = 'http://localhost:3006'

	let units = [];

	let functionList = ['mean', 'last'];
	let functionSelection = null

	let windowNumber = {
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
	let windowSelection = null

	let startDate = new Date();
	let endDate = new Date();

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
			console.log(json)
			units = json
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
			/>
		</div>
		<div class="flex flex-wrap h-48 border rounded border-gray-200 place-content-center justify-center ">
			{#if units.length > 0}
			<div class="w-full overflow-auto h-48">
				{#each units as item}
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
	<div class="w-full md:w-7/12 border border-gray-400 rounded ">
	</div>
</div>