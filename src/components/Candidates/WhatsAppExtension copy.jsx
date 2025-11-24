import React, { useContext, useEffect } from "react";
import { ThemeContext } from "./theme";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";
import { LanguageContext } from "./LanguageContext";

const ComingSoon = () => {
  const { theme } = useContext(ThemeContext);
  const { language, toggleLanguage } = useContext(LanguageContext);
  const text = {
    en: {
      title: "Coming Soon 🚀",
      message:
        "We're working hard to bring you something amazing.\nStay tuned for the big reveal!",
      button: "Switch to Arabic",
    },
    ar: {
      title: "قريبًا 🚀",
      message: "احنا بنجهزلك حاجة جامدة جدًا.\nخليك متابعنا للحدث الكبير!",
      button: "التبديل إلى الإنجليزية",
    },
  };

  useEffect(() => {
    // منع الاسكرول
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center text-center gap-4"
        style={{
          background:
            theme === "dark"
              ? "rgba(255,255,255,0.08)"
              : "rgba(255,255,255,0.6)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderRadius: "2rem",
          boxShadow:
            theme === "dark"
              ? "0 0.5rem 2rem rgba(0,0,0,0.4)"
              : "0 0.5rem 1.5rem rgba(0,0,0,0.1)",
          border:
            theme === "dark"
              ? "1px solid rgba(255,255,255,0.15)"
              : "1px solid rgba(0,0,0,0.05)",
          padding: "3rem 4rem",
          transition: "all 0.3s ease",
          maxWidth: "100%",
          maxHeight: "100%",
        }}
      >
        <motion.div
          initial={{ rotate: -10, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Clock
            size={90}
            className={theme === "dark" ? "text-blue-400" : "text-blue-600"}
          />
        </motion.div>

        <motion.h1
          className="font-bold tracking-wide"
          style={{
            fontSize: "2.8rem",
            color: theme === "dark" ? "#f1f5f9" : "#0f172a",
          }}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {text[language].title}
        </motion.h1>

        <motion.p
          className="max-w-md whitespace-pre-line"
          style={{
            fontSize: "1.15rem",
            color: theme === "dark" ? "rgba(255,255,255,0.7)" : "#334155",
            lineHeight: "1.6",
            textAlign: language === "ar" ? "right" : "left",
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {text[language].message}
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ComingSoon;
