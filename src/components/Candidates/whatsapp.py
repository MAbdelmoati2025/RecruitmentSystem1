# """
# WhatsApp Auto Enter - Script لدوس Enter تلقائياً
# يشتغل مع موقع WhatsApp Extension
# """

# import pyautogui
# import time
# import keyboard
# from colorama import Fore, Style, init

# # تفعيل الألوان
# init(autoreset=True)

# print(f"""
# {Fore.GREEN}═══════════════════════════════════════════════════════
#     🤖 WhatsApp Auto Enter Bot
# ═══════════════════════════════════════════════════════{Style.RESET_ALL}
# """)

# print(f"{Fore.YELLOW}📋 التعليمات:{Style.RESET_ALL}")
# print("1. افتح موقع WhatsApp Extension في المتصفح")
# print("2. ارفع ملف Excel واكتب الرسالة")
# print("3. اضغط 'Start Sending' في الموقع")
# print("4. ارجع للسكريبت واضغط ENTER للبدء")
# print("5. لإيقاف السكريبت: اضغط ESC")
# print(f"\n{Fore.RED}⚠️  مهم: خلي نافذة WhatsApp Web مفتوحة ومرئية!{Style.RESET_ALL}\n")

# input(f"{Fore.CYAN}▶ اضغط ENTER للبدء...{Style.RESET_ALL}")

# # الإعدادات
# DELAY_BETWEEN_MESSAGES = 1
#   # ثواني بين كل رسالة
# SAFETY_DELAY = 0.1
#  # تأخير الأمان قبل الدوس
# MAX_MESSAGES = 1000  # أقصى عدد رسائل (للأمان)




# print(f"\n{Fore.GREEN}✅ السكريبت يشتغل الآن...{Style.RESET_ALL}")
# print(f"{Fore.YELLOW}⏱️  التأخير بين الرسائل: {DELAY_BETWEEN_MESSAGES} ثانية{Style.RESET_ALL}")
# print(f"{Fore.RED}🛑 للإيقاف: اضغط ESC{Style.RESET_ALL}\n")

# message_count = 0
# stop_script = False

# def on_esc():
#     """وظيفة لإيقاف السكريبت عند الضغط على ESC"""
#     global stop_script
#     stop_script = True
#     print(f"\n{Fore.RED}🛑 تم إيقاف السكريبت!{Style.RESET_ALL}")

# # تسجيل مفتاح ESC للإيقاف
# keyboard.on_press_key("esc", lambda _: on_esc())

# try:
#     while not stop_script and message_count < MAX_MESSAGES:
#         message_count += 1
        
#         # انتظار تحميل الصفحة
#         print(f"{Fore.CYAN}[{message_count}] ⏳ انتظار {SAFETY_DELAY} ثانية...{Style.RESET_ALL}", end="")
#         time.sleep(SAFETY_DELAY)
#         print(f" {Fore.GREEN}✓{Style.RESET_ALL}")
        
#         # دوس Enter
#         print(f"{Fore.YELLOW}[{message_count}] 📤 دوس Enter...{Style.RESET_ALL}", end="")
#         pyautogui.press('enter')
#         print(f" {Fore.GREEN}✓ تم الإرسال!{Style.RESET_ALL}")
        
#         # انتظار قبل الرسالة التالية
#         print(f"{Fore.MAGENTA}[{message_count}] 💤 انتظار {DELAY_BETWEEN_MESSAGES} ثانية للرسالة التالية...{Style.RESET_ALL}")
        
#         for i in range(DELAY_BETWEEN_MESSAGES):
#             if stop_script:
#                 break
#             print(f"  {Fore.CYAN}⏱️  {DELAY_BETWEEN_MESSAGES - i} ثانية متبقية...{Style.RESET_ALL}", end="\r")
#             time.sleep(1)
        
#         print()  # سطر جديد
        
# except KeyboardInterrupt:
#     print(f"\n{Fore.RED}⚠️  تم إيقاف السكريبت بواسطة المستخدم{Style.RESET_ALL}")

# finally:
#     print(f"\n{Fore.GREEN}═══════════════════════════════════════════════════════")
#     print(f"    📊 تقرير الإرسال")
#     print(f"═══════════════════════════════════════════════════════{Style.RESET_ALL}")
#     print(f"{Fore.CYAN}✉️  عدد الرسائل المرسلة: {message_count}{Style.RESET_ALL}")
#     print(f"{Fore.YELLOW}⏱️  الوقت المستغرق: {(message_count * DELAY_BETWEEN_MESSAGES) / 60:.1f} دقيقة{Style.RESET_ALL}")
#     print(f"\n{Fore.GREEN}✅ شكراً لاستخدام WhatsApp Auto Enter!{Style.RESET_ALL}\n")

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import pandas as pd
import time

EXCEL_FILE = 'contacts.xlsx'
MESSAGE_TEMPLATE = "Hello {name}, this is a test message!"
DELAY_BETWEEN_MESSAGES = 2  # ثواني

# قراءة ملف الاكسل
df = pd.read_excel(EXCEL_FILE)
contacts = []
for _, row in df.iterrows():
    if pd.notna(row['Phone']):
        contacts.append({
            'name': row.get('Name', 'Unknown'),
            'phone': str(row['Phone']).replace('+', '').replace(' ', '')
        })

# تشغيل المتصفح
options = webdriver.ChromeOptions()
options.add_argument(r"user-data-dir=C:\ChromeProfile")
driver = webdriver.Chrome(options=options)
driver.get("https://web.whatsapp.com/")
input("📌 بعد ما تعمل login في WhatsApp Web اضغط Enter هنا...")

# إرسال الرسائل
for index, contact in enumerate(contacts, start=1):
    try:
        phone = contact['phone']
        name = contact['name']
        message = MESSAGE_TEMPLATE.format(name=name)
        url = f"https://wa.me/{phone}?text={message}"
        driver.get(url)

        # انتظار زر الإرسال
        send_button = WebDriverWait(driver, 15).until(
            EC.element_to_be_clickable((By.XPATH, '//span[@data-icon="send"]'))
        )
        send_button.click()
        print(f"[{index}/{len(contacts)}] ✅ تم الإرسال إلى: {name} ({phone})")

        time.sleep(DELAY_BETWEEN_MESSAGES)
    except Exception as e:
        print(f"[{index}/{len(contacts)}] ❌ فشل الإرسال إلى: {name} ({phone}) - {e}")

print("🎉 تم الانتهاء من إرسال كل الرسائل!")
driver.quit()
