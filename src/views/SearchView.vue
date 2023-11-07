<script lang="ts">
import { ref, defineComponent } from "vue";
import { useRoute } from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue";
import ipsum from "@/mocks/json/lorem/ipsum.json";

export default defineComponent({
  components: {
    MainLayout,
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
  setup() {
    const route = useRoute();

    return {
      route,
    };
  },
});
</script>

<template>
  <MainLayout>
    <div class="content">
      <blockquote>
        <h1>Searched content: </h1> {{ searchQuery }}
      </blockquote>
      <br /> <br />
      <p>
        {{  ipsum.text.repeat(120) }}
      </p>
    </div>
  </MainLayout>
</template>
