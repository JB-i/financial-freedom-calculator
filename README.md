# Financial Freedom Calculator for India

This is a free calculator that helps someone answer one simple question:

**How much should I invest every month to become financially free by my target age?**

It is made for people in India and includes editable India tax assumptions. It works fully in the browser with only HTML, CSS, and JavaScript. There is no login, no database, no backend, and no paid service.

## How to Use It

Open `index.html` in a browser.

Enter everything in today's rupees.

For example, if the life you want costs `₹52,000/month` today, enter `52000`. Do not try to guess what that life will cost 20 years from now. The calculator handles future price increases.

Fill in:

- Your current age
- The age when you want financial freedom
- Money already invested
- Emergency money kept aside
- Your monthly lifestyle costs today
- Big yearly expenses today
- Expected price rise
- Extra cushion
- Other monthly income you expect later
- Basic investment and tax assumptions
- Where the money is invested: Indian equity, S&P 500 / US index fund, debt, and cash

The main answer is:

**Invest this much each month, in today's rupees.**

## What the Calculator Shows

The page shows:

- Your monthly lifestyle cost today
- Your yearly lifestyle cost today
- The yearly amount your investments must cover
- The total money needed in today's rupees
- The same target in future rupees
- How much to invest each month under different return cases
- A chart showing growth over time
- A table showing what changes if you have more or less time

## Today's Rupees and Future Rupees

The calculator separates two ideas:

- **Today's rupees**: money in today's buying power. This is easier to understand.
- **Future rupees**: the bigger-looking number after prices rise over time.

The monthly investment answer is shown mainly in today's rupees, because that is the number a person can act on now.

## Main Lifestyle Formula

```text
Yearly lifestyle cost today =
12 × monthly lifestyle costs today
+ big yearly expenses today
```

Then the calculator adds an extra cushion:

```text
Lifestyle cost with cushion =
yearly lifestyle cost today × (1 + cushion %)
```

Then it subtracts other income:

```text
Yearly amount investments must cover =
lifestyle cost with cushion - other yearly income
```

If this becomes negative, the calculator uses `0`.

## Tax on Money Taken Out

The calculator does not tax the full withdrawal. That would usually be too harsh.

Instead, it asks what part of each withdrawal is profit. Then it applies a blended tax rate based on the investment mix.

Example:

```text
Indian equity tax = 12.5%
S&P 500 / US fund tax = 30%
Debt / FD tax = 30%
Cash interest tax = 30%
Profit part of withdrawal = 50%
```

If the blended tax on profit comes to `20%`, and only `50%` of the withdrawal is profit:

```text
Estimated tax on full withdrawal =
20% × 50%
= 10%
```

So if the user needs `₹12,00,000/year` after tax, the investment must provide more than `₹12,00,000` before tax:

```text
Yearly amount before tax =
₹12,00,000 / (1 - estimated withdrawal tax)
```

## Total Money Needed

The calculator divides the yearly amount needed by the yearly spending rate from investments.

Example:

```text
Yearly amount before tax = ₹13,33,333
Yearly spending from investments = 3.5%

Money needed =
₹13,33,333 / 3.5%
= about ₹3.81 crore
```

A lower yearly spending rate needs more money. A higher yearly spending rate needs less money.

## Monthly Investment Formula

The calculator first works in today's rupees.

```text
Target money = money needed in today's rupees
Starting money = money already invested
Monthly return = (1 + yearly return after price rise)^(1/12) - 1
Months = years to target × 12
```

Then it calculates the monthly investment needed to reach the target.

If current investments are already enough under a return case, the monthly investment shown is `₹0`.

## Return Cases

The default answer uses **Your investment mix**. This combines the Indian equity, S&P 500 / US index fund, debt, and cash percentages entered on the page.

The built-in assumptions for yearly growth after price rise are:

- Indian equity: `5%`
- S&P 500 / US index fund: `4.5%`
- Debt / fixed income: `1.5%`
- Cash: `-0.5%`

Example: if the user enters more Indian equity or S&P 500 and less cash, the estimated growth usually goes up and the monthly investment needed usually goes down. If the user enters more cash and debt, the estimated growth usually goes down and the monthly investment needed usually goes up.

These growth assumptions are editable in the optional growth section.

The page also shows fixed return cases for comparison.

The default return cases are shown after price rise:

- Bad years: `-1%`
- Very low growth: `1%`
- Low growth: `2%`
- Middle growth: `3.5%`
- Good growth: `5%`
- Very good growth: `6.5%`

The calculator also shows the same return in future-rupee terms by adding expected price rise.

## India Tax Fields

The tax fields are editable because tax depends on the exact investment and the rules can change.

The app includes practical fields for:

- Indian equity gains tax
- S&P 500 / US fund gains tax
- Debt / FD tax
- Cash interest tax
- Cess / surcharge added
- Profit part of each withdrawal
- Yearly tax effect while investing

The calculator blends the tax rates using the investment mix. For example, a 100% Indian equity mix uses the Indian equity tax assumption; a 100% S&P 500 mix uses the S&P 500 / US fund tax assumption.

For India, the defaults are intentionally editable because investment tax depends on the exact product. Listed Indian equity/equity mutual funds, overseas index funds, debt funds, fixed deposits, and direct foreign assets can be taxed differently.

For West Bengal, professional tax usually matters for salary, business, professional, or self-employment income. This calculator keeps it separate from investment withdrawals.

## Deploy for Free with GitHub Pages

1. Create a public GitHub repository.
2. Upload these files to the repository:
   - `index.html`
   - `style.css`
   - `app.js`
   - `README.md`
3. Open the repository on GitHub.
4. Go to `Settings` -> `Pages`.
5. Under `Build and deployment`, choose:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
6. Click `Save`.
7. Wait for GitHub to build the page.
8. Share the link GitHub gives you.

The link usually looks like:

```text
https://your-username.github.io/your-repository-name/
```

## Files

- `index.html` contains the page.
- `style.css` controls the design.
- `app.js` contains the calculations and chart.
- `README.md` explains the project.
