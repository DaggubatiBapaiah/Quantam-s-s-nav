import numpy as np

def dlmread(filename, delimiter):
    """Read delimited file and return as numpy array"""
    try:
        return np.loadtxt(filename, delimiter=delimiter)
    except FileNotFoundError:
        print(f"Warning: {filename} not found. Returning empty array.")
        return np.array([])
