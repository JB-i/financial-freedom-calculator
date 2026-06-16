const SCENARIOS = [
  { key: "stress", name: "Bad years", realReturn: -1 },
  { key: "veryConservative", name: "Very low growth", realReturn: 1 },
  { key: "conservative", name: "Low growth", realReturn: 2 },
  { key: "balanced", name: "Middle growth", realReturn: 3.5 },
  { key: "growth", name: "Good growth", realReturn: 5 },
  { key: "aggressive", name: "Very good growth", realReturn: 6.5 }
];

const ASSET_REAL_RETURNS = {
  indianEquity: 5,
  internationalEquity: 4.5,
  debt: 1.5,
  cash: -0.5
};

const EXPENSE_INFLATION_MAP = {
  housing: "housingInflation",
  healthcare: "healthcareInflation",
  education: "educationInflation"
};

const DEFAULTS = {
  currentAge: 25,
  targetAge: 45,
  yearsToTarget: 20,
  housingStatus: "rented",
  currentAssets: 500000,
  emergencyFund: 200000,
  annualLargeExpenses: 200000,
  generalInflation: 6,
  housingInflation: 6.5,
  healthcareInflation: 8,
  educationInflation: 8,
  safetyMargin: 20,
  passiveIncomeMonthly: 0,
  withdrawalRate: 3.5,
  withdrawalTax: 10,
  taxDrag: 0.5,
  returnTaxMode: "drag",
  equityStcg: 20,
  equityLtcg: 12.5,
  equityLtcgExemption: 125000,
  debtTax: 30,
  dividendTax: 30,
  cess: 4,
  surcharge: 0,
  expenses: {
    housing: 25000,
    food: 16000,
    utilities: 5000,
    transport: 6000,
    healthcare: 6000,
    family: 7000,
    education: 3000,
    travel: 5000,
    entertainment: 3000,
    misc: 4000
  },
  allocation: {
    indianEquity: 55,
    internationalEquity: 15,
    debt: 25,
    cash: 5
  }
};

const form = document.getElementById("calculator-form");
const chartScenarioSelect = document.getElementById("chartScenario");
const chartCanvas = document.getElementById("projectionChart");
let lastEditedAgeField = "targetAge";

function num(id) {
  const value = Number(document.getElementById(id).value);
  return Number.isFinite(value) ? value : 0;
}

function pct(id) {
  return num(id) / 100;
}

function currency(value, compact = false) {
  const safe = Number.isFinite(value) ? value : 0;
  if (compact && Math.abs(safe) >= 10000000) {
    return `₹${(safe / 10000000).toLocaleString("en-IN", {
      maximumFractionDigits: safe >= 100000000 ? 1 : 2
    })} crore`;
  }
  if (compact && Math.abs(safe) >= 100000) {
    return `₹${(safe / 100000).toLocaleString("en-IN", {
      maximumFractionDigits: safe >= 1000000 ? 1 : 2
    })} lakh`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Math.round(safe));
}

function percent(value) {
  return `${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: Math.abs(value) < 10 && value % 1 !== 0 ? 1 : 0,
    maximumFractionDigits: 2
  })}%`;
}

function getExpenseValues() {
  const expenses = {};
  document.querySelectorAll("[data-expense]").forEach((input) => {
    expenses[input.dataset.expense] = Number(input.value) || 0;
  });
  return expenses;
}

function getAllocationValues() {
  const allocation = {};
  document.querySelectorAll("[data-allocation]").forEach((input) => {
    allocation[input.dataset.allocation] = Number(input.value) || 0;
  });
  return allocation;
}

function getAllocationTotal(allocation) {
  return Object.values(allocation).reduce((sum, item) => sum + item, 0);
}

function getMixReturn(allocation) {
  const total = getAllocationTotal(allocation);
  if (total <= 0) return 0;
  return Object.entries(allocation).reduce((sum, [key, value]) => {
    return sum + (value / total) * (ASSET_REAL_RETURNS[key] || 0);
  }, 0);
}

function monthlyRate(annualRealReturn) {
  return Math.pow(1 + annualRealReturn, 1 / 12) - 1;
}

