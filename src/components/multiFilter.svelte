<script>
	import Select from 'svelte-select';

    export let items = []
    export let selected = null
    export let placeholder = ""
    export let callback = function() {} 

	function onSelect(event) {
		if (event.detail != null) {
			selected = (event.detail.map((v) => {
				return v.value
			}))
            callback()
		} else {
			selected = null
		}
	}

</script>

<div class="w-full">
    <Select
        items={items}
        placeholder={placeholder}
        isClearable={false}
        isMulti={true}
        isSearchable={true}
        showIndicator={true}
        on:select={onSelect}
    />
</div>

<style>
</style>
