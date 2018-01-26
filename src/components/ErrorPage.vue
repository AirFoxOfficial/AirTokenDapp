<template>
    <div class="error">
    	<h1>Error - Not found</h1>
        <p>{{ msg }}</p>
    </div>
</template>

<script>
export default {
    name: 'ErrorPage',
    data () {
        return {
            msg: 'Sorry, we could not process your request.'
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