function requiredMonthlyContribution(fv, pv, annualRealReturn, years) {
  const n = Math.max(0, Math.round(years * 12));
  if (n === 0) return 0;
  const r = monthlyRate(annualRealReturn);
  const futurePv = pv * Math.pow(1 + r, n);
  const gap = fv - futurePv;
  if (gap <= 0) return 0;
  if (Math.abs(r) < 0.0000001) return gap / n;
  const annuityFactor = (Math.pow(1 + r, n) - 1) / r;
  return gap / annuityFactor;
}

function futureValueWithPmt(pv, pmt, annualRealReturn, years) {
  const n = Math.max(0, Math.round(years * 12));
  const r = monthlyRate(annualRealReturn);
  if (n === 0) return pv;
  if (Math.abs(r) < 0.0000001) return pv + pmt * n;
  return pv * Math.pow(1 + r, n) + pmt * ((Math.pow(1 + r, n) - 1) / r);
}

function effectiveReturn(realReturnPct, state) {
  if (state.returnTaxMode === "drag") {
    return Math.max(realReturnPct / 100 - state.taxDrag, -0.99);
  }
  return Math.max(realReturnPct / 100, -0.99);
}

function returnLabel(state) {
  if (state.returnTaxMode === "drag") return "after yearly tax effect";
  if (state.returnTaxMode === "afterTax") return "tax already included";
  return "before tax";
}

function collectState() {
  const expenses = getExpenseValues();
  const allocation = getAllocationValues();
  return {
    currentAge: num("currentAge"),
    targetAge: num("targetAge"),
    yearsToTarget: Math.max(1, num("yearsToTarget")),
    currentAssets: num("currentAssets"),
    emergencyFund: num("emergencyFund"),
    annualLargeExpenses: num("annualLargeExpenses"),
    generalInflation: pct("generalInflation"),
    housingInflation: pct("housingInflation"),
    healthcareInflation: pct("healthcareInflation"),
    educationInflation: pct("educationInflation"),
    safetyMargin: pct("safetyMargin"),
    passiveIncomeMonthly: num("passiveIncomeMonthly"),
    withdrawalRate: Math.max(0.001, pct("withdrawalRate")),
    withdrawalTax: Math.min(0.95, Math.max(0, pct("withdrawalTax"))),
    taxDrag: Math.max(0, pct("taxDrag")),
    returnTaxMode: document.getElementById("returnTaxMode").value,
    housingStatus: document.getElementById("housingStatus").value,
    expenses,
    allocation
  };
}

function calculateBase(state, withdrawalRateOverride) {
  const swr = withdrawalRateOverride || state.withdrawalRate;
  const years = state.yearsToTarget;
  const monthlyLifestyleToday = Object.values(state.expenses).reduce((sum, item) => sum + item, 0);
  const annualLifestyleToday = monthlyLifestyleToday * 12 + state.annualLargeExpenses;
  const adjustedLifestyleToday = annualLifestyleToday * (1 + state.safetyMargin);
  const passiveIncomeAnnualToday = state.passiveIncomeMonthly * 12;
  const netAnnualNeedToday = Math.max(0, adjustedLifestyleToday - passiveIncomeAnnualToday);
  const preTaxNeedToday = netAnnualNeedToday / (1 - state.withdrawalTax);
  const requiredCapitalToday = preTaxNeedToday / swr;

  let monthlyLifestyleFuture = 0;
  Object.entries(state.expenses).forEach(([key, value]) => {
    const inflationKey = EXPENSE_INFLATION_MAP[key];
    const inflation = inflationKey ? state[inflationKey] : state.generalInflation;
    monthlyLifestyleFuture += value * Math.pow(1 + inflation, years);
  });
  const annualLargeExpensesFuture = state.annualLargeExpenses * Math.pow(1 + state.generalInflation, years);
  const annualLifestyleFuture = monthlyLifestyleFuture * 12 + annualLargeExpensesFuture;
  const adjustedLifestyleFuture = annualLifestyleFuture * (1 + state.safetyMargin);
  const passiveIncomeAnnualFuture = passiveIncomeAnnualToday * Math.pow(1 + state.generalInflation, years);
  const netAnnualNeedFuture = Math.max(0, adjustedLifestyleFuture - passiveIncomeAnnualFuture);
  const preTaxNeedFuture = netAnnualNeedFuture / (1 - state.withdrawalTax);
  const requiredCapitalFuture = preTaxNeedFuture / swr;

  return {
    swr,
    monthlyLifestyleToday,
    annualLifestyleToday,
    adjustedLifestyleToday,
    passiveIncomeAnnualToday,
    netAnnualNeedToday,
    preTaxNeedToday,
    requiredCapitalToday,
    monthlyLifestyleFuture,
    annualLifestyleFuture,
    adjustedLifestyleFuture,
    passiveIncomeAnnualFuture,
    netAnnualNeedFuture,
    preTaxNeedFuture,
    requiredCapitalFuture
  };
}

