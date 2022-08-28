<script>
    export let value = ""
    export let placeholder = ""
    export let onInput = function() {}
</script>

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
        bind:value={value}
		placeholder={placeholder}
        on:input={onInput}
    />
</div>

<style>
    input {
		font-size: 14px;
        padding: 0.5em
    }

</style>
