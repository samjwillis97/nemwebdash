<script>
    export let text = ""
    export let checked = false
</script>

<div class="w-full flex flex-col items-center mx-auto">
    <div class="w-full px-4 my-1 p-0.5 items-center mx-auto">
        <input type="checkbox" class="mx-1" bind:checked={checked}>  { text }
    </div>
</div>
