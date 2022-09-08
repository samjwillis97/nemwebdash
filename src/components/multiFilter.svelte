<script>
	import Select from 'svelte-select';

    export let selected = null
    export let items = []
    export let placeholder = ""
    export let callback = function() {} 
    
    let showPlaceholder = true
    if (selected && selected.length > 0) {
        showPlaceholder = false
    }

	function onSelect(event) {
		if (event.detail != null) {
			selected = (event.detail.map((v) => {
				return v.value
			}))
            if (selected.length === 0) {
                showPlaceholder = true
            } else {
                showPlaceholder = false
            }
		} else {
			selected = []
            showPlaceholder = true
		}
        callback()
	}

    function handleClear() {
        if (selected.length === 1) {
            showPlaceholder = true
        }
    }

</script>

<div class="w-full">
    <Select
        items={items}
        value={selected}
        placeholder={placeholder}
        placeholderAlwaysShow={showPlaceholder}
        isClearable={false}
        isMulti={true}
        isSearchable={true}
        showIndicator={true}
        on:clear={handleClear}
        on:select={onSelect}
    />
</div>

<style>
</style>
