{{--
    bracket-visualizer.blade.php
    Visual PAYE bracket bar — segments light up as the user's income climbs through the brackets.
    All the data rendering is done by updateBracketVisualizer() in charts.js.
--}}
<div class="bviz-card" id="bracketVizCard">

    <div class="bviz-card__header">
        <h2 class="bviz-card__title">
            <i class="fa-solid fa-chart-bar"></i>
            Tax Bracket Visualizer
        </h2>
    </div>

    <p class="bviz-card__subtitle">
        The bar below shows all five PAYE brackets. Highlighted segments are the ones your
        taxable income reaches. The marker shows exactly where your income sits.
    </p>

    {{-- empty state — shown before a salary is entered --}}
    <div class="bviz-empty" id="bracketVizEmpty">
        Enter a salary above to visualize your PAYE bracket position.
    </div>

    {{-- the actual visualizer — hidden until JS populates it --}}
    <div class="bviz-content" id="bracketVizContent" style="display:none;">

        {{-- segmented bar + marker --}}
        <div class="bviz-bar-wrap">
            <div class="bviz-bar" id="bracketVizContainer">
                {{-- segments injected by charts.js --}}
            </div>
            <div class="bviz-marker" id="bracketVizMarker">
                <span class="bviz-marker-label" id="bracketVizMarkerLabel"></span>
            </div>
        </div>

        {{-- bracket labels below the bar --}}
        <div class="bviz-labels" id="bracketVizLabels">
            {{-- injected by charts.js --}}
        </div>

        {{-- effective / marginal / taxable income summary --}}
        <div class="bviz-summary">
            <div class="bviz-summary-item bviz-summary-item--effective">
                <span class="bviz-summary-item__label">Effective Rate</span>
                <span class="bviz-summary-item__value" id="vizEffectiveRate">0.0%</span>
            </div>
            <div class="bviz-summary-item bviz-summary-item--marginal">
                <span class="bviz-summary-item__label">Marginal Rate</span>
                <span class="bviz-summary-item__value" id="vizMarginalRate">0.0%</span>
            </div>
            <div class="bviz-summary-item bviz-summary-item--taxable">
                <span class="bviz-summary-item__label">Taxable Income</span>
                <span class="bviz-summary-item__value" id="vizTaxableIncome">KES 0.00</span>
            </div>
        </div>

    </div>

</div>
