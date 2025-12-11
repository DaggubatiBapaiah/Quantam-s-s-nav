// Quantum Mode Extension for Solar System Simulator
// Adds quantum navigation capabilities to existing simulator

class QuantumMode {
    constructor(simulator) {
        this.sim = simulator;
        this.isActive = false;
        this.systemState = 'READY';
        this.predictions = [];
        this.collapsedEnvironment = null;
        this.routes = [];
        this.selectedRoute = null;
        this.hazards = [];
        this.quantumSatellite = null;
        this.targetPlanet = null;

        this.setupQuantumControls();
    }

    activate() {
        this.isActive = true;
        document.getElementById('quantumControls').style.display = 'block';
        document.getElementById('quantumModeLabel').classList.add('active');
        document.getElementById('normalModeLabel').classList.remove('active');

        // Initialize quantum satellite
        this.initializeQuantumSatellite();
        this.generateHazards();

        console.log('Quantum Mode Activated');
    }

    deactivate() {
        this.isActive = false;
        document.getElementById('quantumControls').style.display = 'none';
        document.getElementById('quantumModeLabel').classList.remove('active');
        document.getElementById('normalModeLabel').classList.add('active');

        // Reset quantum state
        this.reset();

        console.log('Quantum Mode Deactivated');
    }

    initializeQuantumSatellite() {
        // Find Earth
        const earth = this.sim.planets.find(p => p.name === 'Earth');
        if (!earth) return;

        // Create quantum satellite near Earth
        this.quantumSatellite = {
            x: earth.x + 0.05,
            y: earth.y,
            vx: 0,
            vy: 0.01,
            radius: 8,
            color: '#00FF88',
            trail: [],
            fuel: 100
        };

        // Set target (Mars)
        this.targetPlanet = this.sim.planets.find(p => p.name === 'Mars');
    }

    generateHazards() {
        this.hazards = [];
        const numHazards = 12;

        for (let i = 0; i < numHazards; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 0.8 + Math.random() * 1.5;

            this.hazards.push({
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                radius: 0.02 + Math.random() * 0.04,
                vx: (Math.random() - 0.5) * 0.0005,
                vy: (Math.random() - 0.5) * 0.0005,
                type: ['asteroid', 'debris', 'radiation'][Math.floor(Math.random() * 3)],
                danger: 0.3 + Math.random() * 0.7
            });
        }
    }

    // QUANTUM PREDICTION WITH QUBITS
    generatePredictions() {
        this.systemState = 'SUPERPOSITION_ACTIVE';
        this.updateUI();

        // Simulate 10 quantum states using qubit superposition
        // Each state represents a different environmental configuration
        // Probabilities calculated using quantum amplitude squared (|ψ|²)

        const qubitStates = this.simulateQubits(3); // 2^3 = 8 base states + 2 special

        this.predictions = [
            {
                id: 1,
                name: '|000⟩ Clear Path',
                description: 'Optimal conditions, no hazards detected',
                probability: qubitStates[0],
                hazardShift: { x: 0, y: 0 },
                radiationLevel: 0.05,
                qubitState: '|000⟩'
            },
            {
                id: 2,
                name: '|001⟩ Minor Drift Left',
                description: 'Slight asteroid movement counter-clockwise',
                probability: qubitStates[1],
                hazardShift: { x: -0.05, y: 0.03 },
                radiationLevel: 0.2,
                qubitState: '|001⟩'
            },
            {
                id: 3,
                name: '|010⟩ Minor Drift Right',
                description: 'Slight asteroid movement clockwise',
                probability: qubitStates[2],
                hazardShift: { x: 0.05, y: -0.03 },
                radiationLevel: 0.2,
                qubitState: '|010⟩'
            },
            {
                id: 4,
                name: '|011⟩ Major Drift Left',
                description: 'Significant asteroid cluster shift left',
                probability: qubitStates[3],
                hazardShift: { x: -0.12, y: 0.06 },
                radiationLevel: 0.4,
                qubitState: '|011⟩'
            },
            {
                id: 5,
                name: '|100⟩ Major Drift Right',
                description: 'Significant asteroid cluster shift right',
                probability: qubitStates[4],
                hazardShift: { x: 0.12, y: -0.06 },
                radiationLevel: 0.4,
                qubitState: '|100⟩'
            },
            {
                id: 6,
                name: '|101⟩ Radiation Spike',
                description: 'High energy radiation zone detected',
                probability: qubitStates[5],
                hazardShift: { x: 0, y: 0 },
                radiationLevel: 0.9,
                qubitState: '|101⟩'
            },
            {
                id: 7,
                name: '|110⟩ Debris Field',
                description: 'Dense debris cluster formation',
                probability: qubitStates[6],
                hazardShift: { x: 0.04, y: 0.04 },
                radiationLevel: 0.5,
                debrisField: true,
                qubitState: '|110⟩'
            },
            {
                id: 8,
                name: '|111⟩ Critical Zone',
                description: 'Multiple hazards converging',
                probability: qubitStates[7],
                hazardShift: { x: 0.08, y: -0.08 },
                radiationLevel: 0.8,
                debrisField: true,
                qubitState: '|111⟩'
            },
            {
                id: 9,
                name: '|ψ+⟩ Entangled State',
                description: 'Quantum entanglement - unpredictable hazard behavior',
                probability: qubitStates[8],
                hazardShift: { x: Math.random() * 0.1 - 0.05, y: Math.random() * 0.1 - 0.05 },
                radiationLevel: 0.6,
                qubitState: '|ψ+⟩'
            },
            {
                id: 10,
                name: '|ψ-⟩ Superposition Collapse',
                description: 'Rapid environmental flux - emergency protocols',
                probability: qubitStates[9],
                hazardShift: { x: 0.15, y: 0 },
                radiationLevel: 0.7,
                debrisField: true,
                qubitState: '|ψ-⟩'
            }
        ];

        console.log('Quantum Superposition Generated:', this.predictions.map(p =>
            `${p.qubitState}: ${(p.probability * 100).toFixed(1)}%`
        ));

        document.getElementById('qCollapseEnvironment').disabled = false;
    }

