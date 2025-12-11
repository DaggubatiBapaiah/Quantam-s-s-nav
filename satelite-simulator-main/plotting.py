import matplotlib.pyplot as plt

class plottool:
    def __init__(self, fontsize, xlabel, ylabel, title):
        self.fontsize = fontsize
        plt.figure(figsize=(10, 8))
        plt.xlabel(xlabel, fontsize=fontsize)
        plt.ylabel(ylabel, fontsize=fontsize)
        plt.title(title, fontsize=fontsize)
        plt.grid(True)
        
    def plot(self, *args, **kwargs):
        return plt.plot(*args, **kwargs)
