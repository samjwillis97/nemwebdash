<!-- component -->
<!-- built from -->
<!-- https://tailwindcomponents.com/component/multi-select -->
<style>
    .top-100 {top: 100%}
    .max-h-select {
        max-height: 300px;
    }
</style>

<div class="w-full flex flex-col items-center mx-auto">
    <div class="w-full px-4">
        <div class="flex flex-col items-center relative">
            <div class="w-full">
                <div class="my-2 p-0.5 flex border border-gray-300 bg-white rounded">
                    <div class="flex flex-auto flex-wrap">
                        <!-- {#each selected as item} -->
                        {#if selected.length > 0}
                        <div class="flex justify-center items-center m-1 font-medium py-1 px-2 rounded-full text-teal-700 bg-teal-100 border border-teal-300">
                            <div class="text-xs font-normal leading-none max-w-full flex-initial">{ selected[0] }</div>
                            <div class="flex flex-auto flex-row-reverse">
                                <div>
                                    <svg on:click={toggleSelectedString(selected[0])} xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x cursor-pointer hover:text-teal-400 rounded-full w-4 h-4 ml-2">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        {/if}
                        {#if selected.length > 1}
                        <div class="flex justify-center items-center m-1 font-medium py-1 px-2">
                            <div class="text-gray-400 text-xs font-normal leading-none max-w-full flex-initial">{"+" + (selected.length - 1) + " more"}</div>
                        </div>
                        {/if}
                        <div class="flex-1">
                            <input
                            bind:value={search}
                            on:pointerdown={toggleDropDown}
                            placeholder={ placeholderText }
                            class="bg-transparent p-1 px-2 appearance-none outline-none h-full w-full text-gray-800">
                        </div>
                    </div>
                    {#if selected.length > 0 || search != null }
                    <div class="text-gray-300 w-8 py-1 pl-2 pr-1 flex items-center border-gray-300">
                        <button on:click={clearSelection} class="cursor-pointer w-6 h-6 text-gray-600 outline-none focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-up w-4 h-4">
                                <polyline points="18,9 9,18"></polyline>
                                <polyline points="9,9 18,18"></polyline>
                            </svg>
                        </button>
                    </div>
                    {/if}
                    <div class="text-gray-300 w-8 py-1 pl-2 pr-1 border-l flex items-center border-gray-300">
                        <button on:click={toggleDropDown} class="cursor-pointer w-6 h-6 text-gray-600 outline-none focus:outline-none">
                            {#if dropdown}
                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-up w-4 h-4">
                                <polyline points="18,15 12,9 6,15"></polyline>
                            </svg>
                            {:else}
                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-up w-4 h-4">
                                <polyline points="18 9 12 15 6 9"></polyline>
                            </svg>
                            {/if}
                        </button>
                    </div>
                </div>
            </div>
            {#if dropdown}
            <div transition:slide class="absolute shadow top-100 bg-white z-40 w-full lef-0 rounded max-h-select overflow-y-auto">
                <div class="flex flex-col w-full">
                    {#each displayedList as item}
                    <div on:click={toggleSelected} class={"cursor-pointer w-full border-gray-200 rounded-t border-b " + ((selected.indexOf(item) != -1) ? "bg-teal-50" : "") + " hover:bg-teal-100"}>
                        <div class={"flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative " + ((selected.indexOf(item) != -1) ? "border-teal-600" : "hover:border-teal-100")}>
                            <div class="w-full items-center flex">
                                <div class="mx-2 leading-6">{item}</div>
                            </div>
                        </div>
                    </div>
                    {/each}
                </div>
            </div>
            {/if}
        </div>
    </div>
</div>

<script>
    import { slide } from 'svelte/transition';

    let search
    let dropdown = false 
    export let placeholder = ""
    export let list = []
    export let selected = []

    $: placeholderText = getPlaceholder()
    $: getPlaceholder = () => {
        if (selected.length > 0) {
            return ""
        } else {
            return placeholder
        }
    }
    
    $: displayedList = getDisplayList()
    $: getDisplayList = () => {
        if (search != null) {
            return list.filter(e => e.includes(search))    
        }
        return list
    }

    function toggleDropDown() {
        dropdown = !dropdown
    }

    // Use for Div
    function toggleSelected(event) {
        let toToggle = event.target.textContent
        if (selected.indexOf(toToggle) == -1) {
            addSelected(toToggle)
        } else {
            removeSelected(toToggle)
        }
    }

    // Use for SVG Button
    function toggleSelectedString(event) {
        let toToggle = event
        if (selected.indexOf(toToggle) == -1) {
            addSelected(toToggle)
        } else {
            removeSelected(toToggle)
        }
    }

    function clearSelection() {
        selected = []
        search = null
        dropdown = false
    }

    function addSelected(toAdd) {
        selected = [...selected, toAdd]
    }

    function removeSelected(toRemove) {
        selected = selected.filter(t => t != toRemove)
    }

</script>