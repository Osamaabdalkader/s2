class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = '';
        this.init();
    }
    
    init() {
        window.addEventListener('hashchange', () => this.handleRouteChange());
        window.addEventListener('load', () => this.handleRouteChange());
    }
    
    addRoute(path, templateId, callback) {
        this.routes[path] = {
            templateId: templateId,
            callback: callback
        };
    }
    
    async handleRouteChange() {
        const path = window.location.hash.slice(1) || 'home';
        
        if (this.routes[path]) {
            this.currentRoute = path;
            await this.loadTemplate(this.routes[path].templateId);
            
            if (this.routes[path].callback) {
                this.routes[path].callback();
            }
        } else {
            // الصفحة غير موجودة، توجيه إلى الصفحة الرئيسية
            window.location.hash = 'home';
        }
    }
    
    async loadTemplate(templateId) {
        try {
            const response = await fetch(`pages/${templateId}.html`);
            const html = await response.text();
            
            document.getElementById('app-content').innerHTML = html;
            
            // تحميل JS الخاص بالصفحة إذا كان موجودًا
            this.loadPageScript(templateId);
        } catch (error) {
            console.error('خطأ في تحميل القالب:', error);
            document.getElementById('app-content').innerHTML = '<h2>خطأ في تحميل الصفحة</h2>';
        }
    }
    
    loadPageScript(pageName) {
        // إزالة أي scripts سابقة للصفحة
        const oldScript = document.getElementById('page-script');
        if (oldScript) {
            oldScript.remove();
        }
        
        // إنشاء script جديد للصفحة الحالية
        const script = document.createElement('script');
        script.id = 'page-script';
        script.src = `js/${pageName}.js`;
        document.body.appendChild(script);
    }
    
    navigateTo(path) {
        window.location.hash = path;
    }
}

const router = new Router();