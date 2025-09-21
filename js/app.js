document.addEventListener('DOMContentLoaded', async () => {
    // تحميل الهيدر والفوتر
    await loadPartials();
    
    // إعداد الروابط
    setupNavigation();
    
    // تعريف المسارات
    router.addRoute('home', 'home', initHomePage);
    router.addRoute('publish', 'publish', initPublishPage);
    router.addRoute('login', 'login', initLoginPage);
    router.addRoute('register', 'register', initRegisterPage);
    router.addRoute('profile', 'profile', initProfilePage);
    
    // اختبار الاتصال أولاً
    await testConnection();
    
    // ثم التحقق من المصادقة
    await checkAuth();
});

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
    } catch (error) {
        console.error('خطأ في تحميل المكونات:', error);
    }
}

function setupNavigation() {
    // سيتم إضافة معالجات الأحداث بعد تحميل الهيدر
    document.addEventListener('headerLoaded', function() {
        // إعداد معالجات الأحداث للروابط
        document.querySelectorAll('[data-nav]').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetPage = this.getAttribute('data-nav');
                router.navigateTo(targetPage);
            });
        });
        
        // إعداد معالجة تسجيل الخروج
        const logoutBtn = document.getElementById('logout-link');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
        }
        
        // إعداد تصحيح الأخطاء
        const debugBtn = document.getElementById('debug-link');
        if (debugBtn) {
            debugBtn.addEventListener('click', function(e) {
                e.preventDefault();
                toggleDebug();
            });
        }
    });
}

// وظائف مساعدة مشتركة
function showStatus(message, type, elementId = 'upload-status') {
    const statusEl = document.getElementById(elementId);
    statusEl.textContent = message;
    statusEl.className = 'upload-status';
    statusEl.classList.add(type);
    statusEl.style.display = 'block';
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
    debugEl.innerHTML = `
        <h3>معلومات التصحيح:</h3>
        <p>Supabase URL: ${SUPABASE_URL}</p>
        <p>Supabase Key: ${SUPABASE_KEY.substring(0, 20)}...</p>
        <p>تم تحميل الصفحة: ${new Date().toLocaleString('ar-SA')}</p>
        <p>حالة المستخدم: ${currentUser ? 'مسجل الدخول' : 'غير مسجل'}</p>
        <p>معلومات المتصفح: ${navigator.userAgent}</p>
    `;
}