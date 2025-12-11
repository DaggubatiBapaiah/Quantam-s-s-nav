"""
PennyLane Quantum Simulator for Satellite Navigation
Visual quantum circuit simulation with real-time visualization
"""

import pennylane as qml
from pennylane import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
import json

class PennyLaneQuantumNavigator:
    """Quantum navigation using PennyLane framework"""
    
    def __init__(self, num_qubits=3):
        self.num_qubits = num_qubits
        self.dev = qml.device('default.qubit', wires=num_qubits)
        
    def visualize_superposition(self):
        """Create and visualize quantum superposition"""
        
        @qml.qnode(self.dev)
        def superposition_circuit():
            # Create superposition with Hadamard gates
            for i in range(self.num_qubits):
                qml.Hadamard(wires=i)
            
            # Add phase interference
            for i in range(self.num_qubits):
                qml.PhaseShift(i * np.pi / self.num_qubits, wires=i)
            
            # Create entanglement
            for i in range(self.num_qubits - 1):
                qml.CNOT(wires=[i, i + 1])
            
            return qml.state()
        
        # Execute circuit
        state = superposition_circuit()
        
        # Visualize
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 5))
        
        # Plot 1: Probability distribution
        probabilities = np.abs(state) ** 2
        states = [f'|{i:0{self.num_qubits}b}⟩' for i in range(2**self.num_qubits)]
        
        ax1.bar(states, probabilities, color='purple', alpha=0.7, edgecolor='white')
        ax1.set_xlabel('Quantum State', fontsize=12, fontweight='bold')
        ax1.set_ylabel('Probability', fontsize=12, fontweight='bold')
        ax1.set_title('Quantum Superposition - Environment Predictions', 
                     fontsize=14, fontweight='bold')
        ax1.grid(axis='y', alpha=0.3)
        ax1.set_ylim([0, max(probabilities) * 1.2])
        
        # Add probability values on bars
        for i, (state_label, prob) in enumerate(zip(states, probabilities)):
            if prob > 0.01:
                ax1.text(i, prob + 0.01, f'{prob:.1%}', 
                        ha='center', va='bottom', fontsize=9)
        
        # Plot 2: Bloch sphere representation (for first qubit)
        theta = 2 * np.arccos(np.abs(state[0]))
        phi = np.angle(state[1]) if len(state) > 1 else 0
        
        # Draw Bloch sphere
        u = np.linspace(0, 2 * np.pi, 100)
        v = np.linspace(0, np.pi, 100)
        x = np.outer(np.cos(u), np.sin(v))
        y = np.outer(np.sin(u), np.sin(v))
        z = np.outer(np.ones(np.size(u)), np.cos(v))
        
        ax2 = plt.subplot(122, projection='3d')
        ax2.plot_surface(x, y, z, alpha=0.1, color='cyan')
        
        # Plot state vector
        state_x = np.sin(theta) * np.cos(phi)
        state_y = np.sin(theta) * np.sin(phi)
        state_z = np.cos(theta)
        
        ax2.quiver(0, 0, 0, state_x, state_y, state_z, 
                  color='red', arrow_length_ratio=0.1, linewidth=3)
        ax2.scatter([state_x], [state_y], [state_z], 
                   color='red', s=100, marker='o')
        
        ax2.set_xlabel('X', fontweight='bold')
        ax2.set_ylabel('Y', fontweight='bold')
        ax2.set_zlabel('Z', fontweight='bold')
        ax2.set_title('Bloch Sphere - Qubit State', fontsize=14, fontweight='bold')
        
        plt.tight_layout()
        plt.savefig('quantum_superposition_pennylane.png', dpi=150, bbox_inches='tight')
        print("✅ Saved: quantum_superposition_pennylane.png")
        plt.show()
        
        return state, probabilities
    
    def grover_algorithm(self, target_states=[1, 3]):
        """Grover's Algorithm with visualization"""
        
        def oracle(target):
            """Oracle marks target state"""
            # Convert target to binary
            binary = format(target, f'0{self.num_qubits}b')
            
            # Flip qubits where bit is 0
            for i, bit in enumerate(binary):
                if bit == '0':
                    qml.PauliX(wires=i)
            
            # Multi-controlled Z
            if self.num_qubits == 3:
                qml.MultiControlledX(wires=[0, 1, 2], control_values='11')
                qml.PauliZ(wires=2)
                qml.MultiControlledX(wires=[0, 1, 2], control_values='11')
            
            # Undo flips
            for i, bit in enumerate(binary):
                if bit == '0':
                    qml.PauliX(wires=i)
        
        def diffusion():
            """Diffusion operator"""
            for i in range(self.num_qubits):
                qml.Hadamard(wires=i)
            
            for i in range(self.num_qubits):
                qml.PauliX(wires=i)
            
            if self.num_qubits == 3:
                qml.MultiControlledX(wires=[0, 1, 2], control_values='11')
                qml.PauliZ(wires=2)
                qml.MultiControlledX(wires=[0, 1, 2], control_values='11')
            
            for i in range(self.num_qubits):
                qml.PauliX(wires=i)
            
            for i in range(self.num_qubits):
                qml.Hadamard(wires=i)
        
        @qml.qnode(self.dev)
        def grover_circuit(iterations):
            # Initialize superposition
            for i in range(self.num_qubits):
                qml.Hadamard(wires=i)
            
            # Grover iterations
            for _ in range(iterations):
                for target in target_states:
                    oracle(target)
                diffusion()
            
            return qml.probs(wires=range(self.num_qubits))
        
        # Calculate optimal iterations
        N = 2 ** self.num_qubits
        optimal_iterations = int(np.pi / 4 * np.sqrt(N))
        
        # Run Grover's algorithm
        probabilities = grover_circuit(optimal_iterations)
        
        # Visualize
        fig, ax = plt.subplots(figsize=(12, 6))
        
        states = [f'|{i:0{self.num_qubits}b}⟩' for i in range(2**self.num_qubits)]
        colors = ['red' if i in target_states else 'blue' for i in range(2**self.num_qubits)]
        
        bars = ax.bar(states, probabilities, color=colors, alpha=0.7, edgecolor='white', linewidth=2)
        
        ax.set_xlabel('Quantum State', fontsize=12, fontweight='bold')
        ax.set_ylabel('Probability', fontsize=12, fontweight='bold')
        ax.set_title(f"Grover's Algorithm - Finding States {target_states}\n" + 
                    f"Iterations: {optimal_iterations} | Speedup: {N/optimal_iterations:.1f}x",
                    fontsize=14, fontweight='bold')
        ax.grid(axis='y', alpha=0.3)
        
        # Add probability labels
        for i, (state_label, prob) in enumerate(zip(states, probabilities)):
            if prob > 0.05:
                ax.text(i, prob + 0.02, f'{prob:.1%}', 
                       ha='center', va='bottom', fontsize=10, fontweight='bold')
        
        # Add legend
        from matplotlib.patches import Patch
        legend_elements = [
            Patch(facecolor='red', alpha=0.7, label='Target States'),
            Patch(facecolor='blue', alpha=0.7, label='Other States')
        ]
        ax.legend(handles=legend_elements, loc='upper right', fontsize=11)
        
        plt.tight_layout()
        plt.savefig('grover_algorithm_pennylane.png', dpi=150, bbox_inches='tight')
        print("✅ Saved: grover_algorithm_pennylane.png")
        plt.show()
        
        # Find result
        max_idx = np.argmax(probabilities)
        max_prob = probabilities[max_idx]
        
        print(f"\n🔬 Grover's Algorithm Results:")
        print(f"   Found state: |{max_idx:0{self.num_qubits}b}⟩ (decimal: {max_idx})")
        print(f"   Probability: {max_prob:.1%}")
        print(f"   Iterations: {optimal_iterations}")
        print(f"   Quantum speedup: {N/optimal_iterations:.1f}x vs classical")
        
        return max_idx, max_prob
    
    def vqe_optimization(self):
        """VQE for fuel optimization with visualization"""
        
        # Define Hamiltonian (energy function)
        coeffs = [1.0, 0.5, 0.3]
        obs = [qml.PauliZ(0), qml.PauliZ(1), qml.PauliZ(2)]
        H = qml.Hamiltonian(coeffs, obs)
        
        @qml.qnode(self.dev)
        def vqe_circuit(params):
            # Ansatz (parameterized circuit)
            for i in range(self.num_qubits):
                qml.RY(params[i], wires=i)
            
            for i in range(self.num_qubits - 1):
                qml.CNOT(wires=[i, i + 1])
            
            for i in range(self.num_qubits):
                qml.RZ(params[i + self.num_qubits], wires=i)
            
            return qml.expval(H)
        
        # Optimize
        optimizer = qml.GradientDescentOptimizer(stepsize=0.4)
        params = np.random.random(self.num_qubits * 2) * 2 * np.pi
        
        energies = []
        for step in range(50):
            params, energy = optimizer.step_and_cost(vqe_circuit, params)
            energies.append(energy)
        
        # Visualize optimization
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 5))
        
        # Plot 1: Energy convergence
        ax1.plot(energies, linewidth=2, color='green', marker='o', markersize=4)
        ax1.axhline(y=min(energies), color='red', linestyle='--', 
                   label=f'Minimum: {min(energies):.4f}')
        ax1.set_xlabel('Iteration', fontsize=12, fontweight='bold')
        ax1.set_ylabel('Energy (Fuel Consumption)', fontsize=12, fontweight='bold')
        ax1.set_title('VQE Optimization - Fuel Minimization', 
                     fontsize=14, fontweight='bold')
        ax1.grid(alpha=0.3)
        ax1.legend(fontsize=11)
        
        # Plot 2: Parameter evolution
        @qml.qnode(self.dev)
        def get_state(params):
            for i in range(self.num_qubits):
                qml.RY(params[i], wires=i)
            for i in range(self.num_qubits - 1):
                qml.CNOT(wires=[i, i + 1])
            for i in range(self.num_qubits):
                qml.RZ(params[i + self.num_qubits], wires=i)
            return qml.probs(wires=range(self.num_qubits))
        
        final_probs = get_state(params)
        states = [f'|{i:0{self.num_qubits}b}⟩' for i in range(2**self.num_qubits)]
        
        ax2.bar(states, final_probs, color='green', alpha=0.7, edgecolor='white')
        ax2.set_xlabel('Quantum State', fontsize=12, fontweight='bold')
        ax2.set_ylabel('Probability', fontsize=12, fontweight='bold')
        ax2.set_title('Optimized State Distribution', fontsize=14, fontweight='bold')
        ax2.grid(axis='y', alpha=0.3)
        
        plt.tight_layout()
        plt.savefig('vqe_optimization_pennylane.png', dpi=150, bbox_inches='tight')
        print("✅ Saved: vqe_optimization_pennylane.png")
        plt.show()
        
        min_energy = min(energies)
        fuel_savings = (1 - abs(min_energy) / abs(energies[0])) * 100
        
        print(f"\n🔬 VQE Optimization Results:")
        print(f"   Minimum energy: {min_energy:.4f}")
        print(f"   Initial energy: {energies[0]:.4f}")
        print(f"   Fuel savings: {fuel_savings:.1f}%")
        print(f"   Iterations: {len(energies)}")
        
        return min_energy, fuel_savings
    
    def draw_circuit(self):
        """Draw quantum circuit diagram"""
        
        @qml.qnode(self.dev)
        def full_circuit():
            # Superposition
            for i in range(self.num_qubits):
                qml.Hadamard(wires=i)
            
            # Phase
            for i in range(self.num_qubits):
                qml.PhaseShift(i * np.pi / self.num_qubits, wires=i)
            
            # Entanglement
            for i in range(self.num_qubits - 1):
                qml.CNOT(wires=[i, i + 1])
            
            return qml.state()
        
        # Draw circuit
        fig, ax = qml.draw_mpl(full_circuit)()
        plt.title('Quantum Navigation Circuit', fontsize=14, fontweight='bold', pad=20)
        plt.tight_layout()
        plt.savefig('quantum_circuit_pennylane.png', dpi=150, bbox_inches='tight')
        print("✅ Saved: quantum_circuit_pennylane.png")
        plt.show()


def main():
    """Run all quantum simulations"""
    print("=" * 60)
    print("🔬 PENNYLANE QUANTUM NAVIGATION SIMULATOR")
    print("=" * 60)
    
    navigator = PennyLaneQuantumNavigator(num_qubits=3)
    
    print("\n1️⃣ Creating Quantum Superposition...")
    state, probs = navigator.visualize_superposition()
    
    print("\n2️⃣ Running Grover's Algorithm...")
    found_state, probability = navigator.grover_algorithm(target_states=[1, 3])
    
    print("\n3️⃣ Running VQE Optimization...")
    min_energy, fuel_savings = navigator.vqe_optimization()
    
    print("\n4️⃣ Drawing Quantum Circuit...")
    navigator.draw_circuit()
    
    print("\n" + "=" * 60)
    print("✅ ALL SIMULATIONS COMPLETE!")
    print("=" * 60)
    print("\nGenerated visualizations:")
    print("  📊 quantum_superposition_pennylane.png")
    print("  📊 grover_algorithm_pennylane.png")
    print("  📊 vqe_optimization_pennylane.png")
    print("  📊 quantum_circuit_pennylane.png")
    print("\n🚀 Quantum navigation system ready!")


if __name__ == '__main__':
    main()
