<template>
    <div class="home">
        <balance></balance>
    </div>
</template>

<script>
import Balance from '@/components/Balance'
export default {
    name: 'Home',
    components: {
      Balance
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
