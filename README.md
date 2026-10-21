# 🚀 MERN CI/CD Demo — React + Node + Docker + GitHub Actions + Kubernetes

Ek chhota Todo app jo **pura CI/CD pipeline** sikhata hai.

```
You → git push → GitHub → GitHub Actions (build/test) → Docker Image → Docker Hub → Kubernetes (Staging → QA → Production)
```

## 📁 Folder structure

```
mern-cicd-demo/
├── backend/            Node + Express API (+ tests + Dockerfile)
├── frontend/           React (Vite) UI (+ nginx + Dockerfile)
├── k8s/app.yaml        Kubernetes Deployments + Services
├── .github/workflows/ci-cd.yml   ⭐ Pipeline
└── docker-compose.yml  Local pe dono ek saath Docker me
```

## 1️⃣ Bina Docker ke chalao (normal way)

```bash
# Terminal 1
cd backend && npm install && npm run dev      # http://localhost:5000/api/health

# Terminal 2
cd frontend && npm install && npm run dev     # http://localhost:5173
```

Tests: `cd backend && npm test`

## 2️⃣ Docker install

- **Windows / Mac:** https://www.docker.com/products/docker-desktop → install → Docker Desktop open karo (whale icon 🐳 green hona chahiye)
  - Windows pe WSL 2 enable hona chahiye (installer bata dega)
- **Ubuntu:** `curl -fsSL https://get.docker.com | sh` phir `sudo usermod -aG docker $USER` aur logout/login
- Check: `docker --version` aur `docker run hello-world`

## 3️⃣ Docker se chalao

```bash
docker compose up --build
# Browser: http://localhost:8080
# Band karna: Ctrl+C, phir docker compose down
```

Sirf ek image banana + chalana:
```bash
docker build -t cicd-demo-backend ./backend
docker run -p 5000:5000 cicd-demo-backend
docker images        # sab images
docker ps            # chal rahe containers
```

## 4️⃣ Docker Hub pe image push (manually, samajhne ke liye)

```bash
docker login
docker tag cicd-demo-backend YOUR_USERNAME/cicd-demo-backend:v1
docker push YOUR_USERNAME/cicd-demo-backend:v1
```

## 5️⃣ GitHub pe push + pipeline ON

```bash
git init
git add .
git commit -m "feat: initial cicd demo"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mern-cicd-demo.git
git push -u origin main
```

GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Value |
|---|---|
| `DOCKERHUB_USERNAME` | Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub → Account Settings → Personal access tokens → Generate (Read & Write) |
| `KUBE_CONFIG` *(optional)* | `base64 -w0 ~/.kube/config` ka output |

Ab **Actions** tab kholo → pipeline chalti dikhegi ✅

**Manual approval (Continuous Delivery):** Settings → Environments → `production` → *Required reviewers* me apna naam daalo.
Bina reviewer = **Continuous Deployment** (fully automatic).

## 6️⃣ Kubernetes local pe (optional)

Docker Desktop → Settings → Kubernetes → *Enable* (ya `minikube start`)

```bash
sed "s|DOCKERHUB_USER|YOUR_USERNAME|g; s|IMAGE_TAG|latest|g" k8s/app.yaml | kubectl apply -f -
kubectl get pods            # 3 backend + 2 frontend pods
kubectl get svc frontend    # Docker Desktop: http://localhost  | minikube: minikube service frontend
kubectl delete pod <koi-ek-backend-pod>   # dekho K8s khud naya bana deta hai 😎
kubectl rollout undo deployment/backend   # rollback
```

## 🧪 Pipeline fail karke dekho

`backend/tests/app.test.js` me koi assert galat kar do → push → Actions me CI ❌ → Docker/Deploy jobs chalenge hi nahi. Yahi CI ka kaam hai!
