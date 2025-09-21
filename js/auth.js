// التحقق من حالة المصادقة
async function checkAuth() {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session?.user) {
            currentUser = session.user;
            updateUIForAuth();
        }
    } catch (error) {
        console.error('Error checking auth:', error.message);
        document.getElementById('connection-status').textContent = `خطأ في المصادقة: ${error.message}`;
        document.getElementById('connection-status').className = 'connection-status connection-error';
    }
}

// تحديث واجهة المستخدم بناءً على حالة تسجيل الدخول
function updateUIForAuth() {
    const publishLink = document.getElementById('publish-link');
    const profileLink = document.getElementById('profile-link');
    const logoutLink = document.getElementById('logout-link');
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    
    if (currentUser) {
        if (publishLink) publishLink.style.display = 'list-item';
        if (profileLink) profileLink.style.display = 'list-item';
        if (logoutLink) logoutLink.style.display = 'list-item';
        if (loginLink) loginLink.style.display = 'none';
        if (registerLink) registerLink.style.display = 'none';
    } else {
        if (publishLink) publishLink.style.display = 'none';
        if (profileLink) profileLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'none';
        if (loginLink) loginLink.style.display = 'list-item';
        if (registerLink) registerLink.style.display = 'list-item';
    }
}

// تسجيل الخروج
async function logout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        currentUser = null;
        updateUIForAuth();
        navigateTo('home');
    } catch (error) {
        console.error('Error signing out:', error.message);
        alert(`خطأ في تسجيل الخروج: ${error.message}`);
    }
}

// الاستماع لتغيرات حالة المصادقة
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
        currentUser = session.user;
        updateUIForAuth();
        
        const connectionStatus = document.getElementById('connection-status');
        connectionStatus.textContent = 'تم تسجيل الدخول بنجاح';
        connectionStatus.className = 'connection-status connection-success';
        
        setTimeout(() => {
            connectionStatus.style.display = 'none';
        }, 3000);
    } else if (event === 'SIGNED_OUT') {
        currentUser = null;
        updateUIForAuth();
    }
});
