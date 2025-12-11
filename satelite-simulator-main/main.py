#!/usr/bin/env python
"""
Satellite Simulator - Main Entry Point
Simulates satellites in orbit around celestial bodies
"""

import matplotlib.pyplot as plt
from matplotlib.backends.backend_pdf import PdfPages
import solarsys as SS
import numpy as np

def main():
    print("=" * 60)
    print("SATELLITE SIMULATOR")
    print("=" * 60)
    print("\nSimulating satellites in orbit around the Sun")
    print("Using JPL orbital elements data\n")
    
    # Create JPL solar system with current Julian day
    # Julian day 2451545.0 = January 1, 2000, 12:00 TT
    julian_day = 2451545.0  # J2000.0 epoch
    
    print(f"Julian Day: {julian_day}")
    print("-" * 60)
    
    # Initialize the solar system
    jpl = SS.JPL(julian_day)
    
    # Compute orbits
    print("\nComputing orbital paths...")
    jpl.MilkyWay.Orbit()
    
    # Create PDF for plots
    pp = PdfPages('SolarSystem_Orbits.pdf')
    
    # Plot the orbits
    print("\nGenerating 3D orbital plot...")
    jpl.MilkyWay.PlotOrbit(pp, zoomed=-1)
    
    print("\nPlots saved to: SolarSystem_Orbits.pdf")
    
    # Close PDF
    pp.close()
    
    # Show interactive plot
    print("\nDisplaying interactive plot...")
    print("Close the plot window to continue...")
    plt.show()
    
    print("\n" + "=" * 60)
    print("Simulation complete!")
    print("=" * 60)
    
    # Optional: Animate orbits over time
    print("\nWould you like to animate the orbits? (This will take some time)")
    print("Animation will show planetary motion over multiple days")
    
    # Uncomment the following lines to enable animation:
    # day_skip = 10  # Skip 10 days between frames
    # num_skips = 100  # Number of frames
    # pause_time = 0.1  # Pause between frames in seconds
    # jpl.AnimateOrbits(pp, julian_day, day_skip, num_skips, pause_time)

if __name__ == "__main__":
    main()
