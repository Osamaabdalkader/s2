// تهيئة الصفحة الرئيسية
function initHomePage() {
    loadPosts();
}

// تحميل المنشورات من Supabase
async function loadPosts() {
    try {
        const { data: posts, error } = await supabase
            .from('marketing')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Error loading posts:', error);
            document.getElementById('connection-status').textContent = `خطأ في تحميل المنشورات: ${error.message}`;
            document.getElementById('connection-status').className = 'connection-status connection-error';
            
            if (debugMode) {
                const debugEl = document.getElementById('debug-info');
                if (debugEl) {
                    debugEl.innerHTML += `<p>خطأ في تحميل المنشورات: ${error.message}</p>`;
                }
            }
            return;
        }
        
        displayPosts(posts);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('connection-status').textContent = `خطأ في تحميل المنشورات: ${error.message}`;
        document.getElementById('connection-status').className = 'connection-status connection-error';
        
        if (debugMode) {
            const debugEl = document.getElementById('debug-info');
            if (debugEl) {
                debugEl.innerHTML += `<p>خطأ في تحميل المنشورات: ${error.message}</p>`;
            }
        }
    }
}

// عرض المنشورات في الصفحة الرئيسية
function displayPosts(posts) {
    const postsContainer = document.getElementById('posts-container');
    if (!postsContainer) return;
    
    postsContainer.innerHTML = '';
    
    if (!posts || posts.length === 0) {
        postsContainer.innerHTML = '<p>لا توجد منشورات بعد.</p>';
        return;
    }
    
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post-card';
        
        // إضافة صورة إذا كانت موجودة
        const imageHtml = post.image_url 
            ? `<img src="${post.image_url}" alt="${post.name}" class="post-image">`
            : `<div class="post-image no-image">لا توجد صورة</div>`;
        
        // تنسيق السعر
        const formattedPrice = new Intl.NumberFormat('ar-YE').format(post.price) + " ريال يمني";
        
        postElement.innerHTML = `
            ${imageHtml}
            <h3 class="post-title">${post.name}</h3>
            <p class="post-description">${post.description}</p>
            <div class="post-details">
                <span class="post-detail post-price"><i class="fas fa-money-bill-wave"></i> ${formattedPrice}</span>
                <span class="post-detail"><i class="fas fa-tag"></i> ${post.category}</span>
                <span class="post-detail"><i class="fas fa-map-marker-alt"></i> ${post.location}</span>
            </div>
            <div class="post-author">
                <i class="fas fa-user"></i> 
                ${post.user_id ? `تم النشر بواسطة: ${post.user_id}` : 'مستخدم غير معروف'}
            </div>
            <small>${new Date(post.created_at).toLocaleString('ar-SA')}</small>
        `;
        postsContainer.appendChild(postElement);
    });
}
