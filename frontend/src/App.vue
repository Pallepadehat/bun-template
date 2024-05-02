<script setup lang="ts">
import { onMounted, ref } from "vue";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "./lib/api";

const totalSpent = ref(0);

async function fetchTotalSpent() {
  const res = await api.expenses["total-spent"].$get();
  const data = await res.json();
  totalSpent.value = data.total;
  console.log(data);
}

onMounted(() => {
  fetchTotalSpent();
});
</script>

<template>
  <div class="px-20 flex items-center justify-center w-full min-h-screen">
    <Card class="w-[350px]">
      <CardHeader>
        <CardTitle>Total Spent</CardTitle>
        <CardDescription>The total amount you´ve spent</CardDescription>
      </CardHeader>
      <CardContent>Amount: {{ totalSpent }} </CardContent>
    </Card>
  </div>
</template>
