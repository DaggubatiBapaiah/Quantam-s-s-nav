// Solar System Simulator - JavaScript Application
// Using JPL Orbital Elements Data

class SolarSystemSimulator {
    constructor() {
        this.canvas = document.getElementById('solarSystem');
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();

        // Simulation parameters
        this.AU = 149597870700; // Astronomical Unit in meters
        this.G = 6.67408e-11; // Gravitational constant
        this.julianDay = 2451545.0; // J2000.0 epoch
        this.daysElapsed = 0;
        this.animationSpeed = 1;
        this.zoom = 150;
        this.isAnimating = true;
        this.showOrbits = true;
        this.showLabels = true;

        // Camera/View parameters
        this.rotation = 0;
        this.tilt = 0.3;
        this.isDragging = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;

        // Planet data
        this.planets = this.initializePlanets();

        // Satellite data (artificial satellites around Earth)
        this.satellites = this.initializeSatellites();
        this.showSatellites = true;

        // FPS tracking
        this.lastFrameTime = performance.now();
        this.fps = 60;

        this.setupEventListeners();
        this.updatePlanetInfo();
        this.animate();
    }

    setupCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        this.width = rect.width;
        this.height = rect.height;
    }

    initializePlanets() {
        // JPL Orbital Elements (a, e, i, L, ϖ, Ω) and their rates
        const planetData = [
            {
                name: 'Sun',
                color: '#FDB813',
                size: 15,
                a: 0, e: 0, i: 0, L: 0, wbar: 0, omega: 0,
                adot: 0, edot: 0, idot: 0, Ldot: 0, wbardot: 0, omegadot: 0
            },
            {
                name: 'Mercury',
                color: '#8C7853',
                size: 4,
                a: 0.38709927, e: 0.20563593, i: 7.00497902, L: 252.25032350, wbar: 77.45779628, omega: 48.33076593,
                adot: 0.00000037, edot: 0.00001906, idot: -0.00594749, Ldot: 149472.67411175, wbardot: 0.16047689, omegadot: -0.12534081
            },
            {
                name: 'Venus',
                color: '#FFC649',
                size: 6,
                a: 0.72333566, e: 0.00677672, i: 3.39467605, L: 181.97909950, wbar: 131.60246718, omega: 76.67984255,
                adot: 0.00000390, edot: -0.00004107, idot: -0.00078890, Ldot: 58517.81538729, wbardot: 0.00268329, omegadot: -0.27769418
            },
            {
                name: 'Earth',
                color: '#4A90E2',
                size: 6,
                a: 1.00000261, e: 0.01671123, i: -0.00001531, L: 100.46457166, wbar: 102.93768193, omega: 0.0,
                adot: 0.00000562, edot: -0.00004392, idot: -0.01294668, Ldot: 35999.37244981, wbardot: 0.32327364, omegadot: 0.0
            },
            {
                name: 'Mars',
                color: '#E27B58',
                size: 5,
                a: 1.52371034, e: 0.09339410, i: 1.84969142, L: -4.55343205, wbar: -23.94362959, omega: 49.55953891,
                adot: 0.00001847, edot: 0.00007882, idot: -0.00813131, Ldot: 19140.30268499, wbardot: 0.44441088, omegadot: -0.29257343
            },
            {
                name: 'Jupiter',
                color: '#C88B3A',
                size: 11,
                a: 5.20288700, e: 0.04838624, i: 1.30439695, L: 34.39644051, wbar: 14.72847983, omega: 100.47390909,
                adot: -0.00011607, edot: -0.00013253, idot: -0.00183714, Ldot: 3034.74612775, wbardot: 0.21252668, omegadot: 0.20469106
            },
            {
                name: 'Saturn',
                color: '#FAD5A5',
                size: 10,
                a: 9.53667594, e: 0.05386179, i: 2.48599187, L: 49.95424423, wbar: 92.59887831, omega: 113.66242448,
                adot: -0.00125060, edot: -0.00050991, idot: 0.00193609, Ldot: 1222.49362201, wbardot: -0.41897216, omegadot: -0.28867794
            },
            {
                name: 'Uranus',
                color: '#4FD0E7',
                size: 8,
                a: 19.18916464, e: 0.04725744, i: 0.77263783, L: 313.23810451, wbar: 170.95427630, omega: 74.01692503,
                adot: -0.00196176, edot: -0.00004397, idot: -0.00242939, Ldot: 428.48202785, wbardot: 0.40805281, omegadot: 0.04240589
            },
            {
                name: 'Neptune',
                color: '#4166F5',
                size: 8,
                a: 30.06992276, e: 0.00859048, i: 1.77004347, L: -55.12002969, wbar: 44.96476227, omega: 131.78422574,
                adot: 0.00026291, edot: 0.00005105, idot: 0.00035372, Ldot: 218.45945325, wbardot: -0.32241464, omegadot: -0.00508664
            }
        ];

        return planetData.map(data => ({
            ...data,
            x: 0,
            y: 0,
            z: 0,
            trail: []
        }));
    }

    initializeSatellites() {
        // Artificial satellites orbiting Earth
        // Orbital parameters: altitude in km, inclination in degrees, period in minutes
        const earthRadius = 6371; // km
        const satelliteData = [
            {
                name: 'ISS',
                type: 'Space Station',
                color: '#00FF88',
                size: 5,
                altitude: 408, // km above Earth
                inclination: 51.6, // degrees
                period: 92.68, // minutes
                icon: '🛰️'
            },
            {
                name: 'Hubble',
                type: 'Telescope',
                color: '#FFD700',
                size: 4,
                altitude: 547,
                inclination: 28.5,
                period: 95,
                icon: '🔭'
            },
            {
                name: 'GPS-1',
                type: 'Navigation',
                color: '#00D4FF',
                size: 3.5,
                altitude: 20200,
                inclination: 55,
                period: 718,
                icon: '📡'
            },
            {
                name: 'GPS-2',
                type: 'Navigation',
                color: '#00D4FF',
                size: 3.5,
                altitude: 20200,
                inclination: 55,
                period: 718,
                phaseOffset: 120, // degrees
                icon: '📡'
            },
            {
                name: 'GPS-3',
                type: 'Navigation',
                color: '#00D4FF',
                size: 3.5,
                altitude: 20200,
                inclination: 55,
                period: 718,
                phaseOffset: 240,
                icon: '📡'
            },
            {
                name: 'Starlink-1',
                type: 'Communication',
                color: '#FF6B9D',
                size: 3,
                altitude: 550,
                inclination: 53,
                period: 95.5,
                icon: '📶'
            },
            {
                name: 'Starlink-2',
                type: 'Communication',
                color: '#FF6B9D',
                size: 3,
                altitude: 550,
                inclination: 53,
                period: 95.5,
                phaseOffset: 180,
                icon: '📶'
            },
            {
                name: 'GOES-16',
                type: 'Weather',
                color: '#FFA500',
                size: 3.5,
                altitude: 35786, // Geostationary
                inclination: 0,
                period: 1436,
                icon: '🌦️'
            }
        ];

        return satelliteData.map(data => ({
            ...data,
            phaseOffset: data.phaseOffset || 0,
            x: 0,
            y: 0,
            z: 0,
            trail: []
        }));
    }

    computePlanetPosition(planet, days) {
        if (planet.name === 'Sun') {
            planet.x = 0;
            planet.y = 0;
            planet.z = 0;
            return;
        }

        const T = days / 36525.0; // Centuries since J2000.0

        // Compute orbital elements
        const a = planet.a + planet.adot * T;
        const e = planet.e + planet.edot * T;
        const i = (planet.i + planet.idot * T) * Math.PI / 180;
        const L = (planet.L + planet.Ldot * T) * Math.PI / 180;
        const wbar = (planet.wbar + planet.wbardot * T) * Math.PI / 180;
        const omega = (planet.omega + planet.omegadot * T) * Math.PI / 180;

        const w = wbar - omega;
        let M = L - wbar;

        // Normalize M to [-π, π]
        while (M > Math.PI) M -= 2 * Math.PI;
        while (M < -Math.PI) M += 2 * Math.PI;

        // Solve Kepler's equation for E (eccentric anomaly)
        let E = M + e * Math.sin(M);
        let dE = 1;
        let iterations = 0;
        while (Math.abs(dE) > 1e-6 && iterations < 100) {
            dE = (M - (E - e * Math.sin(E))) / (1 - e * Math.cos(E));
            E += dE;
            iterations++;
        }

        // Compute position in orbital plane
        const xPrime = a * (Math.cos(E) - e);
        const yPrime = a * Math.sqrt(1 - e * e) * Math.sin(E);

        // Transform to ecliptic coordinates
        planet.x = (Math.cos(w) * Math.cos(omega) - Math.sin(w) * Math.sin(omega) * Math.cos(i)) * xPrime +
            (-Math.sin(w) * Math.cos(omega) - Math.cos(w) * Math.sin(omega) * Math.cos(i)) * yPrime;
        planet.y = (Math.cos(w) * Math.sin(omega) + Math.sin(w) * Math.cos(omega) * Math.cos(i)) * xPrime +
            (-Math.sin(w) * Math.sin(omega) + Math.cos(w) * Math.cos(omega) * Math.cos(i)) * yPrime;
        planet.z = (Math.sin(w) * Math.sin(i)) * xPrime + (Math.cos(w) * Math.sin(i)) * yPrime;

        // Store trail
        if (planet.trail.length > 200) {
            planet.trail.shift();
        }
        planet.trail.push({ x: planet.x, y: planet.y, z: planet.z });
    }

    computeSatellitePosition(satellite, days) {
        // Find Earth's position
        const earth = this.planets.find(p => p.name === 'Earth');
        if (!earth) return;

        // Convert satellite orbital parameters to simulation units
        const earthRadius = 6371; // km
        const AU_TO_KM = 149597870.7; // 1 AU in km

        // Orbital radius in AU with visual scale multiplier for better visibility
        // Real satellites are too close to Earth to see at solar system scale
        const visualScaleMultiplier = 50; // Make satellites 50x further for visibility
        const orbitalRadius = ((earthRadius + satellite.altitude) / AU_TO_KM) * visualScaleMultiplier;

        // Calculate mean motion (radians per day)
        const meanMotion = (2 * Math.PI) / (satellite.period / (24 * 60)); // period in minutes to days

        // Calculate mean anomaly with phase offset
        const M = (meanMotion * days * this.animationSpeed * 10) + (satellite.phaseOffset * Math.PI / 180);

        // For circular orbits (satellites), E ≈ M
        const E = M;

        // Position in orbital plane
        const xOrbit = orbitalRadius * Math.cos(E);
        const yOrbit = orbitalRadius * Math.sin(E);

        // Apply inclination
        const incRad = satellite.inclination * Math.PI / 180;

        // Transform to 3D coordinates relative to Earth
        const xRel = xOrbit;
        const yRel = yOrbit * Math.cos(incRad);
        const zRel = yOrbit * Math.sin(incRad);

        // Add Earth's position
        satellite.x = earth.x + xRel;
        satellite.y = earth.y + yRel;
        satellite.z = earth.z + zRel;

        // Store trail (shorter for satellites)
        if (satellite.trail.length > 50) {
            satellite.trail.shift();
        }
        satellite.trail.push({ x: satellite.x, y: satellite.y, z: satellite.z });
    }

    project3D(x, y, z) {
        // Apply rotation
        const cosR = Math.cos(this.rotation);
        const sinR = Math.sin(this.rotation);
        const cosT = Math.cos(this.tilt);
        const sinT = Math.sin(this.tilt);

        // Rotate around Y axis
        let x1 = x * cosR - z * sinR;
        let z1 = x * sinR + z * cosR;

        // Rotate around X axis (tilt)
        let y1 = y * cosT - z1 * sinT;
        let z2 = y * sinT + z1 * cosT;

        // Project to 2D
        const scale = this.zoom;
        const screenX = this.width / 2 + x1 * scale;
        const screenY = this.height / 2 - y1 * scale;

        return { x: screenX, y: screenY, z: z2 };
    }

    drawOrbit(planet) {
        if (!this.showOrbits || planet.name === 'Sun') return;

        this.ctx.strokeStyle = planet.color;
        this.ctx.globalAlpha = 0.3;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();

        const points = 100;
        for (let i = 0; i <= points; i++) {
            const angle = (i / points) * 2 * Math.PI;
            const r = planet.a * (1 - planet.e * planet.e) / (1 + planet.e * Math.cos(angle));
            const x = r * Math.cos(angle);
            const y = r * Math.sin(angle);

            const projected = this.project3D(x, y, 0);

            if (i === 0) {
                this.ctx.moveTo(projected.x, projected.y);
            } else {
                this.ctx.lineTo(projected.x, projected.y);
            }
        }

        this.ctx.stroke();
        this.ctx.globalAlpha = 1;
    }

    drawPlanet(planet) {
        const pos = this.project3D(planet.x, planet.y, planet.z);

        // Draw trail
        if (planet.trail.length > 1 && this.showOrbits) {
            this.ctx.strokeStyle = planet.color;
            this.ctx.globalAlpha = 0.5;
            this.ctx.lineWidth = 1.5;
            this.ctx.beginPath();

            planet.trail.forEach((point, i) => {
                const p = this.project3D(point.x, point.y, point.z);
                if (i === 0) {
                    this.ctx.moveTo(p.x, p.y);
                } else {
                    this.ctx.lineTo(p.x, p.y);
                }
            });

            this.ctx.stroke();
            this.ctx.globalAlpha = 1;
        }

        // Draw planet with glow
        const gradient = this.ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, planet.size * 2);
        gradient.addColorStop(0, planet.color);
        gradient.addColorStop(0.5, planet.color + '80');
        gradient.addColorStop(1, planet.color + '00');

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, planet.size * 2, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw solid planet
        this.ctx.fillStyle = planet.color;
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, planet.size, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw label
        if (this.showLabels) {
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '12px Inter, sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(planet.name, pos.x, pos.y + planet.size + 15);
        }
    }

    drawSatellite(satellite) {
        const pos = this.project3D(satellite.x, satellite.y, satellite.z);

        // Draw trail (thinner and shorter for satellites)
        if (satellite.trail.length > 1 && this.showOrbits) {
            this.ctx.strokeStyle = satellite.color;
            this.ctx.globalAlpha = 0.4;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();

            satellite.trail.forEach((point, i) => {
                const p = this.project3D(point.x, point.y, point.z);
                if (i === 0) {
                    this.ctx.moveTo(p.x, p.y);
                } else {
                    this.ctx.lineTo(p.x, p.y);
                }
            });

            this.ctx.stroke();
            this.ctx.globalAlpha = 1;
        }

        // Draw satellite with pulsing glow
        const pulseSize = satellite.size + Math.sin(Date.now() / 200) * 0.5;
        const gradient = this.ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, pulseSize * 2);
        gradient.addColorStop(0, satellite.color);
        gradient.addColorStop(0.5, satellite.color + 'AA');
        gradient.addColorStop(1, satellite.color + '00');

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, pulseSize * 2, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw solid satellite (smaller than planets)
        this.ctx.fillStyle = satellite.color;
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, satellite.size, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw icon and label
        if (this.showLabels) {
            // Icon
            this.ctx.font = '14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(satellite.icon, pos.x, pos.y - satellite.size - 8);

            // Name
            this.ctx.fillStyle = satellite.color;
            this.ctx.font = 'bold 10px Inter, sans-serif';
            this.ctx.fillText(satellite.name, pos.x, pos.y + satellite.size + 12);
        }
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(10, 14, 39, 0.8)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw stars background
        this.drawStars();

        // Update planet positions
        this.planets.forEach(planet => {
            this.computePlanetPosition(planet, this.daysElapsed);
        });

        // Update satellite positions
        if (this.showSatellites) {
            this.satellites.forEach(satellite => {
                this.computeSatellitePosition(satellite, this.daysElapsed);
            });
        }

        // Draw orbits
        this.planets.forEach(planet => {
            this.drawOrbit(planet);
        });

        // Combine planets and satellites for depth sorting
        const allObjects = [...this.planets];
        if (this.showSatellites) {
            allObjects.push(...this.satellites);
        }

        // Sort all objects by z-depth for proper rendering
        const sortedObjects = allObjects.sort((a, b) => {
            const posA = this.project3D(a.x, a.y, a.z);
            const posB = this.project3D(b.x, b.y, b.z);
            return posB.z - posA.z;
        });

        // Draw all objects
        sortedObjects.forEach(obj => {
            if (this.planets.includes(obj)) {
                this.drawPlanet(obj);
            } else if (this.showSatellites) {
                this.drawSatellite(obj);
            }
        });

        // Draw quantum mode overlay if active
        if (window.quantumMode && window.quantumMode.isActive) {
            window.quantumMode.draw(this.ctx, this.width, this.height, this.project3D.bind(this));
        }
    }

    drawStars() {
        this.ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 100; i++) {
            const x = (i * 123.456) % this.width;
            const y = (i * 789.012) % this.height;
            const size = Math.random() * 1.5;
            this.ctx.globalAlpha = Math.random() * 0.5 + 0.3;
            this.ctx.fillRect(x, y, size, size);
        }
        this.ctx.globalAlpha = 1;
    }

    animate() {
        if (this.isAnimating) {
            this.daysElapsed += 0.5 * this.animationSpeed;
        }

        this.draw();

        // Update FPS
        const now = performance.now();
        this.fps = Math.round(1000 / (now - this.lastFrameTime));
        this.lastFrameTime = now;

        // Update UI
        document.getElementById('daysElapsed').textContent = Math.round(this.daysElapsed);
        document.getElementById('fps').textContent = `${this.fps} FPS`;

        requestAnimationFrame(() => this.animate());
    }

    updatePlanetInfo() {
        const container = document.getElementById('planetInfo');
        container.innerHTML = '';

        // Add planets
        this.planets.forEach((planet, index) => {
            if (planet.name === 'Sun') return;

            const item = document.createElement('div');
            item.className = 'planet-item';
            item.innerHTML = `
                <div class="planet-header">
                    <div class="planet-color" style="background-color: ${planet.color}"></div>
                    <div class="planet-name">${planet.name}</div>
                </div>
                <div class="planet-details">
                    <div class="planet-detail">
                        <span class="label">Semi-major axis:</span>
                        <span class="value">${planet.a.toFixed(3)} AU</span>
                    </div>
                    <div class="planet-detail">
                        <span class="label">Eccentricity:</span>
                        <span class="value">${planet.e.toFixed(4)}</span>
                    </div>
                    <div class="planet-detail">
                        <span class="label">Inclination:</span>
                        <span class="value">${planet.i.toFixed(2)}°</span>
                    </div>
                </div>
            `;

            item.addEventListener('click', () => {
                document.querySelectorAll('.planet-item').forEach(el => el.classList.remove('active'));
                item.classList.add('active');
            });

            container.appendChild(item);
        });

        // Add satellites section
        if (this.satellites.length > 0) {
            const satelliteHeader = document.createElement('div');
            satelliteHeader.style.cssText = 'margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(0, 212, 255, 0.2);';
            satelliteHeader.innerHTML = '<h3 style="font-family: Orbitron, monospace; color: #00FF88; font-size: 1.2rem; margin-bottom: 12px;">🛰️ Artificial Satellites</h3>';
            container.appendChild(satelliteHeader);

            this.satellites.forEach((satellite) => {
                const item = document.createElement('div');
                item.className = 'planet-item satellite-item';
                item.innerHTML = `
                    <div class="planet-header">
                        <div class="planet-color" style="background-color: ${satellite.color}"></div>
                        <div class="planet-name">${satellite.icon} ${satellite.name}</div>
                    </div>
                    <div class="planet-details">
                        <div class="planet-detail">
                            <span class="label">Type:</span>
                            <span class="value">${satellite.type}</span>
                        </div>
                        <div class="planet-detail">
                            <span class="label">Altitude:</span>
                            <span class="value">${satellite.altitude.toLocaleString()} km</span>
                        </div>
                        <div class="planet-detail">
                            <span class="label">Orbital Period:</span>
                            <span class="value">${satellite.period.toFixed(1)} min</span>
                        </div>
                        <div class="planet-detail">
                            <span class="label">Inclination:</span>
                            <span class="value">${satellite.inclination}°</span>
                        </div>
                    </div>
                `;

                item.addEventListener('click', () => {
                    document.querySelectorAll('.planet-item').forEach(el => el.classList.remove('active'));
                    item.classList.add('active');
                });

                container.appendChild(item);
            });
        }
    }

    setupEventListeners() {
        // Speed control
        const speedSlider = document.getElementById('speedSlider');
        const speedValue = document.getElementById('speedValue');
        speedSlider.addEventListener('input', (e) => {
            this.animationSpeed = parseFloat(e.target.value);
            speedValue.textContent = `${this.animationSpeed}x`;
        });

        // Zoom control
        const zoomSlider = document.getElementById('zoomSlider');
        const zoomValue = document.getElementById('zoomValue');
        zoomSlider.addEventListener('input', (e) => {
            this.zoom = parseFloat(e.target.value);
            zoomValue.textContent = `${this.zoom}%`;
        });

        // Animation toggle
        const toggleBtn = document.getElementById('toggleAnimation');
        toggleBtn.addEventListener('click', () => {
            this.isAnimating = !this.isAnimating;
            toggleBtn.innerHTML = this.isAnimating
                ? '<span class="btn-icon">⏸️</span> Pause'
                : '<span class="btn-icon">▶️</span> Play';
        });

        // Reset view
        document.getElementById('resetView').addEventListener('click', () => {
            this.rotation = 0;
            this.tilt = 0.3;
            this.zoom = 150;
            this.daysElapsed = 0;
            zoomSlider.value = 150;
            zoomValue.textContent = '150%';
            this.planets.forEach(p => p.trail = []);
            this.satellites.forEach(s => s.trail = []);
        });

        // Show orbits toggle
        document.getElementById('showOrbits').addEventListener('change', (e) => {
            this.showOrbits = e.target.checked;
        });

        // Show labels toggle
        document.getElementById('showLabels').addEventListener('change', (e) => {
            this.showLabels = e.target.checked;
        });

        // Show satellites toggle
        document.getElementById('showSatellites').addEventListener('change', (e) => {
            this.showSatellites = e.target.checked;
        });

        // Mouse controls for rotation
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                const dx = e.clientX - this.lastMouseX;
                const dy = e.clientY - this.lastMouseY;

                this.rotation += dx * 0.01;
                this.tilt += dy * 0.01;

                // Clamp tilt
                this.tilt = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.tilt));

                this.lastMouseX = e.clientX;
                this.lastMouseY = e.clientY;
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.isDragging = false;
        });

        // Wheel zoom
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.zoom += e.deltaY * -0.1;
            this.zoom = Math.max(50, Math.min(300, this.zoom));
            zoomSlider.value = this.zoom;
            zoomValue.textContent = `${Math.round(this.zoom)}%`;
        });

        // Resize handler
        window.addEventListener('resize', () => {
            this.setupCanvas();
        });
    }
}

// Initialize the simulator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.solarSystemSimulator = new SolarSystemSimulator();
});
