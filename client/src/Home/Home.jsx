import React from "react";
import { Link } from "react-router-dom";
import { IoMdCloudUpload } from "react-icons/io";
import { SiFsecure, SiReact, SiRedux, SiTailwindcss, SiNodedotjs, SiGithub } from "react-icons/si";
import { GoFileSubmodule } from "react-icons/go";
import { TbUpload } from "react-icons/tb";
import { FaFacebook, FaInstagram, FaLink, FaTwitter, FaShareSquare, FaLaptopCode, FaArrowRight } from "react-icons/fa";
import CommonHeader from "../components/CommonHeader";

const Home = () => {
  return (
    <main className="font-sans bg-slate-50 text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
      <CommonHeader />

      {/* ---------------- HERO SECTION ---------------- */}
      <section className="relative overflow-hidden bg-slate-900 text-white pt-24 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6 lg:px-8">
        {/* Background gradient effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-[50%] -left-[20%] w-[80%] h-[80%] rounded-full bg-indigo-500 blur-[120px]"></div>
          <div className="absolute top-[20%] -right-[20%] w-[70%] h-[80%] rounded-full bg-purple-500 blur-[120px]"></div>
        </div>

        <div className="relative max-w-5xl mx-auto text-center z-10 animate-fade-in-up">
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-sm font-semibold mb-6 backdrop-blur-sm">
            v2.0 is now live 🚀
          </span>
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Share Files with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Confidence</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Experience the simplest, fastest, and most secure way to share your files. No clutter, just sharing.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login">
              <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-1">
                Get Started Free <FaArrowRight />
              </button>
            </Link>
            <Link to="/signup">
              <button className="px-8 py-4 rounded-full text-lg font-semibold text-white border border-slate-600 hover:bg-slate-800 transition-colors">
                Create Account
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- FEATURES ---------------- */}
      <section className="py-24 px-4 bg-white relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Choose ShareBox?</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">We've stripped away the complexity. Focus on your files, we handle the rest with enterprise-grade security.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: IoMdCloudUpload, color: "text-blue-500", title: "Seamless Uploads", desc: "Drag & drop files of any type. MP4, PDF, JPEG - we handle it all with lightning speed." },
              { icon: SiFsecure, color: "text-green-500", title: "Ironclad Security", desc: "Password protection and auto-expiry date settings give you full control over your data." },
              { icon: GoFileSubmodule, color: "text-purple-500", title: "Global Access", desc: "Access your files from any device, anywhere in the world, 24/7 with zero downtime." }
            ].map((feature, idx) => (
              <article key={idx} className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all duration-300 hover:shadow-xl">
                <div className={`w-16 h-16 rounded-xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${feature.color}`}>
                  <feature.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-16">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: TbUpload, color: "text-orange-500", title: "1. Upload", desc: "Simply drag your file to our secure dropzone." },
              { icon: FaLink, color: "text-blue-500", title: "2. Generate Link", desc: "We create a unique, secure link instantly." },
              { icon: FaShareSquare, color: "text-pink-500", title: "3. Share", desc: "Send it to anyone — clients, team, friends." }
            ].map((step, idx) => (
              <div key={idx} className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
                <div className={`mx-auto w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6 shadow-inner ${step.color}`}>
                  <step.icon size={36} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{step.title}</h3>
                <p className="text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- TECH STACK ---------------- */}
      <section className="py-20 px-4 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-slate-300">Powering Next-Gen Sharing</h2>
          <div className="flex flex-wrap justify-center gap-12 sm:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex flex-col items-center gap-2 hover:text-cyan-400 transition-colors"><SiReact size={50} /><span className="text-sm font-medium">React</span></div>
            <div className="flex flex-col items-center gap-2 hover:text-purple-400 transition-colors"><SiRedux size={50} /><span className="text-sm font-medium">Redux</span></div>
            <div className="flex flex-col items-center gap-2 hover:text-sky-400 transition-colors"><SiTailwindcss size={50} /><span className="text-sm font-medium">Tailwind</span></div>
            <div className="flex flex-col items-center gap-2 hover:text-green-500 transition-colors"><SiNodedotjs size={50} /><span className="text-sm font-medium">Node.js</span></div>
          </div>
        </div>
      </section>

      {/* ---------------- DEVELOPER SECTION ---------------- */}
      <section className="py-20 px-4 bg-white text-center">
        <div className="max-w-3xl mx-auto">
          <FaLaptopCode size={50} className="mx-auto text-indigo-600 mb-6" />
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Developed by Suraj Pawar</h2>
          <p className="text-lg text-slate-600 mb-8">Full Stack Developer — Passionate about building elegant & scalable web solutions.</p>

          <div className="flex justify-center gap-6">
            <a href="https://github.com/Suraj231194/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition shadow-lg hover:scale-105 active:scale-95 duration-300">
              <SiGithub size={20} /> <span>GitHub</span>
            </a>
            <a href="https://suraj231194.github.io/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-lg hover:scale-105 active:scale-95 duration-300">
              <FaLink size={18} /> <span>Portfolio</span>
            </a>
            <a href="https://www.linkedin.com/in/surajpawar2311" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-lg hover:scale-105 active:scale-95 duration-300">
              <FaFacebook size={18} /> <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="py-20 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl font-bold mb-6">Ready to start sharing?</h2>
          <p className="text-xl text-indigo-100 mb-8">Join thousands of users sharing files effortlessly today.</p>
          <Link to="/login">
            <button className="bg-white text-indigo-600 px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:bg-gray-50 transform hover:scale-105 transition-all">
              Launch App
            </button>
          </Link>
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-6 flex justify-center items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
            <span className="text-xl font-bold text-white">ShareBox</span>
          </div>
          <p className="mb-8 text-sm">© {new Date().getFullYear()} ShareBox. Crafted with ❤️ by Suraj Pawar.</p>
          <div className="flex justify-center gap-8">
            <a href="https://www.linkedin.com/in/surajpawar2311" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors hover:scale-125 duration-300"><FaFacebook size={24} title="LinkedIn" /></a>
            <a href="https://github.com/Suraj231194/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors hover:scale-125 duration-300"><SiGithub size={24} title="GitHub" /></a>
            <a href="https://suraj231194.github.io/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors hover:scale-125 duration-300"><FaLink size={24} title="Portfolio" /></a>
          </div>
        </div>
      </footer>

    </main>
  );
};

export default Home;
