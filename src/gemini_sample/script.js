$(function() { // jQueryの読み込み完了後に実行

    // --- スムーススクロール ---
    $('a[href^="#"]').click(function() {
        const speed = 500; // スクロール速度 (ミリ秒)
        let href = $(this).attr("href");
        let target = $(href == "#" || href == "" ? 'html' : href);
        // ヘッダーの高さを取得 (固定ヘッダー分オフセット)
        let headerHeight = $('.header').outerHeight() || 0;
        let position = target.offset().top - headerHeight;

        // SPナビが開いていたら閉じる
        if ($('.sp-nav').hasClass('is-active')) {
            $('.hamburger-menu').removeClass('is-active');
            $('.sp-nav').removeClass('is-active');
        }

        $("html, body").animate({scrollTop: position}, speed, "swing");
        return false;
    });

    // --- ハンバーガーメニュー ---
    $('.hamburger-menu').on('click', function() {
        $(this).toggleClass('is-active');
        $('.sp-nav').toggleClass('is-active');
        // 背景固定 (iOS Safari対策含む)
        $('body').toggleClass('no-scroll');
    });
    // SPナビのリンククリック時にもメニューを閉じる
    $('.sp-nav a').on('click', function() {
        $('.hamburger-menu').removeClass('is-active');
        $('.sp-nav').removeClass('is-active');
        $('body').removeClass('no-scroll');
    });

    // --- スクロールアニメーション (Intersection Observer API) ---
    // アニメーションさせたい要素を取得
    const animatedItems = document.querySelectorAll('.strength-item, .service-item, .process-item, .casestudy-item'); // 対象要素を追加

    if (!!window.IntersectionObserver) { // ブラウザがIntersectionObserverに対応しているかチェック
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) { // 要素がビューポート内に入ったら
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // 一度表示したら監視を解除
                }
            });
        }, {
            rootMargin: "-50px 0px" // 少し早めに表示させる（調整可）
        });

        animatedItems.forEach(item => {
            observer.observe(item); // 各要素の監視を開始
        });

    } else { // IntersectionObserver未対応ブラウザ向けのフォールバック (全要素表示)
        animatedItems.forEach(item => {
            item.classList.add('is-visible');
        });
        console.log("IntersectionObserver is not supported.");
    }

    // --- (オプション) スクロールでヘッダー背景変更 ---
    /*
    $(window).on('scroll', function() {
        const header = $('.header');
        const scroll = $(window).scrollTop();
        if (scroll > 100) { // 100pxスクロールしたら
            header.addClass('scrolled'); // 背景色などを変えるクラスを付与
        } else {
            header.removeClass('scrolled');
        }
    });
    // CSS側に .header.scrolled { background-color: rgba(255, 255, 255, 0.9); } のようなスタイルを追加
    */

});

// bodyに .no-scroll クラスが付いた時のスタイル (CSSに追加)
/*
body.no-scroll {
  overflow: hidden;
}
*/