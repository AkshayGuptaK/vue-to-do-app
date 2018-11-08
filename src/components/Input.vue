<template>
    <form>
        <input type="text" id="inputTaskName" name="TaskName" v-model.lazy="name" placeholder="Enter a Task">
        <button title="Add Task" @click.prevent="$emit('add', name, desc)"></button>
        <input type="text" id="inputTaskDescription" name="TaskDescription" v-model.lazy="desc" placeholder="Enter a Description">
    </form>
</template>

<script>
export default {
    name: "Input",
    data () {
        return {
            name: '',
            desc: ''
        }
    }
}
</script>

<style scoped>
form {
    margin: 20px;
    display: table;
    width: 100%;
}

input {
    display: table-cell;
    vertical-align: middle;
    width: 95%;
    min-width: 100px;
    background-color: beige;
    border-radius: 5px;
}

#inputTaskName {
    font-size: 1.5rem;
    margin: 0px 5px 5px 0px;
}

#inputTaskDescription {
    font-size: 1rem;
    margin-right: 5px;
}

button {
    background: url('../../images/add.png') no-repeat local;
    background-size: 100% 100%;
    padding: 11px;
    border-radius: 5px;
    display: table-cell;
    vertical-align: middle;
    margin: 0px 0px 5px 0px;
}
</style>