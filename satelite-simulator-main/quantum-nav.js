// Quantum Navigation System - Core Engine
// Autonomous Deep Space Navigation via Superposition Prediction

class QuantumNavigationSystem {
    constructor() {
        this.canvas = document.getElementById('quantumCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();

        // System state
        this.quantumMode = true;
        this.systemState = 'READY';
        this.missionStartTime = Date.now();

        // Celestial bodies
        this.planet = {
            x: 0,
            y: 0,
            radius: 30,
            mass: 5.972e24, // Earth-like
            color: '#4A90E2'
        };

        this.target = {
            x: 2.5,
            y: 0,
            radius: 20,
            color: '#E27B58'
        };

        // Satellite
        this.satellite = {
            x: 1.0,
            y: 0,
            vx: 0,
            vy: 0.02,
            radius: 8,
            color: '#00FF88',
            fuel: 100,
            trail: []
        };

        // Quantum predictions (superposition)
        this.predictions = [];
        this.collapsedEnvironment = null;

        // Route candidates
        this.routes = [];
        this.selectedRoute = null;

        // Hazards (asteroids, debris)
        this.hazards = [];
        this.generateHazards();

        // Stats
        this.hazardsAvoided = 0;

        // Physics constants
        this.G = 6.674e-11;
        this.AU = 149597870700;
        this.timeScale = 1;

        // Animation
        this.animationId = null;
        this.autoAnimate = true;

        this.setupEventListeners();
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

    generateHazards() {
        // Generate random hazards in space
        this.hazards = [];
        const numHazards = 15;

        for (let i = 0; i < numHazards; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 0.8 + Math.random() * 2;

            this.hazards.push({
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                radius: 0.05 + Math.random() * 0.1,
                vx: (Math.random() - 0.5) * 0.001,
                vy: (Math.random() - 0.5) * 0.001,
                type: ['asteroid', 'debris', 'radiation'][Math.floor(Math.random() * 3)],
                danger: 0.3 + Math.random() * 0.7
            });
        }
    }

    // QUANTUM PREDICTION MODULE
    generateQuantumPredictions() {
        if (!this.quantumMode) return;

        this.systemState = 'GENERATING_SUPERPOSITION';
        this.updateUI();

        // Generate multiple possible environment states (superposition)
        this.predictions = [
            {
                id: 1,
                name: 'Clear Path',
                description: 'No hazards detected in trajectory',
                probability: 0.35,
                hazardShift: { x: 0, y: 0 },
                radiationLevel: 0.1,
                debrisField: false
            },
            {
                id: 2,
                name: 'Asteroid Drift Left',
                description: 'Asteroids shifting counter-clockwise',
                probability: 0.25,
                hazardShift: { x: -0.1, y: 0.05 },
                radiationLevel: 0.3,
                debrisField: false
            },
            {
                id: 3,
                name: 'Asteroid Drift Right',
                description: 'Asteroids shifting clockwise',
                probability: 0.20,
                hazardShift: { x: 0.1, y: -0.05 },
                radiationLevel: 0.3,
                debrisField: false
            },
            {
                id: 4,
                name: 'Radiation Spike',
                description: 'High radiation zone detected',
                probability: 0.12,
                hazardShift: { x: 0, y: 0 },
                radiationLevel: 0.9,
                debrisField: false
            },
            {
                id: 5,
                name: 'Debris Field',
                description: 'Dense debris cluster ahead',
                probability: 0.08,
                hazardShift: { x: 0.05, y: 0.05 },
                radiationLevel: 0.4,
                debrisField: true
            }
        ];

        this.systemState = 'SUPERPOSITION_ACTIVE';
        this.updateUI();
        this.displayPredictions();

        // Enable collapse button
        document.getElementById('collapseEnvironment').disabled = false;
    }

    collapseEnvironment() {
        if (this.predictions.length === 0) return;

        this.systemState = 'COLLAPSING_WAVEFUNCTION';
        this.updateUI();

        // Weighted random selection based on probabilities
        const rand = Math.random();
        let cumulative = 0;

        for (const pred of this.predictions) {
            cumulative += pred.probability;
            if (rand <= cumulative) {
                this.collapsedEnvironment = pred;
                break;
            }
        }

        // Apply environment changes
        this.applyEnvironment(this.collapsedEnvironment);

        this.systemState = 'ENVIRONMENT_LOCKED';
        this.updateUI();
        this.displayPredictions();

        // Enable route generation
        document.getElementById('generateRoutes').disabled = false;
        document.getElementById('collapseEnvironment').disabled = true;
    }

    applyEnvironment(env) {
        // Apply hazard shifts based on predicted environment
        this.hazards.forEach(h => {
            h.x += env.hazardShift.x;
            h.y += env.hazardShift.y;
        });

        if (env.debrisField) {
            // Add extra debris
            for (let i = 0; i < 5; i++) {
                const angle = Math.random() * Math.PI * 2;
                const distance = 1.2 + Math.random() * 0.8;
                this.hazards.push({
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance,
                    radius: 0.03 + Math.random() * 0.05,
                    vx: (Math.random() - 0.5) * 0.001,
                    vy: (Math.random() - 0.5) * 0.001,
                    type: 'debris',
                    danger: 0.5
                });
            }
        }
    }

    // ROUTE GENERATION MODULE
    generateRoutes() {
        if (!this.collapsedEnvironment) return;

        this.systemState = 'CALCULATING_ROUTES';
        this.updateUI();

        const start = { x: this.satellite.x, y: this.satellite.y };
        const end = { x: this.target.x, y: this.target.y };

        // Generate multiple route candidates
        this.routes = [
            this.calculateFastestRoute(start, end),
            this.calculateSafestRoute(start, end),
            this.calculateLowestFuelRoute(start, end),
            this.calculateEmergencyRoute(start, end)
        ];

        this.systemState = 'ROUTES_READY';
        this.updateUI();
        this.displayRoutes();

        // Enable route collapse
        document.getElementById('collapseRoute').disabled = false;
        document.getElementById('generateRoutes').disabled = true;
    }

    calculateFastestRoute(start, end) {
        // Direct path with minimal waypoints
        const waypoints = [
            { x: start.x, y: start.y },
            { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 },
            { x: end.x, y: end.y }
        ];

        return {
            id: 1,
            name: 'Fastest Route',
            type: 'speed',
            waypoints: waypoints,
            fuelCost: 45,
            timeEstimate: 120,
            safetyScore: 0.6,
            totalScore: 0.75
        };
    }

    calculateSafestRoute(start, end) {
        // Path avoiding all hazards
        const waypoints = [
            { x: start.x, y: start.y },
            { x: start.x - 0.5, y: start.y + 0.8 },
            { x: end.x - 0.3, y: end.y + 0.5 },
            { x: end.x, y: end.y }
        ];

        return {
            id: 2,
            name: 'Safest Route',
            type: 'safety',
            waypoints: waypoints,
            fuelCost: 65,
            timeEstimate: 200,
            safetyScore: 0.95,
            totalScore: 0.85
        };
    }

    calculateLowestFuelRoute(start, end) {
        // Gravity-assist trajectory
        const waypoints = [
            { x: start.x, y: start.y },
            { x: 0.3, y: 0.5 },
            { x: 1.5, y: 0.2 },
            { x: end.x, y: end.y }
        ];

        return {
            id: 3,
            name: 'Lowest Fuel',
            type: 'efficiency',
            waypoints: waypoints,
            fuelCost: 30,
            timeEstimate: 250,
            safetyScore: 0.7,
            totalScore: 0.70
        };
    }

    calculateEmergencyRoute(start, end) {
        // Balanced approach
        const waypoints = [
            { x: start.x, y: start.y },
            { x: start.x + 0.5, y: start.y - 0.3 },
            { x: end.x - 0.5, y: end.y - 0.2 },
            { x: end.x, y: end.y }
        ];

        return {
            id: 4,
            name: 'Emergency Avoidance',
            type: 'balanced',
            waypoints: waypoints,
            fuelCost: 50,
            timeEstimate: 160,
            safetyScore: 0.8,
            totalScore: 0.78
        };
    }

    collapseRoute() {
        if (this.routes.length === 0) return;

        this.systemState = 'SELECTING_OPTIMAL_PATH';
        this.updateUI();

        // Select route with highest total score
        this.selectedRoute = this.routes.reduce((best, route) =>
            route.totalScore > best.totalScore ? route : best
        );

        this.systemState = 'PATH_LOCKED';
        this.updateUI();
        this.displayRoutes();

        // Enable navigation
        document.getElementById('executeNavigation').disabled = false;
        document.getElementById('collapseRoute').disabled = true;
    }

    executeNavigation() {
        if (!this.selectedRoute) return;

        this.systemState = 'NAVIGATING';
        this.updateUI();

        // Start autonomous navigation along selected route
        this.navigateAlongRoute();

        document.getElementById('executeNavigation').disabled = true;
    }

    navigateAlongRoute() {
        // Implement autonomous navigation with smooth movement
        const waypoints = this.selectedRoute.waypoints;
        let currentWaypoint = 1;

        // Disable orbital physics during navigation
        this.autoAnimate = false;

        const navigate = () => {
            if (currentWaypoint >= waypoints.length) {
                this.systemState = 'MISSION_COMPLETE';
                this.updateUI();
                this.autoAnimate = true; // Re-enable physics
                return;
            }

            const target = waypoints[currentWaypoint];
            const dx = target.x - this.satellite.x;
            const dy = target.y - this.satellite.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 0.05) {
                currentWaypoint++;
                if (currentWaypoint < waypoints.length) {
                    setTimeout(navigate, 100);
                } else {
                    this.systemState = 'MISSION_COMPLETE';
                    this.updateUI();
                    this.autoAnimate = true; // Re-enable physics
                }
                return;
            }

            // Smooth movement directly towards waypoint
            const speed = 0.008;
            this.satellite.x += (dx / dist) * speed;
            this.satellite.y += (dy / dist) * speed;

            // Update velocity for display
            this.satellite.vx = (dx / dist) * speed;
            this.satellite.vy = (dy / dist) * speed;

            // Consume fuel
            this.satellite.fuel = Math.max(0, this.satellite.fuel - 0.05);

            // Update trail
            if (this.satellite.trail.length > 100) {
                this.satellite.trail.shift();
            }
            this.satellite.trail.push({ x: this.satellite.x, y: this.satellite.y });

            setTimeout(navigate, 30);
        };

        navigate();
    }

    // PHYSICS & ORBITAL MECHANICS
    updatePhysics(dt) {
        if (!this.autoAnimate) return;

        // Update satellite position
        this.satellite.x += this.satellite.vx * dt;
        this.satellite.y += this.satellite.vy * dt;

        // Gravitational force from planet
        const dx = this.planet.x - this.satellite.x;
        const dy = this.planet.y - this.satellite.y;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);

        if (dist > 0.01) {
            const force = 0.001 / distSq;
            this.satellite.vx += (dx / dist) * force * dt;
            this.satellite.vy += (dy / dist) * force * dt;
        }

        // Update hazards
        this.hazards.forEach(h => {
            h.x += h.vx * dt;
            h.y += h.vy * dt;
        });

        // Store trail
        if (this.satellite.trail.length > 100) {
            this.satellite.trail.shift();
        }
        this.satellite.trail.push({ x: this.satellite.x, y: this.satellite.y });

        // Check hazard collisions
        this.checkHazardCollisions();
    }

