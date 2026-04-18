import { useEffect, useRef, useState } from "react";

export default function HowItWorksFlow() {
    const containerRef = useRef(null);
    const cardRefs = useRef([]);
    const [paths, setPaths] = useState([]);
    const [active, setActive] = useState(null);

    const steps = [
        {
            title: "Choose Service",
            desc: "Browse and select your required service",
            points: ["Explore categories", "Find trusted providers"],
            details: "Explore services like cleaning, salon, repair and more.",
            icon: (
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            ),
        },
        {
            title: "Pick Slot",
            desc: "Select available time slot",
            points: ["Real-time availability", "No overlaps"],
            details: "Choose slots without conflicts.",
            icon: (
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
            ),
        },
        {
            title: "Book & Pay",
            desc: "Secure payment",
            points: ["Multiple options", "Instant confirmation"],
            details: "Complete booking securely.",
            icon: (
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="6" width="20" height="12" rx="2" />
                    <path d="M2 10h20" />
                </svg>
            ),
        },
        {
            title: "Get Service",
            desc: "Enjoy service",
            points: ["On-time delivery", "Trusted professionals"],
            details: "Relax while service is delivered.",
            icon: (
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 12l2 2 4-4" />
                </svg>
            ),
        },
    ];

    useEffect(() => {
        const newPaths = [];

        for (let i = 0; i < cardRefs.current.length - 1; i++) {
            const from = cardRefs.current[i];
            const to = cardRefs.current[i + 1];

            if (!from || !to) continue;

            const fromRect = from.getBoundingClientRect();
            const toRect = to.getBoundingClientRect();
            const parentRect = containerRef.current.getBoundingClientRect();

            const startX =
                i % 2 === 0
                    ? fromRect.right - parentRect.left
                    : fromRect.left - parentRect.left;

            const startY = fromRect.top - parentRect.top + fromRect.height / 2;

            const endX =
                i % 2 === 0
                    ? toRect.left - parentRect.left
                    : toRect.right - parentRect.left;

            const endY = toRect.top - parentRect.top + toRect.height / 2;

            const midX = (startX + endX) / 2;

            const d = `M ${startX} ${startY}
                 C ${midX} ${startY},
                   ${midX} ${endY},
                   ${endX} ${endY}`;

            newPaths.push(d);
        }

        setPaths(newPaths);
    }, []);

    return (
        <div ref={containerRef} className="relative max-w-6xl mx-auto py-24">

            <h2 className="text-5xl font-bold text-center mb-20">
                How It <span className="text-yellow-500">Works</span>
            </h2>

            {/* CONNECTED DOT PATH */}
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {paths.map((d, i) => (
                    <path
                        key={i}
                        d={d}
                        stroke="#facc15"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray="4 10"
                        strokeLinecap="round"
                    />
                ))}
            </svg>

            {/* CARDS */}
            <div className="flex flex-col gap-32">
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className={`flex ${index % 2 === 0 ? "justify-start" : "justify-end"
                            }`}
                    >
                        <div
                            ref={(el) => (cardRefs.current[index] = el)}
                            onClick={() => setActive(step)}
                            className="w-[420px] cursor-pointer bg-white border border-yellow-200 rounded-xl p-7 shadow-md hover:shadow-2xl hover:-translate-y-2 transition group"
                        >
                            {/* ICON */}
                            <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center mb-4">
                                {step.icon}
                            </div>

                            <h3 className="text-xl font-semibold">{step.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{step.desc}</p>

                            <ul className="mt-3 text-sm text-gray-700 space-y-1">
                                {step.points.map((p, i) => (
                                    <li key={i}>✔ {p}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            {active && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-[360px] shadow-xl relative">

                        <button
                            onClick={() => setActive(null)}
                            className="absolute top-3 right-3 text-gray-500 text-xl"
                        >
                            ×
                        </button>

                        <h3 className="text-lg font-semibold mb-3">
                            {active.title}
                        </h3>

                        <p className="text-sm text-gray-700 mb-3">
                            {active.details}
                        </p>

                        <ul className="text-sm text-gray-600 mb-4 space-y-1">
                            {active.points.map((p, i) => (
                                <li key={i}>✔ {p}</li>
                            ))}
                        </ul>

                        <p className="text-sm text-gray-500 mb-4">
                            Login to use this feature
                        </p>

                        <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-lg w-full">
                            Login
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}