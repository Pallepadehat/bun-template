<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart } from "@/components/ui/chart-bar";
import { api } from "./lib/api";
import { formatDateTime } from "./lib/utils";
import { Button } from "@/components/ui/button";

const totalSpent = ref(0);
const totalExpenses = ref(0);
const chartData = ref<ChartExpenses[]>([]);

type TotalExpense = {
  total: number;
};

type Expense = {
  id: number;
  title: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
};

type ChartExpenses = {
  createdAt: string;
  amount: number;
  title: string;
};

async function fetchData() {
  try {
    const [totalSpentRes, expensesRes, totalExpensesRes] = await Promise.all([
      api.expenses["total-spent"].$get(),
      api.expenses.$get(),
      api.expenses["total-expenses"].$get(),
    ]);

    const totalSpentData: TotalExpense = await totalSpentRes.json();
    totalSpent.value = totalSpentData.total;

    const expensesResponse: { expenses: Expense[] } = await expensesRes.json();
    chartData.value = expensesResponse.expenses.map((expense: Expense) => ({
      createdAt: formatDateTime(String(expense.createdAt)),
      amount: expense.amount,
      title: expense.title,
    }));

    const totalExpense: TotalExpense = await totalExpensesRes.json();
    totalExpenses.value = totalExpense.total;
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
}

onMounted(fetchData);
</script>

<template>
  <div
    class="px-20 flex items-center justify-center flex-col w-full min-h-screen"
  >
    <div class="grid grid-cols-2 gap-2 items-center">
      <div>
        <Card class="w-[350px]">
          <CardHeader>
            <CardTitle>Total Spent</CardTitle>
            <CardDescription>The total amount you´ve spent</CardDescription>
          </CardHeader>
          <CardContent>Amount: {{ totalSpent }} </CardContent>
        </Card>
      </div>
      <div>
        <Card class="w-[350px]">
          <CardHeader>
            <CardTitle>Total Expenses</CardTitle>
            <CardDescription
              >The total amount of expenses you have</CardDescription
            >
          </CardHeader>
          <CardContent>Amount: {{ totalExpenses }} </CardContent>
        </Card>
      </div>
    </div>
    <div class="w-full max-w-[700px] flex flex-col gap-2 mt-5">
      <div class="w-full flex items-center justify-end">
        <Button>Create expense</Button>
      </div>
      <BarChart
        class="w-full h-[400px] mt-10"
        :data="chartData"
        index="createdAt"
        :categories="['amount']"
        :y-formatter="
          (tick) => {
            return typeof tick === 'number'
              ? `${new Intl.NumberFormat('da-DK').format(tick)} kr.`
              : '';
          }
        "
      />
    </div>
  </div>
</template>
