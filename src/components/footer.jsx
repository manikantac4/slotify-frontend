import {
    Mail,
    Phone,
    MapPin,
    Clock,
} from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gray-200 mt-20 border-t border-gray-300">
            <div className="max-w-7xl mx-auto px-6 py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-5 items-start">

                {/* Company */}
                <div className="-mt-2">
                    <h2 className="text-3xl font-bold text-yellow-500 mb-4">
                        Slotify
                    </h2>
                    <p className="text-gray-800 text-sm leading-relaxed mb-4">
                        Smart service booking platform that helps users schedule appointments effortlessly and avoid time conflicts.
                    </p>
                    <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Book services instantly</li>
                        <li>• Manage time slots efficiently</li>
                        <li>• Secure and seamless payments</li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="font-semibold text-yellow-500 mb-4">Contact</h3>
                    <ul className="space-y-3 text-gray-800 text-sm">
                        <li className="flex items-center gap-2">
                            <MapPin size={16} /> Vijayawada, India
                        </li>
                        <li className="flex items-center gap-2">
                            <Mail size={16} /> slotify@gmail.com
                        </li>
                        <li className="flex items-center gap-2">
                            <Phone size={16} /> +91 7737495559
                        </li>
                        <li className="flex items-center gap-2">
                            <Clock size={16} /> Mon–Sat | 9AM–9PM
                        </li>
                    </ul>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="font-semibold text-yellow-500 mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-gray-800 text-sm">
                        {["Home", "Services", "Book Appointment", "Dashboard", "Admin Panel"].map((item) => (
                            <li
                                key={item}
                                className="cursor-pointer hover:text-black transition duration-200 hover:translate-x-1"
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h3 className="font-semibold text-yellow-500 mb-4">Support</h3>
                    <ul className="space-y-2 text-gray-800 text-sm">
                        {["FAQ", "Terms & Conditions", "Privacy Policy", "Refund Policy"].map((item) => (
                            <li
                                key={item}
                                className="cursor-pointer hover:text-black transition duration-200 hover:translate-x-1"
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h3 className="font-semibold text-yellow-500 mb-4">Stay Updated</h3>
                    <p className="text-gray-800 text-sm mb-3">
                        Get updates on new features
                    </p>

                    <div className="flex items-center border border-gray-400 rounded-lg overflow-hidden bg-white mb-4">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="px-3 py-2 w-full outline-none text-sm text-black"
                        />
                        <button className="bg-yellow-400 text-black font-semibold px-4 py-2 hover:bg-yellow-500 transition">
                            Subscribe
                        </button>
                    </div>

                    {/* Social Icons */}
                    <div className="flex gap-3">
                        {["IG", "IN", "TW", "GH"].map((item, i) => (
                            <div
                                key={i}
                                className="w-9 h-9 flex items-center justify-center border border-gray-400 rounded-full bg-white text-xs font-semibold hover:bg-yellow-400 hover:text-black transition cursor-pointer"
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-gray-300 py-5 text-center text-gray-800 text-sm">
                © 2026 <span className="font-semibold text-yellow-500">Slotify</span>. All rights reserved.
            </div>
        </footer>
    );
}