// src/pages/Login.jsx

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { loginAdapter as loginApi } from "../adapters/auth/authAdapter";
import { TOKEN_KEY } from "../utils/constants";

import Logo from '../assets/images/logo-multiApp.png';

export default function Login() {

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [flashWord, setFlashWord] = useState("");
  const [pos, setPos] = useState({ top: "50%", left: "50%" });
  const [visible, setVisible] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) navigate("/");

    // 🔴 Flashes subliminales cada 1s
    const words = [
      "útil", "rápido", "fácil", "eficiente",
      "seguro", "práctico", "innovador", "confiable",
      "intuitivo", "sencillo", "potente",
      "cómodo", "versátil", "rápido", "inteligente"
    ];

    const interval = setInterval(() => {
      const w = words[Math.floor(Math.random() * words.length)];
      setFlashWord(w);
      setPos({
        top: `${Math.random() * 70 + 15}%`,
        left: `${Math.random() * 70 + 15}%`,
      });
      setVisible(false); // comienza visible
      
      setTimeout(() => setVisible(true), 50);
      console.log(`Word: ${w}`);
      setTimeout(() => setVisible(false), 110);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      if (form.email === '' || form.password === '') return setErrorMsg('Debe ingresar la información completa.');

      const res = await loginApi(form);

      if (!res.ok) return setErrorMsg(res.message);

      localStorage.setItem(TOKEN_KEY, res.token);
      navigate("/");
    } catch (error) {
      setErrorMsg(error.message || "Error en login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">

      {/* FONDO FUTURISTA CON GRADIENTE */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-90" />


      {/* PALABRAS */}
      {flashWord && (
        <div
          className="fixed text-white text-2xl font-bold select-none pointer-events-none z-30 transition-opacity duration-500"
          style={{
            top: pos.top,
            left: pos.left,
            opacity: visible ? 0.1 : 0,
          }}
        >
          {flashWord}
        </div>
      )}

      {/* EFECTO GLASS */}
      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl border border-white/20 animate-fadeIn">

        <img src={Logo} alt="MultiApp" className="mx-auto w-16 sm:w-20 lg:w-24" />
        {/* TITULO */}
        <h2 className="text-3xl font-bold text-center text-white mb-6 tracking-wide">
          Iniciar Sesión
        </h2>

        {/* 🔴 ALERTA DE ERROR */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-400 text-red-300 animate-fadeIn">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* EMAIL */}
          <div>


            <label className="text-gray-300 text-sm">Correo electrónico</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              className="mt-1 w-full px-4 py-3 bg-gray-800/40 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="usuario@correo.com"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-gray-300 text-sm">Contraseña</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              className="mt-1 w-full px-4 py-3 bg-gray-800/40 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>

          {/* BOTÓN */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all disabled:bg-indigo-400"
          >
            {loading ? "Ingresando..." : "Entrar"}
          </button>

        </form>
      </div>
    </div>
  );
}
