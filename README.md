# Employee Management App 📱💼

A modern, cloud-connected React Native (Expo) mobile application engineered for real-time workforce tracking, dynamic department metrics, and enterprise data synchronization.

---

## 📐 System Architecture

This application implements a decoupled, cloud-mobile architecture designed for maximum performance, low-latency updates, and minimal device footprint.

| Layer | What it represents | What it does in your app | The Technology Used |
| :--- | :--- | :--- | :--- |
| **Frontend** | **The Face** (The UI) | Everything the user sees, clicks, and touches on the phone screen (Login inputs, salary cards, employee lists). | **React Native, Expo, & TypeScript** |
| **Backend** | **The Brain** (The Logic) | Handles authentication, checks security rules, and securely transfers data between the phone screen and storage. | **Supabase Client Logic** |
| **Database** | **The Memory** (The Storage) | The secure, permanent storage vault where all your actual employee names, emails, and salary figures live. | **PostgreSQL (hosted on Supabase)** |

---

## ⚡ Production Engineering & Optimization

A primary technical milestone of this project was optimizing the compilation footprint for Android distribution. 

Standard React Native builds bundle multi-architecture binaries into a single, bloated "Universal APK". By implementing **Gradle ABI (Application Binary Interface) Splitting**, the monolithic compilation footprint was split into isolated, target-architecture packages.

### The Metrics:
* **Universal APK Size:** 110MB
* **Optimized `arm64-v8a` APK Size:** 47MB 
* **Total Footprint Reduction:** **57.2%**

This dramatic optimization lowers user download friction, minimizes app-store bounce rates, and ensures highly efficient memory and battery utilization on target mobile hardware.

---

## 🛠️ Tech Stack & Ecosystem

* **React Native / Expo:** Cross-Platform Native Components & Architecture
* **TypeScript (95.5%):** Strict, compile-time type safety across all components
* **Supabase / PostgreSQL:** Real-time cloud database & instant data syncing
* **Expo Router:** Native file-based routing and layout management
* **Gradle:** Automated Android compilation optimization via ABI splitting

---

## 📦 Installation & Setup

1. **Clone the Repository:**
   ```bash
   git clone [https://github.com/ragulmee/employee-management-app.git](https://github.com/ragulmee/employee-management-app.git)
   cd employee-management-app