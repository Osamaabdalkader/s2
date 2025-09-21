// تهيئة Supabase
const SUPABASE_URL = 'https://rrjocpzsyxefcsztazkd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyam9jcHpzeXhlZmNzenRhemtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyOTEzMTgsImV4cCI6MjA3Mzg2NzMxOH0.TvUthkBc_lnDdGlHJdEFUPo4Dl2n2oHyokXZE8_wodw';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
let debugMode = false;
let currentUser = null;

// اختبار اتصال Supabase
async function testConnection() {
    const connectionStatus = document.getElementById('connection-status');
    try {
        const { data, error } = await supabase.from('marketing').select('count');
        
        if (error) {
            console.error('اتصال Supabase فشل:', error);
            connectionStatus.textContent = `خطأ في الاتصال: ${error.message}`;
            connectionStatus.className = 'connection-status connection-error';
            
            if (debugMode) {
                const debugEl = document.getElementById('debug-info');
                debugEl.innerHTML += `<p>خطأ الاتصال: ${error.message}</p>`;
            }
        } else {
            console.log('اتصال Supabase ناجح');
            connectionStatus.textContent = 'الاتصال مع قاعدة البيانات ناجح';
            connectionStatus.className = 'connection-status connection-success';
            
            // إخفاء رسالة النجاح بعد 3 ثوان
            setTimeout(() => {
                connectionStatus.style.display = 'none';
            }, 3000);
        }
    } catch (error) {
        console.error('خطأ في اختبار الاتصال:', error);
        connectionStatus.textContent = `خطأ في الاتصال: ${error.message}`;
        connectionStatus.className = 'connection-status connection-error';
    }
}