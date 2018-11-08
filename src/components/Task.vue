<template>
  <div class="task" :taskId ="id" :completed="completed">
    <input type="text" :disabled="editNameDisabled" class="taskname" v-model.lazy="taskname">
    <input type="text" :disabled="editDescDisabled" class="taskdesc" v-model.lazy="taskdesc">
    <button title="Edit Task" :class="editBtnState" @click="editTask"></button>
    <button title="Describe Task" :class="descBtnState" @click="describeTask"></button>
    <button title="Delete Task" class="deleteBtn" @click="$emit('del', id)"></button>
    <button title="Task Completed" :class="compBtnState" @click="$emit(completeTask, completed)"></button>
  </div>
</template>

<script>
export default {
    name: "Task",
    data () {
        return {
            editNameDisabled: true,
            editDescDisabled: true,
            editBtnState: 'editBtn',
            descBtnState: 'describeBtn',
            compBtnState: 'completeBtn',
            taskname: this.name,
            taskdesc: this.description
        }
    },
    props: {
        name: String,
        description: String,
        completed: Boolean,
        id: Number
    },
    methods: {
        editTask() {
            if (this.editNameDisabled) {
                this.editNameDisabled = false
                this.editBtnState = 'acceptNameEditBtn'
            } else if ( !/\S+/.test(this.taskname) ) {
                alert('Please enter a task name')
            } else {
            this.$emit('changeName', this.taskname, this.taskdesc)
            }
        },
        describeTask() {
            if (this.editDescDisabled) {
                this.editDescDisabled = false
                this.descBtnState = 'acceptDescEditBtn'
            } else {
                this.$emit('changeDesc', this.taskname, this.taskdesc)
            }
        }
    }
}
</script>

<style scoped>
.task {
    margin: 20px;
    display: grid;
    grid-template-columns: 1fr 30px 30px;
    grid-template-rows: 5fr 1fr 4fr;
    grid-column-gap: 5px;
    width: 95.4%;
}

input {
    background-color: rgba(245, 245, 220, 0.8);
    border: none;
    border-radius: 5px;
    color: grey;
    width: 99.5%;
    min-width: 75px;
    padding: 5px 0px 5px 5px;
    text-overflow: ellipsis;
}

.taskname {
    font-size: 1.5rem;
    margin: 0px 0px 5px 0px;
    grid-area: 1 / 1 / 3 / 2;
}

.taskdesc {
    font-size: 1rem;
    margin: 0px;
    grid-area: 3 / 1 / 4 / 2;
}

input[disabled] {
    color: black;
}

button:hover {
    background-color: lightblue;
}

.deleteBtn {
    background: url('../../images/delete.png') no-repeat local;
    background-size: 100% 100%;
    grid-area: 2 / 3 / 4 / 4;
}

.editBtn {
    background: url('../../images/edit.png') no-repeat local;
    background-size: 100% 100%;
    grid-area: 1 / 2 / 2 / 3;
}

.describeBtn {
    background: url('../../images/describe.png') no-repeat local;
    background-size: 100% 100%;
    grid-area: 2 / 2 / 4 / 3;
}

.completeBtn {
    background: url('../../images/complete.png') no-repeat local;
    background-size: 100% 100%;
    grid-area: 1 / 3 / 2 / 4;
}

.incompleteBtn {
    background: url('../../images/incomplete.png') no-repeat local;
    background-size: 100% 100%;
    grid-area: 1 / 3 / 2 / 4;
}

.acceptNameEditBtn, .acceptDescEditBtn {
    background: url('../../images/apply-change.png') no-repeat local;
    background-size: 100% 100%;
}

.acceptNameEditBtn {
    grid-area: 1 / 2 / 2 / 3;
}

.acceptDescEditBtn {
    grid-area: 2 / 2 / 4 / 3;
}
</style>