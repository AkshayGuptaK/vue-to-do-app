<template>
	<div id="app">
	    <h1>Carpe Diem</h1>
		<Input @add="addTask"/>
        <div class="divider"></div>
		<p v-if="tasksCurrent.length===0" >Twiddling my thumbs, nothing to do.</p>
		<Task
		 v-for="task in tasksCurrent"
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
		 v-for="task in tasksComplete"
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
			tasksCurrent: [],
			tasksComplete: []
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
					if (cursor.value.completed) {
						vm.tasksComplete.push({ name: cursor.value.name, description: cursor.value.description, completed: true, id: cursor.value.id})
					} else {
						vm.tasksCurrent.push({ name: cursor.value.name, description: cursor.value.description, completed: false, id: cursor.value.id})
					}
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
				vm.tasksCurrent.push({ name: taskname, description: taskdesc, completed: false, id: request.result})
			}
		},
		delTask (delId) {
			let vm = this
		    let [transaction, objectStore] = vm.openRWTransaction(vm.db)
    		let request = objectStore.delete(delId)
		    transaction.oncomplete = function() {
				vm.tasksCurrent = vm.tasksCurrent.filter(task => {return task.id !== delId})
				vm.tasksComplete = vm.tasksComplete.filter(task => {return task.id !== delId})
		        console.log('Task ' + delId + ' deleted')
    		}
		},
		acceptNameEdit (name, taskId) {
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
		setCompleted (completed, taskId) {
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
            		if (completed) {
						let i = vm.tasksCurrent.map(x => x.id).indexOf(taskId)
						vm.tasksCurrent[i].completed = completed
						vm.tasksComplete.push(vm.tasksCurrent.splice(i, 1)[0])
            		} else {
						let i = vm.tasksComplete.map(x => x.id).indexOf(taskId)
						vm.tasksComplete[i].completed = completed
						vm.tasksCurrent.push(vm.tasksComplete.splice(i, 1)[0])
					}
        		}
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
h2 {
    text-align: center;
    font-size: 2rem;
}
p {
    text-align: center;
    font-size: 1.5rem;
}
.divider {
    margin: auto;
    width: 80%;
    padding-top: 10px;
    border-bottom: solid blue 1px;
}
</style>