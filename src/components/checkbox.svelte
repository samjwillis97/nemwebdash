<div class="w-full flex flex-col items-center mx-auto">
    <div class="w-full px-4 my-3 p-0.5">
        <input type="checkbox" class="mx-1" bind:checked={checked}>  { text }
    </div>
</div>

<script>
    export let text = ""
    export let checked = false
</script>