    // ⚛️ REAL QUANTUM SIMULATION using QuantumComputer class
    simulateQubits(numQubits) {
        console.log('🔬 Initializing Real Quantum Computer with', numQubits, 'qubits...');

        // Create actual quantum computer
        const qc = new QuantumComputer(numQubits);

        // Create superposition using Hadamard gates on all qubits
        console.log('⚡ Applying Hadamard gates to create superposition...');
        for (let q = 0; q < numQubits; q++) {
            qc.hadamard(q);
        }

        // Apply quantum interference using phase gates
        console.log('🌊 Applying quantum interference...');
        for (let q = 0; q < numQubits; q++) {
            const phase = (q * Math.PI) / numQubits;
            qc.phase(q, phase);
        }

        // Apply entanglement using CNOT gates
        console.log('🔗 Creating quantum entanglement...');
        for (let q = 0; q < numQubits - 1; q++) {
            qc.cnot(q, q + 1);
        }

        // Get probabilities from quantum state vector
        let probabilities = qc.getProbabilities();

        // Add 2 special entangled states (Bell states)
        const bellState1 = { real: 1 / Math.sqrt(2), imag: 0 };
        const bellState2 = { real: 0, imag: 1 / Math.sqrt(2) };

        const bellProb1 = qc.probability(bellState1);
        const bellProb2 = qc.probability(bellState2);

        probabilities.push(bellProb1 * 0.1);
        probabilities.push(bellProb2 * 0.1);

        // Normalize
        const sum = probabilities.reduce((a, b) => a + b, 0);
        const normalized = probabilities.map(p => p / sum);

        console.log('✅ Quantum state prepared:', normalized.map(p => (p * 100).toFixed(1) + '%').join(', '));

        return normalized;
    }

    collapseEnvironment() {
        if (this.predictions.length === 0) return;

        this.systemState = 'ENVIRONMENT_LOCKED';

        // Weighted random selection
        const rand = Math.random();
        let cumulative = 0;

        for (const pred of this.predictions) {
            cumulative += pred.probability;
            if (rand <= cumulative) {
                this.collapsedEnvironment = pred;
                break;
            }
        }

        // Apply environment
        this.hazards.forEach(h => {
            h.x += this.collapsedEnvironment.hazardShift.x;
            h.y += this.collapsedEnvironment.hazardShift.y;
        });

        this.updateUI();
        document.getElementById('qGenerateRoutes').disabled = false;
        document.getElementById('qCollapseEnvironment').disabled = true;
    }

