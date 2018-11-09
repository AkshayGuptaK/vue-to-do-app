<template>
	<div id="app">
	    <h1>Carpe Diem</h1>
		<Input @add="addTask"/>
        <div class="divider"></div>
		<p v-if="tasks.filter(task => {return !task.completed}).length===0" >Twiddling my thumbs, nothing to do.</p>
		<Task
		 v-for="task in tasks.filter(task => {return !task.completed})"
		 :key="task.id"
		 :name="task.name"
		 :description="task.description"
		 :completed="task.completed"
		 :id="task.id"
		 @del="delTask"
		 @changeName="acceptNameEdit"
		 @changeDesc="acceptDescEdit"
		 @complete="setCompleted"
		/>
        <div class="divider"></div>
        <h2>Completed</h2>
		<Task
		 v-for="task in tasks.filter(task => {return task.completed})"
		 :key="task.id"
		 :name="task.name"
		 :description="task.description"
		 :completed="task.completed"
		 :id="task.id"
		 @del="delTask"
		 @changeName="acceptNameEdit"
		 @changeDesc="acceptDescEdit"
		 @complete="setCompleted"
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
			tasks: [],
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
		loadTasks () { // initial fetch from db and store in arrays
			let vm = this
    		let objectStore = vm.db.transaction(['tasks'], 'readonly').objectStore('tasks')
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
		// Helper methods
		openRWTransaction () {
		    let transaction = this.db.transaction(['tasks'], 'readwrite')
    		let objectStore = transaction.objectStore('tasks')
    		return [transaction, objectStore]
		},
		getTaskData (db, taskId) { // retrieves data corresponding to task id
    		let objectStore = this.openRWTransaction(db)[1]
    		let request = objectStore.get(taskId)
    		return [objectStore, request]
		},
		storeTaskData (eve, objectStore, field, value) { // updates task data with one value alteration
    		let data = eve.target.result
    		data[field] = value
    		let request = objectStore.put(data)
    		return request
		},
		// Button click response methods
		addTask (taskname, taskdesc) { // add task with inputted parameters to db and display it
			let vm = this
		    let newTask = { name: taskname, description: taskdesc, completed: false }
		    let [transaction, objectStore] = vm.openRWTransaction(vm.db)
			var request = objectStore.add(newTask)
    		transaction.onerror = function() {
        		alert('Database modification failed.')
			}
    		transaction.oncomplete = function() {
        		console.log('Database successfully modified.')
				vm.tasks.push({ name: taskname, description: taskdesc, completed: false, id: request.result})
			}
		},
		delTask (delId) { // delete task from db and display
			let vm = this
		    let [transaction, objectStore] = vm.openRWTransaction(vm.db)
    		let request = objectStore.delete(delId)
		    transaction.oncomplete = function() {
				vm.tasks = vm.tasks.filter(task => {return task.id !== delId})
		        console.log('Task ' + delId + ' deleted')
    		}
		},
		acceptNameEdit (name, taskId) { // save changes to a name description edit
			let vm = this
			let [objectStore, request] = vm.getTaskData(vm.db, taskId)

		    request.onsuccess = function (eve) {
        		let requestUpdate = vm.storeTaskData(eve, objectStore, 'name', name)
        		requestUpdate.onerror = function() {
            		alert('Database modification failed.')
        		}
        		requestUpdate.onsuccess = function() {
            		console.log('Database successfully modified.')
        		}
    		}
		},
		acceptDescEdit (desc, taskId) { // save changes to a task description edit
			let vm = this
		    let [objectStore, request] = vm.getTaskData(vm.db, taskId)

		    request.onsuccess = function (eve) {
        		let requestUpdate = vm.storeTaskData(eve, objectStore, 'description', desc)
        		requestUpdate.onerror = function() {
            		alert('Database modification failed.')
        		}
	        	requestUpdate.onsuccess = function() {
    	        	console.log('Database successfully modified.')
        		}
    		}
		},
		setCompleted (completed, taskId) { // response to click on complete or incomplete buttons
			let vm = this
    		let [objectStore, request] = vm.getTaskData(vm.db, taskId)
			completed = !completed

		    request.onsuccess = function (eve) {
        		let requestUpdate = vm.storeTaskData(eve, objectStore, 'completed', completed)
		        requestUpdate.onerror = function() {
        		    alert('Database modification failed.')
        		}
        		requestUpdate.onsuccess = function() {
            		console.log('Database successfully modified.')
					let i = vm.tasks.map(x => x.id).indexOf(taskId)
					vm.tasks[i].completed = completed
        		}
    		}
		}
	}
}
</script>
<style>
@import url('https://www.fontify.me/wf/48f3e12c04a64dde546f078f61fa84bc');

h1 {
    text-align: center;
    font-size: 3rem;
    font-family: font89786;
}
h2 {
    text-align: center;
    font-size: 2rem;
    font-family: font89786;
}
p {
    text-align: center;
    font-size: 1.5rem;
    font-family: font89786;
}
.divider {
    margin: auto;
    width: 80%;
    padding-top: 10px;
    border-bottom: solid blue 1px;
}
</style>