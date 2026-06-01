## Dev Work

### Container

To build and run a docker container with this app port forwarded:

```bash
docker build -t cosmic-explorer -f deploy/Dockerfile .
docker run -p 5174:5174  cosmic-explorer
```

### Local

The following are necessary steps for launching and viewing this on localhost. From the root of the repo:

```bash
npm install      # only needed once / after pulling
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.