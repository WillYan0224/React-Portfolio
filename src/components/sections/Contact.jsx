import React, { useRef, useState } from "react";
import { Github } from "lucide-react";
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
                href="mailto:yanchung1998@gmail.com"
                className="text-xl font-bold transition-colors break-words"
                style={{ color: "#ffffff" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = theme.accentSoft;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#ffffff";
                }}
              >
                yanchung1998@gmail.com
              </a>
            </div>

            <div>
              <h4
                className="font-mono text-xs uppercase tracking-widest mb-4 font-black"
                style={{ color: theme.accent }}
              >
                Social
              </h4>

              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/WillYan0224"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="View GitHub repository"
                  className="group relative inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl p-[1px]"
                  style={{
                    background: `linear-gradient(135deg, ${theme.accent}65, rgba(255,255,255,0.08), ${theme.accent}24)`,
                    boxShadow: `0 0 18px ${theme.accent}10`,
                  }}
                >
                  <span
                    className="relative flex h-full w-full items-center justify-center rounded-2xl text-white"
                    style={{
                      background: "rgba(3,10,18,0.78)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <span
                      className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{
                        background: `radial-gradient(circle at 50% 0%, ${theme.accent}18, transparent 70%)`,
                      }}
                    />
                    <Github
                      size={22}
                      className="relative z-10 transition-all duration-300 group-hover:-translate-y-[1px] group-hover:scale-105"
                    />
                  </span>
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
                disabled={status === "sending"}
                className="group relative w-full overflow-hidden rounded-2xl p-[1px] disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(135deg, ${theme.accent}88, rgba(255,255,255,0.10), ${theme.accent}44)`,
                  boxShadow: `0 0 28px ${theme.accent}18`,
                }}
              >
                <span
                  className="relative flex h-16 w-full items-center justify-center rounded-2xl text-sm font-black uppercase tracking-widest text-white transition-all duration-300"
                  style={{
                    background: "rgba(3,10,18,0.78)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <span
                    className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(circle at 50% 0%, ${theme.accent}22, transparent 65%)`,
                    }}
                  />
                  <span className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)] -translate-x-[140%] group-hover:translate-x-[140%] transition-transform duration-1000" />

                  <span className="relative z-10">
                    {status === "sending"
                      ? "Sending..."
                      : status === "success"
                        ? "Message Sent!"
                        : status === "error"
                          ? "Failed to Send"
                          : t.contact.btn_send}
                  </span>
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
