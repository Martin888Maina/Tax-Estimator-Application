# Kenya Tax Estimator

A free, browser-based tax calculator for Kenyan employees. Enter your gross monthly or annual salary and instantly see your full PAYE breakdown — every statutory deduction itemised, visualised, and exportable as a PDF.

---

## Features

**1. PAYE Tax Calculator**
Real-time calculation using all five KRA graduated tax brackets (Finance Act 2023). Personal relief of KES 2,400/month is applied automatically. Handles edge cases including zero salary and salaries where personal relief fully offsets the tax.

**2. Statutory Deductions Breakdown**
Every deduction shown as a separate line item with the rate and computed amount: SHIF (2.75% of gross, minimum KES 300), NSSF Tier I and Tier II (6% of pensionable pay), and the Affordable Housing Levy (1.5% of gross).

**3. Annual / Monthly Toggle**
Switch between monthly and annual salary view with a single click. All figures — cards, tables, charts — recalculate instantly.

**4. Editable Tax Rate Settings**
All hardcoded KRA values are exposed in a collapsible settings panel. Edit any PAYE bracket threshold or rate, SHIF rate, NSSF caps, Housing Levy rate, or personal relief amount. Changes apply immediately. A "Reset All to Defaults" button restores official values.

**5. Visual Income Breakdown Charts**
A donut chart shows the proportion of gross salary allocated to each deduction and net pay. A horizontal stacked bar shows the same proportions side by side. Both charts update in real time.

**6. Tax Bracket Visualizer**
A segmented bar highlights which of the five PAYE brackets your taxable income reaches. An income marker needle shows exactly where you sit. Displays effective rate vs. marginal rate.

**7. Deduction Explanation Panel**
A collapsible accordion with plain-language explanations of PAYE, SHIF, NSSF, the Housing Levy, and personal relief — including the relevant legislation for each.

**8. PDF Export**
A "Download PDF" button captures your full results breakdown as a clean, printable PDF. The filename includes your salary amount and the date: `tax-breakdown-KES-75000-2025-03-04.pdf`.

---

## Prerequisites

- PHP 8.1 or higher
- Composer

No database, no Node.js build step, and no npm install required.

---

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/Martin888Maina/Tax-Estimator-Application.git
cd Tax-Estimator-Application

# 2. Install PHP dependencies
composer install

# 3. Copy the environment file
cp .env.example .env

# 4. Generate the application key
php artisan key:generate

# 5. Start the development server
php artisan serve
```

Open your browser and navigate to `http://localhost:8000`.

That is all the setup required. There are no migrations, no database configuration, and no frontend build pipeline.

---

## Usage

### Basic calculation

1. Navigate to the Calculator page at `/calculator`.
2. Enter your gross monthly salary in the input field (e.g. `75000`).
3. Your full tax breakdown appears immediately — PAYE, SHIF, NSSF Tier I and Tier II, Housing Levy, and net take-home pay.

### Annual view

Toggle the Monthly / Annual switch in the input section. All figures multiply by twelve. The input field then accepts an annual salary directly.

### Customising tax rates

Click "Tax Rate Settings" to expand the settings panel. Edit any rate or threshold — changes take effect instantly. Use "Reset to Default" beside any field to restore its official value, or "Reset All to Defaults" to restore everything.

### Downloading a PDF

Once a salary has been entered, a "Download PDF" button appears above the results. Click it to generate and download a formatted breakdown document.

---

## Calculation Methodology

### PAYE (Pay As You Earn)

Kenya uses a graduated income tax system. Tax is computed only on the portion of income within each bracket — not on the total income.

**Monthly brackets (Finance Act 2023):**

| Monthly Taxable Income   | Rate  |
|--------------------------|-------|
| Up to KES 24,000         | 10%   |
| KES 24,001 – 32,333      | 25%   |
| KES 32,334 – 500,000     | 30%   |
| KES 500,001 – 800,000    | 32.5% |
| Above KES 800,000        | 35%   |

Personal relief of KES 2,400/month is deducted from the gross PAYE. If the result is negative, PAYE payable is set to zero.

