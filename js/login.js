// تهيئة صفحة تسجيل الدخول
function initLoginPage() {
    // لا حاجة لعمل أي شيء هنا حيث تم إعداد الأحداث في app.js
}

// معالجة إرسال نموذج تسجيل الدخول
async function handleLoginSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) throw error;
        
        currentUser = data.user;
        updateUIForAuth();
        navigateTo('home');
    } catch (error) {
        console.error('Error signing in:', error.message);
        showStatus(`فشل تسجيل الدخول: ${error.message}`, 'error', 'login-status');
    }
}
