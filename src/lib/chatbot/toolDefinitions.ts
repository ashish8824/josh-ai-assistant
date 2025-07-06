export const toolDefinitions = [
  {
    type: "function",
    function: {
      name: "getTotalExpense",
      description: "Get total expense from date to date",
      parameters: {
        type: "object",
        properties: {
          from: { type: "string" },
          to: { type: "string" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "addExpense",
      description: "Add new expense",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string" },
          amount: { type: "string" },
          category: { type: "string" },
          date: { type: "string" },
          note: { type: "string" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "addIncome",
      description: "Add new income",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string" },
          amount: { type: "string" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getMoneyBalance",
      description: "Get balance",
    },
  },
  {
    type: "function",
    function: {
      name: "getSmartSummary",
      description: "Provides a smart summary of user’s finances",
    },
  },
  {
    type: "function",
    function: {
      name: "listExpenses",
      description:
        "Lists all past expenses with name, amount, category, and date.",
    },
  },
  {
    type: "function",
    function: {
      name: "filterExpenses",
      description: "List all expenses for a given category",
      parameters: {
        type: "object",
        properties: {
          category: { type: "string" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "setMonthlyBudget",
      description: "Set monthly budget for a category like Food or Transport",
      parameters: {
        type: "object",
        properties: {
          category: { type: "string" },
          amount: { type: "string" },
        },
        required: ["category", "amount"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getBudgetStatus",
      description:
        "Check how much you've spent against your set monthly budgets",
    },
  },
  {
    type: "function",
    function: {
      name: "suggestSavingsPlan",
      description:
        "Analyze 3-month income & expenses to recommend monthly savings",
    },
  },
  {
    type: "function",
    function: {
      name: "compareMonthSpending",
      description: "Compare this month's expense with the previous month",
    },
  },
  {
    type: "function",
    function: {
      name: "detectSpendingSpike",
      description:
        "Detect categories where current spending has significantly increased compared to past months",
    },
  },
  {
    type: "function",
    function: {
      name: "categorizeRecurringExpenses",
      description:
        "Identify expenses that repeat every month, such as rent, subscriptions, and EMIs",
    },
  },
  {
    type: "function",
    function: {
      name: "getDailySpendingLimit",
      description:
        "Calculate how much the user can spend daily for the rest of the month to stay within budget",
    },
  },
  {
    type: "function",
    function: {
      name: "recommendBudget",
      description:
        "Suggest a monthly budget for a given category based on user's past expenses",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description: "The expense category (e.g., Food, Transport)",
          },
        },
        required: ["category"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "forecastSpending",
      description:
        "Predicts this month’s spending and estimated end-of-month balance using past 6 months",
    },
  },
  {
    type: "function",
    function: {
      name: "analyzeSpendingPatterns",
      description:
        "Finds trends in day-of-week, date-of-month, and top category spending",
    },
  },
];
