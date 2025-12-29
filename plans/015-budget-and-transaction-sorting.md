# Plan: Budget and Transaction Sorting

## Goal
Implement client-side sorting for the Budget list and Transaction list to improve data organization and usability.

## Strategy
Since the application currently fetches all budgets and transactions (which is appropriate for a personal budget app with typical data volumes), we will implement **client-side sorting**. This provides immediate feedback and simplifies the implementation without requiring API changes at this stage.

## Changes

### 1. Budgets Page (`app/budgets/page.tsx`)

**Current State:**
- Filters by Search Query (Name).
- Filters by Year.
- Default Order: API returns Year Desc, Month Desc.

**New Functionality:**
- Add a "Sort By" dropdown.
- **Sort Options:**
  - `date-desc`: Date: Newest First (Default) -> Sort by Year Desc, Month Desc
  - `date-asc`: Date: Oldest First -> Sort by Year Asc, Month Asc
  - `name-asc`: Name: A-Z
  - `name-desc`: Name: Z-A

**Implementation Details:**
- Add state `sortBy` (default: 'date-desc').
- Update `filteredBudgets` logic to include `.sort()` after filtering.
- Add a `Select` component for sorting next to the Year filter.

### 2. Transaction Page (`app/budgets/[id]/page.tsx`)

**Current State:**
- Filters by Search Query (Name).
- Default Order: API returns Date Desc.

**New Functionality:**
- Add a "Sort By" dropdown.
- **Sort Options:**
  - `date-desc`: Date: Newest First (Default)
  - `date-asc`: Date: Oldest First
  - `amount-desc`: Amount: Highest First
  - `amount-asc`: Amount: Lowest First
  - `name-asc`: Name: A-Z
  - `name-desc`: Name: Z-A
  - `type-asc`: Type: Income First
  - `type-desc`: Type: Expense First

**Implementation Details:**
- Add state `sortBy` (default: 'date-desc').
- Update `filteredTransactions` logic to include `.sort()` after filtering.
- Add a `Select` component for sorting next to the Search bar.

## Verification
- Verify Budgets sort correctly by Date and Name.
- Verify Transactions sort correctly by Date, Amount, Name, and Type.
- Ensure sorting works in combination with search/filters.