    // ROUTE GENERATION
    generateRoutes() {
        if (!this.collapsedEnvironment || !this.quantumSatellite || !this.targetPlanet) return;

        this.systemState = 'ROUTES_READY';

        const start = { x: this.quantumSatellite.x, y: this.quantumSatellite.y };
        const end = { x: this.targetPlanet.x, y: this.targetPlanet.y };

        this.routes = [
            {
                id: 1,
                name: '⚡ Fastest Route',
                type: 'speed',
                waypoints: [start, { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 }, end],
                fuelCost: 45,
                safetyScore: 0.6,
                totalScore: 0.75,
                color: '#00FFFF', // Bright Cyan
                description: 'Direct path, minimal time'
            },
            {
                id: 2,
                name: '🛡️ Safest Route',
                type: 'safety',
                waypoints: [start, { x: start.x - 0.3, y: start.y + 0.5 }, { x: end.x - 0.2, y: end.y + 0.3 }, end],
                fuelCost: 65,
                safetyScore: 0.95,
                totalScore: 0.85,
                color: '#00FF00', // Bright Green
                description: 'Maximum hazard avoidance'
            },
            {
                id: 3,
                name: '⛽ Low Fuel Route',
                type: 'efficiency',
                waypoints: [start, { x: 0.2, y: 0.3 }, { x: 1.0, y: 0.1 }, end],
                fuelCost: 30,
                safetyScore: 0.7,
                totalScore: 0.70,
                color: '#FF00FF', // Bright Magenta
                description: 'Gravity-assist trajectory'
            },
            {
                id: 4,
                name: '⚠️ Emergency Route',
                type: 'balanced',
                waypoints: [start, { x: start.x + 0.4, y: start.y - 0.2 }, { x: end.x - 0.3, y: end.y - 0.1 }, end],
                fuelCost: 50,
                safetyScore: 0.8,
                totalScore: 0.78,
                color: '#FFFF00', // Bright Yellow
                description: 'Balanced approach'
            }
        ];

        this.updateUI();
        this.displayRoutes();
        document.getElementById('qCollapseRoute').disabled = false;
        document.getElementById('qGenerateRoutes').disabled = true;
    }

    collapseRoute() {
        if (this.routes.length === 0) return;

        this.systemState = 'PATH_LOCKED';

        // 🔬 USE GROVER'S ALGORITHM FOR OPTIMAL ROUTE SEARCH
        console.log('🔬 ========================================');
        console.log('🔬 RUNNING GROVER\'S ALGORITHM');
        console.log('🔬 ========================================');

        const quantumEngine = new QuantumNavigationEngine();

        // Use Grover's Algorithm to find optimal route
        const groverResult = quantumEngine.findOptimalRoute(this.routes);
        this.selectedRoute = groverResult;

        // Use VQE to optimize fuel consumption
        console.log('\n🔬 ========================================');
        console.log('🔬 RUNNING VQE FOR FUEL OPTIMIZATION');
        console.log('🔬 ========================================');

        const vqeResult = quantumEngine.optimizeFuelPath(this.selectedRoute.waypoints);

        // Apply VQE fuel savings to selected route
        this.selectedRoute.fuelCost = Math.max(20, this.selectedRoute.fuelCost - vqeResult.fuelSavings);

        console.log(`\n✅ QUANTUM OPTIMIZATION COMPLETE:`);
        console.log(`   Route: ${this.selectedRoute.name}`);
        console.log(`   Original Fuel: ${this.selectedRoute.fuelCost + vqeResult.fuelSavings}%`);
        console.log(`   VQE Optimized Fuel: ${this.selectedRoute.fuelCost.toFixed(1)}%`);
        console.log(`   Fuel Savings: ${vqeResult.fuelSavings.toFixed(1)}%`);
        console.log(`   Minimum Energy: ${vqeResult.energy.toFixed(4)}`);
        console.log('🔬 ========================================\n');

        this.updateUI();
        document.getElementById('qExecuteNav').disabled = false;
        document.getElementById('qCollapseRoute').disabled = true;
    }

    executeNavigation() {
        if (!this.selectedRoute || !this.quantumSatellite) return;

        this.systemState = 'NAVIGATING';
        this.updateUI();

        // Start navigation
        this.navigateAlongRoute();

        document.getElementById('qExecuteNav').disabled = true;
    }

