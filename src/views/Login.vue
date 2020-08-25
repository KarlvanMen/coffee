<template lang="pug">
  main.main
    .container
        h1 Welcome
        form.form(@submit.prevent="onsubmit")
            input( type="text" placeholder="Username" v-model="user")
            input( type="password" placeholder="Password" v-model="pass")
            button.login(type="submit") Login
</template>

<script>
import axios from "axios";
import { mapMutations } from 'vuex';

export default {
    data: ()=> {
        return {
            user: '',
            pass: ''
        }
    },
    methods: {
        ...mapMutations([
            'setJwt',
        ]),
        onsubmit() {
            const getToken = async () => {
                try {
                    const token = await axios.post('http://localhost:1337/auth/local', {
                        identifier: this.user,
                        password: this.pass,
                    });
					this.setJwt(token.data.jwt)
					this.$router.push({name: 'Admin'})
                    return {token, isAuthError: false};
                } catch (err) {
                    // throw new Error('Unable to establish a login session.'); // here I'd like to send the error to the user instead
                    console.log(err)
                    return {err, isAuthError: true};
                }
            };
            getToken()
        }
    },
}
</script>

<style lang="scss" scoped>

$prim: #53e3a6;

::-webkit-input-placeholder { /* WebKit browsers */
    font-weight: 300;
}
:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    opacity:  1;
    font-weight: 300;
}
::-moz-placeholder { /* Mozilla Firefox 19+ */
    opacity:  1;
    font-weight: 300;
}
:-ms-input-placeholder { /* Internet Explorer 10+ */
    font-weight: 300;
}
.main{
	background: #50a3a2;
    background: -webkit-linear-gradient(top left, #50a3a2 0%, #53e3a6 100%);
    background: -moz-linear-gradient(top left, #50a3a2 0%, #53e3a6 100%);
    background: -o-linear-gradient(top left, #50a3a2 0%, #53e3a6 100%);
    background: linear-gradient(to bottom right, #50a3a2 0%, #53e3a6 100%);
	
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
    bottom: 0;
	overflow: hidden;
	
	&.form-success{
		.container{
			h1{
				transform: translateY(85px);
			}
		}
	}
}

.container{
	max-width: 600px;
	margin: 0 auto;
	padding: 80px 0;
	height: 400px;
	text-align: center;
	
	h1{
		font-size: 40px;
		transition-duration: 1s;
		transition-timing-function: ease-in-put;
		font-weight: 200;
	}
}

form{
	padding: 20px 0;
	position: relative;
	z-index: 2;
	
	input{
		display: block;
		appearance: none;
		outline: 0;
		border: 1px solid white;
		background-color: white;
		border: 1px solid rgba($color: #fff, $alpha: 0.6);
		background-color: rgba($color: #fff, $alpha: 0.8);
		width: 250px;
		
		border-radius: 3px;
		padding: 10px 15px;
		margin: 0 auto 10px auto;
		display: block;
		text-align: center;
		font-size: 18px;
		
		transition-duration: 0.25s;
		font-weight: 300;
		
		&:hover{
			background-color: rgba($color: #fff, $alpha: 0.6);
		}
		
		&:focus{
			background-color: white;
			width: 300px;
			
			color: $prim;
		}
	}
	
	button{
		appearance: none;
		outline: 0;
		background-color: white;
		border: 0;
		padding: 10px 15px;
		color: $prim;
		border-radius: 3px;
		width: 250px;
		cursor: pointer;
		font-size: 18px;
		transition-duration: 0.25s;
		
		&:hover{
			background-color: rgb(245, 247, 249);
		}
	}
}

</style>