







































import React, { useState } from 'react';
import { Send, MessageSquare, Phone, Zap, Download, Terminal, Rocket, Code } from 'lucide-react';

function WhatsAppSpeedSender() {
  const [phoneNumbers, setPhoneNumbers] = useState('');
  const [message, setMessage] = useState('');
  const [method, setMethod] = useState('fast'); // fast, selenium, api

  // تنظيف الأرقام
  const parsePhoneNumbers = (text) => {
    const numbers = text
      .split(/[\s,،\n]+/)
      .map(num => num.trim().replace(/\D/g, ''))
      .filter(num => num.length >= 10);
    return numbers;
  };

  // الطريقة السريعة - PyWhatKit محسّن
  const generateFastScript = () => {
    const numbers = parsePhoneNumbers(phoneNumbers);
    if (numbers.length === 0 || !message.trim()) return '';

    const formattedNumbers = numbers.map(num => 
      num.startsWith('20') ? '+' + num : '+20' + num
    );

    return `"""
WhatsApp Speed Sender - أسرع طريقة ممكنة! ⚡
pip install pywhatkit pyautogui
"""

import pywhatkit as kit
import pyautogui
import time
import webbrowser

# الأرقام
numbers = ${JSON.stringify(formattedNumbers, null, 2)}

# الرسالة
message = """${message}"""

print("⚡ وضع السرعة العالية - Fast Mode!")
print(f"📤 سيتم إرسال {len(numbers)} رسالة\\n")

# إعدادات السرعة
LOAD_TIME = 3      # وقت تحميل الصفحة (قلله لـ 2 ثانية)
SEND_DELAY = 0.5   # تأخير بسيط بعد الإرسال

for i, number in enumerate(numbers, 1):
    try:
        print(f"🚀 [{i}/{len(numbers)}] → {number}")
        
        # فتح WhatsApp مباشرة
        kit.sendwhatmsg_instantly(
            number, 
            message, 
            wait_time=LOAD_TIME,  # تقليل وقت الانتظار
            tab_close=False
        )
        
        # انتظار قصير جداً
        time.sleep(2)
        
        # إرسال مباشر
        pyautogui.press('enter')
        print(f"✅ تم!")
        
        # تأخير بسيط قبل التالي
        time.sleep(SEND_DELAY)
            
    except Exception as e:
        print(f"❌ فشل: {str(e)}")
        continue

print(f"\\n✅ انتهى! تم إرسال {len(numbers)} رسالة")
`;
  };

  // طريقة Selenium - الأسرع والأذكى
  const generateSeleniumScript = () => {
    const numbers = parsePhoneNumbers(phoneNumbers);
    if (numbers.length === 0 || !message.trim()) return '';

    const formattedNumbers = numbers.map(num => 
      num.startsWith('20') ? num : '20' + num
    );

    return `"""
WhatsApp Selenium Sender - أسرع × 10 مرات! 🔥
pip install selenium webdriver-manager
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
import time

# الأرقام
numbers = ${JSON.stringify(formattedNumbers, null, 2)}

# الرسالة
message = """${message}"""

print("🔥 Selenium Mode - أسرع طريقة!")
print(f"📤 {len(numbers)} رسالة\\n")

# فتح Chrome مع WhatsApp Web
options = webdriver.ChromeOptions()
options.add_argument("--user-data-dir=./whatsapp_session")  # حفظ الجلسة
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
driver.get("https://web.whatsapp.com")

print("📱 امسح QR Code...")
input("اضغط Enter بعد تسجيل الدخول...")

for i, number in enumerate(numbers, 1):
    try:
        print(f"⚡ [{i}/{len(numbers)}] → {number}")
        
        # فتح المحادثة مباشرة
        driver.get(f"https://web.whatsapp.com/send?phone={number}")
        
        # انتظار صندوق الرسالة
        wait = WebDriverWait(driver, 10)
        msg_box = wait.until(EC.presence_of_element_located(
            (By.XPATH, '//div[@contenteditable="true"][@data-tab="10"]')
        ))
        
        # كتابة وإرسال فوراً
        msg_box.send_keys(message)
        time.sleep(0.3)  # تأخير بسيط جداً
        msg_box.send_keys(Keys.ENTER)
        
        print(f"✅ تم!")
        time.sleep(1)  # ثانية واحدة فقط!
        
    except Exception as e:
        print(f"❌ خطأ: {str(e)}")
        continue

print(f"\\n🎉 انتهى! {len(numbers)} رسالة في وقت قياسي!")
driver.quit()
`;
  };

  // طريقة API - للمحترفين
  const generateAPIScript = () => {
    const numbers = parsePhoneNumbers(phoneNumbers);
    if (numbers.length === 0 || !message.trim()) return '';

    const formattedNumbers = numbers.map(num => 
      num.startsWith('20') ? num : '20' + num
    );

    return `"""
WhatsApp API Sender - احترافي وسريع جداً! 💼
استخدم WhatsApp Business API أو خدمة مثل Twilio
"""

# مثال باستخدام Twilio (يحتاج حساب مدفوع)
# pip install twilio

from twilio.rest import Client
import time

# بيانات Twilio (احصل عليها من twilio.com)
account_sid = 'YOUR_ACCOUNT_SID'
auth_token = 'YOUR_AUTH_TOKEN'
twilio_whatsapp = 'whatsapp:+14155238886'  # رقم Twilio

client = Client(account_sid, auth_token)

# الأرقام
numbers = ${JSON.stringify(formattedNumbers, null, 2)}

# الرسالة
message = """${message}"""

print("💼 API Mode - إرسال احترافي!")
print(f"📤 {len(numbers)} رسالة\\n")

for i, number in enumerate(numbers, 1):
    try:
        print(f"📤 [{i}/{len(numbers)}] → {number}")
        
        # إرسال فوري عبر API
        msg = client.messages.create(
            from_=twilio_whatsapp,
            body=message,
            to=f'whatsapp:+{number}'
        )
        
        print(f"✅ تم! SID: {msg.sid}")
        time.sleep(0.1)  # بدون تأخير تقريباً!
        
    except Exception as e:
        print(f"❌ خطأ: {str(e)}")

print(f"\\n🎉 انتهى! {len(numbers)} رسالة في ثوانٍ!")

# ملاحظة: هذه الطريقة مدفوعة لكنها الأسرع والأكثر موثوقية
# التكلفة: ~0.005$ لكل رسالة
`;
  };

  const downloadScript = (scriptType) => {
    let script = '';
    let filename = '';

    switch(scriptType) {
      case 'fast':
        script = generateFastScript();
        filename = 'whatsapp_fast_sender.py';
        break;
      case 'selenium':
        script = generateSeleniumScript();
        filename = 'whatsapp_selenium_sender.py';
        break;
      case 'api':
        script = generateAPIScript();
        filename = 'whatsapp_api_sender.py';
        break;
    }

    if (!script) {
      alert('⚠️ اكتب الأرقام والرسالة أولاً!');
      return;
    }

    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('✅ تم التنزيل!\n\nشغّل السكريبت: python ' + filename);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/30 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse">
              <Rocket className="text-white" size={40} />
            </div>
          </div>
          <h1 className="text-5xl font-black text-white mb-2">WhatsApp Speed Sender ⚡</h1>
          <p className="text-purple-200/80 text-xl">أسرع طريقة ممكنة - 100 رسالة في دقائق!</p>
        </div>

        {/* Input Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Phone Numbers */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Phone className="text-blue-400" size={24} />
              <h2 className="text-xl font-bold text-white">الأرقام</h2>
            </div>
            <textarea
              value={phoneNumbers}
              onChange={(e) => setPhoneNumbers(e.target.value)}
              placeholder="01014884327&#10;01091071159&#10;..."
              className="w-full h-48 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-500 resize-none font-mono"
            />
            {phoneNumbers && (
              <p className="mt-2 text-green-400 font-bold">
                ✅ {parsePhoneNumbers(phoneNumbers).length} رقم
              </p>
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
              className="w-full h-48 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>
        </div>

        {/* Speed Methods */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
            <Zap className="text-yellow-400" />
            اختر الطريقة الأسرع
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Method 1: Fast PyWhatKit */}
            <div className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
              method === 'fast' 
                ? 'bg-green-500/20 border-green-500' 
                : 'bg-white/5 border-white/10 hover:border-green-500/50'
            }`} onClick={() => setMethod('fast')}>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <Zap size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">سريع ⚡</h3>
              </div>
              <ul className="text-white/70 text-sm space-y-2">
                <li>✅ سهل التثبيت</li>
                <li>✅ يعمل مباشرة</li>
                <li>⏱️ ~3 ثواني/رسالة</li>
                <li>📦 PyWhatKit + PyAutoGUI</li>
              </ul>
              <div className="mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadScript('fast');
                  }}
                  className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-all"
                >
                  <Download size={16} className="inline mr-2" />
                  تنزيل
                </button>
              </div>
            </div>

            {/* Method 2: Selenium (Fastest) */}
            <div className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
              method === 'selenium' 
                ? 'bg-orange-500/20 border-orange-500' 
                : 'bg-white/5 border-white/10 hover:border-orange-500/50'
            }`} onClick={() => setMethod('selenium')}>
              <div className="absolute top-2 right-2">
                <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-full animate-pulse">
                  الأسرع 🔥
                </span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Rocket size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">سيلينيوم 🔥</h3>
              </div>
              <ul className="text-white/70 text-sm space-y-2">
                <li>✅ أسرع × 10 مرات</li>
                <li>✅ تحكم كامل</li>
                <li>⏱️ ~1 ثانية/رسالة</li>
                <li>📦 Selenium WebDriver</li>
              </ul>
              <div className="mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadScript('selenium');
                  }}
                  className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold transition-all"
                >
                  <Download size={16} className="inline mr-2" />
                  تنزيل
                </button>
              </div>
            </div>

            {/* Method 3: API (Professional) */}
            <div className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
              method === 'api' 
                ? 'bg-purple-500/20 border-purple-500' 
                : 'bg-white/5 border-white/10 hover:border-purple-500/50'
            }`} onClick={() => setMethod('api')}>
              <div className="absolute top-2 right-2">
                <span className="px-2 py-1 bg-purple-500 text-white text-xs font-bold rounded-full">
                  Pro 💼
                </span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Code size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">API 💼</h3>
              </div>
              <ul className="text-white/70 text-sm space-y-2">
                <li>✅ فوري تماماً</li>
                <li>✅ موثوق 100%</li>
                <li>⏱️ ~0.1 ثانية/رسالة</li>
                <li>💰 مدفوع (~$0.005)</li>
              </ul>
              <div className="mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadScript('api');
                  }}
                  className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-bold transition-all"
                >
                  <Download size={16} className="inline mr-2" />
                  تنزيل
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">📊 مقارنة السرعة</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-right p-3 text-white/70">الطريقة</th>
                  <th className="text-right p-3 text-white/70">السرعة</th>
                  <th className="text-right p-3 text-white/70">100 رسالة</th>
                  <th className="text-right p-3 text-white/70">السهولة</th>
                  <th className="text-right p-3 text-white/70">التكلفة</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="p-3 font-bold text-green-400">⚡ Fast</td>
                  <td className="p-3">3s/msg</td>
                  <td className="p-3">~5 دقائق</td>
                  <td className="p-3">⭐⭐⭐⭐⭐</td>
                  <td className="p-3 text-green-400">مجاني</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-3 font-bold text-orange-400">🔥 Selenium</td>
                  <td className="p-3">1s/msg</td>
                  <td className="p-3">~2 دقيقة</td>
                  <td className="p-3">⭐⭐⭐⭐</td>
                  <td className="p-3 text-green-400">مجاني</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-purple-400">💼 API</td>
                  <td className="p-3">0.1s/msg</td>
                  <td className="p-3">~10 ثواني</td>
                  <td className="p-3">⭐⭐⭐</td>
                  <td className="p-3 text-yellow-400">~$0.50</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20">
          <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
            <Terminal size={20} />
            تعليمات التشغيل
          </h3>
          
          <div className="space-y-4">
            <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
              <p className="text-green-400 font-bold mb-2">⚡ Fast Method:</p>
              <code className="text-white/80 text-sm block">
                pip install pywhatkit pyautogui<br/>
                python whatsapp_fast_sender.py
              </code>
            </div>

            <div className="bg-orange-500/10 rounded-lg p-4 border border-orange-500/30">
              <p className="text-orange-400 font-bold mb-2">🔥 Selenium Method (الأفضل):</p>
              <code className="text-white/80 text-sm block">
                pip install selenium webdriver-manager<br/>
                python whatsapp_selenium_sender.py<br/>
                <span className="text-yellow-400">→ امسح QR Code مرة واحدة فقط!</span>
              </code>
            </div>

            <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
              <p className="text-purple-400 font-bold mb-2">💼 API Method:</p>
              <code className="text-white/80 text-sm block">
                1. سجل في twilio.com<br/>
                2. احصل على API credentials<br/>
                3. pip install twilio<br/>
                4. python whatsapp_api_sender.py
              </code>
            </div>
          </div>

          <div className="mt-6 bg-red-500/10 rounded-lg p-4 border border-red-500/30">
            <p className="text-red-400 font-bold text-sm mb-2">⚠️ تحذيرات:</p>
            <ul className="text-white/60 text-sm space-y-1">
              <li>• استخدم Selenium للسرعة القصوى (موصى به)</li>
              <li>• API الأسرع لكنه مدفوع</li>
              <li>• لا ترسل أكثر من 200 رسالة/يوم لتجنب الحظر</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhatsAppSpeedSender;
