# 🔧 TROUBLESHOOTING GUIDE

## ❌ **Issue: Planets Not Showing or Orbiting**

### 🔍 **Quick Checks:**

1. **Open the Browser:**
   ```
   http://localhost:8000
   ```

2. **Open Developer Console:**
   - Press `F12` or `Ctrl+Shift+I`
   - Look for any **red error messages**

3. **Check if Canvas is Loading:**
   - You should see a dark space background
   - Stars should be visible

---

## 🛠️ **Possible Issues & Fixes:**

### **Issue 1: JavaScript Error**
**Symptom:** Blank screen or no planets

**Fix:**
1. Open browser console (F12)
2. Look for errors in red
3. Share the error message

---

### **Issue 2: Canvas Not Rendering**
**Symptom:** Black screen, no stars

**Fix:**
1. Hard refresh: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Try different browser (Chrome/Firefox)

---

### **Issue 3: Files Not Loading**
**Symptom:** Console shows 404 errors

**Check:**
- `app.js` loaded?
- `style.css` loaded?
- `quantum-mode.js` loaded?

**Fix:**
- Verify server is running on port 8000
- Check file paths are correct

---

### **Issue 4: Planets Calculated but Not Visible**
**Symptom:** Console shows no errors but planets invisible

**Debug Steps:**

1. **Open Console** (F12)
2. **Type this:**
   ```javascript
   window.solarSystemSimulator.planets
   ```
3. **Press Enter**
4. **Check output:**
   - Should show array of 9 objects
   - Each should have x, y, z coordinates
   - If coordinates are all 0, there's a calculation issue

---

## 🚀 **Quick Test:**

**In browser console, type:**
```javascript
// Check if simulator exists
console.log(window.solarSystemSimulator);

// Check planets
console.log(window.solarSystemSimulator.planets);

// Check if animating
console.log(window.solarSystemSimulator.isAnimating);

// Check days elapsed
console.log(window.solarSystemSimulator.daysElapsed);
```

---

## 📊 **Expected Output:**

**Planets should have:**
```javascript
{
  name: "Earth",
  x: 0.xx,  // NOT 0
  y: 0.xx,  // NOT 0
  z: 0.xx,
  color: "#4A90E2",
  // ... more properties
}
```

**If x, y, z are all exactly 0:**
- Orbital calculation issue
- Need to check `computePlanetPosition` function

---

## 🔄 **Reset Steps:**

1. **Stop Server:** Press `Ctrl+C` in terminal
2. **Restart Server:**
   ```
   python -m http.server 8000
   ```
3. **Hard Refresh Browser:** `Ctrl+F5`
4. **Check Console:** Look for errors

---

## 📝 **What to Share:**

If still not working, please share:

1. **Browser Console Errors** (screenshot or copy text)
2. **What you see** (blank screen? stars only? no movement?)
3. **Console output** from the quick test above

---

## 🎯 **Most Common Fix:**

**Hard Refresh the Browser:**
- Windows: `Ctrl+F5`
- Mac: `Cmd+Shift+R`

This clears cached JavaScript and reloads everything fresh!

---

**Try opening the browser first and let me know what you see!** 🔍