function calculateScenarioRows(state, base) {
  const mixScenario = {
    key: "mix",
    name: "Your investment mix",
    realReturn: getMixReturn(state.allocation)
  };
  return [mixScenario, ...SCENARIOS].map((scenario) => {
    const afterTaxRealReturn = effectiveReturn(scenario.realReturn, state);
    const nominalReturn = (1 + scenario.realReturn / 100) * (1 + state.generalInflation) - 1;
    const pmtReal = requiredMonthlyContribution(
      base.requiredCapitalToday,
      state.currentAssets,
      afterTaxRealReturn,
      state.yearsToTarget
    );
    const pmtFinalNominal = pmtReal * Math.pow(1 + state.generalInflation, state.yearsToTarget);
    const projectedReal = futureValueWithPmt(
      state.currentAssets,
      pmtReal,
      afterTaxRealReturn,
      state.yearsToTarget
    );
    const projectedNominal = projectedReal * Math.pow(1 + state.generalInflation, state.yearsToTarget);
    return {
      ...scenario,
      afterTaxRealReturn,
      nominalReturn,
      pmtReal,
      pmtFinalNominal,
      projectedReal,
      projectedNominal,
      isAlreadyFree: pmtReal === 0 && state.currentAssets > base.requiredCapitalToday * 0.99
    };
  });
}

function renderDefinitionList(id, rows) {
  const container = document.getElementById(id);
  container.innerHTML = rows.map(([label, value]) => `<dt>${label}</dt><dd>${value}</dd>`).join("");
}

function renderLifestyle(state, base) {
  document.getElementById("monthlyLifestyleToday").textContent = currency(base.monthlyLifestyleToday, true);
  document.getElementById("requiredCapitalToday").textContent = currency(base.requiredCapitalToday, true);
  document.getElementById("requiredCapitalFuture").textContent = currency(base.requiredCapitalFuture, true);

  renderDefinitionList("lifestyleBreakdown", [
    ["Monthly lifestyle cost today", currency(base.monthlyLifestyleToday)],
    ["Annual lifestyle cost today", currency(base.annualLifestyleToday)],
    ["After adding your extra cushion", currency(base.adjustedLifestyleToday)],
    ["Other income subtracted", currency(base.passiveIncomeAnnualToday)],
    ["Yearly spending your investments must cover", currency(base.netAnnualNeedToday)],
    ["Yearly amount before tax on withdrawals", currency(base.preTaxNeedToday)],
    ["Emergency money kept separate", currency(state.emergencyFund)]
  ]);
}

function renderWithdrawalTable(state) {
  const container = document.getElementById("withdrawalRateTable");
  container.innerHTML = [3, 3.5, 4].map((rate) => {
    const base = calculateBase(state, rate / 100);
    return `<div class="mini-row"><span>If you spend ${rate}% per year</span><strong>${currency(base.requiredCapitalToday, true)}</strong></div>`;
  }).join("");
}

function renderScenarioTable(state, rows) {
  const tbody = document.getElementById("scenarioTable");
  tbody.innerHTML = rows.map((row) => {
    const alreadyFree = row.isAlreadyFree ? `<span class="status-pill">assets already cover target</span>` : "";
    return `
      <tr>
        <td><strong>${row.name}</strong><br>${alreadyFree}</td>
        <td>${percent(row.realReturn)}</td>
        <td>${percent(row.nominalReturn * 100)}</td>
        <td>${percent(row.afterTaxRealReturn * 100)}<br><small>${returnLabel(state)}</small></td>
        <td><strong>${currency(row.pmtReal)}</strong></td>
        <td>${currency(row.pmtFinalNominal)}</td>
        <td>${currency(row.projectedReal, true)} today<br><small>${currency(row.projectedNominal, true)} future rupees</small></td>
      </tr>
    `;
  }).join("");
}