### Order of operations

1. Compute SHIF: `max(gross × 2.75%, KES 300)`
2. Compute NSSF: `6% × Tier I (first KES 9,000) + 6% × Tier II (KES 9,001–108,000)`
3. Compute Housing Levy: `gross × 1.5%`
4. Taxable Income: `gross − SHIF − NSSF − Housing Levy`
5. Apply PAYE brackets to taxable income
6. Subtract personal relief: `PAYE Payable = Gross PAYE − 2,400` (minimum zero)
7. Net Pay: `gross − PAYE Payable − SHIF − NSSF − Housing Levy`

### SHIF (Social Health Insurance Fund)

Replaced NHIF effective 1 October 2024. Rate is 2.75% of gross salary with a minimum of KES 300/month. Fully tax-deductible since 27 December 2024.

### NSSF (National Social Security Fund)

Under the NSSF Act 2013, fully enforced from February 2026. Employee contribution rate is 6% of pensionable pay, capped at KES 6,480/month. Employee contributions are tax-deductible.

### Affordable Housing Levy

Reintroduced 19 March 2024 under the Affordable Housing Act 2024. Rate is 1.5% of gross salary. Fully tax-deductible since 27 December 2024.

---

## Data Sources

- Kenya Revenue Authority — kra.go.ke
- Finance Act 2023
- Tax Laws (Amendment) Act 2024
- Social Health Insurance Act 2023
- NSSF Act 2013
- Affordable Housing Act 2024

---

## Project Structure

```
Tax-Estimator-Application/
├── public/
│   ├── css/
│   │   ├── app.css              Global styles, variables, navbar, footer
│   │   ├── calculator.css       Calculator page styles
│   │   ├── settings.css         Settings panel and explanation accordion
│   │   ├── charts.css           Chart containers and bracket visualizer
│   │   ├── landing.css          Landing page styles
│   │   ├── about.css            About page styles
│   │   └── responsive.css       Mobile-first media queries
│   └── js/
│       ├── tax-constants.js     All KRA rates and thresholds (single source of truth)
│       ├── tax-calculator.js    Core PAYE calculation engine
│       ├── currency-formatter.js KES formatting helpers
│       ├── settings-override.js Settings panel population and override logic
│       ├── charts.js            Chart.js initialization and bracket visualizer
│       ├── ui-helpers.js        DOM wiring, event listeners, result rendering
│       └── export-pdf.js        PDF generation using html2canvas and jsPDF
├── resources/views/
│   ├── layouts/app.blade.php    Master layout with CDN links
│   ├── partials/                Navbar, footer, tax disclaimer
│   ├── components/              Settings panel, bracket visualizer
│   └── pages/                   Landing, calculator, about
├── routes/web.php               Three Route::view() declarations
└── README.md
```

---

## Technology Stack

| Layer           | Technology                              |
|-----------------|-----------------------------------------|
| Templating      | Laravel Blade                           |
| Styling         | Pure CSS with custom properties         |
| Charts          | Chart.js (CDN)                          |
| PDF Export      | html2canvas + jsPDF (CDN)              |
| Currency Format | Intl.NumberFormat (built-in JS API)     |
| Tax Logic       | Vanilla JavaScript                      |
| Icons           | Font Awesome (CDN)                      |

---

## Future Enhancements

- Employer cost calculator showing employer NSSF and Housing Levy matching
- Reverse calculator — enter desired net pay, compute required gross
- Side-by-side salary comparison at two different income levels
- Historical rate reference showing how KRA brackets have changed over the years
- Dark mode with localStorage persistence
- Localization support for English and Swahili
- Unit tests for all tax calculation functions
- PWA support for offline access on mobile

---

## Disclaimer

This application is for educational and informational purposes only. It does not constitute professional tax advice. Tax laws change — always verify your figures with the Kenya Revenue Authority (KRA) or a licensed tax professional. The developer accepts no liability for decisions made based on this tool's output.

---

## License

MIT License. See the LICENSE file for details.
