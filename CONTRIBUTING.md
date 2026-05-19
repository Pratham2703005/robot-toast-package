## 🚀 How to Contribute (Step-by-Step)

### 1️⃣ Star & Fork the Repository

Hit the ⭐ **Star** button first, then click **Fork** to create your own copy of the repo.

### 2️⃣ Clone Your Fork Locally

```bash
git clone https://github.com/<your-username>/robot-toast-package.git
cd robot-toast-package
```

### 3️⃣ Create a New Branch

Always create a new branch for your changes.
```bash
git checkout -b fix/short-description-of-change
```

Example:
```bash
git checkout -b fix/swipe-dismiss-threshold
```

### 4️⃣ Install Dependencies
```bash
npm install
```

### 5️⃣ Build & Test Locally
```bash
npm run dev        # rebuilds on file changes
npm test           # runs the vitest suite
npm run typecheck  # verifies types
```

Make your changes and test them properly before pushing.

### 6️⃣ Commit Your Changes

Write clean and descriptive commit messages.
```bash
git add .
git commit -m "fix(core): correct swipe-to-dismiss threshold on mobile"
```

### 7️⃣ Push to Your Fork
```bash
git push origin fix/short-description-of-change
```

### 8️⃣ Open a Pull Request

- Go to your fork on GitHub and click:
- Compare & Pull Request
- In the PR description:
    - Explain what you changed
    - Reference the issue (if any)

## 📌 Contribution Guidelines

- Keep changes focused and minimal
- Follow existing code style
- Add or update tests for any behavior change
- Run `npm test` and `npm run typecheck` before submitting
- Do not commit `dist/`, `node_modules/`, or other build artifacts
- Avoid large unrelated changes in a single PR

## 🛠 Reporting Issues

If you find a bug or have an improvement idea:
- Go to the [Issues tab](https://github.com/Pratham2703005/robot-toast-package/issues)
- Click **New Issue**
- Clearly describe the problem, steps to reproduce, and expected behavior

## 🙌 After Your PR I will:
- Review your code
- Suggest changes (if needed)
- Merge when approved
- Once merged, your contribution becomes part of the project history 🎉

Thanks for helping improve **robot-toast**!
Let’s build something creative.
