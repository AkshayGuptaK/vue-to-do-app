<template>
	<div id="app">
	    <h1>Carpe Diem</h1>
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
			db: null,
			tasks: []
		}
	},
	mounted: function () {
		let vm = this
    	let request = window.indexedDB.open('tasks', 1) // db named tasks, version 1
    	request.onblocked = function () {
        	alert('Please close other instances of this site first')
    	}
    	request.onerror = function () {
        	alert('Database failed to load')
    	}
    	request.onsuccess = function () {
        	console.log('Database successfully loaded')
        	vm.db = request.result
        	vm.loadTasks()
    	}
    	request.onupgradeneeded = function(eve) { // fires if db doesn't exist or is outdated version
			vm.db = eve.target.result
        	let objectStore = vm.db.createObjectStore('tasks', { keyPath: 'id', autoIncrement:true })
        	objectStore.createIndex('name', 'name', { unique: false })
        	objectStore.createIndex('description', 'description', { unique: false })
        	objectStore.createIndex('completed', 'completed', { unique: false })
        	console.log('Database setup complete')
    	}
	},
	methods: {
		loadTasks () {
			let vm = this
    		let objectStore = this.db.transaction(['tasks'], 'readonly').objectStore('tasks')
    		let request = objectStore.openCursor()
    		request.onsuccess = function (eve) {
        		let cursor = eve.target.result
        		if(cursor) {
            		vm.tasks.push({ name: cursor.value.name, description: cursor.value.description, completed: cursor.value.completed, id: cursor.value.id})
            		cursor.continue()
        		} else {
		            console.log('Tasks all displayed')
        		}
    		}
		},
		openRWTransaction () {
		    let transaction = this.db.transaction(['tasks'], 'readwrite')
    		let objectStore = transaction.objectStore('tasks')
    		return [transaction, objectStore]
		},
		addTask (taskname, taskdesc) {
			let vm = this
		    let newTask = { name: taskname, description: taskdesc, completed: false }
		    let [transaction, objectStore] = this.openRWTransaction(this.db)
			var request = objectStore.add(newTask)
    		transaction.onerror = function() {
        		alert('Database modification failed.')
			}
    		transaction.oncomplete = function() {
        		console.log('Database successfully modified.')
				vm.tasks.push({ name: taskname, description: taskdesc, completed: false, id: request.result})
			}
		},
		delTask (delId) {
			let vm = this
		    let [transaction, objectStore] = this.openRWTransaction(this.db)
    		let request = objectStore.delete(delId)
		    transaction.oncomplete = function() {
				vm.tasks = vm.tasks.filter(task => {return task.id !== delId})
		        console.log('Task ' + delId + ' deleted')
    		}
		}
	}
}
</script>
<style>
h1 {
    text-align: center;
    font-size: 3rem;
}
</style>