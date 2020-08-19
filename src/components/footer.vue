<template lang="pug">
    .footer
        .contact
            Form
        .social
            Coordinates
        .copyright
            Copyright
</template>

<script>
import Form from "./footer/form.vue";
import Coordinates from "./footer/coordinates.vue";
import Copyright from "./footer/copyright.vue";
export default {
    name: "Footer",
    components: {
        Form,
        Coordinates,
        Copyright
    }
}
</script>