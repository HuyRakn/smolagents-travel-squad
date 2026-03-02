"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Container, ISourceOptions } from "@tsparticles/engine";

export default function ParticlesBackground() {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesLoaded = async (container?: Container): Promise<void> => {
        // container loaded
    };

    const options: ISourceOptions = {
        fpsLimit: 60,
        interactivity: {
            events: {
                onHover: {
                    enable: true,
                    mode: "bubble",
                },
            },
            modes: {
                bubble: {
                    distance: 150,
                    duration: 2,
                    opacity: 0.8,
                    size: 3,
                },
            },
        },
        particles: {
            color: {
                value: "#ffffff",
            },
            move: {
                direction: "top",
                enable: true,
                outModes: {
                    default: "out",
                },
                random: true,
                speed: 0.5,
                straight: false,
            },
            number: {
                density: {
                    enable: true,
                },
                value: 40,
            },
            opacity: {
                value: { min: 0.1, max: 0.4 },
                animation: {
                    enable: true,
                    speed: 1,
                    sync: false,
                }
            },
            shape: {
                type: "circle",
            },
            size: {
                value: { min: 1, max: 2 },
            },
        },
        detectRetina: true,
    };

    if (!init) return null;

    return (
        <Particles
            id="tsparticles"
            particlesLoaded={particlesLoaded}
            options={options}
            className="fixed inset-0 z-0 pointer-events-none"
        />
    );
}
