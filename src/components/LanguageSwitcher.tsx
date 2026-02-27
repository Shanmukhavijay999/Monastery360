import { useState, useRef, useEffect } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useTranslation, LANGUAGES, type Language } from "@/lib/i18n";

const LanguageSwitcher = () => {
    const { language, setLanguage } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentLang = LANGUAGES.find((l) => l.code === language)!;

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-2.5 py-2 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200"
                title="Change Language"
            >
                <Globe className="w-4 h-4" />
                <span className="hidden md:inline text-xs font-medium">{currentLang.flag}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-orange-100/50 py-2 z-50 animate-fade-in-up">
                    <div className="px-3 py-1.5 mb-1 border-b border-gray-100">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Select Language</p>
                    </div>
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                setLanguage(lang.code);
                                setIsOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all duration-200 ${language === lang.code
                                    ? "bg-orange-50 text-orange-600"
                                    : "text-gray-600 hover:bg-orange-50/50 hover:text-orange-600"
                                }`}
                        >
                            <span className="text-lg w-7 text-center">{lang.flag}</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium">{lang.label}</p>
                                <p className="text-[10px] text-gray-400">{lang.nativeLabel}</p>
                            </div>
                            {language === lang.code && (
                                <Check className="w-4 h-4 text-orange-500 flex-shrink-0" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
