import React, { useEffect } from "react";
import { Clock } from "lucide-react";

const WhatsAppExtension = () => {

  useEffect(() => {
    // منع الاسكرول في كل الصفحة
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div
        className="flex flex-col items-center text-center gap-4"
        style={{
          background: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(20px) saturate(180%)",
          borderRadius: "2rem",
          boxShadow: "0 0.5rem 1.5rem rgba(0,0,0,0.1)",
          border: "1px solid rgba(0,0,0,0.05)",
          padding: "3rem 4rem",
          maxWidth: "100%",
        }}
      >
        <Clock size={90} />

        <h1
          className="font-bold tracking-wide"
          style={{
            fontSize: "2.8rem",
            color: "#0f172a",
          }}
        >
          Coming Soon 
        </h1>
      </div>
    </div>
  );
};

export default WhatsAppExtension;
