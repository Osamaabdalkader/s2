// تطبيق منصة تسريع الإلكترونية
document.addEventListener('DOMContentLoaded', async () => {
    console.log('تم تحميل التطبيق');
    
    // تحميل الأجزاء الثابتة (الهيدر والفوتر)
    await loadPartials();
    
    // إعداد نظام التوجيه
    setupRouter();
    
    // اختبار اتصال Supabase
    await testConnection();
    
    // التحقق من حالة المصادقة
    await checkAuth();
    
    // معالجة المسار الأولي
    handleInitialRoute();
});

// تحميل الأجزاء الثابتة
async function loadPartials() {
    try {
        // تحميل الهيدر
        const headerResponse = await fetch('partials/header.html');
        const headerHtml = await headerResponse.text();
        document.getElementById('header-container').innerHTML = headerHtml;
        
        // تحميل الفوتر
        const footerResponse = await fetch('partials/footer.html');
        const footerHtml = await footerResponse.text();
        document.getElementById('footer-container').innerHTML = footerHtml;
        
        // إعداد أحداث الهيدر بعد تحميله
        setupHeaderEvents();
    } catch (error) {
        console.error('خطأ في تحميل الأجزاء:', error);
    }
}

// إعداد أحداث الهيدر
function setupHeaderEvents() {
    // الانتقال بين الصفحات
    document.querySelectorAll('[data-nav]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-nav');
            navigateTo(page);
        });
    });
    
    // تسجيل الخروج
    const logoutBtn = document.getElementById('logout-link');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    // تصحيح الأخطاء
    const debugBtn = document.getElementById('debug-link');
    if (debugBtn) {
        debugBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleDebug();
        });
    }
}

// إعداد نظام التوجيه
function setupRouter() {
    // تعريف المسارات
    window.routes = {
        'home': { template: 'pages/home.html', script: 'js/home.js', init: initHomePage },
        'publish': { template: 'pages/publish.html', script: 'js/publish.js', init: initPublishPage },
        'login': { template: 'pages/login.html', script: 'js/login.js', init: initLoginPage },
        'register': { template: 'pages/register.html', script: 'js/register.js', init: initRegisterPage },
        'profile': { template: 'pages/profile.html', script: 'js/profile.js', init: initProfilePage }
    };
    
    // الاستماع لتغيرات الـ hash في URL
    window.addEventListener('hashchange', handleRoute);
}

// معالجة المسار الأولي
function handleInitialRoute() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        navigateTo(hash);
    } else {
        navigateTo('home');
    }
}

// التنقل إلى صفحة
async function navigateTo(page) {
    if (!window.routes[page]) {
        console.error('الصفحة غير موجودة:', page);
        return;
    }
    
    // تحديث الـ URL
    window.location.hash = page;
    
    // تحميل الصفحة
    await loadPage(page);
}

// تحميل الصفحة
async function loadPage(page) {
    const route = window.routes[page];
    
    try {
        // تحميل القالب
        const response = await fetch(route.template);
        const html = await response.text();
        document.getElementById('app-content').innerHTML = html;
        
        // تحميل script الصفحة
        await loadScript(route.script);
        
        // استدعاء دالة التهيئة
        if (typeof route.init === 'function') {
            route.init();
        }
    } catch (error) {
        console.error('خطأ في تحميل الصفحة:', error);
        document.getElementById('app-content').innerHTML = `
            <div class="error-page">
                <h2>خطأ في تحميل الصفحة</h2>
                <p>تعذر تحميل الصفحة المطلوبة. يرجى المحاولة مرة أخرى.</p>
            </div>
        `;
    }
}

// تحميل script
function loadScript(src) {
    return new Promise((resolve, reject) => {
        // إزالة أي scripts سابقة
        const oldScript = document.getElementById('page-script');
        if (oldScript) {
            oldScript.remove();
        }
        
        // إنشاء script جديد
        const script = document.createElement('script');
        script.id = 'page-script';
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
}

// وظائف مساعدة
function showStatus(message, type, elementId = 'upload-status') {
    const statusEl = document.getElementById(elementId);
    if (statusEl) {
        statusEl.textContent = message;
        statusEl.className = `upload-status ${type}`;
        statusEl.style.display = 'block';
    }
}

function toggleDebug() {
    debugMode = !debugMode;
    const debugEl = document.getElementById('debug-info');
    if (debugEl) {
        debugEl.style.display = debugMode ? 'block' : 'none';
        if (debugMode) {
            loadDebugInfo();
        }
    }
}

function loadDebugInfo() {
    const debugEl = document.getElementById('debug-info');
    if (debugEl) {
        debugEl.innerHTML = `
            <h3>معلومات التصحيح:</h3>
            <p>Supabase URL: ${SUPABASE_URL}</p>
            <p>Supabase Key: ${SUPABASE_KEY.substring(0, 20)}...</p>
            <p>تم تحميل الصفحة: ${new Date().toLocaleString('ar-SA')}</p>
            <p>حالة المستخدم: ${currentUser ? 'مسجل الدخول' : 'غير مسجل'}</p>
            <p>معلومات المتصفح: ${navigator.userAgent}</p>
        `;
    }
                              }
