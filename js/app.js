// تطبيق منصة تسريع الإلكترونية
document.addEventListener('DOMContentLoaded', async () => {
    console.log('تم تحميل التطبيق');
    
    // إعداد نظام التوجيه
    setupRouter();
    
    // إعداد أحداث واجهة المستخدم
    setupUIEvents();
    
    // اختبار اتصال Supabase
    await testConnection();
    
    // التحقق من حالة المصادقة
    await checkAuth();
    
    // معالجة المسار الأولي
    handleInitialRoute();
});

// إعداد نظام التوجيه
function setupRouter() {
    // منع السلوك الافتراضي للروابط ذات data-link
    document.body.addEventListener('click', e => {
        if (e.target.matches('[data-link]')) {
            e.preventDefault();
            const href = e.target.getAttribute('href');
            const page = href.substring(1); // إزالة #
            navigateTo(page);
        }
    });
    
    // التعامل مع تغيير الـ hash في المتصفح
    window.addEventListener('hashchange', () => {
        const page = window.location.hash.substring(1) || 'home';
        loadPage(page);
    });
}

// إعداد أحداث واجهة المستخدم
function setupUIEvents() {
    // إعداد حدث تسجيل الخروج
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
    
    // إعداد حدث تصحيح الأخطاء
    const debugBtn = document.getElementById('debug-btn');
    if (debugBtn) {
        debugBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleDebug();
        });
    }
}

// معالجة المسار الأولي
function handleInitialRoute() {
    // استخدام الـ hash الحالي أو الصفحة الرئيسية
    const page = window.location.hash.substring(1) || 'home';
    navigateTo(page);
}

// التنقل إلى صفحة
function navigateTo(page) {
    if (!routes[page]) {
        page = 'home';
    }
    
    // تحديث الـ URL
    window.location.hash = page;
    
    // تحميل الصفحة
    loadPage(page);
}

// تحميل الصفحة
async function loadPage(page) {
    if (!routes[page]) {
        page = 'home';
    }
    
    const route = routes[page];
    
    // التحقق من المصادقة إذا كانت الصفحة تتطلب ذلك
    if (route.auth && !currentUser) {
        navigateTo('login');
        return;
    }
    
    try {
        // عرض حالة التحميل
        document.getElementById('app-content').innerHTML = `
            <div class="loader">
                <div class="spinner"></div>
            </div>
        `;
        
        // تحميل القالب
        const response = await fetch(route.template);
        if (!response.ok) {
            throw new Error('لم يتم العثور على الصفحة');
        }
        
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
                <button onclick="navigateTo('home')">العودة إلى الرئيسية</button>
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
