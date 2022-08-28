<script>
    export let items = null
    export let titleProperty = ""
    export let subtitleProperty = ""
    export let showSubtitle = true
</script>

<div class="w-full h-full overflow-y-scroll border rounded border-gray-200 place-content-center justify-center ">
    {#if items && items.length > 0}
    <div class="w-full border-b border-gray-300">
        {#each items as item}
        <div class="w-full border-b border-gray-300 pl-2 py-1">
            <div class="text-sm font-semibold">{item[titleProperty]}</div>
            {#if showSubtitle && subtitleProperty !== ""}
            <div class="text-xxs text-gray-400">{item[subtitleProperty]}</div>
            {/if}
        </div>
        {/each}
    </div>
    {:else}
    <div>
        No Content Found 😔
    </div>
    {/if}
</div>


<style>
</style>
