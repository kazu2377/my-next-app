$(function() {

    // --- スムーススクロール ---
    $('a[href^="#"]').click(function() {
        const speed = 500;
        let href = $(this).attr("href");
        let target = $(href == "#" || href == "" ? 'html' : href);
        let headerHeight = $('.header').outerHeight() || 0;
        let position = target.offset().top - headerHeight;

        if ($('.sp-nav').hasClass('is-active')) {
            closeSpMenu();
        }

        $("html, body").animate({scrollTop: position}, speed, "swing");
        return false;
    });

    // --- ハンバーガーメニュー ---
    $('.hamburger-menu').on('click', function() {
        toggleSpMenu();
    });
    $('.sp-nav a').on('click', function() {
        closeSpMenu();
    });

    function toggleSpMenu() {
        $('.hamburger-menu').toggleClass('is-active');
        $('.sp-nav').toggleClass('is-active');
        $('body').toggleClass('no-scroll');
    }
    function closeSpMenu() {
        $('.hamburger-menu').removeClass('is-active');
        $('.sp-nav').removeClass('is-active');
        $('body').removeClass('no-scroll');
    }

    // --- ヘッダースクロール変化 ---
    $(window).on('scroll', function() {
        const header = $('.header');
        if ($(window).scrollTop() > 50) {
            header.addClass('scrolled');
        } else {
            header.removeClass('scrolled');
        }
    });

    // --- スクロールアニメーション (Intersection Observer API) ---
    const animatedItems = document.querySelectorAll('.fade-in'); // 対象クラス名

    if (!!window.IntersectionObserver) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
             rootMargin: "-100px 0px" // 100px手前で表示開始
        });

        animatedItems.forEach(item => {
            observer.observe(item);
        });
    } else { // フォールバック
        animatedItems.forEach(item => item.classList.add('is-visible'));
    }

});