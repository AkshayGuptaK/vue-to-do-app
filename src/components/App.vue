<template>
	<div id="app">
		<Input/>
	</div>
</template>

<script>
import Input from './Input.vue'

export default {
	components: {
		Input
	},
	methods: {
		addTask (name, desc) {
			console.log(name, desc) // placeholder
		}
	}
}
</script>

<style>
</style>