function renderMainAnswer(state, rows) {
  const selectedKey = chartScenarioSelect.value || "mix";
  const selected = rows.find((row) => row.key === selectedKey) || rows[0];
  document.getElementById("mainMonthlyContribution").textContent = currency(selected.pmtReal);
  document.getElementById("mainScenarioLabel").textContent = `${selected.name} scenario, ${returnLabel(state)}`;
  document.getElementById("finalYearContribution").textContent = currency(selected.pmtFinalNominal);

  const yearOne = selected.pmtReal * Math.pow(1 + state.generalInflation, 1);
  const halfway = selected.pmtReal * Math.pow(1 + state.generalInflation, state.yearsToTarget / 2);
  renderDefinitionList("nominalContributionBreakdown", [
    ["Invest monthly in today's rupees", currency(selected.pmtReal)],
    ["Same value in year 1 rupees", currency(yearOne)],
    ["Same value halfway there", currency(halfway)],
    ["Same value in final-year rupees", currency(selected.pmtFinalNominal)]
  ]);
}

function renderSensitivityTable(state, base) {
  const returns = [1, 2, 3.5, 5, 6.5];
  const years = [5, 10, 15, 20, 25, 30];
  document.getElementById("sensitivityHead").innerHTML = `
    <tr>
      <th>Years</th>
      ${returns.map((rate) => `<th>${percent(rate)} after price rise</th>`).join("")}
    </tr>
  `;
  document.getElementById("sensitivityBody").innerHTML = years.map((year) => {
    const cells = returns.map((rate) => {
      const adjustedRate = effectiveReturn(rate, state);
      const pmt = requiredMonthlyContribution(base.requiredCapitalToday, state.currentAssets, adjustedRate, year);
      return `<td>${currency(pmt)}</td>`;
    }).join("");
    return `<tr><td><strong>${year}</strong></td>${cells}</tr>`;
  }).join("");
}

