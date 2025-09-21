function initLoginPage() {
    // إعداد نموذج تسجيل الدخول
    document.getElementById('login-form').addEventListener('submit', handleLoginSubmit);
}

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
        router.navigateTo('home');
    } catch (error) {
        console.error('Error signing in:', error.message);
        showStatus(`فشل تسجيل الدخول: ${error.message}`, 'error', 'login-status');
    }
}