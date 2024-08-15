import {
  deleteExpense,
  getExpensesQueryOptions,
  loadingCreateExpenseQueryOptions,
} from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_auth/expenses")({
  component: Expenses,
});

function Expenses() {
  const { isPending, error, data } = useQuery(getExpensesQueryOptions);
  const { data: loadingCreateExpense } = useQuery(
    loadingCreateExpenseQueryOptions
  );
  if (error) return "An error has occurred: " + error.message;

  return (
    <div className=" max-w-3xl m-auto">
      <Table>
        <TableCaption>A list of all your Expenses</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Date</TableHead>
            <TableHead className="text-right">Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loadingCreateExpense?.expense && (
            <TableRow>
              <TableCell>
                <Skeleton className=" h-4" />
              </TableCell>
              <TableCell>{loadingCreateExpense?.expense.title}</TableCell>
              <TableCell className="text-right">
                {loadingCreateExpense?.expense.amount}
              </TableCell>
              <TableCell className="text-right">
                {loadingCreateExpense?.expense.date.split("T")[0]}
              </TableCell>
            </TableRow>
          )}
          {isPending
            ? Array(3)
                .fill(0)
                .map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className=" h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className=" h-4" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className=" h-4" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className=" h-4" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className=" h-4" />
                    </TableCell>
                  </TableRow>
                ))
            : data?.expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{expense.id}</TableCell>
                  <TableCell>{expense.title}</TableCell>
                  <TableCell className="text-right">{expense.amount}</TableCell>
                  <TableCell className="text-right">
                    {expense.date.split("T")[0]}
                  </TableCell>
                  <TableCell className="text-right">
                    <ExpenseDeleteButton id={expense.id} />
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ExpenseDeleteButton({ id }: { id: number }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteExpense,
    onError: () => {
      toast.error("Error", { description: "Failed to delete expense" });
    },
    onSuccess: () => {
      toast.success("Successs", {
        description: "Expense deleted successfully",
      });
      queryClient.setQueryData(
        getExpensesQueryOptions.queryKey,
        (existingExpenses) => ({
          ...existingExpenses,
          expenses: existingExpenses
            ? existingExpenses.expenses.filter((e) => e.id !== id)
            : [],
        })
      );
    },
  });
  return (
    <Button
      disabled={mutation.isPending}
      onClick={() => mutation.mutate({ id })}
      variant={"outline"}
      size={"sm"}
    >
      <TrashIcon className=" h-4 w-4" />
    </Button>
  );
}
