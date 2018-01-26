<template>
	<div class="metamask">
		<h1>Please, setup MetaMask to access Airfox dApp</h1>
		<div class="download">
			<a href="https://metamask.io/" target="_blank">
				<img src="/static/download-metamask.png" alt="Download metamask" />
			</a>
		</div>
	</div>
</template>

<script>
import Vue from 'vue'
import {errorHandler} from '../utils/handler';

export default {
	name: 'metamask',
	data () {
		return {
		}
	}
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.metamask {
	height: 100%;
	width: 100%;
	text-align: center;
}

.download {
	
}

</style>