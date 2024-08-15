import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const Route = createFileRoute("/_auth/")({
  component: Index,
});

async function getTotalSpent() {
  const res = await api.expenses["total-spent"].$get();
  if (!res.ok) {
    throw new Error("server error");
  }
  const data = await res.json();
  return data;
}

function Index() {
  const { isPending, error, data } = useQuery({
    queryKey: ["get-total-spent"],
    queryFn: getTotalSpent,
  });
  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <Card className=" w-[400px] m-auto">
      <CardHeader>
        <CardTitle>Total Spent</CardTitle>
        <CardDescription>Total amount spent</CardDescription>
      </CardHeader>
      <CardContent>{data.total}</CardContent>
    </Card>
  );
}
