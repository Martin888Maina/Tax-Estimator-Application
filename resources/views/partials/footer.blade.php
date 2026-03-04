<footer class="footer">
    <div class="footer__container">
        <div class="footer__top">
            <div class="footer__brand">
                <a href="{{ url('/') }}" class="footer__logo">
                    <i class="fa-solid fa-calculator"></i>
                    <span>KenyaTax</span>
                </a>
                <p class="footer__tagline">Know exactly where every shilling of your salary goes.</p>
            </div>

            <div class="footer__links-group">
                <h4 class="footer__group-title">Pages</h4>
                <ul class="footer__links">
                    <li><a href="{{ url('/') }}">Home</a></li>
                    <li><a href="{{ url('/calculator') }}">Calculator</a></li>
                    <li><a href="{{ url('/about') }}">About</a></li>
                </ul>
            </div>

        </div>

        <div class="footer__bottom">
            <p class="footer__disclaimer">
                This tool is for informational purposes only and does not constitute tax advice.
                Always verify with KRA or a licensed tax professional.
            </p>
            <p class="footer__copy">
                &copy; {{ date('Y') }} Kenya Tax Estimator. Built for Kenyan employees.
            </p>
        </div>
    </div>
</footer>
