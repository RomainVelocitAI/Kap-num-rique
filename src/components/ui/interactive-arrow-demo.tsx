'use client'

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Play } from 'lucide-react';

// Helper to parse 'rgb(r, g, b)' or 'rgba(r, g, b, a)' string to {r, g, b}
const parseRgbColor = (colorString: string | null): { r: number; g: number; b: number } | null => {
    if (!colorString) return null;
    const match = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
    if (match) {
        return {
            r: parseInt(match[1], 10),
            g: parseInt(match[2], 10),
            b: parseInt(match[3], 10),
        };
    }
    return null;
};

interface NavItem {
    id: string;
    label: string;
    href?: string;
    target?: string;
    onClick?: () => void;
}

interface InteractiveArrowDemoProps {
    heading?: string;
    tagline?: string;
    buttonText?: string;
    imageUrl?: string;
    videoUrl?: string;
    navItems?: NavItem[];
}

const defaultNavItems: NavItem[] = [
    { id: 'home', label: 'Accueil', onClick: () => console.info('Home clicked') },
    { id: 'features', label: 'Fonctionnalités', href: '#features' },
    { id: 'pricing', label: 'Tarifs', onClick: () => console.info('Pricing clicked') },
    { id: 'contact', label: 'Contact', onClick: () => console.info('Contact clicked') },
];

