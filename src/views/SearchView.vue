<script lang="ts">
import { defineComponent } from "vue";
import { useRoute } from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue";
import ipsum from "@/mocks/json/lorem/ipsum.json";

export default defineComponent({
  components: {
    MainLayout,
  },
  setup() {
    const route = useRoute();

    return {
      route,
    };
  },
  data() {
    return {
      ipsum,
    };
  },
  computed: {
    searchQuery() {
      return this.route.params.query;
    },
  },
});
</script>

<template>
  <MainLayout>
    <div class="content">
      <blockquote>
        <h1>Searched content: </h1> {{ searchQuery }}
      </blockquote>
      <br> <br>
      <p>
        {{ ipsum.text.repeat(120) }}
      </p>
    </div>
  </MainLayout>
</template>
