<script>
import Textfield from "../components/textfield.svelte";
import Checkbox from "../components/checkbox.svelte";
import MultiSelect from "../components/multi-select.svelte";
import Dropdown from "../components/dropdown.svelte";

let testList = ["Test", "Test1", "Test2", "Test3", "Test4"]
let testSelected = []

let testList2 = ["m", "d", "h"]
</script>

<!-- Checkboxes for -> Rooftop, Demand -->
<!-- Range will be a text field with dropdown for h/m/s/d/w/mo -->
<!-- Dropdowns for Aggregate and Function  -->

<div class="flex justify-center">
	<div class="mb-3 xl:w-96">
		<Textfield placeholder="Search..." />
	</div>
	<div class="mb-3 w-96">
		<MultiSelect
		placeholder="Test List"
		list={testList}
		selected={testSelected}/>
	</div>
	<div class="mb-3 w-96">
		<Checkbox text="Rooftop"/>
	</div>
	<div class="mb-3 w-96">
		<Dropdown/>
	</div>
</div>

