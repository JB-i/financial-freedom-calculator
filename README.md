# Dollar Financial Freedom Calculator for India

This is a free calculator for someone living in India who wants to think in US dollars.

It answers one question:

**How many dollars should I invest every month to become financially free by my target age?**

It works fully in the browser with only HTML, CSS, and JavaScript. There is no login, no database, no backend, and no paid service.

## How to Use It

Open `index.html` in a browser.

Enter everything in today's dollars.

For example, if the life you want in West Bengal costs about `$625/month` today, enter `625` across the monthly lifestyle fields. Do not guess the future cost. The calculator handles future price increases.

The default example is roughly:

- Monthly lifestyle: `$625`
- Big yearly expenses: `$1,200`
- Money already invested: `$2,500`
- Emergency money kept aside: `$1,800`

## Why Inflation Is Different in Dollars

If someone lives in India but plans in dollars, Indian inflation is not the whole story.

Example:

```text
India prices rise by 6% per year
INR weakens against USD by 3% per year
```

Then the same India lifestyle rises in dollars by about:

```text
(1 + 6%) / (1 + 3%) - 1 = 2.91%
```

So the calculator asks for:

- India yearly price rise
- Rent / home cost rise in India
- Healthcare cost rise in India
- Education cost rise in India
- INR weakening versus USD

It converts those into future dollar costs.

## What the Calculator Shows

The page shows:

- Monthly lifestyle cost today in dollars
- Yearly lifestyle cost today in dollars
- Money needed in today's dollars
- Same target in future dollars
- Monthly dollars to invest
- Investment growth chart
- Sensitivity table
- Estimated tax on withdrawals

## Investment Mix

The main answer uses the entered investment mix:

- Indian equity
- S&P 500 / US index fund
- Debt / fixed deposits / bonds
- Cash

The default USD growth assumptions are editable:

- Indian equity: `9%`
- S&P 500 / US index fund: `8%`
- Debt / FD: `5%`
- Cash: `2%`

The calculator compares these USD returns against the future dollar cost of the India lifestyle.

## Tax Model

The calculator does not tax the full withdrawal. It asks what part of each withdrawal is profit, then applies a blended tax rate based on the investment mix.

Example:

```text
Blended tax on investment profit = 20%
Profit part of withdrawal = 50%

Estimated tax on full withdrawal = 20% × 50% = 10%
```

The tax fields are editable because India tax depends on the exact product. Indian equity, S&P 500 / overseas funds, debt funds, fixed deposits, cash interest, and foreign assets can be treated differently.

## Main Formulas

```text
Yearly lifestyle cost today =
12 × monthly lifestyle costs today
+ big yearly expenses today
```

```text
Lifestyle cost with cushion =
yearly lifestyle cost today × (1 + cushion %)
```

```text
Yearly amount investments must cover =
lifestyle cost with cushion - other yearly income
```

```text
Yearly amount before tax =
yearly amount investments must cover / (1 - estimated withdrawal tax)
```

```text
Money needed today =
yearly amount before tax / yearly spending rate from investments
```

Monthly investment is calculated in today's dollars using monthly compounding and the chosen time to target.

## Deploy for Free with GitHub Pages

1. Create a public GitHub repository.
2. Upload these files:
   - `index.html`
   - `style.css`
   - `app.js`
   - `README.md`
3. Open the repository on GitHub.
4. Go to `Settings` -> `Pages`.
5. Choose:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
6. Click `Save`.
7. Share the GitHub Pages link.

The link usually looks like:

```text
https://your-username.github.io/your-repository-name/
```
