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
            const page = e.target.getAttribute('data-link');
            navigateTo(page);
        }
        
        // معالجة الأزرار ذات data-link
        if (e.target.matches('button[data-link]')) {
            e.preventDefault();
            const page = e.target.getAttribute('data-link');
            navigateTo(page);
        }
    });
    
    // التعامل مع تغيير الـ hash في المتصفح
    window.addEventListener('hashchange', () => {
        const page = window.location.hash.substring(1) || 'home';
        showPage(page);
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
    
    // إعداد أحداث النماذج
    setupFormEvents();
}

// إعداد أحداث النماذج
function setupFormEvents() {
    // نموذج النشر
    const publishForm = document.getElementById('publish-form');
    if (publishForm) {
        publishForm.addEventListener('submit', handlePublishSubmit);
    }
    
    // نموذج تسجيل الدخول
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
    
    // نموذج إنشاء حساب
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegisterSubmit);
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
    if (!isValidPage(page)) {
        page = 'home';
    }
    
    // تحديث الـ URL
    window.location.hash = page;
    
    // عرض الصفحة
    showPage(page);
}

// التحقق إذا كانت الصفحة صالحة
function isValidPage(page) {
    const validPages = ['home', 'publish', 'login', 'register', 'profile'];
    return validPages.includes(page);
}

// عرض الصفحة
function showPage(page) {
    if (!isValidPage(page)) {
        page = 'home';
    }
    
    // إخفاء جميع الصفحات
    document.querySelectorAll('.page').forEach(pageEl => {
        pageEl.classList.remove('active');
    });
    
    // إظهار الصفحة المطلوبة
    const pageEl = document.getElementById(`${page}-page`);
    if (pageEl) {
        pageEl.classList.add('active');
        
        // تحميل المحتوى الديناميكي للصفحة
        loadPageContent(page);
    }
}

// تحميل محتوى الصفحة
function loadPageContent(page) {
    switch(page) {
        case 'home':
            if (typeof loadPosts === 'function') {
                loadPosts();
            }
            break;
        case 'publish':
            if (typeof initPublishPage === 'function') {
                initPublishPage();
            }
            break;
        case 'login':
            if (typeof initLoginPage === 'function') {
                initLoginPage();
            }
            break;
        case 'register':
            if (typeof initRegisterPage === 'function') {
                initRegisterPage();
            }
            break;
        case 'profile':
            if (typeof initProfilePage === 'function') {
                initProfilePage();
            }
            break;
    }
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
