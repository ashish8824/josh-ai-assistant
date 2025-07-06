import { addExpense } from "./tools/addExpenses";
import { addIncome } from "./tools/addIncome";
import { getTotalExpense } from "./tools/getTotalExpense";
import { getMoneyBalance } from "./tools/getMoneyBalance";
import { getSmartSummary } from "./tools/getSmartSummary";
import { listExpenses } from "./tools/listExpeses";
import { filterExpenses } from "./tools/filterExpenses";
import { setMonthlyBudget } from "./tools/setMonthlyBudget";
import { getBudgetStatus } from "./tools/getBudgetStatus";
import { suggestSavingsPlan } from "./tools/suggestSavingsPlan";
import { compareMonthSpending } from "./tools/compareMonthSpending";
import { detectSpendingSpike } from "./tools/detectSpendingSpike";
import { categorizeRecurringExpenses } from "./tools/categorizeRecurringExpenses";
import { getDailySpendingLimit } from "./tools/getDailySpendingLimit";
import { recommendBudget } from "./tools/recommendBudget";
import { suggestInvestmentPercentage } from "./tools/suggestInvestmentPercentage";
import { forecastSpending } from "./tools/forecast";
import { analyzeSpendingPatterns } from "./tools/analyzeSpendingPatterns";

export const toolHandlers: Record<
  string,
  (args: any) => Promise<string> | string
> = {
  addExpense,
  addIncome,
  getTotalExpense,
  getMoneyBalance,
  getSmartSummary,
  listExpenses,
  filterExpenses,
  setMonthlyBudget,
  getBudgetStatus,
  suggestSavingsPlan,
  compareMonthSpending,
  detectSpendingSpike,
  categorizeRecurringExpenses,
  getDailySpendingLimit,
  recommendBudget,
  suggestInvestmentPercentage,
  forecastSpending,
  analyzeSpendingPatterns,
};
