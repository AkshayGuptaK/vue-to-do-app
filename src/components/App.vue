<template>
	<div id="app">
		<Input @add="addTask"/>
		<Task
		 v-for="task in tasks"
		 :key="task.id"
		 :name="task.name"
		 :description="task.description"
		 :completed="task.completed"
		 :id="task.id"
		 @del="delTask"
		/>
	</div>
</template>

<script>
import Input from './Input.vue'
import Task from './Task.vue'

export default {
	components: {
		Input, Task
	},
	data () {
		return {
			tasks: [] // fetch from db
		}
	},
	methods: {
		addTask (taskname, taskdesc) {
			this.tasks.push({ name: taskname, description: taskdesc, completed: true, id: 1}) // get id from db
		},
		delTask (delId) {
			this.tasks = this.tasks.filter(task => {return task.id !== delId})
		}
	}
}
</script>

<style>
</style>