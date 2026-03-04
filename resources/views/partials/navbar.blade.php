<nav class="navbar">
    <div class="navbar__container">
        <a href="{{ url('/') }}" class="navbar__brand">
            <i class="fa-solid fa-calculator"></i>
            <span>KenyaTax</span>
        </a>

        {{-- hamburger for mobile --}}
        <button class="navbar__toggle" id="navToggle" aria-label="Toggle navigation" aria-expanded="false">
            <span class="navbar__toggle-bar"></span>
            <span class="navbar__toggle-bar"></span>
            <span class="navbar__toggle-bar"></span>
        </button>

        <ul class="navbar__links" id="navLinks">
            <li>
                <a href="{{ url('/') }}" class="{{ request()->is('/') ? 'navbar__link--active' : '' }}">
                    Home
                </a>
            </li>
            <li>
                <a href="{{ url('/calculator') }}" class="{{ request()->is('calculator') ? 'navbar__link--active' : '' }}">
                    Calculator
                </a>
            </li>
            <li>
                <a href="{{ url('/about') }}" class="{{ request()->is('about') ? 'navbar__link--active' : '' }}">
                    About
                </a>
            </li>
            <li>
                <a href="{{ url('/calculator') }}" class="btn btn--primary btn--sm">
                    Calculate Now
                </a>
            </li>
        </ul>
    </div>
</nav>

<script>
    // wire up the mobile hamburger toggle
    const navToggle = document.getElementById('navToggle');
    const navLinks  = document.getElementById('navLinks');
    navToggle.addEventListener('click', function () {
        const isOpen = navLinks.classList.toggle('navbar__links--open');
        navToggle.setAttribute('aria-expanded', isOpen);
    });
</script>