function drawProjectionChart(state, base, rows) {
  const selected = rows.find((row) => row.key === chartScenarioSelect.value) || rows[0];
  const canvas = chartCanvas;
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(320, Math.floor(rect.width * dpr));
  canvas.height = Math.floor(320 * dpr);

  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  const width = canvas.width / dpr;
  const height = canvas.height / dpr;
  const pad = { top: 20, right: 20, bottom: 42, left: 82 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;

  const points = [];
  const years = Math.max(1, Math.round(state.yearsToTarget));
  for (let year = 0; year <= years; year += 1) {
    const real = futureValueWithPmt(state.currentAssets, selected.pmtReal, selected.afterTaxRealReturn, year);
    const nominal = real * Math.pow(1 + state.generalInflation, year);
    const targetReal = base.requiredCapitalToday;
    const targetNominal = base.requiredCapitalToday * Math.pow(1 + state.generalInflation, year);
    points.push({ year, real, nominal, targetReal, targetNominal });
  }

  const maxY = Math.max(
    base.requiredCapitalFuture,
    ...points.flatMap((point) => [point.real, point.nominal, point.targetReal, point.targetNominal])
  ) * 1.08 || 1;

  const x = (year) => pad.left + (year / years) * chartW;
  const y = (value) => pad.top + chartH - (value / maxY) * chartH;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fffdf8";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "#e4dccf";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#68736b";
  ctx.font = "12px system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (let i = 0; i <= 4; i += 1) {
    const value = (maxY / 4) * i;
    const gy = y(value);
    ctx.beginPath();
    ctx.moveTo(pad.left, gy);
    ctx.lineTo(width - pad.right, gy);
    ctx.stroke();
    ctx.fillText(currency(value, true), pad.left - 10, gy);
  }

  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  for (let i = 0; i <= 4; i += 1) {
    const year = Math.round((years / 4) * i);
    const gx = x(year);
    ctx.fillText(`${year}y`, gx, height - pad.bottom + 14);
  }

  function line(key, color, dash = []) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.setLineDash(dash);
    ctx.beginPath();
    points.forEach((point, index) => {
      const px = x(point.year);
      const py = y(point[key]);
      if (index === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();
    ctx.restore();
  }

  line("targetNominal", "#ad4f4b", [8, 7]);
  line("targetReal", "#ad4f4b", [2, 6]);
  line("nominal", "#b98719");
  line("real", "#0f7b68");

  ctx.fillStyle = "#17211d";
  ctx.font = "700 13px system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(`${selected.name} projection`, pad.left, 8);
}

function renderAllocationMessage(state) {
  const total = getAllocationTotal(state.allocation);
  const message = document.getElementById("allocationMessage");
  const mixReturn = getMixReturn(state.allocation);
  if (Math.abs(total - 100) > 0.01) {
    message.textContent = `Allocation total is ${percent(total)}. The calculator normalizes it and uses about ${percent(mixReturn)} yearly growth after price rise for "Your investment mix."`;
    message.classList.add("attention");
  } else {
    message.textContent = `This mix is used in the main answer. It assumes about ${percent(mixReturn)} yearly growth after price rise, before the tax effect above.`;
    message.classList.remove("attention");
  }
}

function recalculate() {
  const state = collectState();
  const base = calculateBase(state);
  const rows = calculateScenarioRows(state, base);
  renderLifestyle(state, base);
  renderWithdrawalTable(state);
  renderScenarioTable(state, rows);
  renderMainAnswer(state, rows);
  renderSensitivityTable(state, base);
  renderAllocationMessage(state);
  drawProjectionChart(state, base, rows);
}

function syncAgeFields(source) {
  const currentAge = num("currentAge");
  const targetAge = num("targetAge");
  const yearsToTarget = num("yearsToTarget");
  if (source === "targetAge") {
    document.getElementById("yearsToTarget").value = Math.max(1, targetAge - currentAge);
    lastEditedAgeField = "targetAge";
  } else if (source === "yearsToTarget") {
    document.getElementById("targetAge").value = currentAge + Math.max(1, yearsToTarget);
    lastEditedAgeField = "yearsToTarget";
  } else if (lastEditedAgeField === "targetAge") {
    document.getElementById("yearsToTarget").value = Math.max(1, targetAge - currentAge);
  } else {
    document.getElementById("targetAge").value = currentAge + Math.max(1, yearsToTarget);
  }
}

function setDefaults() {
  Object.entries(DEFAULTS).forEach(([key, value]) => {
    if (key === "expenses" || key === "allocation") return;
    const field = document.getElementById(key);
    if (field) field.value = value;
  });
  Object.entries(DEFAULTS.expenses).forEach(([key, value]) => {
    document.querySelector(`[data-expense="${key}"]`).value = value;
  });
  Object.entries(DEFAULTS.allocation).forEach(([key, value]) => {
    document.querySelector(`[data-allocation="${key}"]`).value = value;
  });
  chartScenarioSelect.value = "mix";
  lastEditedAgeField = "targetAge";
  syncAgeFields("targetAge");
  recalculate();
}

function initScenarioSelect() {
  const options = [{ key: "mix", name: "Your investment mix" }, ...SCENARIOS];
  chartScenarioSelect.innerHTML = options.map((scenario) => {
    const selected = scenario.key === "mix" ? "selected" : "";
    return `<option value="${scenario.key}" ${selected}>${scenario.name}</option>`;
  }).join("");
}

form.addEventListener("input", (event) => {
  if (event.target.id === "targetAge") syncAgeFields("targetAge");
  if (event.target.id === "yearsToTarget") syncAgeFields("yearsToTarget");
  if (event.target.id === "currentAge") syncAgeFields("currentAge");
  recalculate();
});

form.addEventListener("change", recalculate);
chartScenarioSelect.addEventListener("change", recalculate);
document.getElementById("reset-defaults").addEventListener("click", setDefaults);
window.addEventListener("resize", recalculate);

initScenarioSelect();
setDefaults();
