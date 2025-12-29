# Refactor Forms to use react-hook-form and Zod

## Objective
Update all forms in the application to follow the [shadcn/ui form pattern](https://ui.shadcn.com/docs/forms/react-hook-form), utilizing `react-hook-form` for state management, `zod` for validation, and the `@hookform/resolvers` for integration.

## Proposed Changes

1.  **Dependency Installation**
    *   Install `react-hook-form`, `zod`, and `@hookform/resolvers` using `bun`.

2.  **Implementation Pattern (Radix Mira)**
    *   Following the shadcn/ui "Radix Mira" style, we will use the `Controller` component from `react-hook-form` in conjunction with the existing `Field` components.
    *   Structure for each field:
        ```tsx
        <Controller
          name="fieldName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Label</FieldLabel>
              <Input {...field} aria-invalid={fieldState.invalid} />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
        ```

3.  **Update `components/budgets/budget-dialog.tsx`**
    *   Define `budgetSchema` using Zod.
    *   Initialize form with `useForm` and `zodResolver`.
    *   Refactor JSX to use `Controller` and `Field` components.
    *   Handle `Select` components within the `Controller` render.

4.  **Update `components/transactions/transaction-dialog.tsx`**
    *   Define `transactionSchema` using Zod.
    *   Initialize form with `useForm` and `zodResolver`.
    *   Refactor JSX to use `Controller` and `Field`.
    *   Integrate `NumericFormat` and `ButtonGroup` within the `Controller` pattern.
    *   Handle the "Add another" checkbox logic.

## Implementation Steps

1.  Run `bun add react-hook-form zod @hookform/resolvers`.
2.  Implement Zod schemas in the respective dialog files.
3.  Refactor `BudgetDialog` component logic and JSX.
4.  Refactor `TransactionDialog` component logic and JSX.
5.  Verify validation and submission flow.


## Questions for User
1.  **Validation Rules:** Do you have specific validation rules (e.g., minimum name length, positive amount only) that you want to enforce via Zod, or should I stick to "required" for now?
2.  **Schema Location:** Should I define the schemas directly in the dialog files or move them to a central location like `lib/schemas.ts`?
