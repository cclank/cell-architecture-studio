# Deploy

## Netify

To deploy with [Netlify](https://app.netlify.com/drop), go to the root of the repo (one dir back: `cd ..`) and build with:
```bash
npm run build
```
Then drag the `dist/` dir into [netlify.com/drop](netlify.com/drop).

## Vercel

From the root of the repo:

```bash
rm -rf .vercel/
npm i -g vercel
vercel
```

----
----
## Dev Work

### Container

To build and run a docker container with this app port forwarded:

```bash
docker build -t cosmic-explorer -f deploy/Dockerfile .
docker run -p 5174:5174 cosmic-explorer
```

**Note:** If using port `5173`, it needs to be `EXPOSE`d in the [Dockerfile](./Dockerfile) and passed into the docker run command with `-p 5173:5173`. Then it is viewable at [5173](http://localhost:5173), instead of [5174](http://localhost:5174).


### Local

The following are necessary steps for launching and viewing this on localhost. From the root of the repo:

```bash
npm install      # only needed once / after pulling
npm run dev
```

Then open [http://localhost:5174](http://localhost:5174) in your browser.