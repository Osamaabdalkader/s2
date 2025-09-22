// تهيئة صفحة الملف الشخصي
function initProfilePage() {
    // التحقق من حالة تسجيل الدخول
    if (!currentUser) {
        document.getElementById('profile-content').style.display = 'none';
        document.getElementById('login-required-profile').style.display = 'block';
    } else {
        document.getElementById('profile-content').style.display = 'block';
        document.getElementById('login-required-profile').style.display = 'none';
        loadProfileData();
    }
}

// تحميل بيانات الملف الشخصي
function loadProfileData() {
    if (currentUser) {
        document.getElementById('profile-name').textContent = currentUser.user_metadata.full_name || 'غير محدد';
        document.getElementById('profile-email').textContent = currentUser.email;
        document.getElementById('profile-phone').textContent = currentUser.user_metadata.phone || 'غير محدد';
        document.getElementById('profile-address').textContent = currentUser.user_metadata.address || 'غير محدد';
        document.getElementById('profile-created').textContent = new Date(currentUser.created_at).toLocaleString('ar-SA');
    }
}
