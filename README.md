# S-Calculator (Local Finance Manager)

S-Calculator is a local finance management application that uses **IndexedDB** to securely store and manage your personal financial data.

## 📌 Features

With this app, you can:  
✅ Manage multiple **users**  
✅ Create and track **bank accounts**  
✅ Record and categorize **transactions** & **Fixed expenses**  
✅ Calculate and monitor **income and salaries**  
✅ Estimate **local taxes**  

## 🌍 Tax Estimations  
Tax estimations are based on the **Swiss tax system**, taking local taxes into account for accurate calculations.

## 🚀 Installation

1. Install Homebrew:
   ```sh
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
2. Install Volta:
   ```sh
   brew install volta
   ```
3. Clone the repository:
   ```sh
   git clone https://github.com/Nicnry/s-calculator-js.git
   ```
4. Navigate inside the cloned repo:
   ```sh
   cd s-calculator-js
   ```
5. Install dependencies:
   ```sh
   npm install
   ```

## 🔧 Dev Usage

1. Create a new feature branch:
   ```sh
   git flow feature start MYFEATURE
   ```
2. Start the local server:
   ```sh
   npm run dev
   ```

## 🚀 Production Usage

1. Build the app:
   ```sh
   npm run build
   ```
2. Finish feature:
   ```sh
   git flow feature finish MYFEATURE
   ```
3. Build the app again in the develop branch:
   ```sh
   npm run build
   ```
4. Start a release:
   ```sh
   git flow release start x.x.x
   ```
   *(Check https://semver.org/ for naming conventions.)*
5. Update the version in `package.json` & necessary files.
6. Finish the release:
   ```sh
   git flow release finish x.x.x
   ```
7. Push tags:
   ```sh
   git push origin --tags
   ```
8. Wait 1 minute for the CI/CD to complete or ask the administrator if there are issues in production.

## 🛠️ Bug or Build Failure?

Use a hotfix!
1. Create a hotfix branch:
   ```sh
   git flow hotfix start VERSION
   ```
2. Edit and fix the mistake.
3. Ensure the build works:
   ```sh
   npm run build
   ```
4. Finish the hotfix:
   ```sh
   git flow hotfix finish VERSION
   ```

## 🛠️ Technologies Used

- **JavaScript** (Frontend)
- **IndexedDB** (Local data storage)
- **HTML/CSS**
- **TypeScript**
- **Next.js**
- **React**
- **Tailwind CSS**
- **ESLint**
- **Node.js**

## 🔗 Useful Links

- **GitFlow:** [Cheat Sheet](https://danielkummer.github.io/git-flow-cheatsheet/)
- **GitKraken:** [Website](https://www.gitkraken.com/)
- **CI/CD:** [Vercel](https://vercel.com/)
- **Versioning:** [Semantic Versioning](https://semver.org/)
- **Project Repository:** [GitHub](https://github.com/Nicnry/s-calculator-js)

## 📜 License
This project is licensed under the MIT License.

