document.addEventListener('DOMContentLoaded', function() {

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionButton = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggleIcon = item.querySelector('.faq-toggle');

        if (questionButton) {
            questionButton.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all other items (optional)
                // faqItems.forEach(otherItem => {
                //     if (otherItem !== item) {
                //         otherItem.classList.remove('active');
                //         otherItem.querySelector('.faq-answer').style.maxHeight = null;
                //         otherItem.querySelector('.faq-toggle').textContent = '+';
                //     }
                // });

                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                    answer.style.maxHeight = null;
                    if (toggleIcon) toggleIcon.textContent = '+';
                } else {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + "px"; // Set max-height to content height
                     if (toggleIcon) toggleIcon.textContent = '-'; // Change icon using textContent
                    // If using CSS for the icon change (e.g., transform), this line isn't needed
                }
            });
        }
    });

    // --- Page Top Button ---
    const pageTopBtn = document.getElementById('pageTopBtn');
    const scrollThreshold = 300; // Show button after scrolling down 300px

    window.onscroll = function() {
        if (document.body.scrollTop > scrollThreshold || document.documentElement.scrollTop > scrollThreshold) {
            pageTopBtn.style.display = "block";
        } else {
            pageTopBtn.style.display = "none";
        }
    };

    if (pageTopBtn) {
        pageTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Unsplash Random Image Helper Function ---
    function loadRandomUnsplashImage(element, query, size = '800x600') {
        if (!element) return;
        
        // 実装方法1: 直接Unsplash URLを使用
        const directUrl = `https://source.unsplash.com/random/${size}/?${query}`;
        
        // 実装方法2: Proxy API経由（クロスオリジン問題の回避策）
        // 注: 実際のアプリケーションでは、自前のプロキシサーバーを用意するか、
        // Unsplash APIキーを使用する方が望ましい
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(directUrl)}`;
        
        console.log(`画像読み込み開始: ${query}, サイズ: ${size}`);
        
        // 別の方法を試してみる関数
        function tryFallbackMethod() {
            console.log(`別の方法を試します: ${query}`);
            
            // 代替手段として直接URLを使用
            if (element.tagName.toLowerCase() === 'img') {
                element.src = directUrl;
                element.crossOrigin = "anonymous"; // CORS対応
            } else {
                element.style.backgroundImage = `url(${directUrl})`;
            }
            
            // しばらく待ってからクラスを追加（読み込みイベントを捕捉できない場合の対策）
            setTimeout(() => {
                element.classList.add('loaded');
            }, 2000);
        }
        
        // プロキシ経由でのロード試行
        try {
            fetch(proxyUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.blob();
                })
                .then(blob => {
                    const objectUrl = URL.createObjectURL(blob);
                    if (element.tagName.toLowerCase() === 'img') {
                        element.src = objectUrl;
                    } else {
                        element.style.backgroundImage = `url(${objectUrl})`;
                    }
                    element.classList.add('loaded');
                    console.log(`画像読み込み成功: ${query}`);
                })
                .catch(error => {
                    console.error(`プロキシ経由の読み込みに失敗: ${error.message}`);
                    tryFallbackMethod();
                });
        } catch (error) {
            console.error(`初期エラー: ${error.message}`);
            tryFallbackMethod();
        }
    }

    // --- 代替アプローチでUnsplash画像をロード ---
    function loadFallbackImage(element, query, size = '800x600') {
        if (!element) return;
        
        // 特定のUnsplash画像をハードコードで指定（デモ用）
        const fallbackImages = {
            'bank,logo': 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f',
            'fuji,japan': 'https://images.unsplash.com/photo-1546528377-9049abbac88f',
            'agile,speed': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
            'challenge,innovation': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf',
            'empathy,teamwork': 'https://images.unsplash.com/photo-1536324762978-d2ebce968e2f',
            'business,office,japan': 'https://images.unsplash.com/photo-1497366216548-37526070297c',
            'housing,loan,japan': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa',
            'finance,advisor,japan': 'https://images.unsplash.com/photo-1622473590773-f588134b6ce7',
            'realestate,investment,japan': 'https://images.unsplash.com/photo-1530364445156-b3a9e36e8c2d',
            'office,meeting,japan': 'https://images.unsplash.com/photo-1595525101922-4d52a4646d98',
            'bank,building,japan': 'https://images.unsplash.com/photo-1551367595-c96de8a5e2a0',
            'building,historic': 'https://images.unsplash.com/photo-1516156008625-3a9d6067fab5'
        };
        
        // クエリに一致する画像があるか確認
        let imageUrl = '';
        for (const key in fallbackImages) {
            if (query.includes(key) || key.includes(query)) {
                imageUrl = fallbackImages[key];
                break;
            }
        }
        
        // 一致するものがなければデフォルトのものを使用
        if (!imageUrl) {
            imageUrl = fallbackImages['bank,logo'];
        }
        
        // サイズを指定（サイズはauto-formatで適用）
        imageUrl += `?auto=format&fit=crop&w=${size.split('x')[0]}&h=${size.split('x')[1]}`;
        
        console.log(`フォールバック画像を読み込みます: ${imageUrl}`);
        
        if (element.tagName.toLowerCase() === 'img') {
            element.src = imageUrl;
            element.crossOrigin = "anonymous";
        } else {
            element.style.backgroundImage = `url(${imageUrl})`;
        }
        
        element.classList.add('loaded');
    }

    // --- ページ読み込み時に初期画像を設定 ---
    function loadInitialImages() {
        console.log('初期画像の読み込みを開始します');
        
        // ランダム要素を表示する
        const randomElement = Math.random() > 0.5;
        console.log(`ランダム要素: ${randomElement ? 'ランダム' : 'フォールバック'}画像を使用します`);
        
        // data-unsplash属性を持つ画像を全て処理
        document.querySelectorAll('img.unsplash-image').forEach(img => {
            const query = img.getAttribute('data-unsplash');
            if (!query) return;
            
            // imgタグのサイズを推測（クラス名から）
            let size = '800x600'; // デフォルトサイズ
            
            if (img.closest('.logo')) {
                size = '200x50';
            } else if (img.closest('.image-separator')) {
                size = '1600x400';
            } else if (img.closest('.personality-cards')) {
                size = '200x200';
            } else if (img.closest('.interview-card')) {
                size = '400x300';
            } else if (img.closest('.image-content')) {
                size = '500x400';
            } else if (img.closest('.data-value')) {
                size = '80x80';
            }
            
            console.log(`処理中の画像: ${query}, サイズ: ${size}`);
            if (randomElement) {
                loadRandomUnsplashImage(img, query, size);
            } else {
                loadFallbackImage(img, query, size);
            }
        });

        // ヒーローセクションの背景
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            console.log('ヒーローセクションの背景を読み込みます');
            if (randomElement) {
                loadRandomUnsplashImage(heroSection, 'bank,business', '1600x800');
            } else {
                // ヒーローセクションの背景用のフォールバック画像
                heroSection.style.backgroundImage = 'url(https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?auto=format&fit=crop&w=1600&h=800)';
                heroSection.classList.add('loaded');
            }
        }
    }

    // ページ読み込み時に画像を初期化
    console.log('画像の初期化を開始します...');
    loadInitialImages();
    
    // 画像をランダムに更新するボタン
    const refreshImagesBtn = document.getElementById('refreshImagesBtn');
    if (refreshImagesBtn) {
        refreshImagesBtn.addEventListener('click', function() {
            console.log('画像更新ボタンがクリックされました');
            loadInitialImages();
        });
    }

    // imgタグの読み込み完了を監視
    document.querySelectorAll('img').forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
            img.addEventListener('error', function() {
                console.error(`画像の読み込みに失敗しました: ${this.src}`);
                
                // エラーになった画像にもloadedクラスを追加して表示を整える
                this.classList.add('loaded');
                
                // エラーの場合、placeholder画像に置き換える
                if (this.classList.contains('unsplash-image')) {
                    this.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23f0f5fa"/><text x="50%" y="50%" font-size="14" text-anchor="middle" alignment-baseline="middle" font-family="Arial, sans-serif" fill="%23aabbcc">Image Error</text></svg>';
                }
            });
        }
    });

});