// تهيئة صفحة إنشاء حساب
function initRegisterPage() {
    // لا حاجة لعمل أي شيء هنا حيث تم إعداد الأحداث في app.js
}

// معالجة إرسال نموذج إنشاء حساب
async function handleRegisterSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const phone = document.getElementById('register-phone').value;
    const address = document.getElementById('register-address').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    // التحقق من تطابق كلمة المرور
    if (password !== confirmPassword) {
        showStatus('كلمة المرور غير متطابقة', 'error', 'register-status');
        return;
    }
    
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                    phone: phone,
                    address: address
                }
            }
        });
        
        if (error) throw error;
        
        showStatus('تم إنشاء الحساب بنجاح! يرجى تسجيل الدخول', 'success', 'register-status');
        
        // إعادة تعيين النموذج
        document.getElementById('register-form').reset();
        
        // الانتظار قليلاً ثم الانتقال إلى صفحة تسجيل الدخول
        setTimeout(() => {
            navigateTo('login');
        }, 2000);
    } catch (error) {
        console.error('Error signing up:', error.message);
        showStatus(`فشل في إنشاء الحساب: ${error.message}`, 'error', 'register-status');
    }
}