const InteractiveArrowDemo: React.FC<InteractiveArrowDemoProps> = ({
    heading = "Captez l'attention instantanément",
    tagline = "En 2025, votre site doit bouger, surprendre et engager. Découvrez la puissance des interactions visuelles.",
    buttonText = "Essayez maintenant",
    imageUrl = "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    videoUrl,
    navItems = defaultNavItems,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const targetRef = useRef<HTMLButtonElement>(null);
    const mousePosRef = useRef({ x: null as number | null, y: null as number | null });
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const animationFrameIdRef = useRef<number | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [showVideo, setShowVideo] = useState(false);

    const resolvedCanvasColorsRef = useRef({
        strokeStyle: { r: 255, g: 215, b: 0 }, // Gold color for visibility
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        const tempElement = document.createElement('div');
        tempElement.style.display = 'none';
        document.body.appendChild(tempElement);

        const updateResolvedColors = () => {
            // Always use gold color for visibility on dark background
            resolvedCanvasColorsRef.current.strokeStyle = { r: 255, g: 215, b: 0 };
        };
        updateResolvedColors();
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class' && mutation.target === document.documentElement) {
                    updateResolvedColors();
                    break;
                }
            }
        });
        observer.observe(document.documentElement, { attributes: true });
        return () => {
            observer.disconnect();
            if (tempElement.parentNode) {
                tempElement.parentNode.removeChild(tempElement);
            }
        };
    }, []);

    const drawArrow = useCallback(() => {
        if (!canvasRef.current || !targetRef.current || !ctxRef.current) return;

        const targetEl = targetRef.current;
        const ctx = ctxRef.current;
        const mouse = mousePosRef.current;

        const x0 = mouse.x;
        const y0 = mouse.y;

        if (x0 === null || y0 === null) return;

        const rect = targetEl.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const a = Math.atan2(cy - y0, cx - x0);
        const x1 = cx - Math.cos(a) * (rect.width / 2 + 12);
        const y1 = cy - Math.sin(a) * (rect.height / 2 + 12);

        const midX = (x0 + x1) / 2;
        const midY = (y0 + y1) / 2;
        const offset = Math.min(200, Math.hypot(x1 - x0, y1 - y0) * 0.5);
        const t = Math.max(-1, Math.min(1, (y0 - y1) / 200));
        const controlX = midX;
        const controlY = midY + offset * t;
        
        const r = Math.sqrt((x1 - x0)**2 + (y1 - y0)**2);
        const opacity = Math.min(1.0, (r - Math.max(rect.width, rect.height) / 2) / 500); 

        const arrowColor = resolvedCanvasColorsRef.current.strokeStyle;
        ctx.strokeStyle = `rgba(${arrowColor.r}, ${arrowColor.g}, ${arrowColor.b}, ${opacity})`;
        ctx.lineWidth = 2;

        // Draw curve
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.quadraticCurveTo(controlX, controlY, x1, y1);
        ctx.setLineDash([10, 5]);
        ctx.stroke();
        ctx.restore();

        // Draw arrowhead
        const angle = Math.atan2(y1 - controlY, x1 - controlX);
        const headLength = 10 * (ctx.lineWidth / 1.5); 
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(
            x1 - headLength * Math.cos(angle - Math.PI / 6),
            y1 - headLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(x1, y1);
        ctx.lineTo(
            x1 - headLength * Math.cos(angle + Math.PI / 6),
            y1 - headLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        const canvas = canvasRef.current;
        if (!canvas || !targetRef.current) return;

        ctxRef.current = canvas.getContext("2d");
        const ctx = ctxRef.current;

        const updateCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const handleMouseMove = (e: MouseEvent) => {
            mousePosRef.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener("resize", updateCanvasSize);
        window.addEventListener("mousemove", handleMouseMove);
        updateCanvasSize();

        const animateLoop = () => {
            if (ctx && canvas) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawArrow();
            }
            animationFrameIdRef.current = requestAnimationFrame(animateLoop);
        };
        
        animateLoop();

        return () => {
            window.removeEventListener("resize", updateCanvasSize);
            window.removeEventListener("mousemove", handleMouseMove);
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
        };
    }, [drawArrow]);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (videoElement && videoUrl) {
            const handleVideoEnd = () => {
                setShowVideo(false);
                videoElement.currentTime = 0;
            };

            if (showVideo) {
                videoElement.play().catch(error => {
                    console.error("InteractiveArrowDemo: Error playing video:", error);
                    setShowVideo(false);
                });
                videoElement.addEventListener('ended', handleVideoEnd);
            } else {
                videoElement.pause();
            }

            return () => {
                videoElement.removeEventListener('ended', handleVideoEnd);
            };
        }
    }, [showVideo, videoUrl]);

    const handlePlayButtonClick = () => {
        if (videoUrl) {
            setShowVideo(true);
        }
    };

    return (
        <div className="relative bg-gray-900 text-white min-h-screen flex flex-col overflow-hidden">
            <nav className="w-full max-w-screen-md mx-auto flex flex-wrap justify-center sm:justify-between items-center px-4 sm:px-8 py-4 text-sm z-20 relative">
                {navItems.map((item) => {
                    const commonProps = {
                        key: item.id,
                        className: "py-2 px-3 sm:px-4 rounded-md text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-150 ease-in-out whitespace-nowrap",
                        onClick: item.onClick,
                    };
                    if (item.href) {
                        return (
                            <a href={item.href} target={item.target} rel={item.target === '_blank' ? 'noopener noreferrer' : undefined} {...commonProps}>
                                {item.label}
                            </a>
                        );
                    }
                    return (
                        <button type="button" {...commonProps}>
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            <main className="flex-grow flex flex-col items-center justify-center z-20 relative">
                <div className="mt-12 sm:mt-16 lg:mt-24 flex flex-col items-center">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center px-4 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                        {heading}
                    </h1>
                    <p className="mt-3 block text-gray-300 text-center text-base sm:text-lg px-4 max-w-xl">
                        {tagline}
                    </p>
                </div>

                <div className="mt-8 flex justify-center">
                    <button
                        ref={targetRef}
                        className="py-3 px-6 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 transform hover:scale-105"
                    >
                        {buttonText}
                    </button>
                </div>

                <div className="mt-12 lg:mt-16 w-full max-w-screen-sm mx-auto overflow-hidden px-4 sm:px-2">
                    <div className="bg-gray-800 rounded-[2rem] p-[0.25rem]">
                        <div className="relative h-64 sm:h-72 md:h-80 lg:h-96 rounded-[1.75rem] bg-gray-900 flex items-center justify-center overflow-hidden">
                            {imageUrl && (
                                <img
                                    src={imageUrl}
                                    alt="Démonstration interactive"
                                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                                        showVideo ? 'opacity-0 pointer-events-none' : 'opacity-100'
                                    }`}
                                />
                            )}
                            {videoUrl && (
                                <video
                                    ref={videoRef}
                                    src={videoUrl}
                                    muted
                                    playsInline
                                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                                        showVideo ? 'opacity-100' : 'opacity-0 pointer-events-none'
                                    }`}
                                />
                            )}
                            {!showVideo && videoUrl && imageUrl && (
                                <button
                                    onClick={handlePlayButtonClick}
                                    className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20 p-2 sm:p-3 bg-primary-500/30 hover:bg-primary-500/50 text-white backdrop-blur-sm rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    aria-label="Lire la vidéo"
                                >
                                    <Play className="w-4 h-4 sm:w-5 sm:h-6" />
                                </button>
                            )}
                            {!imageUrl && !videoUrl && (
                                <div className="text-gray-500 italic">Zone de contenu interactif</div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <div className="h-12 sm:h-16 md:h-24"></div>
            <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-30"></canvas>
            
            {/* Background decorative elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/20 rounded-full filter blur-3xl animate-float" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-500/20 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '3s' }} />
            </div>
        </div>
    );
};

export default InteractiveArrowDemo;