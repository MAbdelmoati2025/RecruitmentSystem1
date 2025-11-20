import React, { useState } from 'react';
import { Send, Phone, MessageSquare, Play, Download, CheckCircle, AlertCircle, Zap, Terminal, Copy, Code } from 'lucide-react';

function WhatsAppSeleniumRunner() {
  const [phoneNumbers, setPhoneNumbers] = useState('');
  const [message, setMessage] = useState('');
  const [logs, setLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  // تنظيف الأرقام
  const parsePhoneNumbers = (text) => {
    const numbers = text
      .split(/[\s,،\n]+/)
      .map(num => num.trim().replace(/\D/g, ''))
      .filter(num => num.length >= 10);
    return numbers;
  };

  // إضافة لوج
  const addLog = (msg, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString('ar-EG');
    setLogs(prev => [...prev, { msg, type, timestamp }]);
  };

  // توليد كود Python المحسّن
  const generatePythonCode = () => {
    const numbers = parsePhoneNumbers(phoneNumbers);
    if (numbers.length === 0 || !message.trim()) return '';

    const formattedNumbers = numbers.map(num => 
      num.startsWith('20') ? '+' + num : '+20' + num
    );

    return `"""
WhatsApp Selenium Sender - Auto Generated 🔥
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
import time
import os

# الأرقام
numbers = ${JSON.stringify(formattedNumbers, null, 2)}

# الرسالة
message = """${message}"""

print("🔥 Selenium Mode - بدء الإرسال!")
print(f"📤 عدد الرسائل: {len(numbers)}\\n")

# إعدادات Chrome
options = webdriver.ChromeOptions()
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.add_argument("--disable-gpu")
options.add_argument("--start-maximized")

profile_path = os.path.join(os.getcwd(), "whatsapp_profile")
options.add_argument(f"--user-data-dir={profile_path}")

try:
    print("⏳ تشغيل Chrome...")
    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()),
        options=options
    )
    print("✅ Chrome جاهز!\\n")
except Exception as e:
    print(f"❌ خطأ: {e}")
    exit()

driver.get("https://web.whatsapp.com")
print("📱 امسح QR Code إذا لم تكن مسجلاً...")
input("\\n✅ اضغط Enter بعد تسجيل الدخول...\\n")

wait = WebDriverWait(driver, 30)
success_count = 0
failed_count = 0

for i, number in enumerate(numbers, 1):
    try:
        print(f"⚡ [{i}/{len(numbers)}] جاري الإرسال إلى: {number}")
        
        driver.get(f"https://web.whatsapp.com/send?phone={number}")
        time.sleep(3)
        
        # البحث عن صندوق الرسالة
        try:
            msg_box = wait.until(EC.presence_of_element_located(
                (By.XPATH, '//div[@contenteditable="true"][@data-tab="10"]')
            ))
        except:
            try:
                msg_box = wait.until(EC.presence_of_element_located(
                    (By.XPATH, '//footer//div[@contenteditable="true"]')
                ))
            except:
                msg_box = driver.find_element(
                    By.XPATH, 
                    '//div[@role="textbox" and @contenteditable="true"]'
                )
        
        msg_box.click()
        time.sleep(0.5)
        
        # كتابة الرسالة حرف حرف
        for char in message:
            msg_box.send_keys(char)
            time.sleep(0.02)
        
        time.sleep(0.5)
        msg_box.send_keys(Keys.ENTER)
        
        print(f"✅ تم الإرسال بنجاح!")
        success_count += 1
        time.sleep(2)
        
    except Exception as e:
        print(f"❌ فشل: {str(e)}")
        failed_count += 1
        time.sleep(2)
        continue

print(f"\\n{'='*50}")
print(f"🎉 انتهى الإرسال!")
print(f"✅ نجح: {success_count}")
print(f"❌ فشل: {failed_count}")
print(f"📊 الإجمالي: {len(numbers)}")
print(f"{'='*50}\\n")

input("اضغط Enter للخروج...")
driver.quit()
`;
  };

  // محاكاة تشغيل Python
  const simulateRun = async () => {
    const numbers = parsePhoneNumbers(phoneNumbers);
    
    if (numbers.length === 0) {
      addLog('❌ لا توجد أرقام صحيحة!', 'error');
      return;
    }
    
    if (!message.trim()) {
      addLog('❌ الرجاء كتابة رسالة!', 'error');
      return;
    }

    setIsRunning(true);
    setLogs([]);

    addLog('🔥 بدء عملية الإرسال...', 'success');
    addLog(`📊 عدد الأرقام: ${numbers.length}`, 'info');
    addLog('⏳ تشغيل Selenium...', 'info');
    
    await sleep(2000);
    addLog('✅ Chrome مفتوح بنجاح!', 'success');
    addLog('📱 جاري فتح WhatsApp Web...', 'info');
    
    await sleep(2000);
    addLog('⚠️ تنبيه: تأكد من مسح QR Code إذا لزم الأمر', 'warning');
    addLog('🚀 بدء الإرسال للأرقام...', 'info');

    let success = 0;
    let failed = 0;

    for (let i = 0; i < numbers.length; i++) {
      await sleep(1500);
      const num = numbers[i];
      addLog(`⚡ [${i + 1}/${numbers.length}] إرسال إلى: ${num}`, 'info');
      
      await sleep(1000);
      
      // محاكاة نجاح/فشل عشوائي
      const isSuccess = Math.random() > 0.1; // 90% نجاح
      
      if (isSuccess) {
        addLog(`✅ تم الإرسال بنجاح إلى ${num}`, 'success');
        success++;
      } else {
        addLog(`❌ فشل الإرسال إلى ${num}`, 'error');
        failed++;
      }
    }

    await sleep(1000);
    addLog('━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
    addLog('🎉 انتهى الإرسال!', 'success');
    addLog(`✅ نجح: ${success} | ❌ فشل: ${failed} | 📊 الإجمالي: ${numbers.length}`, 'info');
    addLog('━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');

    setIsRunning(false);
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // تنزيل السكريبت
  const downloadScript = () => {
    const code = generatePythonCode();
    if (!code) {
      alert('⚠️ اكتب الأرقام والرسالة أولاً!');
      return;
    }

    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'whatsapp_sender.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('✅ تم التنزيل!\n\nللتشغيل:\n1. pip install selenium webdriver-manager\n2. python whatsapp_sender.py');
  };

  // نسخ الكود
  const copyCode = () => {
    const code = generatePythonCode();
    if (!code) {
      alert('⚠️ اكتب الأرقام والرسالة أولاً!');
      return;
    }

    navigator.clipboard.writeText(code).then(() => {
      alert('✅ تم النسخ!');
    });
  };

  const getLogIcon = (type) => {
    switch(type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return '📋';
    }
  };

  const getLogColor = (type) => {
    switch(type) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/30 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-pulse">
              <Zap className="text-white" size={40} />
            </div>
          </div>
          <h1 className="text-5xl font-black text-white mb-2">WhatsApp Selenium Sender</h1>
          <p className="text-purple-200/80 text-xl">إرسال سريع وذكي باستخدام Selenium 🔥</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Panel - Input */}
          <div className="space-y-6">
            {/* Phone Numbers */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Phone className="text-blue-400" size={24} />
                <h2 className="text-xl font-bold text-white">أرقام الهواتف</h2>
              </div>
              <textarea
                value={phoneNumbers}
                onChange={(e) => setPhoneNumbers(e.target.value)}
                placeholder="01014884327&#10;01091071159&#10;01234567890"
                className="w-full h-48 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-500 resize-none font-mono text-lg"
                disabled={isRunning}
              />
              {phoneNumbers && (
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-white/60 text-sm">عدد الأرقام:</span>
                  <span className="text-green-400 font-bold text-lg">
                    {parsePhoneNumbers(phoneNumbers).length} رقم
                  </span>
                </div>
              )}
            </div>

            {/* Message */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="text-purple-400" size={24} />
                <h2 className="text-xl font-bold text-white">الرسالة</h2>
              </div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="مرحباً! كيف الحال؟ 👋"
                className="w-full h-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 resize-none text-lg"
                disabled={isRunning}
              />
              {message && (
                <div className="mt-3 text-white/60 text-sm">
                  عدد الأحرف: {message.length}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={simulateRun}
                disabled={isRunning || !phoneNumbers || !message}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isRunning ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <Play size={20} />
                    بدء الإرسال
                  </>
                )}
              </button>

              <button
                onClick={downloadScript}
                disabled={!phoneNumbers || !message}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg"
              >
                <Download size={20} />
                تنزيل Python
              </button>
            </div>

            {/* Instructions */}
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-xl rounded-xl p-6 border border-yellow-500/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-yellow-400 flex-shrink-0 mt-1" size={20} />
                <div className="space-y-2">
                  <h3 className="text-white font-bold">📋 تعليمات مهمة:</h3>
                  <ul className="text-white/70 text-sm space-y-1">
                    <li>• اكتب الأرقام (كل رقم في سطر)</li>
                    <li>• اكتب الرسالة</li>
                    <li>• اضغط "بدء الإرسال" للمحاكاة</li>
                    <li>• أو "تنزيل Python" للتشغيل الحقيقي</li>
                  </ul>
                  
                  <div className="mt-4 bg-green-500/20 rounded-lg p-3 border border-green-500/30">
                    <p className="text-green-300 text-xs font-bold mb-1">🐍 للتشغيل الفعلي:</p>
                    <code className="text-white/80 text-xs block">
                      pip install selenium webdriver-manager<br/>
                      python whatsapp_sender.py
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Console Output */}
          <div className="space-y-6">
            {/* Live Console */}
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-green-500/30 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 px-6 py-4 border-b border-green-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Terminal className="text-green-400" size={20} />
                    <h3 className="text-white font-bold">Console Output</h3>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                </div>
              </div>

              <div className="h-[600px] overflow-y-auto p-4 font-mono text-sm scrollbar-thin scrollbar-thumb-green-500/50 scrollbar-track-transparent">
                {logs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-white/30">
                    <Terminal size={48} className="mb-4" />
                    <p>في انتظار بدء العملية...</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {logs.map((log, index) => (
                      <div 
                        key={index}
                        className={`flex items-start gap-3 ${getLogColor(log.type)} animate-fadeIn`}
                      >
                        <span className="text-white/40 text-xs min-w-[70px]">
                          {log.timestamp}
                        </span>
                        <span>{getLogIcon(log.type)}</span>
                        <span className="flex-1">{log.msg}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={copyCode}
                disabled={!phoneNumbers || !message}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all disabled:opacity-50"
              >
                <Copy size={18} />
                نسخ الكود
              </button>
              
              <button
                onClick={() => setLogs([])}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all"
              >
                <Code size={18} />
                مسح السجل
              </button>
            </div>

            {/* Stats */}
            {logs.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-500/20 backdrop-blur-xl rounded-xl p-4 border border-green-500/30">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-green-400" size={20} />
                    <div>
                      <p className="text-white/60 text-xs">نجح</p>
                      <p className="text-white font-bold text-xl">
                        {logs.filter(l => l.type === 'success' && l.msg.includes('تم الإرسال بنجاح')).length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-500/20 backdrop-blur-xl rounded-xl p-4 border border-red-500/30">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="text-red-400" size={20} />
                    <div>
                      <p className="text-white/60 text-xs">فشل</p>
                      <p className="text-white font-bold text-xl">
                        {logs.filter(l => l.type === 'error' && l.msg.includes('فشل الإرسال')).length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-500/20 backdrop-blur-xl rounded-xl p-4 border border-blue-500/30">
                  <div className="flex items-center gap-2">
                    <Terminal className="text-blue-400" size={20} />
                    <div>
                      <p className="text-white/60 text-xs">الإجمالي</p>
                      <p className="text-white font-bold text-xl">
                        {parsePhoneNumbers(phoneNumbers).length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default WhatsAppSeleniumRunner;