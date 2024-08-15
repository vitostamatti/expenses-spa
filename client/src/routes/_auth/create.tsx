import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { Calendar } from "@/components/ui/calendar";

import { useForm } from "@tanstack/react-form";
import type { FieldApi } from "@tanstack/react-form";
import {
  createExpense,
  getExpensesQueryOptions,
  loadingCreateExpenseQueryOptions,
} from "@/lib/api";

import { createExpenseSchema } from "@server/types";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <em className=" text-destructive text-xs">
          {field.state.meta.errors.join(", ")}
        </em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

export const Route = createFileRoute("/_auth/create")({
  component: Create,
});

function Create() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      title: "",
      amount: "0",
      date: new Date().toISOString(),
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      const existingExpenses = await queryClient.ensureQueryData(
        getExpensesQueryOptions
      );
      navigate({ to: "/expenses" });

      //loading state
      queryClient.setQueryData(loadingCreateExpenseQueryOptions.queryKey, {
        expense: value,
      });
      try {
        const newExpense = await createExpense({ value });
        queryClient.setQueryData(getExpensesQueryOptions.queryKey, {
          ...existingExpenses,
          expenses: [newExpense, ...existingExpenses.expenses],
        });
        toast.success("Sucesss", {
          description: `Expense ${newExpense.id} created successfully`,
        });
      } catch (error) {
        console.log(error);
        toast.error("Error", {
          description: "Failed to create an expense",
        });
        // queryClient.setQueryData(["error-create-expense"], { expense: value });
      } finally {
        queryClient.setQueryData(loadingCreateExpenseQueryOptions.queryKey, {});
      }
    },
  });

  return (
    <div className=" p-2">
      <h2>Create Expense</h2>
      <form
        className=" flex flex-col max-w-xl m-auto"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <form.Field
          name="title"
          validators={{
            onChange: createExpenseSchema.shape.title,
          }}
          children={(field) => {
            return (
              <div>
                <Label htmlFor={field.name}>Title</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Title"
                />
                <FieldInfo field={field} />
              </div>
            );
          }}
        />
        <form.Field
          name="amount"
          validators={{
            onChange: createExpenseSchema.shape.amount,
          }}
          children={(field) => {
            return (
              <div>
                <Label htmlFor={field.name}>Amount</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Amount"
                  type="number"
                />
                <FieldInfo field={field} />
              </div>
            );
          }}
        />
        <form.Field
          name="date"
          validators={{
            onChange: createExpenseSchema.shape.date,
          }}
          children={(field) => {
            return (
              <div className=" self-center mt-4">
                <Calendar
                  mode="single"
                  selected={new Date(field.state.value)}
                  onSelect={(date) =>
                    field.handleChange((date ?? new Date()).toISOString())
                  }
                  className="rounded-md border"
                />
              </div>
            );
          }}
        />
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit]) => (
            <Button disabled={!canSubmit} className=" mt-4" type="submit">
              Create Expense
            </Button>
          )}
        />
      </form>
    </div>
  );
}
