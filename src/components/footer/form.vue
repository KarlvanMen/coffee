<template lang="pug">
    .form.shifted-border
        .title
            h2 Contact us
        form(@submit.prevent="onsubmit")
            .left
                .half.floating-label
                    input(type="text" id="name_input" placeholder=" ")
                    label.title(for="name_input") Name:
                .half.floating-label
                    input(type="email" id="email_input" placeholder=" ")
                    label.title(for="email_input") E-mail:
                .full.floating-label
                    textarea(id="message_input" max-length="800" placeholder=" " v-on:keyup="changeHeight($event)")
                    label.title(for="message_input") Message:
            .right
                .full
                    button.submit.title.shifted-border(type="submit") send
</template>

<script>
export default {
    name: "Form",
    methods: {
        changeHeight: (event) => {
            let target = event.target
            let height = target.getBoundingClientRect().height
            let scrollHeight = target.scrollHeight
            let maxHeight = 100
            if (height < scrollHeight && scrollHeight < maxHeight) {
                target.style.height = `${scrollHeight + 1}px`
            }
        },
        onsubmit: () => {

        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../scss/common.scss';
.form{
    width: 80%;
    max-width: 960px;
    margin: 2em auto;
    padding: 1.5em 0.75em;
    form{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        align-items: flex-end;
        input,
        textarea{
            width: 100%;
            outline: none;
            border: none;
            font-size: 1em;
            border-bottom: 1px solid black;
            &:focus{
                border-color: $coffee-brown;
                & + label{
                    color: $coffee-brown;
                }
            }
        }
        .half,
        .full{
            padding: 5px;
            border-radius: 3px;
            margin: 5px;
        }
        .half{
            width: calc(50% - 10px);
            display: inline-block;
            float: left;
        }
        .full{
            width: calc(100% - 10px);
            float: left;
        }
        .left{
            flex: 1 1 100%;
            @media all and (min-width: 800px) {
                flex: 1 1 70%;
            }
        }
        .right{
            flex: 1 1 100%;
            @media all and (min-width: 800px) {
                flex: 1 1 30%;
            }
        }
        #message_input{
            overflow: hidden;
            resize: none;
        }
        .floating-label{
            position:  relative;
            margin-bottom:  1em;
            margin-top: 1em;
            label{
                color:  #000;
                position:  absolute;
                top: -1em;
                left:  5px;
                transform:  translateY(0);
                cursor: text;
            }
            textarea,
            input{
                &:not(:focus) + label{
                    transform:  translateY(1.45em);
                    font-size:  0.95em;
                }
                &:focus + label,
                &:not(:placeholder-shown) + label{
                    transform:  translateY(0);
                    font-size:  0.8em;
                }
            }
        }
        .submit{
            margin-bottom: 1em;
            padding: 1em 4em;
            color: $coffee-brown;
            transition: all 0.3s;
            &:hover{
                background-color: $coffee-brown;
                color: white;
                cursor: pointer;
            }
        }
    }
}
.shifted-border{
    position: relative  ;
    background: white;
    border: 1px solid $coffee-brown;
    &::before{
        content: "";
        position: absolute;
        top: 10px;
        left: 10px;
        right: -10px;
        bottom: -10px;
        border: 1px solid $coffee-brown ;
        z-index: -100;
    }
}
</style>