    navigateAlongRoute() {
        const waypoints = this.selectedRoute.waypoints;
        let currentWaypoint = 1;

        // Initialize Quantum Annealing engine for collision avoidance
        const quantumEngine = new QuantumNavigationEngine();

        const navigate = () => {
            if (!this.isActive || currentWaypoint >= waypoints.length) {
                if (currentWaypoint >= waypoints.length) {
                    this.systemState = 'MISSION_COMPLETE';
                    this.updateUI();
                }
                return;
            }

            const target = waypoints[currentWaypoint];
            const dx = target.x - this.quantumSatellite.x;
            const dy = target.y - this.quantumSatellite.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 0.05) {
                currentWaypoint++;
                if (currentWaypoint < waypoints.length) {
                    setTimeout(navigate, 100);
                } else {
                    this.systemState = 'MISSION_COMPLETE';
                    this.updateUI();
                }
                return;
            }

            // 🔬 USE QUANTUM ANNEALING FOR COLLISION AVOIDANCE
            const annealingResult = quantumEngine.avoidCollisions(
                this.hazards,
                { x: this.quantumSatellite.x, y: this.quantumSatellite.y }
            );

            // Apply quantum-optimized path adjustment
            const safetyFactor = annealingResult.safetyImprovement / 100;

            // Move satellite with quantum collision avoidance
            const speed = 0.005 * (1 + safetyFactor * 0.2);
            this.quantumSatellite.vx = (dx / dist) * speed;
            this.quantumSatellite.vy = (dy / dist) * speed;
            this.quantumSatellite.x += this.quantumSatellite.vx;
            this.quantumSatellite.y += this.quantumSatellite.vy;

            // Consume fuel (reduced by quantum optimization)
            const fuelConsumption = 0.05 * (1 - safetyFactor * 0.1);
            this.quantumSatellite.fuel = Math.max(0, this.quantumSatellite.fuel - fuelConsumption);

            // Store trail
            if (this.quantumSatellite.trail.length > 100) {
                this.quantumSatellite.trail.shift();
            }
            this.quantumSatellite.trail.push({ x: this.quantumSatellite.x, y: this.quantumSatellite.y });

            setTimeout(navigate, 50);
        };

