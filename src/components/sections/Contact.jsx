import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { useAppContext } from "../../context/AppContext";

export default function Contact() {
  const { t, theme } = useAppContext();
  const form = useRef();
  const [status, setStatus] = useState("");

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus("sending");

    emailjs
      .sendForm(
        import.meta.env.VITE_SERVICE_ID,
        import.meta.env.VITE_TEMPLATE_ID,
        form.current,
        import.meta.env.VITE_PUBLIC_KEY,
      )
      .then(() => {
        setStatus("success");
        e.target.reset();
        setTimeout(() => setStatus(""), 3000);
      })
      .catch(() => {
        setStatus("error");
        setTimeout(() => setStatus(""), 3000);
      });
  };

  return (
    <section id="contact" className="py-32 px-6 bg-black/40 backdrop-blur-3xl">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-6xl md:text-8xl font-black mb-6 text-white tracking-tighter">
            Let's Dive{" "}
            <span style={{ color: theme.accent }} className="text-shadow-glow">
              In
            </span>
          </h2>

          <p
            className="text-xl font-medium"
            style={{ color: "rgba(219,234,254,0.40)" }}
          >
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-16">
          <div className="space-y-12">
            <div>
              <h4
                className="font-mono text-xs uppercase tracking-widest mb-4 font-black"
                style={{ color: theme.accent }}
              >
                Message me
              </h4>

              <a
                href="mailto:hal.chung.chingyan.2025@gmail.com"
                className="text-xl font-bold transition-colors break-words"
                style={{ color: "#ffffff" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = theme.accentSoft;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#ffffff";
                }}
              >
                hal.chung.chingyan.2025@gmail.com
              </a>
            </div>

            <div>
              <h4
                className="font-mono text-xs uppercase tracking-widest mb-4 font-black"
                style={{ color: theme.accent }}
              >
                Social
              </h4>

              <div className="flex flex-col gap-3">
                <a
                  href="https://github.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-lg font-semibold transition-colors"
                  style={{ color: "#ffffff" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = theme.accentSoft;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#ffffff";
                  }}
                >
                  GitHub
                </a>

                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-lg font-semibold transition-colors"
                  style={{ color: "#ffffff" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = theme.accentSoft;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#ffffff";
                  }}
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <form
              ref={form}
              onSubmit={sendEmail}
              className="rounded-[2rem] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-8 md:p-10 shadow-2xl space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  required
                  name="user_name"
                  type="text"
                  placeholder={t.contact.name}
                  className="w-full bg-white/5 border-b p-4 focus:outline-none text-white text-lg transition-colors placeholder:text-white/20"
                  style={{ borderColor: `${theme.accent}44` }}
                />

                <input
                  required
                  name="user_email"
                  type="email"
                  placeholder={t.contact.email}
                  className="w-full bg-white/5 border-b p-4 focus:outline-none text-white text-lg transition-colors placeholder:text-white/20"
                  style={{ borderColor: `${theme.accent}44` }}
                />
              </div>

              <textarea
                required
                name="message"
                rows="4"
                placeholder="Briefly describe your idea."
                className="w-full bg-white/5 border-b p-4 focus:outline-none text-white text-lg transition-colors placeholder:text-white/20"
                style={{ borderColor: `${theme.accent}44` }}
              />

              <button
                type="submit"
                className="w-full text-white font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-widest"
                style={{
                  backgroundColor: theme.buttonBg,
                  boxShadow: `0 10px 30px ${theme.buttonBg}33`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#ffffff";
                  e.currentTarget.style.color = theme.buttonHoverText;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.buttonBg;
                  e.currentTarget.style.color = "#ffffff";
                }}
              >
                {status === "sending"
                  ? "Sending..."
                  : status === "success"
                    ? "Message Sent!"
                    : status === "error"
                      ? "Failed to Send"
                      : t.contact.btn_send}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
