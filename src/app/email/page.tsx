'use client';

import { motion } from "framer-motion";
import { Send, Mail, ArrowLeft, CheckCircle, Instagram } from "lucide-react"; 
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function EmailPage() {
  // Your Formspree ID
  const FORMSPREE_ID = "mykzlzpd"; 

  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setStatus("success");
        toast.success("Message sent successfully!");
      } else {
        setStatus("idle");
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Network Error:", error);
      setStatus("idle");
      toast.error("Error sending message.");
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-surface border border-white/10 p-10 rounded-2xl max-w-md w-full flex flex-col items-center"
        >
          <div className="w-16 h-16 bg-neon/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 text-neon" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Message Sent!</h2>
          <p className="text-muted mb-8">
            Thanks for reaching out. I'll get back to <br />
            <span className="text-white font-mono">franknathan12@gmail.com</span> shortly.
          </p>
          <Link href="/" onClick={() => setStatus("idle")} className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-neon transition-colors w-full">
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-neon/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-muted hover:text-white mb-8 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to Store
        </Link>

        {/* The Glass Form Card */}
        <div className="bg-surface border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          
          {/* Header */}
          <div className="mb-6">
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 mb-4">
              <Mail className="w-6 h-6 text-neon" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Get in touch.</h1>
            <p className="text-muted mt-2">
              Business inquiries, brand deals, or just say hi.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1">
              <label className="text-xs font-mono text-muted uppercase">Name</label>
              <input 
                type="text" 
                name="name" 
                required
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neon focus:ring-1 focus:ring-neon outline-none transition-all placeholder:text-neutral-700"
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-muted uppercase">Email</label>
              <input 
                type="email" 
                name="email" 
                required
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neon focus:ring-1 focus:ring-neon outline-none transition-all placeholder:text-neutral-700"
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-muted uppercase">Message</label>
              <textarea 
                name="message"
                rows={4}
                required
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neon focus:ring-1 focus:ring-neon outline-none transition-all placeholder:text-neutral-700 resize-none"
                placeholder="What's on your mind?"
              />
            </div>

            <button 
              disabled={status === "submitting"}
              type="submit" 
              className="w-full bg-white text-black font-bold py-4 rounded-lg hover:bg-neon transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              {status === "submitting" ? (
                "Sending..."
              ) : (
                <>
                  Send Message <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* --- NEW INSTAGRAM OPTION --- */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-muted mb-4">Prefer a quicker chat?</p>
            <a 
              href="https://www.instagram.com/frnk_nthn/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-black/40 border border-white/10 text-white font-medium py-3 rounded-lg hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-orange-500/20 hover:border-white/20 transition-all group"
            >
              <Instagram className="w-5 h-5 text-neon group-hover:text-white transition-colors" />
              <span>DM me on Instagram</span>
            </a>
          </div>

        </div>
      </motion.div>
    </div>
  );
}