import { FaGlobe, FaFacebook } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="flex items-center gap-4 text-white">
      <p>© Mosaddik</p>
      <a
        href="https://mosaddik.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaGlobe className="w-6 h-6 hover:text-gray-400 transition-all" />
      </a>
      <a
        href="https://facebook.com/mosaddik.dev"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaFacebook className="w-6 h-6 hover:text-blue-500 transition-all" />
      </a>
    </div>
  );
};

export default Footer;
