<script>
	import * as Pancake from '@sveltejs/pancake';
    import { loading } from '../stores/state.js';
    import { units } from '../stores/unit.js';

	let closest;
    export let data = []

    let processed = []
    let points = []

    let isLoading = false;
    loading.subscribe(value => {
        isLoading = value;
    })

    $: {
        if (data && data.length > 0) {
            processed = preProcessData(data)
            calcMinMax(processed)
            points = processed.reduce((points, unit) => {
                return points.concat(unit.data.map(d => ({
                    x: d.x,
                    y: d.y,
                    unit
                })));
            }, []);
        }
    }

	function preProcessData(data) {
		const processed = data.map(unit => {
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
        return processed
	}

	$: xMin = +Infinity;
	$: xMax = -Infinity;
	$: yMin = +Infinity;
	$: yMax = -Infinity;

	function calcMinMax(data) {
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

	function getUnitStationName(unit) {
        let name = ($units.filter((v) => {
			return v.duid == unit
        }))
        if (name & name.length > 0) {
            return name[0].station_name
        }
        return ""
	}

</script>

{#if isLoading || processed && processed.length == 0}
<div class="flex flex-wrap w-full h-full border place-content-center text-gray-600 justify-center rounded">
    <div>
        {isLoading ? "Loading..." : "No Data to Plot 😔"}
    </div>
</div>
{:else}
<div class="flex flex-wrap w-full h-full rounded place-content-center justify-center">
    <div class="w-full h-full py-5 pb-12 pl-10">
        <Pancake.Chart x1={xMin} x2={xMax} y1={yMin} y2={yMax}>
            <Pancake.Grid horizontal count={10} let:value let:last>
                <div class="grid-line horizontal">
                    <span class="">{value} {last ? "MW" : ""}</span>
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
                {#each processed as unit}
                    <Pancake.SvgLine data={unit.data} let:d>
                        <path class="processed" {d}></path>
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
                        <div class="font-bold">{closest.unit.unit.replace("+", " - ")}</div>
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


<style>
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

	path.processed {
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

	.annotation span {
		display: block;
		font-size: 14px;
	}
</style>