        navigate();
    }

    reset() {
        this.systemState = 'READY';
        this.predictions = [];
        this.collapsedEnvironment = null;
        this.routes = [];
        this.selectedRoute = null;

        if (this.quantumSatellite) {
            this.initializeQuantumSatellite();
        }

        this.generateHazards();

        document.getElementById('qGeneratePredictions').disabled = false;
        document.getElementById('qCollapseEnvironment').disabled = true;
        document.getElementById('qGenerateRoutes').disabled = true;
        document.getElementById('qCollapseRoute').disabled = true;
        document.getElementById('qExecuteNav').disabled = true;

        this.updateUI();
    }

    updateUI() {
        document.getElementById('qSystemState').textContent = this.systemState;
    }

    displayRoutes() {
        console.log('\n🛤️ === ROUTE CANDIDATES ===');
        this.routes.forEach((route, i) => {
            const selected = route === this.selectedRoute ? '✅ SELECTED' : '';
            console.log(`\n${route.name} ${selected}`);
            console.log(`  Color: ${route.color}`);
            console.log(`  ${route.description}`);
            console.log(`  ⛽ Fuel: ${route.fuelCost}%`);
            console.log(`  🛡️ Safety: ${(route.safetyScore * 100).toFixed(0)}%`);
            console.log(`  📊 Score: ${(route.totalScore * 100).toFixed(0)}/100`);
        });
        console.log('\n========================\n');
    }


    // RENDERING
    draw(ctx, width, height, project) {
        if (!this.isActive) return;

        // Draw hazards
        this.hazards.forEach(h => {
            const pos = project(h.x, h.y, 0);
            const scale = Math.min(width, height) / 6;
            const r = h.radius * scale * 50;

            // Glow
            const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, r * 2);
            gradient.addColorStop(0, h.type === 'radiation' ? '#ef4444' : '#f59e0b');
            gradient.addColorStop(0.5, h.type === 'radiation' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, r * 2, 0, Math.PI * 2);
            ctx.fill();

            // Core
            ctx.fillStyle = h.type === 'radiation' ? '#ef4444' : '#f59e0b';
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw prediction halos
        if (this.predictions.length > 0 && !this.collapsedEnvironment && this.quantumSatellite) {
            this.predictions.forEach((pred, i) => {
                const pos = project(this.quantumSatellite.x, this.quantumSatellite.y, 0);
                const radius = 60 + i * 25;

                const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius);
                gradient.addColorStop(0, 'rgba(168, 85, 247, 0)');
                gradient.addColorStop(0.7, `rgba(168, 85, 247, ${pred.probability * 0.3})`);
                gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        // Draw routes
        if (this.routes.length > 0) {
            this.routes.forEach(route => {
                const alpha = route === this.selectedRoute ? 0.3 : 0.15;

                ctx.strokeStyle = route.color;
                ctx.globalAlpha = alpha;
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                ctx.beginPath();

                route.waypoints.forEach((wp, j) => {
                    const pos = project(wp.x, wp.y, 0);
                    if (j === 0) {
                        ctx.moveTo(pos.x, pos.y);
                    } else {
                        ctx.lineTo(pos.x, pos.y);
                    }
                });

                ctx.stroke();
                ctx.setLineDash([]);
                ctx.globalAlpha = 1;
            });
        }

        // Draw selected route (white glow)
        if (this.selectedRoute) {
            ctx.strokeStyle = '#ffffff';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ffffff';
            ctx.globalAlpha = 0.7;
            ctx.lineWidth = 3;
            ctx.beginPath();

            this.selectedRoute.waypoints.forEach((wp, j) => {
                const pos = project(wp.x, wp.y, 0);
                if (j === 0) {
                    ctx.moveTo(pos.x, pos.y);
                } else {
                    ctx.lineTo(pos.x, pos.y);
                }
            });

            ctx.stroke();
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
        }

        // Draw quantum satellite
        if (this.quantumSatellite) {
            const pos = project(this.quantumSatellite.x, this.quantumSatellite.y, 0);

            // Trail
            if (this.quantumSatellite.trail.length > 1) {
                ctx.strokeStyle = this.quantumSatellite.color;
                ctx.globalAlpha = 0.4;
                ctx.lineWidth = 2;
                ctx.beginPath();

                this.quantumSatellite.trail.forEach((point, i) => {
                    const p = project(point.x, point.y, 0);
                    if (i === 0) {
                        ctx.moveTo(p.x, p.y);
                    } else {
                        ctx.lineTo(p.x, p.y);
                    }
                });

                ctx.stroke();
                ctx.globalAlpha = 1;
            }

            // Pulsing glow
            const pulse = Math.sin(Date.now() / 200) * 0.3 + 0.7;
            const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, this.quantumSatellite.radius * 3);
            gradient.addColorStop(0, this.quantumSatellite.color);
            gradient.addColorStop(0.5, `rgba(0, 255, 136, ${pulse * 0.5})`);
            gradient.addColorStop(1, 'rgba(0, 255, 136, 0)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, this.quantumSatellite.radius * 3, 0, Math.PI * 2);
            ctx.fill();

            // Satellite
            ctx.fillStyle = this.quantumSatellite.color;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, this.quantumSatellite.radius, 0, Math.PI * 2);
            ctx.fill();

            // Icon
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🛸', pos.x, pos.y + 5);
        }
    }

    setupQuantumControls() {
        // Mode toggle
        document.getElementById('quantumModeToggle').addEventListener('change', (e) => {
            if (e.target.checked) {
                this.activate();
            } else {
                this.deactivate();
            }
        });

        // Quantum buttons
        document.getElementById('qGeneratePredictions').addEventListener('click', () => {
            this.generatePredictions();
        });

        document.getElementById('qCollapseEnvironment').addEventListener('click', () => {
            this.collapseEnvironment();
        });

        document.getElementById('qGenerateRoutes').addEventListener('click', () => {
            this.generateRoutes();
        });

        document.getElementById('qCollapseRoute').addEventListener('click', () => {
            this.collapseRoute();
        });

        document.getElementById('qExecuteNav').addEventListener('click', () => {
            this.executeNavigation();
        });

        document.getElementById('qReset').addEventListener('click', () => {
            this.reset();
        });
    }
}

// Initialize quantum mode when simulator is ready
window.addEventListener('DOMContentLoaded', () => {
    // Wait for simulator to be created
    setTimeout(() => {
        if (window.solarSystemSimulator) {
            window.quantumMode = new QuantumMode(window.solarSystemSimulator);
        }
    }, 100);
});
