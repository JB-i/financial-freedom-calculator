# Financial Freedom Calculator for India

A free, public, beginner-friendly static calculator for people in India, with notes for West Bengal. It runs entirely in the browser using only HTML, CSS, and JavaScript. There is no backend, no login, no database, and no paid API.

The main idea is simple: users enter their desired lifestyle in today's rupees, and the calculator estimates how much capital they need and how much they must invest each month to reach financial freedom by a chosen age or number of years.

## Files

- `index.html` - app structure and form fields
- `style.css` - responsive layout and visual design
- `app.js` - all calculations, tables, and chart drawing

## What the Calculator Does

The app calculates the financial freedom target from lifestyle expenses instead of asking the user to guess a target capital number.

Inputs include:

- Current age
- Target financial freedom age or years to target
- Current invested assets
- Emergency fund / cash buffer
- Monthly lifestyle expenses in today's rupees
- Optional annual large expenses in today's rupees
- Rented or owned housing
- General, housing, healthcare, and education inflation assumptions
- Safety margin
- Passive income at financial freedom
- Safe withdrawal rate
- Editable tax assumptions
- Asset allocation
- Return scenario

The dashboard shows:

- Lifestyle calculation
- Capital needed in today's rupees
- Capital needed in future nominal rupees
- Monthly contribution required in today's rupees
- Future nominal contribution examples
- Scenario table
- Projection chart
- Sensitivity table
- Warnings and limitations

## Key Principle

All user expense inputs are in today's rupees.

Example: if the user wants a lifestyle worth `₹80,000/month` today, they enter `₹80,000`, even if financial freedom is 20 years away. The calculator handles inflation internally.

## Formulas Used

### Lifestyle Cost

```text
Annual lifestyle cost today =
12 × monthly lifestyle expenses today
+ annual large expenses today
```

```text
Adjusted annual lifestyle cost today =
Annual lifestyle cost today × (1 + safety margin)
```

```text
Net annual spending need today =
Adjusted annual lifestyle cost today - annual passive income today
```

If the value is negative, it is set to `0`.

### Withdrawal Tax Gross-Up

The user wants spendable money after taxes, so the calculator grosses up the withdrawal need:

```text
Pre-tax annual withdrawal needed today =
Net annual spending need today / (1 - effective withdrawal tax rate)
```

### Required Capital

```text
Required capital today =
Pre-tax annual withdrawal needed today / safe withdrawal rate
```

Example:

```text
Net lifestyle need = ₹12,00,000/year
Effective withdrawal tax = 10%
Safe withdrawal rate = 3.5%

Pre-tax need = 12,00,000 / 0.90 = ₹13,33,333
Required capital = 13,33,333 / 0.035 = ₹3,80,95,238
```

### Nominal Future Capital

The app inflates future lifestyle needs to the target date. Housing, healthcare, and education can use separate inflation assumptions. Other expenses use general inflation.

It then applies the same safety margin, passive income deduction, withdrawal tax gross-up, and withdrawal rate to estimate future nominal capital.

### Monthly Contribution

The monthly investment answer is calculated in real terms, meaning today's rupees:

```text
FV_real = required capital today
PV_real = current invested assets today
r_real_monthly = (1 + annual real return)^(1/12) - 1
n = years_to_target × 12
```

If `r_real_monthly` is not zero:

```text
PMT_real =
(FV_real - PV_real × (1 + r_real_monthly)^n)
/
(((1 + r_real_monthly)^n - 1) / r_real_monthly)
```

If `r_real_monthly` is zero:

```text
PMT_real = (FV_real - PV_real) / n
```

If the result is negative, the app displays `₹0` and notes that the current assets may already cover the target under that scenario.

### Future Nominal Contributions

The main monthly contribution is shown in today's rupees. The app also shows equivalent nominal contribution examples:

```text
Monthly contribution in year k =
PMT_real × (1 + inflation)^k
```

## Return Scenarios

Default annual real returns are:

- Stress: `-1%`
- Very conservative: `1%`
- Conservative: `2%`
- Balanced: `3.5%`
- Growth: `5%`
- Aggressive: `6.5%`

Nominal return is shown as:

```text
nominal return = (1 + real return) × (1 + inflation) - 1
```

## Tax Simplification

Tax fields are editable. The calculator includes realistic India-oriented defaults, but it does not hard-code tax law as final truth.

Editable fields include:

- Equity short-term capital gains tax
- Equity long-term capital gains tax
- Equity LTCG exemption threshold
- Debt / fixed income tax
- Dividend or slab tax
- Cess
- Surcharge
- Tax drag during accumulation
- Effective withdrawal tax during withdrawal

The calculator uses a simplified tax model:

- Effective withdrawal tax grosses up required withdrawals.
- Annual tax drag can reduce real returns during accumulation.
- Granular fields such as STCG, LTCG, debt tax, dividend tax, cess, and surcharge are included for user awareness and planning notes, but they are not a substitute for a detailed tax return calculation.

For current rules, verify directly with the Income Tax Department and a tax professional. Useful official starting points:

- Income Tax Department: <https://www.incometax.gov.in/>
- West Bengal Profession Tax Directorate: <https://www.wbprofessiontax.gov.in/>

West Bengal professional tax is not applied to the financial freedom withdrawal calculation by default. It is mainly relevant when modelling active salary, business, professional, or self-employment income.

## How Inflation Is Applied

The calculator separates real and nominal values:

- Real values are in today's rupees.
- Nominal values are future rupees after inflation.

For future lifestyle estimates:

- Housing uses housing inflation.
- Healthcare uses healthcare inflation.
- Education uses education inflation.
- Other monthly expenses and annual large expenses use general inflation.
- Passive income is inflated with general inflation.

For future contribution examples, the calculator uses general inflation.

## How to Deploy for Free on GitHub Pages

1. Create a new public GitHub repository.
2. Add these files to the repository root:
   - `index.html`
   - `style.css`
   - `app.js`
   - `README.md`
3. Commit and push the files.
4. Open the repository on GitHub.
5. Go to `Settings` → `Pages`.
6. Under `Build and deployment`, choose:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
7. Click `Save`.
8. GitHub will publish the site at a free GitHub Pages URL.

## Limitations

- This is a simplified planning calculator, not a financial plan.
- It does not model every Indian tax rule, exemption, holding period, asset type, surcharge case, or future tax change.
- It does not model changing expenses after retirement.
- It does not model sequence-of-return risk in detail.
- It assumes steady monthly contributions.
- It assumes user-provided returns, inflation, withdrawal rate, and taxes.
- It does not store data. Refreshing the page resets to defaults unless the browser keeps form values.

## Disclaimer

This calculator is for education and rough planning only. It is not financial, tax, legal, or investment advice. Inflation and market returns are uncertain. Past returns do not guarantee future returns. Verify current Indian tax rules with official sources and consult a qualified professional before making financial decisions.
