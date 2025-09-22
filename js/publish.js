// تهيئة صفحة النشر
function initPublishPage() {
    // التحقق من حالة تسجيل الدخول
    if (!currentUser) {
        document.getElementById('publish-content').style.display = 'none';
        document.getElementById('login-required-publish').style.display = 'block';
    } else {
        document.getElementById('publish-content').style.display = 'block';
        document.getElementById('login-required-publish').style.display = 'none';
    }
}

// معالجة إرسال نموذج النشر
async function handlePublishSubmit(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showStatus('يجب تسجيل الدخول لنشر منشور', 'error');
        navigateTo('login');
        return;
    }
    
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const location = document.getElementById('location').value;
    const category = document.getElementById('category').value;
    const price = document.getElementById('price').value;
    const imageFile = document.getElementById('image').files[0];
    
    let imageUrl = null;
    
    try {
        // إذا تم رفع صورة
        if (imageFile) {
            // التحقق من حجم الصورة
            if (imageFile.size > 5 * 1024 * 1024) {
                showStatus('حجم الصورة كبير جداً. الحد الأقصى هو 5MB', 'error');
                return;
            }
            
            showStatus('جاري رفع الصورة...', 'success');
            
            // رفع الصورة إلى Supabase Storage
            imageUrl = await uploadImage(imageFile);
            
            if (!imageUrl) {
                showStatus('فشل في رفع الصورة', 'error');
                return;
            }
        }
        
        if (name && description && location && category && price) {
            showStatus('جاري نشر المنشور...', 'success');
            
            const success = await addPost(name, description, location, category, price, imageUrl);
            
            if (success) {
                // إعادة تعيين النموذج
                document.getElementById('publish-form').reset();
                
                // إظهار رسالة نجاح
                showStatus('تم نشر المنشور بنجاح!', 'success');
                
                // الانتظار قليلاً ثم العودة إلى الصفحة الرئيسية
                setTimeout(() => {
                    const uploadStatus = document.getElementById('upload-status');
                    if (uploadStatus) {
                        uploadStatus.classList.remove('success');
                        uploadStatus.style.display = 'none';
                    }
                    navigateTo('home');
                }, 1500);
            } else {
                showStatus('فشل في نشر المنشور', 'error');
            }
        } else {
            showStatus('يرجى ملء جميع الحقول المطلوبة', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showStatus(`فشل في نشر المنشور: ${error.message}`, 'error');
        
        if (debugMode) {
            const debugEl = document.getElementById('debug-info');
            if (debugEl) {
                debugEl.innerHTML += `<p>خطأ: ${error.message}</p>`;
            }
        }
    }
}

// رفع الصورة إلى Supabase Storage
async function uploadImage(file) {
    try {
        // إنشاء اسم فريد للصورة
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;
        
        // رفع الصورة إلى bucket المسمى "marketing"
        const { data, error: uploadError } = await supabase.storage
            .from('marketing')
            .upload(filePath, file);
        
        if (uploadError) {
            console.error('Error uploading image:', uploadError);
            if (debugMode) {
                const debugEl = document.getElementById('debug-info');
                if (debugEl) {
                    debugEl.innerHTML += `<p>خطأ في رفع الصورة: ${uploadError.message}</p>`;
                }
            }
            throw new Error(uploadError.message);
        }
        
        // الحصول على رابط الصورة
        const { data: { publicUrl } } = supabase.storage
            .from('marketing')
            .getPublicUrl(filePath);
        
        return publicUrl;
    } catch (error) {
        console.error('Error:', error);
        if (debugMode) {
            const debugEl = document.getElementById('debug-info');
            if (debugEl) {
                debugEl.innerHTML += `<p>خطأ في رفع الصورة: ${error.message}</p>`;
            }
        }
        throw error;
    }
}

// إضافة منشور جديد إلى Supabase
async function addPost(name, description, location, category, price, imageUrl) {
    try {
        const { data, error } = await supabase
            .from('marketing')
            .insert([{ 
                name,
                description, 
                location,
                category,
                price,
                image_url: imageUrl,
                user_id: currentUser.email // استخدام البريد الإلكتروني كمعرف للمستخدم
            }]);
        
        if (error) {
            console.error('Error adding post:', error);
            if (debugMode) {
                const debugEl = document.getElementById('debug-info');
                if (debugEl) {
                    debugEl.innerHTML += `<p>خطأ في إضافة المنشور: ${error.message}</p>`;
                }
            }
            throw new Error(error.message);
        }
        
        return true;
    } catch (error) {
        console.error('Error:', error);
        if (debugMode) {
            const debugEl = document.getElementById('debug-info');
            if (debugEl) {
                debugEl.innerHTML += `<p>خطأ في إضافة المنشور: ${error.message}</p>`;
            }
        }
        throw error;
    }
        }