    checkHazardCollisions() {
        this.hazards.forEach(h => {
            const dx = this.satellite.x - h.x;
            const dy = this.satellite.y - h.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < h.radius + 0.05) {
                // Hazard avoided if we predicted it
                if (this.collapsedEnvironment) {
                    this.hazardsAvoided++;
                }
            }
        });
    }

    // RENDERING
    project(x, y) {
        const scale = Math.min(this.width, this.height) / 6;
        return {
            x: this.width / 2 + x * scale,
            y: this.height / 2 - y * scale
        };
    }

    draw() {
        // Clear with pure black
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw stars
        this.drawStars();

        // Draw prediction halos (if in superposition)
        if (document.getElementById('showPredictions').checked && this.predictions.length > 0 && !this.collapsedEnvironment) {
            this.drawPredictionHalos();
        }

        // Draw hazards
        if (document.getElementById('showHazards').checked) {
            this.drawHazards();
        }

        // Draw route candidates
        if (document.getElementById('showRoutes').checked && this.routes.length > 0) {
            this.drawRoutes();
        }

        // Draw selected route (white glow)
        if (this.selectedRoute) {
            this.drawSelectedRoute();
        }

        // Draw target planet
        this.drawPlanet(this.target, 'Target');

        // Draw central planet
        this.drawPlanet(this.planet, 'Origin');

        // Draw satellite trail
        this.drawSatelliteTrail();

        // Draw satellite
        this.drawSatellite();
    }

    drawStars() {
        this.ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 200; i++) {
            const x = (i * 123.456) % this.width;
            const y = (i * 789.012) % this.height;
            const size = Math.random() * 1.5;
            this.ctx.globalAlpha = Math.random() * 0.5 + 0.2;
            this.ctx.fillRect(x, y, size, size);
        }
        this.ctx.globalAlpha = 1;
    }

    drawPredictionHalos() {
        this.predictions.forEach((pred, i) => {
            const pos = this.project(this.satellite.x, this.satellite.y);
            const radius = 80 + i * 30;

            const gradient = this.ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius);
            gradient.addColorStop(0, 'rgba(168, 85, 247, 0)');
            gradient.addColorStop(0.7, `rgba(168, 85, 247, ${pred.probability * 0.3})`);
            gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    drawHazards() {
        this.hazards.forEach(h => {
            const pos = this.project(h.x, h.y);
            const scale = Math.min(this.width, this.height) / 6;
            const r = h.radius * scale;

            // Glow
            const gradient = this.ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, r * 2);
            gradient.addColorStop(0, h.type === 'radiation' ? '#ef4444' : '#f59e0b');
            gradient.addColorStop(0.5, h.type === 'radiation' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(pos.x, pos.y, r * 2, 0, Math.PI * 2);
            this.ctx.fill();

            // Core
            this.ctx.fillStyle = h.type === 'radiation' ? '#ef4444' : '#f59e0b';
            this.ctx.beginPath();
            this.ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    drawRoutes() {
        this.routes.forEach((route, i) => {
            // Brighter, more visible colors
            const alpha = route === this.selectedRoute ? 0.9 : 0.6;
            const color = route.type === 'safety' ? '#00FF00' :  // Bright Green
                route.type === 'speed' ? '#00FFFF' :              // Bright Cyan
                    route.type === 'efficiency' ? '#FF00FF' :     // Bright Magenta
                        '#FFFF00';                                  // Bright Yellow

            this.ctx.strokeStyle = color;
            this.ctx.globalAlpha = alpha;
            this.ctx.lineWidth = route === this.selectedRoute ? 4 : 3;
            this.ctx.setLineDash([8, 4]);
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = color;
            this.ctx.beginPath();

            route.waypoints.forEach((wp, j) => {
                const pos = this.project(wp.x, wp.y);
                if (j === 0) {
                    this.ctx.moveTo(pos.x, pos.y);
                } else {
                    this.ctx.lineTo(pos.x, pos.y);
                }
            });

            this.ctx.stroke();
            this.ctx.setLineDash([]);
            this.ctx.shadowBlur = 0;
            this.ctx.globalAlpha = 1;
        });
    }

    drawSelectedRoute() {
        if (!this.selectedRoute) return;

        this.ctx.strokeStyle = '#ffffff';
        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = '#ffffff';
        this.ctx.globalAlpha = 0.8;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();

        this.selectedRoute.waypoints.forEach((wp, j) => {
            const pos = this.project(wp.x, wp.y);
            if (j === 0) {
                this.ctx.moveTo(pos.x, pos.y);
            } else {
                this.ctx.lineTo(pos.x, pos.y);
            }
        });

        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
        this.ctx.globalAlpha = 1;
    }

    drawPlanet(planet, label) {
        const pos = this.project(planet.x, planet.y);

        // Glow
        const gradient = this.ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, planet.radius * 2);
        gradient.addColorStop(0, planet.color);
        gradient.addColorStop(0.5, planet.color + '80');
        gradient.addColorStop(1, planet.color + '00');

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, planet.radius * 2, 0, Math.PI * 2);
        this.ctx.fill();

        // Planet
        this.ctx.fillStyle = planet.color;
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, planet.radius, 0, Math.PI * 2);
        this.ctx.fill();

        // Label
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '14px Orbitron';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(label, pos.x, pos.y + planet.radius + 20);
    }

    drawSatelliteTrail() {
        if (this.satellite.trail.length < 2) return;

        this.ctx.strokeStyle = '#00FF88';
        this.ctx.globalAlpha = 0.3;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();

        this.satellite.trail.forEach((point, i) => {
            const pos = this.project(point.x, point.y);
            if (i === 0) {
                this.ctx.moveTo(pos.x, pos.y);
            } else {
                this.ctx.lineTo(pos.x, pos.y);
            }
        });

        this.ctx.stroke();
        this.ctx.globalAlpha = 1;
    }

    drawSatellite() {
        const pos = this.project(this.satellite.x, this.satellite.y);

        // Pulsing glow
        const pulse = Math.sin(Date.now() / 200) * 0.3 + 0.7;
        const gradient = this.ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, this.satellite.radius * 3);
        gradient.addColorStop(0, this.satellite.color);
        gradient.addColorStop(0.5, `rgba(0, 255, 136, ${pulse * 0.5})`);
        gradient.addColorStop(1, 'rgba(0, 255, 136, 0)');

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, this.satellite.radius * 3, 0, Math.PI * 2);
        this.ctx.fill();

        // Satellite
        this.ctx.fillStyle = this.satellite.color;
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, this.satellite.radius, 0, Math.PI * 2);
        this.ctx.fill();

        // Icon
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🛸', pos.x, pos.y + 5);
    }

    animate() {
        this.updatePhysics(1);
        this.draw();
        this.updateTelemetry();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    // UI UPDATES
    updateUI() {
        document.getElementById('systemState').textContent = this.systemState;
        document.getElementById('predictionCount').textContent = this.predictions.length;
    }

    updateTelemetry() {
        document.getElementById('satPosition').textContent =
            `X: ${this.satellite.x.toFixed(2)}, Y: ${this.satellite.y.toFixed(2)}`;

        const vel = Math.sqrt(this.satellite.vx ** 2 + this.satellite.vy ** 2);
        document.getElementById('satVelocity').textContent = `${(vel * 1000).toFixed(2)} km/s`;

        const dx = this.target.x - this.satellite.x;
        const dy = this.target.y - this.satellite.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        document.getElementById('targetDistance').textContent = `${dist.toFixed(3)} AU`;

        const altitude = Math.sqrt(this.satellite.x ** 2 + this.satellite.y ** 2);
        document.getElementById('altitude').textContent = `${(altitude * 149597870).toFixed(0)} km`;

        document.getElementById('fuelPercent').textContent = `${this.satellite.fuel.toFixed(1)}%`;
        document.getElementById('fuelLevel').style.width = `${this.satellite.fuel}%`;

        if (this.collapsedEnvironment) {
            document.getElementById('accuracy').textContent =
                `${(this.collapsedEnvironment.probability * 100).toFixed(1)}%`;
        }

        document.getElementById('hazardsAvoided').textContent = this.hazardsAvoided;

        const elapsed = Math.floor((Date.now() - this.missionStartTime) / 1000);
        const mins = Math.floor(elapsed / 60);
        const secs = elapsed % 60;
        document.getElementById('missionTime').textContent =
            `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    displayPredictions() {
        const container = document.getElementById('predictionsList');
        container.innerHTML = '';

        if (this.predictions.length === 0) {
            container.innerHTML = '<p class="empty-state">No predictions generated</p>';
            return;
        }

        this.predictions.forEach(pred => {
            const item = document.createElement('div');
            item.className = 'prediction-item';
            if (this.collapsedEnvironment && pred.id === this.collapsedEnvironment.id) {
                item.classList.add('selected');
            }

            item.innerHTML = `
                <div class="prediction-header">
                    <span class="prediction-name">${pred.name}</span>
                    <span class="prediction-prob">${(pred.probability * 100).toFixed(1)}%</span>
                </div>
                <div class="prediction-desc">${pred.description}</div>
            `;

            container.appendChild(item);
        });
    }

    displayRoutes() {
        const container = document.getElementById('routesList');
        container.innerHTML = '';

        if (this.routes.length === 0) {
            container.innerHTML = '<p class="empty-state">No routes calculated</p>';
            return;
        }

        this.routes.forEach(route => {
            const item = document.createElement('div');
            item.className = 'route-item';
            if (this.selectedRoute && route.id === this.selectedRoute.id) {
                item.classList.add('selected');
            }

            item.innerHTML = `
                <div class="route-header">
                    <span class="route-name">${route.name}</span>
                    <span class="route-score">${(route.totalScore * 100).toFixed(0)}/100</span>
                </div>
                <div class="route-desc">
                    Fuel: ${route.fuelCost}% | Time: ${route.timeEstimate}s | Safety: ${(route.safetyScore * 100).toFixed(0)}%
                </div>
            `;

            container.appendChild(item);
        });
    }

    reset() {
        // Reset system
        this.satellite.x = 1.0;
        this.satellite.y = 0;
        this.satellite.vx = 0;
        this.satellite.vy = 0.02;
        this.satellite.fuel = 100;
        this.satellite.trail = [];

        this.predictions = [];
        this.collapsedEnvironment = null;
        this.routes = [];
        this.selectedRoute = null;
        this.hazardsAvoided = 0;
        this.systemState = 'READY';

        this.generateHazards();

        document.getElementById('generatePredictions').disabled = false;
        document.getElementById('collapseEnvironment').disabled = true;
        document.getElementById('generateRoutes').disabled = true;
        document.getElementById('collapseRoute').disabled = true;
        document.getElementById('executeNavigation').disabled = true;

        this.updateUI();
        this.displayPredictions();
        this.displayRoutes();
    }

    setupEventListeners() {
        // Quantum mode toggle
        document.getElementById('quantumMode').addEventListener('change', (e) => {
            this.quantumMode = e.target.checked;
            document.querySelector('.mode-label').textContent =
                e.target.checked ? 'Quantum Mode Active' : 'Classical Mode';
        });

        // Control buttons
        document.getElementById('generatePredictions').addEventListener('click', () => {
            this.generateQuantumPredictions();
        });

        document.getElementById('collapseEnvironment').addEventListener('click', () => {
            this.collapseEnvironment();
        });

        document.getElementById('generateRoutes').addEventListener('click', () => {
            this.generateRoutes();
        });

        document.getElementById('collapseRoute').addEventListener('click', () => {
            this.collapseRoute();
        });

        document.getElementById('executeNavigation').addEventListener('click', () => {
            this.executeNavigation();
        });

        document.getElementById('resetSystem').addEventListener('click', () => {
            this.reset();
        });

        // Settings
        document.getElementById('autoAnimate').addEventListener('change', (e) => {
            this.autoAnimate = e.target.checked;
        });

        // Resize
        window.addEventListener('resize', () => {
            this.setupCanvas();
        });
    }
}

// Initialize system
document.addEventListener('DOMContentLoaded', () => {
    new QuantumNavigationSystem();
});
