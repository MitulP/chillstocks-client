import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../components/Button";
import { Card, CardContent } from "../components/Card";
import { X } from "lucide-react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

export default function Home() {
  const [showAuth, setShowAuth] = useState(false);
  const [isSignup, setIsSignup] = useState(true);
  const [authMethod, setAuthMethod] = useState("email"); // email or otp
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  const [name, setName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  const provider = new GoogleAuthProvider();

  const handleAuthSubmit = async () => {
    try {
      if (isSignup) await createUserWithEmailAndPassword(auth, email, password);
      else await signInWithEmailAndPassword(auth, email, password);
      alert(`${isSignup ? "Signup" : "Login"} successful!`);
      setShowAuth(false); setEmail(""); setPassword("");
    } catch (err) { alert(err.message); }
  };

  const handleGoogleLogin = async () => {
    try { await signInWithPopup(auth, provider); alert("Google login successful!"); setShowAuth(false); }
    catch (err) { alert(err.message); }
  };

  const sendOtp = async () => {
    try {
      window.recaptchaVerifier = new RecaptchaVerifier("recaptcha-container", { size: "invisible" }, auth);
      const result = await signInWithPhoneNumber(auth, "+91" + phone, window.recaptchaVerifier);
      setConfirmationResult(result); setShowOtpInput(true); alert("OTP sent!");
    } catch (err) { alert(err.message); }
  };

  const verifyOtp = async () => {
    try { await confirmationResult.confirm(otp); alert("Phone login successful!"); setShowAuth(false); setPhone(""); setOtp(""); setShowOtpInput(false); }
    catch (err) { alert(err.message); }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try { await addDoc(collection(db, "contacts"), { name, email: contactEmail, message: contactMessage, createdAt: new Date() });
      alert("Message sent successfully!"); setName(""); setContactEmail(""); setContactMessage("");
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen text-gray-800">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center py-4 px-6">
          <h1 className="text-2xl font-bold text-blue-800">CrystalCapital</h1>
          <ul className="hidden md:flex gap-6 text-gray-700 font-medium">
            {["Home","About","Why Us","Services","Insights","Testimonials","Contact"].map((item,i)=>(
              <li key={i} className="hover:text-blue-600 cursor-pointer">{item}</li>
            ))}
          </ul>
          <div className="flex gap-4">
            <Button className="rounded-xl bg-blue-700 text-white" onClick={()=>{setShowAuth(true); setIsSignup(true); setAuthMethod("email")}}>Signup</Button>
            <Button variant="outline" className="rounded-xl" onClick={()=>{setShowAuth(true); setIsSignup(false); setAuthMethod("email")}}>Login</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center py-40 px-6">
        <motion.h1 initial={{ opacity:0,y:-40 }} animate={{ opacity:1,y:0 }} transition={{ duration:1 }} className="text-5xl font-bold text-blue-900 drop-shadow-sm">CrystalCapital</motion.h1>
        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5, duration:1 }} className="mt-4 text-lg max-w-2xl text-gray-600">
          Empowering Indian investors with crystal-clear opportunities inspired by the elegance of snowflakes.
        </motion.p>
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1, duration:1 }} className="mt-8 flex gap-4">
          <Button className="rounded-2xl bg-blue-700 hover:bg-blue-800 px-6 py-3 text-white text-lg shadow-lg">Start Investing</Button>
          <Button variant="outline" className="rounded-2xl px-6 py-3 text-lg">Learn More</Button>
        </motion.div>
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {Array.from({length:20}).map((_,i)=>(
            <motion.div key={i} className="absolute text-blue-200 opacity-70" style={{ left:`${Math.random()*100}%`, fontSize:`${Math.random()*24+12}px` }} animate={{ y:["-10%","110%"], rotate:[0,360] }} transition={{ duration:Math.random()*10+10, repeat:Infinity, ease:"linear" }}>❆</motion.div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-6 bg-white" id="about">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-blue-800 mb-6">About Us</h2>
          <p className="text-lg text-gray-600 mb-12">At <span className="font-semibold text-blue-700">CrystalCapital</span>, we believe investing should be clear, accessible, and trustworthy. Inspired by the uniqueness of snowflakes, we craft personalized strategies for Indian investors.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{title:"Our Vision",desc:"Empower every Indian investor with transparent financial growth."},{title:"Our Mission",desc:"Deliver personalized investment solutions that align with your goals."},{title:"Our Values",desc:"Integrity, clarity, and innovation at the heart of everything we do."}].map((item,i)=>(
              <Card key={i} className="rounded-2xl shadow-md border border-blue-100">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-blue-700 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-6 bg-white" id="contact">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-blue-800 mb-6">Contact Us</h2>
          <p className="text-lg text-gray-600 mb-12">Have questions? We’d love to hear from you.</p>
          <form className="grid grid-cols-1 gap-6 text-left" onSubmit={handleContactSubmit}>
            <input type="text" placeholder="Your Name" className="border rounded-xl p-4" value={name} onChange={e=>setName(e.target.value)} />
            <input type="email" placeholder="Your Email" className="border rounded-xl p-4" value={contactEmail} onChange={e=>setContactEmail(e.target.value)} />
            <textarea placeholder="Your Message" rows="5" className="border rounded-xl p-4" value={contactMessage} onChange={e=>setContactMessage(e.target.value)}></textarea>
            <Button className="rounded-xl bg-blue-700 hover:bg-blue-800 text-white">Send Message</Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-blue-900 text-white text-center">
        <p>© 2025 CrystalCapital. All Rights Reserved.</p>
        <p className="text-sm text-blue-200 mt-2">Investments are subject to market risks. Read all scheme related documents carefully.</p>
      </footer>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button className="absolute top-4 right-4 text-gray-500" onClick={()=>setShowAuth(false)}><X className="h-6 w-6"/></button>
            <div className="flex justify-around mb-4">
              <button className={`px-4 py-2 rounded-xl ${authMethod==="email"?"bg-blue-700 text-white":"bg-gray-200"}`} onClick={()=>setAuthMethod("email")}>Email</button>
              <button className={`px-4 py-2 rounded-xl ${authMethod==="otp"?"bg-blue-700 text-white":"bg-gray-200"}`} onClick={()=>setAuthMethod("otp")}>Mobile OTP</button>
            </div>

            {authMethod==="email" ? (
              <>
                <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">{isSignup ? "Signup" : "Login"}</h2>
                <form className="grid gap-4" onSubmit={e=>{e.preventDefault(); handleAuthSubmit();}}>
                  <input type="email" placeholder="Email" className="border rounded-xl p-4" value={email} onChange={e=>setEmail(e.target.value)} />
                  <input type="password" placeholder="Password" className="border rounded-xl p-4" value={password} onChange={e=>setPassword(e.target.value)} />
                  <Button className="rounded-xl bg-blue-700 hover:bg-blue-800 text-white">{isSignup ? "Signup" : "Login"}</Button>
                </form>
                <Button className="mt-4 w-full rounded-xl bg-red-500 hover:bg-red-600 text-white" onClick={handleGoogleLogin}>Continue with Google</Button>
              </>
            ) : (
              <div>
                <div id="recaptcha-container"></div>
                {!showOtpInput ? (
                  <>
                    <input type="text" placeholder="Phone Number" className="border rounded-xl p-4 w-full mb-4" value={phone} onChange={e=>setPhone(e.target.value)} />
                    <Button className="w-full bg-blue-700 hover:bg-blue-800 text-white rounded-xl" onClick={sendOtp}>Send OTP</Button>
                  </>
                ) : (
                  <>
                    <input type="text" placeholder="Enter OTP" className="border rounded-xl p-4 w-full
