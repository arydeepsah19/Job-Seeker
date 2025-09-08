import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative mt-10 text-gray-400 overflow-hidden">
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-black to-gray-900 opacity-95"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(0,0,255,0.15),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(255,0,150,0.15),transparent_50%)]"></div>

      {/* Top Divider with Glow */}
      <div className="relative h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/40"></div>

      {/* Main Content */}
      <div className="relative max-w-6xl mx-auto p-10 gap-12 grid md:grid-cols-4 md:gap-30 text-center md:text-left">
        
        {/* About */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">JobSeeker</h2>
          <p className="text-sm leading-relaxed">
            Helping you find the right opportunities and grow your career with ease.
            Explore, connect, and succeed with JobSeeker.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-blue-400 transition hover:pl-1 inline-block">Home</Link></li>
            <li><Link to="/jobs" className="hover:text-blue-400 transition hover:pl-1 inline-block">Jobs</Link></li>
            <li><Link to="/saved-jobs" className="hover:text-blue-400 transition hover:pl-1 inline-block">Saved Jobs</Link></li>
            <li><Link to="/my-job" className="hover:text-blue-400 transition hover:pl-1 inline-block">My Job</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Contact</h2>
          <p className="text-sm">
            <FaEnvelope className="inline mr-2 text-blue-400" />
            <a href="mailto:jobseekersup25@gmail.com?subject=Support Request&body=Hello JobSeeker Team," target="_blank">
              support@jobseeker.com
            </a>
          </p>
        </div>

        {/* Social Media */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Follow Me</h2>
          <div className="flex justify-center md:justify-start space-x-5 text-2xl">
            <a href="https://github.com/arydeepsah19/Job-Seeker" className="hover:text-blue-500 transition hover:scale-110 transform"><FaGithub /></a>
            <a href="https://www.linkedin.com/in/arydeepsah16" className="hover:text-blue-400 transition hover:scale-110 transform"><FaLinkedin /></a>
            <a href="https://x.com/?lang=en" className="hover:text-sky-400 transition hover:scale-110 transform"><FaTwitter /></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative text-center border-t border-gray-800 py-4 text-sm">
        Made With <span className="animate-pulse text-red-500">❤️</span> by{" "}
        <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-semibold hover:from-purple-500 hover:to-pink-500 transition-all duration-500">
          Arydeep Sah
        </span>{" "}
        | © {new Date().getFullYear()} JobSeeker. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;


