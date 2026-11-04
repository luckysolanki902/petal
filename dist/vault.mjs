// lib/vault.ts
import { promises as fs2 } from "node:fs";
import path2 from "node:path";
import os from "node:os";
import { execFile as execFile2 } from "node:child_process";
import { promisify as promisify2 } from "node:util";
import { randomUUID as randomUUID2 } from "node:crypto";

// icons/catalog.json
var catalog_default = [
  {
    id: "brand-posthog",
    title: "PostHog",
    path: "icons/brand-posthog.svg",
    kind: "brand",
    source: "https://posthog.com/handbook/company/brand-assets",
    license: {
      type: "See upstream brand guidelines",
      url: "https://posthog.com/handbook/company/brand-assets",
    },
  },
  {
    id: "brand-googlecalendar",
    title: "Google Calendar",
    path: "icons/brand-googlecalendar.svg",
    kind: "brand",
    source:
      "https://fonts.gstatic.com/s/i/productlogos/calendar_2020q4/v8/192px.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://fonts.gstatic.com/s/i/productlogos/calendar_2020q4/v8/192px.svg",
    },
  },
  {
    id: "brand-github",
    title: "GitHub",
    path: "icons/brand-github.svg",
    kind: "brand",
    source: "https://github.com/logos",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/logos",
    },
  },
  {
    id: "brand-gitlab",
    title: "GitLab",
    path: "icons/brand-gitlab.svg",
    kind: "brand",
    source: "https://about.gitlab.com/press/press-kit/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://about.gitlab.com/press/press-kit/",
    },
  },
  {
    id: "brand-bitbucket",
    title: "Bitbucket",
    path: "icons/brand-bitbucket.svg",
    kind: "brand",
    source: "https://atlassian.design/resources/logo-library",
    license: {
      type: "See upstream brand guidelines",
      url: "https://atlassian.design/resources/logo-library",
    },
  },
  {
    id: "brand-docker",
    title: "Docker",
    path: "icons/brand-docker.svg",
    kind: "brand",
    source: "https://www.docker.com/company/newsroom/media-resources",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.docker.com/company/newsroom/media-resources",
    },
  },
  {
    id: "brand-nextdotjs",
    title: "Next.js",
    path: "icons/brand-nextdotjs.svg",
    kind: "brand",
    source: "https://vercel.com/design/brands#next-js",
    license: {
      type: "See upstream brand guidelines",
      url: "https://vercel.com/design/brands#next-js",
    },
  },
  {
    id: "brand-react",
    title: "React",
    path: "icons/brand-react.svg",
    kind: "brand",
    source:
      "https://github.com/facebook/create-react-app/blob/282c03f9525fdf8061ffa1ec50dce89296d916bd/test/fixtures/relative-paths/src/logo.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/facebook/create-react-app/blob/282c03f9525fdf8061ffa1ec50dce89296d916bd/test/fixtures/relative-paths/src/logo.svg",
    },
  },
  {
    id: "brand-reactrouter",
    title: "React Router",
    path: "icons/brand-reactrouter.svg",
    kind: "brand",
    source:
      "https://github.com/ReactTraining/react-router/blob/c94bcd8cef0c811f80b02777ec26fee3618f8e86/website/static/safari-pinned-tab.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/ReactTraining/react-router/blob/c94bcd8cef0c811f80b02777ec26fee3618f8e86/website/static/safari-pinned-tab.svg",
    },
  },
  {
    id: "brand-reactquery",
    title: "React Query",
    path: "icons/brand-reactquery.svg",
    kind: "brand",
    source:
      "https://github.com/tannerlinsley/react-query/blob/9b5d18cd47a4c1454d6c8dd0f38280641c1dd5dd/docs/src/images/emblem-light.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/tannerlinsley/react-query/blob/9b5d18cd47a4c1454d6c8dd0f38280641c1dd5dd/docs/src/images/emblem-light.svg",
    },
  },
  {
    id: "brand-angular",
    title: "Angular",
    path: "icons/brand-angular.svg",
    kind: "brand",
    source: "https://angular.dev/press-kit",
    license: {
      type: "CC-BY-4.0",
      url: "https://spdx.org/licenses/CC-BY-4.0",
    },
  },
  {
    id: "brand-vuedotjs",
    title: "Vue.js",
    path: "icons/brand-vuedotjs.svg",
    kind: "brand",
    source:
      "https://github.com/vuejs/art/blob/a1c78b74569b70a25300925b4eacfefcc143b8f6/logo.svg",
    license: {
      type: "CC-BY-NC-SA-4.0",
      url: "https://spdx.org/licenses/CC-BY-NC-SA-4.0",
    },
  },
  {
    id: "brand-nuxt",
    title: "Nuxt",
    path: "icons/brand-nuxt.svg",
    kind: "brand",
    source: "https://nuxt.com/design-kit",
    license: {
      type: "See upstream brand guidelines",
      url: "https://nuxt.com/design-kit",
    },
  },
  {
    id: "brand-svelte",
    title: "Svelte",
    path: "icons/brand-svelte.svg",
    kind: "brand",
    source:
      "https://github.com/sveltejs/branding/blob/c4dfca6743572087a6aef0e109ffe3d95596e86a/svelte-logo.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/sveltejs/branding/blob/c4dfca6743572087a6aef0e109ffe3d95596e86a/svelte-logo.svg",
    },
  },
  {
    id: "brand-astro",
    title: "Astro",
    path: "icons/brand-astro.svg",
    kind: "brand",
    source: "https://astro.build/press",
    license: {
      type: "See upstream brand guidelines",
      url: "https://astro.build/press",
    },
  },
  {
    id: "brand-solid",
    title: "Solid",
    path: "icons/brand-solid.svg",
    kind: "brand",
    source: "https://www.solidjs.com/media",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.solidjs.com/media",
    },
  },
  {
    id: "brand-remix",
    title: "Remix",
    path: "icons/brand-remix.svg",
    kind: "brand",
    source:
      "https://drive.google.com/drive/u/0/folders/1pbHnJqg8Y1ATs0Oi8gARH7wccJGv4I2c",
    license: {
      type: "See upstream brand guidelines",
      url: "https://drive.google.com/drive/u/0/folders/1pbHnJqg8Y1ATs0Oi8gARH7wccJGv4I2c",
    },
  },
  {
    id: "brand-qwik",
    title: "Qwik",
    path: "icons/brand-qwik.svg",
    kind: "brand",
    source:
      "https://github.com/BuilderIO/qwik/blob/c88e53d49dc65020899d770338f4e51f3134611e/packages/docs/public/logos/qwik-logo.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/BuilderIO/qwik/blob/c88e53d49dc65020899d770338f4e51f3134611e/packages/docs/public/logos/qwik-logo.svg",
    },
  },
  {
    id: "brand-preact",
    title: "Preact",
    path: "icons/brand-preact.svg",
    kind: "brand",
    source: "https://preactjs.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://preactjs.com",
    },
  },
  {
    id: "brand-jquery",
    title: "jQuery",
    path: "icons/brand-jquery.svg",
    kind: "brand",
    source: "https://brand.jquery.org/logos/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://brand.jquery.org/logos/",
    },
  },
  {
    id: "brand-bootstrap",
    title: "Bootstrap",
    path: "icons/brand-bootstrap.svg",
    kind: "brand",
    source: "https://getbootstrap.com/docs/5.3/about/brand",
    license: {
      type: "MIT",
      url: "https://spdx.org/licenses/MIT",
    },
  },
  {
    id: "brand-tailwindcss",
    title: "Tailwind CSS",
    path: "icons/brand-tailwindcss.svg",
    kind: "brand",
    source: "https://tailwindcss.com/brand",
    license: {
      type: "See upstream brand guidelines",
      url: "https://tailwindcss.com/brand",
    },
  },
  {
    id: "brand-bulma",
    title: "Bulma",
    path: "icons/brand-bulma.svg",
    kind: "brand",
    source: "https://bulma.io/brand",
    license: {
      type: "See upstream brand guidelines",
      url: "https://bulma.io/brand",
    },
  },
  {
    id: "brand-chakraui",
    title: "Chakra UI",
    path: "icons/brand-chakraui.svg",
    kind: "brand",
    source:
      "https://github.com/chakra-ui/chakra-ui/blob/e08025b359146d80ab46f1d35da82a11780c5316/media/logomark-colored.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/chakra-ui/chakra-ui/blob/e08025b359146d80ab46f1d35da82a11780c5316/media/logomark-colored.svg",
    },
  },
  {
    id: "brand-radixui",
    title: "Radix UI",
    path: "icons/brand-radixui.svg",
    kind: "brand",
    source: "https://www.radix-ui.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.radix-ui.com",
    },
  },
  {
    id: "brand-shadcnui",
    title: "shadcn/ui",
    path: "icons/brand-shadcnui.svg",
    kind: "brand",
    source: "https://ui.shadcn.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://ui.shadcn.com",
    },
  },
  {
    id: "brand-mui",
    title: "MUI",
    path: "icons/brand-mui.svg",
    kind: "brand",
    source:
      "https://github.com/mui-org/material-ui/blob/353cecb5391571163eb6bd8cbf36d2dd299aaf56/docs/src/icons/SvgMuiLogo.tsx",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/mui-org/material-ui/blob/353cecb5391571163eb6bd8cbf36d2dd299aaf56/docs/src/icons/SvgMuiLogo.tsx",
    },
  },
  {
    id: "brand-daisyui",
    title: "daisyUI",
    path: "icons/brand-daisyui.svg",
    kind: "brand",
    source: "https://daisyui.com/brand",
    license: {
      type: "See upstream brand guidelines",
      url: "https://daisyui.com/brand",
    },
  },
  {
    id: "brand-styledcomponents",
    title: "styled-components",
    path: "icons/brand-styledcomponents.svg",
    kind: "brand",
    source: "https://www.styled-components.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.styled-components.com",
    },
  },
  {
    id: "brand-sass",
    title: "Sass",
    path: "icons/brand-sass.svg",
    kind: "brand",
    source: "https://sass-lang.com/styleguide/brand",
    license: {
      type: "CC-BY-NC-SA-3.0",
      url: "https://spdx.org/licenses/CC-BY-NC-SA-3.0",
    },
  },
  {
    id: "brand-less",
    title: "Less",
    path: "icons/brand-less.svg",
    kind: "brand",
    source:
      "https://github.com/less/logo/blob/c9c10c328cfc00071e92443934b35e389310abf8/less_logo.ai",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/less/logo/blob/c9c10c328cfc00071e92443934b35e389310abf8/less_logo.ai",
    },
  },
  {
    id: "brand-css",
    title: "CSS",
    path: "icons/brand-css.svg",
    kind: "brand",
    source:
      "https://github.com/CSS-Next/logo.css/blob/bacc20878227204b283c68a6b935f8279e06b0cd/css.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/CSS-Next/logo.css/blob/bacc20878227204b283c68a6b935f8279e06b0cd/css.svg",
    },
  },
  {
    id: "brand-html5",
    title: "HTML5",
    path: "icons/brand-html5.svg",
    kind: "brand",
    source: "https://www.w3.org/html/logo/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.w3.org/html/logo/",
    },
  },
  {
    id: "brand-javascript",
    title: "JavaScript",
    path: "icons/brand-javascript.svg",
    kind: "brand",
    source:
      "https://github.com/voodootikigod/logo.js/blob/1544bdeed6d618a6cfe4f0650d04ab8d9cfa76d9/js.svg",
    license: {
      type: "MIT",
      url: "https://spdx.org/licenses/MIT",
    },
  },
  {
    id: "brand-typescript",
    title: "TypeScript",
    path: "icons/brand-typescript.svg",
    kind: "brand",
    source: "https://www.typescriptlang.org/branding",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.typescriptlang.org/branding",
    },
  },
  {
    id: "brand-nodedotjs",
    title: "Node.js",
    path: "icons/brand-nodedotjs.svg",
    kind: "brand",
    source: "https://nodejs.org/en/about/branding",
    license: {
      type: "See upstream brand guidelines",
      url: "https://nodejs.org/en/about/branding",
    },
  },
  {
    id: "brand-deno",
    title: "Deno",
    path: "icons/brand-deno.svg",
    kind: "brand",
    source:
      "https://github.com/denoland/docs/blob/5dee713844c7447f80acd4093caa9d350d80bf36/static/img/logo.svg",
    license: {
      type: "MIT",
      url: "https://spdx.org/licenses/MIT",
    },
  },
  {
    id: "brand-bun",
    title: "Bun",
    path: "icons/brand-bun.svg",
    kind: "brand",
    source: "https://bun.sh/press-kit",
    license: {
      type: "See upstream brand guidelines",
      url: "https://bun.sh/press-kit",
    },
  },
  {
    id: "brand-npm",
    title: "npm",
    path: "icons/brand-npm.svg",
    kind: "brand",
    source: "https://www.npmjs.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.npmjs.com",
    },
  },
  {
    id: "brand-pnpm",
    title: "pnpm",
    path: "icons/brand-pnpm.svg",
    kind: "brand",
    source: "https://pnpm.io/logos",
    license: {
      type: "See upstream brand guidelines",
      url: "https://pnpm.io/logos",
    },
  },
  {
    id: "brand-yarn",
    title: "Yarn",
    path: "icons/brand-yarn.svg",
    kind: "brand",
    source:
      "https://github.com/yarnpkg/assets/blob/76d30ca2aebed5b73ea8131d972218fb860bd32d/yarn-kitten-circle.svg",
    license: {
      type: "CC-BY-4.0",
      url: "https://spdx.org/licenses/CC-BY-4.0",
    },
  },
  {
    id: "brand-vite",
    title: "Vite",
    path: "icons/brand-vite.svg",
    kind: "brand",
    source:
      "https://github.com/voidzero-dev/community-design-resources/blob/55902097229cf01cf2a4ceb376f992f5cf306756/brand-assets/vite/vite-icon-color-bracketless.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/voidzero-dev/community-design-resources/blob/55902097229cf01cf2a4ceb376f992f5cf306756/brand-assets/vite/vite-icon-color-bracketless.svg",
    },
  },
  {
    id: "brand-webpack",
    title: "Webpack",
    path: "icons/brand-webpack.svg",
    kind: "brand",
    source: "https://webpack.js.org/branding",
    license: {
      type: "custom",
      url: "https://js.foundation/about/governance/trademark-policy",
    },
  },
  {
    id: "brand-esbuild",
    title: "esbuild",
    path: "icons/brand-esbuild.svg",
    kind: "brand",
    source:
      "https://github.com/evanw/esbuild/blob/ac542f913908d7326b65eb2e01f0559ed135a40e/images/logo.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/evanw/esbuild/blob/ac542f913908d7326b65eb2e01f0559ed135a40e/images/logo.svg",
    },
  },
  {
    id: "brand-babel",
    title: "Babel",
    path: "icons/brand-babel.svg",
    kind: "brand",
    source:
      "https://github.com/babel/website/blob/93330158b6ecca1ab88d3be8dbf661f5c2da6c76/website/static/img/babel-black.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/babel/website/blob/93330158b6ecca1ab88d3be8dbf661f5c2da6c76/website/static/img/babel-black.svg",
    },
  },
  {
    id: "brand-swc",
    title: "SWC",
    path: "icons/brand-swc.svg",
    kind: "brand",
    source:
      "https://github.com/swc-project/logo/blob/f26cac1b4a490e3bdf128d3b084bb57f4fab1aac/svg/swc_black.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/swc-project/logo/blob/f26cac1b4a490e3bdf128d3b084bb57f4fab1aac/svg/swc_black.svg",
    },
  },
  {
    id: "brand-turborepo",
    title: "Turborepo",
    path: "icons/brand-turborepo.svg",
    kind: "brand",
    source: "https://vercel.com/geist/brands",
    license: {
      type: "See upstream brand guidelines",
      url: "https://vercel.com/geist/brands",
    },
  },
  {
    id: "brand-vitest",
    title: "Vitest",
    path: "icons/brand-vitest.svg",
    kind: "brand",
    source:
      "https://github.com/voidzero-dev/community-design-resources/blob/55902097229cf01cf2a4ceb376f992f5cf306756/brand-assets/vitest/vitest-icon-color-bracketless.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/voidzero-dev/community-design-resources/blob/55902097229cf01cf2a4ceb376f992f5cf306756/brand-assets/vitest/vitest-icon-color-bracketless.svg",
    },
  },
  {
    id: "brand-jest",
    title: "Jest",
    path: "icons/brand-jest.svg",
    kind: "brand",
    source: "https://jestjs.io",
    license: {
      type: "See upstream brand guidelines",
      url: "https://jestjs.io",
    },
  },
  {
    id: "brand-mocha",
    title: "Mocha",
    path: "icons/brand-mocha.svg",
    kind: "brand",
    source: "https://mochajs.org",
    license: {
      type: "See upstream brand guidelines",
      url: "https://mochajs.org",
    },
  },
  {
    id: "brand-cypress",
    title: "Cypress",
    path: "icons/brand-cypress.svg",
    kind: "brand",
    source: "https://www.cypress.io/press-kit",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.cypress.io/press-kit",
    },
  },
  {
    id: "brand-testinglibrary",
    title: "Testing Library",
    path: "icons/brand-testinglibrary.svg",
    kind: "brand",
    source: "https://testing-library.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://testing-library.com",
    },
  },
  {
    id: "brand-storybook",
    title: "Storybook",
    path: "icons/brand-storybook.svg",
    kind: "brand",
    source:
      "https://github.com/storybookjs/brand/tree/6f4d67f65f8275c53c310a73a8da6c6e96c8488c",
    license: {
      type: "MIT",
      url: "https://spdx.org/licenses/MIT",
    },
  },
  {
    id: "brand-chromatic",
    title: "Chromatic",
    path: "icons/brand-chromatic.svg",
    kind: "brand",
    source: "https://www.chromatic.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.chromatic.com",
    },
  },
  {
    id: "brand-selenium",
    title: "Selenium",
    path: "icons/brand-selenium.svg",
    kind: "brand",
    source:
      "https://github.com/SeleniumHQ/heroku-selenium/blob/2f66891ba030d3aa1f36ab1748c52ba4fb4e057d/selenium-green.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/SeleniumHQ/heroku-selenium/blob/2f66891ba030d3aa1f36ab1748c52ba4fb4e057d/selenium-green.svg",
    },
  },
  {
    id: "brand-puppeteer",
    title: "Puppeteer",
    path: "icons/brand-puppeteer.svg",
    kind: "brand",
    source: "https://pptr.dev",
    license: {
      type: "See upstream brand guidelines",
      url: "https://pptr.dev",
    },
  },
  {
    id: "brand-python",
    title: "Python",
    path: "icons/brand-python.svg",
    kind: "brand",
    source: "https://www.python.org/community/logos/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.python.org/community/logos/",
    },
  },
  {
    id: "brand-django",
    title: "Django",
    path: "icons/brand-django.svg",
    kind: "brand",
    source: "https://www.djangoproject.com/community/logos/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.djangoproject.com/community/logos/",
    },
  },
  {
    id: "brand-flask",
    title: "Flask",
    path: "icons/brand-flask.svg",
    kind: "brand",
    source:
      "https://github.com/pallets/flask/blob/85c5d93cbd049c4bd0679c36fd1ddcae8c37b642/docs/_static/flask-icon.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/pallets/flask/blob/85c5d93cbd049c4bd0679c36fd1ddcae8c37b642/docs/_static/flask-icon.svg",
    },
  },
  {
    id: "brand-fastapi",
    title: "FastAPI",
    path: "icons/brand-fastapi.svg",
    kind: "brand",
    source:
      "https://github.com/tiangolo/fastapi/blob/ffb4f77a11f83132b521ba0aac6c95792c19e797/docs/en/docs/img/icon-white.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/tiangolo/fastapi/blob/ffb4f77a11f83132b521ba0aac6c95792c19e797/docs/en/docs/img/icon-white.svg",
    },
  },
  {
    id: "brand-pydantic",
    title: "Pydantic",
    path: "icons/brand-pydantic.svg",
    kind: "brand",
    source:
      "https://github.com/pydantic/pydantic/blob/94c748001a32992a587694b999fb1f3d2f1fc1fe/docs/logo-white.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/pydantic/pydantic/blob/94c748001a32992a587694b999fb1f3d2f1fc1fe/docs/logo-white.svg",
    },
  },
  {
    id: "brand-uv",
    title: "uv",
    path: "icons/brand-uv.svg",
    kind: "brand",
    source: "https://docs.astral.sh/uv/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://docs.astral.sh/uv/",
    },
  },
  {
    id: "brand-poetry",
    title: "Poetry",
    path: "icons/brand-poetry.svg",
    kind: "brand",
    source: "https://python-poetry.org",
    license: {
      type: "See upstream brand guidelines",
      url: "https://python-poetry.org",
    },
  },
  {
    id: "brand-anaconda",
    title: "Anaconda",
    path: "icons/brand-anaconda.svg",
    kind: "brand",
    source: "https://www.anaconda.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.anaconda.com",
    },
  },
  {
    id: "brand-jupyter",
    title: "Jupyter",
    path: "icons/brand-jupyter.svg",
    kind: "brand",
    source:
      "https://github.com/jupyter/design/blob/80716ee75dd7b2a6ec6abcd89922d020483589b1/logos/Logo%20Mark/logomark-whitebody-whitemoons/logomark-whitebody-whitemoons.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/jupyter/design/blob/80716ee75dd7b2a6ec6abcd89922d020483589b1/logos/Logo%20Mark/logomark-whitebody-whitemoons/logomark-whitebody-whitemoons.svg",
    },
  },
  {
    id: "brand-pandas",
    title: "pandas",
    path: "icons/brand-pandas.svg",
    kind: "brand",
    source: "https://pandas.pydata.org/about/citing.html",
    license: {
      type: "See upstream brand guidelines",
      url: "https://pandas.pydata.org/about/citing.html",
    },
  },
  {
    id: "brand-numpy",
    title: "NumPy",
    path: "icons/brand-numpy.svg",
    kind: "brand",
    source: "https://numpy.org/press-kit/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://numpy.org/press-kit/",
    },
  },
  {
    id: "brand-scipy",
    title: "SciPy",
    path: "icons/brand-scipy.svg",
    kind: "brand",
    source:
      "https://github.com/scikit-image/skimage-branding/blob/eafb65cbc3a700e3d9c8ba2ba15788fcc8703984/logo/scipy.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/scikit-image/skimage-branding/blob/eafb65cbc3a700e3d9c8ba2ba15788fcc8703984/logo/scipy.svg",
    },
  },
  {
    id: "brand-pytorch",
    title: "PyTorch",
    path: "icons/brand-pytorch.svg",
    kind: "brand",
    source:
      "https://github.com/pytorch/pytorch.github.io/blob/8f083bd12192ca12d5e1c1f3d236f4831d823d8f/assets/images/logo.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/pytorch/pytorch.github.io/blob/8f083bd12192ca12d5e1c1f3d236f4831d823d8f/assets/images/logo.svg",
    },
  },
  {
    id: "brand-tensorflow",
    title: "TensorFlow",
    path: "icons/brand-tensorflow.svg",
    kind: "brand",
    source: "https://www.tensorflow.org",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.tensorflow.org",
    },
  },
  {
    id: "brand-keras",
    title: "Keras",
    path: "icons/brand-keras.svg",
    kind: "brand",
    source: "https://keras.io",
    license: {
      type: "See upstream brand guidelines",
      url: "https://keras.io",
    },
  },
  {
    id: "brand-scikitlearn",
    title: "scikit-learn",
    path: "icons/brand-scikitlearn.svg",
    kind: "brand",
    source:
      "https://github.com/scikit-learn/scikit-learn/blob/c5ef2e985c13119001aa697e446ebb3dbcb326e5/doc/logos/scikit-learn-logo.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/scikit-learn/scikit-learn/blob/c5ef2e985c13119001aa697e446ebb3dbcb326e5/doc/logos/scikit-learn-logo.svg",
    },
  },
  {
    id: "brand-huggingface",
    title: "Hugging Face",
    path: "icons/brand-huggingface.svg",
    kind: "brand",
    source: "https://huggingface.co/brand",
    license: {
      type: "See upstream brand guidelines",
      url: "https://huggingface.co/brand",
    },
  },
  {
    id: "brand-ollama",
    title: "Ollama",
    path: "icons/brand-ollama.svg",
    kind: "brand",
    source:
      "https://github.com/ollama/ollama/issues/2152#issuecomment-1905286922",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/ollama/ollama/issues/2152#issuecomment-1905286922",
    },
  },
  {
    id: "brand-langchain",
    title: "LangChain",
    path: "icons/brand-langchain.svg",
    kind: "brand",
    source: "https://www.langchain.com/langchain",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.langchain.com/langchain",
    },
  },
  {
    id: "brand-anthropic",
    title: "Anthropic",
    path: "icons/brand-anthropic.svg",
    kind: "brand",
    source: "https://www.anthropic.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.anthropic.com",
    },
  },
  {
    id: "brand-claude",
    title: "Claude",
    path: "icons/brand-claude.svg",
    kind: "brand",
    source: "https://claude.ai",
    license: {
      type: "See upstream brand guidelines",
      url: "https://claude.ai",
    },
  },
  {
    id: "brand-googlegemini",
    title: "Google Gemini",
    path: "icons/brand-googlegemini.svg",
    kind: "brand",
    source: "https://gemini.google.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://gemini.google.com",
    },
  },
  {
    id: "brand-mistralai",
    title: "Mistral AI",
    path: "icons/brand-mistralai.svg",
    kind: "brand",
    source: "https://chat.mistral.ai",
    license: {
      type: "See upstream brand guidelines",
      url: "https://chat.mistral.ai",
    },
  },
  {
    id: "brand-perplexity",
    title: "Perplexity",
    path: "icons/brand-perplexity.svg",
    kind: "brand",
    source: "https://www.perplexity.ai",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.perplexity.ai",
    },
  },
  {
    id: "brand-deepseek",
    title: "DeepSeek",
    path: "icons/brand-deepseek.svg",
    kind: "brand",
    source: "https://www.deepseek.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.deepseek.com",
    },
  },
  {
    id: "brand-replicate",
    title: "Replicate",
    path: "icons/brand-replicate.svg",
    kind: "brand",
    source: "https://replicate.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://replicate.com",
    },
  },
  {
    id: "brand-modal",
    title: "Modal",
    path: "icons/brand-modal.svg",
    kind: "brand",
    source: "https://modal.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://modal.com",
    },
  },
  {
    id: "brand-lightning",
    title: "Lightning",
    path: "icons/brand-lightning.svg",
    kind: "brand",
    source:
      "https://github.com/Lightning-AI/lightning/blob/a584196abf820179adb0758ef67ddae91c44e7bc/docs/source/_static/images/icon.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/Lightning-AI/lightning/blob/a584196abf820179adb0758ef67ddae91c44e7bc/docs/source/_static/images/icon.svg",
    },
  },
  {
    id: "brand-rust",
    title: "Rust",
    path: "icons/brand-rust.svg",
    kind: "brand",
    source: "https://www.rust-lang.org",
    license: {
      type: "CC-BY-SA-4.0",
      url: "https://spdx.org/licenses/CC-BY-SA-4.0",
    },
  },
  {
    id: "brand-go",
    title: "Go",
    path: "icons/brand-go.svg",
    kind: "brand",
    source: "https://blog.golang.org/go-brand",
    license: {
      type: "See upstream brand guidelines",
      url: "https://blog.golang.org/go-brand",
    },
  },
  {
    id: "brand-ruby",
    title: "Ruby",
    path: "icons/brand-ruby.svg",
    kind: "brand",
    source: "https://www.ruby-lang.org/en/about/logo/",
    license: {
      type: "CC-BY-SA-2.5",
      url: "https://spdx.org/licenses/CC-BY-SA-2.5",
    },
  },
  {
    id: "brand-rubyonrails",
    title: "Ruby on Rails",
    path: "icons/brand-rubyonrails.svg",
    kind: "brand",
    source:
      "https://github.com/simple-icons/simple-icons/issues/9619#issuecomment-1735150580",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/simple-icons/simple-icons/issues/9619#issuecomment-1735150580",
    },
  },
  {
    id: "brand-php",
    title: "PHP",
    path: "icons/brand-php.svg",
    kind: "brand",
    source: "https://php.net/download-logos.php",
    license: {
      type: "CC-BY-SA-4.0",
      url: "https://spdx.org/licenses/CC-BY-SA-4.0",
    },
  },
  {
    id: "brand-laravel",
    title: "Laravel",
    path: "icons/brand-laravel.svg",
    kind: "brand",
    source:
      "https://github.com/laravel/art/tree/5a8325b064634b900f25dbb6f1cafd888b2d2211",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/laravel/art/tree/5a8325b064634b900f25dbb6f1cafd888b2d2211",
    },
  },
  {
    id: "brand-symfony",
    title: "Symfony",
    path: "icons/brand-symfony.svg",
    kind: "brand",
    source: "https://symfony.com/logo",
    license: {
      type: "See upstream brand guidelines",
      url: "https://symfony.com/logo",
    },
  },
  {
    id: "brand-composer",
    title: "Composer",
    path: "icons/brand-composer.svg",
    kind: "brand",
    source: "https://getcomposer.org",
    license: {
      type: "See upstream brand guidelines",
      url: "https://getcomposer.org",
    },
  },
  {
    id: "brand-kotlin",
    title: "Kotlin",
    path: "icons/brand-kotlin.svg",
    kind: "brand",
    source: "https://www.jetbrains.com/company/brand/logos/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.jetbrains.com/company/brand/logos/",
    },
  },
  {
    id: "brand-spring",
    title: "Spring",
    path: "icons/brand-spring.svg",
    kind: "brand",
    source: "https://spring.io/trademarks",
    license: {
      type: "See upstream brand guidelines",
      url: "https://spring.io/trademarks",
    },
  },
  {
    id: "brand-springboot",
    title: "Spring Boot",
    path: "icons/brand-springboot.svg",
    kind: "brand",
    source: "https://spring.io/projects",
    license: {
      type: "See upstream brand guidelines",
      url: "https://spring.io/projects",
    },
  },
  {
    id: "brand-quarkus",
    title: "Quarkus",
    path: "icons/brand-quarkus.svg",
    kind: "brand",
    source: "https://design.jboss.org/quarkus",
    license: {
      type: "See upstream brand guidelines",
      url: "https://design.jboss.org/quarkus",
    },
  },
  {
    id: "brand-scala",
    title: "Scala",
    path: "icons/brand-scala.svg",
    kind: "brand",
    source: "https://www.scala-lang.org",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.scala-lang.org",
    },
  },
  {
    id: "brand-clojure",
    title: "Clojure",
    path: "icons/brand-clojure.svg",
    kind: "brand",
    source: "https://commons.wikimedia.org/wiki/File:Clojure_logo.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://commons.wikimedia.org/wiki/File:Clojure_logo.svg",
    },
  },
  {
    id: "brand-elixir",
    title: "Elixir",
    path: "icons/brand-elixir.svg",
    kind: "brand",
    source:
      "https://github.com/elixir-lang/elixir-lang.github.com/tree/031746384ee23b9be19298c92a9699c56cc05845/images/logo",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/elixir-lang/elixir-lang.github.com/tree/031746384ee23b9be19298c92a9699c56cc05845/images/logo",
    },
  },
  {
    id: "brand-erlang",
    title: "Erlang",
    path: "icons/brand-erlang.svg",
    kind: "brand",
    source:
      "https://github.com/erlang/erlide_eclipse/blob/99d1d61fde8e32ef1630ca0e1b05a6822b3d6489/meta/media/erlang-logo.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/erlang/erlide_eclipse/blob/99d1d61fde8e32ef1630ca0e1b05a6822b3d6489/meta/media/erlang-logo.svg",
    },
  },
  {
    id: "brand-haskell",
    title: "Haskell",
    path: "icons/brand-haskell.svg",
    kind: "brand",
    source: "https://wiki.haskell.org/Thompson-Wheeler_logo",
    license: {
      type: "See upstream brand guidelines",
      url: "https://wiki.haskell.org/Thompson-Wheeler_logo",
    },
  },
  {
    id: "brand-ocaml",
    title: "OCaml",
    path: "icons/brand-ocaml.svg",
    kind: "brand",
    source: "https://ocaml.org/logo",
    license: {
      type: "Unlicense",
      url: "https://spdx.org/licenses/Unlicense",
    },
  },
  {
    id: "brand-dart",
    title: "Dart",
    path: "icons/brand-dart.svg",
    kind: "brand",
    source:
      "https://github.com/dart-lang/site-shared/tree/18458ff440afd3d06f04e5cb871c4c5eda29c9d5/src/_assets/image/dart/logo",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/dart-lang/site-shared/tree/18458ff440afd3d06f04e5cb871c4c5eda29c9d5/src/_assets/image/dart/logo",
    },
  },
  {
    id: "brand-flutter",
    title: "Flutter",
    path: "icons/brand-flutter.svg",
    kind: "brand",
    source: "https://flutter.dev/brand",
    license: {
      type: "See upstream brand guidelines",
      url: "https://flutter.dev/brand",
    },
  },
  {
    id: "brand-swift",
    title: "Swift",
    path: "icons/brand-swift.svg",
    kind: "brand",
    source: "https://developer.apple.com/swift/resources/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://developer.apple.com/swift/resources/",
    },
  },
  {
    id: "brand-apple",
    title: "Apple",
    path: "icons/brand-apple.svg",
    kind: "brand",
    source: "https://www.apple.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.apple.com",
    },
  },
  {
    id: "brand-android",
    title: "Android",
    path: "icons/brand-android.svg",
    kind: "brand",
    source:
      "https://partnermarketinghub.withgoogle.com/brands/android/visual-identity/visual-identity/logo-lock-ups",
    license: {
      type: "CC-BY-3.0",
      url: "https://spdx.org/licenses/CC-BY-3.0",
    },
  },
  {
    id: "brand-jetpackcompose",
    title: "Jetpack Compose",
    path: "icons/brand-jetpackcompose.svg",
    kind: "brand",
    source: "https://developer.android.com/jetpack/compose/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://developer.android.com/jetpack/compose/",
    },
  },
  {
    id: "brand-expo",
    title: "Expo",
    path: "icons/brand-expo.svg",
    kind: "brand",
    source: "https://expo.dev/brand/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://expo.dev/brand/",
    },
  },
  {
    id: "brand-unity",
    title: "Unity",
    path: "icons/brand-unity.svg",
    kind: "brand",
    source: "https://brand.unity.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://brand.unity.com",
    },
  },
  {
    id: "brand-unrealengine",
    title: "Unreal Engine",
    path: "icons/brand-unrealengine.svg",
    kind: "brand",
    source: "https://www.unrealengine.com/en-US/branding",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.unrealengine.com/en-US/branding",
    },
  },
  {
    id: "brand-godotengine",
    title: "Godot Engine",
    path: "icons/brand-godotengine.svg",
    kind: "brand",
    source: "https://godotengine.org/press",
    license: {
      type: "CC-BY-4.0",
      url: "https://spdx.org/licenses/CC-BY-4.0",
    },
  },
  {
    id: "brand-electron",
    title: "Electron",
    path: "icons/brand-electron.svg",
    kind: "brand",
    source: "https://www.electronjs.org",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.electronjs.org",
    },
  },
  {
    id: "brand-tauri",
    title: "Tauri",
    path: "icons/brand-tauri.svg",
    kind: "brand",
    source:
      "https://github.com/tauri-apps/tauri-docs/blob/b1cdfa9d7c6d0b17dae60a90266ddced40a7b384/static/img/tauri.svg",
    license: {
      type: "CC-BY-NC-ND-4.0",
      url: "https://spdx.org/licenses/CC-BY-NC-ND-4.0",
    },
  },
  {
    id: "brand-capacitor",
    title: "Capacitor",
    path: "icons/brand-capacitor.svg",
    kind: "brand",
    source:
      "https://github.com/ionic-team/ionicons-site/blob/b0c97018d737b763301154231b34e1b882c0c84d/docs/ionicons/svg/logo-capacitor.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/ionic-team/ionicons-site/blob/b0c97018d737b763301154231b34e1b882c0c84d/docs/ionicons/svg/logo-capacitor.svg",
    },
  },
  {
    id: "brand-ionic",
    title: "Ionic",
    path: "icons/brand-ionic.svg",
    kind: "brand",
    source: "https://ionicframework.com/press",
    license: {
      type: "See upstream brand guidelines",
      url: "https://ionicframework.com/press",
    },
  },
  {
    id: "brand-dotnet",
    title: ".NET",
    path: "icons/brand-dotnet.svg",
    kind: "brand",
    source:
      "https://github.com/dotnet/brand/blob/c7d0f51b8ec59531332d05fb27a5b758a7a3d689/logo/dotnet-logo.svg",
    license: {
      type: "CC0-1.0",
      url: "https://spdx.org/licenses/CC0-1.0",
    },
  },
  {
    id: "brand-cplusplus",
    title: "C++",
    path: "icons/brand-cplusplus.svg",
    kind: "brand",
    source:
      "https://github.com/isocpp/logos/tree/64ef037049f87ac74875dbe72695e59118b52186",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/isocpp/logos/tree/64ef037049f87ac74875dbe72695e59118b52186",
    },
  },
  {
    id: "brand-c",
    title: "C",
    path: "icons/brand-c.svg",
    kind: "brand",
    source:
      "https://commons.wikimedia.org/wiki/File:The_C_Programming_Language_logo.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://commons.wikimedia.org/wiki/File:The_C_Programming_Language_logo.svg",
    },
  },
  {
    id: "brand-sharp",
    title: "sharp",
    path: "icons/brand-sharp.svg",
    kind: "brand",
    source:
      "https://github.com/lovell/sharp/blob/315f519e1dd9adca0678e94a5ed0492cb5e0aae4/docs/image/sharp-logo-mono.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/lovell/sharp/blob/315f519e1dd9adca0678e94a5ed0492cb5e0aae4/docs/image/sharp-logo-mono.svg",
    },
  },
  {
    id: "brand-zig",
    title: "Zig",
    path: "icons/brand-zig.svg",
    kind: "brand",
    source:
      "https://github.com/ziglang/logo/blob/6446ba8e37a0651da720d8869e1ce9264fa0c0b9/zig-mark.svg",
    license: {
      type: "CC-BY-SA-4.0",
      url: "https://spdx.org/licenses/CC-BY-SA-4.0",
    },
  },
  {
    id: "brand-lua",
    title: "Lua",
    path: "icons/brand-lua.svg",
    kind: "brand",
    source: "https://www.lua.org/images/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.lua.org/images/",
    },
  },
  {
    id: "brand-perl",
    title: "Perl",
    path: "icons/brand-perl.svg",
    kind: "brand",
    source:
      "https://github.com/metacpan/perl-assets/blob/56b555711934dde8fd0b20ec29ecc3bf81a3d493/blessed/src/010.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/metacpan/perl-assets/blob/56b555711934dde8fd0b20ec29ecc3bf81a3d493/blessed/src/010.svg",
    },
  },
  {
    id: "brand-r",
    title: "R",
    path: "icons/brand-r.svg",
    kind: "brand",
    source: "https://www.r-project.org/logo/",
    license: {
      type: "CC-BY-SA-4.0",
      url: "https://spdx.org/licenses/CC-BY-SA-4.0",
    },
  },
  {
    id: "brand-julia",
    title: "Julia",
    path: "icons/brand-julia.svg",
    kind: "brand",
    source:
      "https://github.com/JuliaLang/julia-logo-graphics/blob/b5551ca7946b4a25746c045c15fbb8806610f8d0/images/julia-dots.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/JuliaLang/julia-logo-graphics/blob/b5551ca7946b4a25746c045c15fbb8806610f8d0/images/julia-dots.svg",
    },
  },
  {
    id: "brand-mongodb",
    title: "MongoDB",
    path: "icons/brand-mongodb.svg",
    kind: "brand",
    source: "https://www.mongodb.com/pressroom",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.mongodb.com/pressroom",
    },
  },
  {
    id: "brand-postgresql",
    title: "PostgreSQL",
    path: "icons/brand-postgresql.svg",
    kind: "brand",
    source: "https://wiki.postgresql.org/wiki/Logo",
    license: {
      type: "See upstream brand guidelines",
      url: "https://wiki.postgresql.org/wiki/Logo",
    },
  },
  {
    id: "brand-mysql",
    title: "MySQL",
    path: "icons/brand-mysql.svg",
    kind: "brand",
    source: "https://www.mysql.com/about/legal/logos.html",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.mysql.com/about/legal/logos.html",
    },
  },
  {
    id: "brand-mariadb",
    title: "MariaDB",
    path: "icons/brand-mariadb.svg",
    kind: "brand",
    source: "https://mariadb.com/about-us/logos/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://mariadb.com/about-us/logos/",
    },
  },
  {
    id: "brand-sqlite",
    title: "SQLite",
    path: "icons/brand-sqlite.svg",
    kind: "brand",
    source:
      "https://github.com/sqlite/sqlite/blob/43e862723ec680542ca6f608f9963c0993dd7324/art/sqlite370.eps",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/sqlite/sqlite/blob/43e862723ec680542ca6f608f9963c0993dd7324/art/sqlite370.eps",
    },
  },
  {
    id: "brand-redis",
    title: "Redis",
    path: "icons/brand-redis.svg",
    kind: "brand",
    source: "https://redis.io/brand-guidelines",
    license: {
      type: "See upstream brand guidelines",
      url: "https://redis.io/brand-guidelines",
    },
  },
  {
    id: "brand-firebase",
    title: "Firebase",
    path: "icons/brand-firebase.svg",
    kind: "brand",
    source: "https://firebase.google.com/brand-guidelines",
    license: {
      type: "See upstream brand guidelines",
      url: "https://firebase.google.com/brand-guidelines",
    },
  },
  {
    id: "brand-supabase",
    title: "Supabase",
    path: "icons/brand-supabase.svg",
    kind: "brand",
    source:
      "https://github.com/supabase/supabase/blob/4031a7549f5d46da7bc79c01d56be4177dc7c114/packages/common/assets/images/supabase-logo-wordmark--light.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/supabase/supabase/blob/4031a7549f5d46da7bc79c01d56be4177dc7c114/packages/common/assets/images/supabase-logo-wordmark--light.svg",
    },
  },
  {
    id: "brand-appwrite",
    title: "Appwrite",
    path: "icons/brand-appwrite.svg",
    kind: "brand",
    source: "https://appwrite.io/assets",
    license: {
      type: "See upstream brand guidelines",
      url: "https://appwrite.io/assets",
    },
  },
  {
    id: "brand-convex",
    title: "Convex",
    path: "icons/brand-convex.svg",
    kind: "brand",
    source: "https://www.convex.dev/brand",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.convex.dev/brand",
    },
  },
  {
    id: "brand-neon",
    title: "Neon",
    path: "icons/brand-neon.svg",
    kind: "brand",
    source: "https://neon.com/brand",
    license: {
      type: "See upstream brand guidelines",
      url: "https://neon.com/brand",
    },
  },
  {
    id: "brand-planetscale",
    title: "PlanetScale",
    path: "icons/brand-planetscale.svg",
    kind: "brand",
    source: "https://planetscale.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://planetscale.com",
    },
  },
  {
    id: "brand-cockroachlabs",
    title: "Cockroach Labs",
    path: "icons/brand-cockroachlabs.svg",
    kind: "brand",
    source: "https://www.cockroachlabs.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.cockroachlabs.com",
    },
  },
  {
    id: "brand-clickhouse",
    title: "ClickHouse",
    path: "icons/brand-clickhouse.svg",
    kind: "brand",
    source:
      "https://github.com/ClickHouse/ClickHouse/blob/12bd453a43819176d25ecf247033f6cb1af54beb/website/images/logo-clickhouse.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/ClickHouse/ClickHouse/blob/12bd453a43819176d25ecf247033f6cb1af54beb/website/images/logo-clickhouse.svg",
    },
  },
  {
    id: "brand-snowflake",
    title: "Snowflake",
    path: "icons/brand-snowflake.svg",
    kind: "brand",
    source: "https://www.snowflake.com/brand-guidelines/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.snowflake.com/brand-guidelines/",
    },
  },
  {
    id: "brand-databricks",
    title: "Databricks",
    path: "icons/brand-databricks.svg",
    kind: "brand",
    source: "https://www.databricks.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.databricks.com",
    },
  },
  {
    id: "brand-elasticsearch",
    title: "Elasticsearch",
    path: "icons/brand-elasticsearch.svg",
    kind: "brand",
    source: "https://www.elastic.co/brand",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.elastic.co/brand",
    },
  },
  {
    id: "brand-opensearch",
    title: "OpenSearch",
    path: "icons/brand-opensearch.svg",
    kind: "brand",
    source: "https://opensearch.org/trademark-brand-policy.html",
    license: {
      type: "See upstream brand guidelines",
      url: "https://opensearch.org/trademark-brand-policy.html",
    },
  },
  {
    id: "brand-meilisearch",
    title: "Meilisearch",
    path: "icons/brand-meilisearch.svg",
    kind: "brand",
    source: "https://www.meilisearch.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.meilisearch.com",
    },
  },
  {
    id: "brand-algolia",
    title: "Algolia",
    path: "icons/brand-algolia.svg",
    kind: "brand",
    source:
      "https://algolia.frontify.com/d/1AZwVNcFZiu7/style-guide#/basics/algolia-logo",
    license: {
      type: "See upstream brand guidelines",
      url: "https://algolia.frontify.com/d/1AZwVNcFZiu7/style-guide#/basics/algolia-logo",
    },
  },
  {
    id: "brand-milvus",
    title: "Milvus",
    path: "icons/brand-milvus.svg",
    kind: "brand",
    source:
      "https://github.com/milvus-io/artwork/blob/e30bffa2b0632b0d4cefcdd4e1a2c09fee5b0d28/icon/black/milvus-icon-black.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/milvus-io/artwork/blob/e30bffa2b0632b0d4cefcdd4e1a2c09fee5b0d28/icon/black/milvus-icon-black.svg",
    },
  },
  {
    id: "brand-qdrant",
    title: "Qdrant",
    path: "icons/brand-qdrant.svg",
    kind: "brand",
    source:
      "https://qdrant.tech/img/brand-resources-logos/qdrant-brandmark-white.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://qdrant.tech/img/brand-resources-logos/qdrant-brandmark-white.svg",
    },
  },
  {
    id: "brand-influxdb",
    title: "InfluxDB",
    path: "icons/brand-influxdb.svg",
    kind: "brand",
    source: "https://influxdata.github.io/branding/logo/downloads/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://influxdata.github.io/branding/logo/downloads/",
    },
  },
  {
    id: "brand-prometheus",
    title: "Prometheus",
    path: "icons/brand-prometheus.svg",
    kind: "brand",
    source: "https://prometheus.io",
    license: {
      type: "See upstream brand guidelines",
      url: "https://prometheus.io",
    },
  },
  {
    id: "brand-grafana",
    title: "Grafana",
    path: "icons/brand-grafana.svg",
    kind: "brand",
    source: "https://grafana.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://grafana.com",
    },
  },
  {
    id: "brand-opentelemetry",
    title: "OpenTelemetry",
    path: "icons/brand-opentelemetry.svg",
    kind: "brand",
    source: "https://cncf-branding.netlify.app/projects/opentelemetry/",
    license: {
      type: "CC-BY-4.0",
      url: "https://spdx.org/licenses/CC-BY-4.0",
    },
  },
  {
    id: "brand-sentry",
    title: "Sentry",
    path: "icons/brand-sentry.svg",
    kind: "brand",
    source: "https://sentry.io/branding/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://sentry.io/branding/",
    },
  },
  {
    id: "brand-datadog",
    title: "Datadog",
    path: "icons/brand-datadog.svg",
    kind: "brand",
    source: "https://www.datadoghq.com/about/resources",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.datadoghq.com/about/resources",
    },
  },
  {
    id: "brand-newrelic",
    title: "New Relic",
    path: "icons/brand-newrelic.svg",
    kind: "brand",
    source: "https://newrelic.com/about/media-assets",
    license: {
      type: "See upstream brand guidelines",
      url: "https://newrelic.com/about/media-assets",
    },
  },
  {
    id: "brand-mixpanel",
    title: "Mixpanel",
    path: "icons/brand-mixpanel.svg",
    kind: "brand",
    source: "https://mixpanel.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://mixpanel.com",
    },
  },
  {
    id: "brand-plausibleanalytics",
    title: "Plausible Analytics",
    path: "icons/brand-plausibleanalytics.svg",
    kind: "brand",
    source:
      "https://github.com/plausible/docs/blob/be5c935484e075f1e0caf3c9b3351ddd62348139/static/img/logo.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/plausible/docs/blob/be5c935484e075f1e0caf3c9b3351ddd62348139/static/img/logo.svg",
    },
  },
  {
    id: "brand-umami",
    title: "Umami",
    path: "icons/brand-umami.svg",
    kind: "brand",
    source:
      "https://github.com/umami-software/umami/blob/3572df0a09503f357a06fe7f816295ba2c878325/assets/logo.svg",
    license: {
      type: "MIT",
      url: "https://spdx.org/licenses/MIT",
    },
  },
  {
    id: "brand-betterstack",
    title: "Better Stack",
    path: "icons/brand-betterstack.svg",
    kind: "brand",
    source: "https://betterstack.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://betterstack.com",
    },
  },
  {
    id: "brand-zapier",
    title: "Zapier",
    path: "icons/brand-zapier.svg",
    kind: "brand",
    source:
      "https://www.figma.com/file/NQFxTCE5pGR3dHZt0DkOyy/Zapier-Brand-Guidelines-%5BExternal%5D?type=design&node-id=101-9701&mode=design",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.figma.com/file/NQFxTCE5pGR3dHZt0DkOyy/Zapier-Brand-Guidelines-%5BExternal%5D?type=design&node-id=101-9701&mode=design",
    },
  },
  {
    id: "brand-n8n",
    title: "n8n",
    path: "icons/brand-n8n.svg",
    kind: "brand",
    source: "https://n8n.io/press",
    license: {
      type: "See upstream brand guidelines",
      url: "https://n8n.io/press",
    },
  },
  {
    id: "brand-make",
    title: "Make",
    path: "icons/brand-make.svg",
    kind: "brand",
    source: "https://www.make.com/en/press",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.make.com/en/press",
    },
  },
  {
    id: "brand-temporal",
    title: "Temporal",
    path: "icons/brand-temporal.svg",
    kind: "brand",
    source:
      "https://github.com/temporalio/temporaldotio/blob/b6b5f3ed1fda818d5d6c07e27ec15d51a61f2267/public/images/icons/temporal-no-text.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/temporalio/temporaldotio/blob/b6b5f3ed1fda818d5d6c07e27ec15d51a61f2267/public/images/icons/temporal-no-text.svg",
    },
  },
  {
    id: "brand-apacheairflow",
    title: "Apache Airflow",
    path: "icons/brand-apacheairflow.svg",
    kind: "brand",
    source: "https://apache.org/logos",
    license: {
      type: "Apache-2.0",
      url: "https://spdx.org/licenses/Apache-2.0",
    },
  },
  {
    id: "brand-prefect",
    title: "Prefect",
    path: "icons/brand-prefect.svg",
    kind: "brand",
    source: "https://www.prefect.io",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.prefect.io",
    },
  },
  {
    id: "brand-rabbitmq",
    title: "RabbitMQ",
    path: "icons/brand-rabbitmq.svg",
    kind: "brand",
    source: "https://www.rabbitmq.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.rabbitmq.com",
    },
  },
  {
    id: "brand-apachekafka",
    title: "Apache Kafka",
    path: "icons/brand-apachekafka.svg",
    kind: "brand",
    source: "https://apache.org/logos",
    license: {
      type: "Apache-2.0",
      url: "https://spdx.org/licenses/Apache-2.0",
    },
  },
  {
    id: "brand-apachepulsar",
    title: "Apache Pulsar",
    path: "icons/brand-apachepulsar.svg",
    kind: "brand",
    source: "https://apache.org/logos",
    license: {
      type: "Apache-2.0",
      url: "https://spdx.org/licenses/Apache-2.0",
    },
  },
  {
    id: "brand-mqtt",
    title: "MQTT",
    path: "icons/brand-mqtt.svg",
    kind: "brand",
    source: "https://mqtt.org",
    license: {
      type: "See upstream brand guidelines",
      url: "https://mqtt.org",
    },
  },
  {
    id: "brand-apacheflink",
    title: "Apache Flink",
    path: "icons/brand-apacheflink.svg",
    kind: "brand",
    source: "https://apache.org/logos",
    license: {
      type: "Apache-2.0",
      url: "https://spdx.org/licenses/Apache-2.0",
    },
  },
  {
    id: "brand-apachespark",
    title: "Apache Spark",
    path: "icons/brand-apachespark.svg",
    kind: "brand",
    source: "https://apache.org/logos",
    license: {
      type: "Apache-2.0",
      url: "https://spdx.org/licenses/Apache-2.0",
    },
  },
  {
    id: "brand-airbyte",
    title: "Airbyte",
    path: "icons/brand-airbyte.svg",
    kind: "brand",
    source: "https://airbyte.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://airbyte.com",
    },
  },
  {
    id: "brand-vercel",
    title: "Vercel",
    path: "icons/brand-vercel.svg",
    kind: "brand",
    source: "https://vercel.com/geist/brands",
    license: {
      type: "See upstream brand guidelines",
      url: "https://vercel.com/geist/brands",
    },
  },
  {
    id: "brand-netlify",
    title: "Netlify",
    path: "icons/brand-netlify.svg",
    kind: "brand",
    source: "https://www.netlify.com/press/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.netlify.com/press/",
    },
  },
  {
    id: "brand-cloudflare",
    title: "Cloudflare",
    path: "icons/brand-cloudflare.svg",
    kind: "brand",
    source: "https://www.cloudflare.com/logo/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.cloudflare.com/logo/",
    },
  },
  {
    id: "brand-flydotio",
    title: "Fly.io",
    path: "icons/brand-flydotio.svg",
    kind: "brand",
    source: "https://fly.io/docs/about/brand",
    license: {
      type: "See upstream brand guidelines",
      url: "https://fly.io/docs/about/brand",
    },
  },
  {
    id: "brand-railway",
    title: "Railway",
    path: "icons/brand-railway.svg",
    kind: "brand",
    source: "https://railway.app",
    license: {
      type: "See upstream brand guidelines",
      url: "https://railway.app",
    },
  },
  {
    id: "brand-render",
    title: "Render",
    path: "icons/brand-render.svg",
    kind: "brand",
    source: "https://render.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://render.com",
    },
  },
  {
    id: "brand-digitalocean",
    title: "DigitalOcean",
    path: "icons/brand-digitalocean.svg",
    kind: "brand",
    source: "https://www.digitalocean.com/press/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.digitalocean.com/press/",
    },
  },
  {
    id: "brand-hetzner",
    title: "Hetzner",
    path: "icons/brand-hetzner.svg",
    kind: "brand",
    source: "https://www.hetzner.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.hetzner.com",
    },
  },
  {
    id: "brand-scaleway",
    title: "Scaleway",
    path: "icons/brand-scaleway.svg",
    kind: "brand",
    source: "https://ultraviolet.scaleway.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://ultraviolet.scaleway.com",
    },
  },
  {
    id: "brand-vultr",
    title: "Vultr",
    path: "icons/brand-vultr.svg",
    kind: "brand",
    source: "https://www.vultr.com/company/brand-assets",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.vultr.com/company/brand-assets",
    },
  },
  {
    id: "brand-googlecloud",
    title: "Google Cloud",
    path: "icons/brand-googlecloud.svg",
    kind: "brand",
    source: "https://cloud.google.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://cloud.google.com",
    },
  },
  {
    id: "brand-alibabacloud",
    title: "Alibaba Cloud",
    path: "icons/brand-alibabacloud.svg",
    kind: "brand",
    source: "https://www.alibabagroup.com/en/ir/reports",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.alibabagroup.com/en/ir/reports",
    },
  },
  {
    id: "brand-kubernetes",
    title: "Kubernetes",
    path: "icons/brand-kubernetes.svg",
    kind: "brand",
    source:
      "https://github.com/kubernetes/kubernetes/tree/cac53883f4714452f3084a22e4be20d042a9df33/logo",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/kubernetes/kubernetes/tree/cac53883f4714452f3084a22e4be20d042a9df33/logo",
    },
  },
  {
    id: "brand-helm",
    title: "Helm",
    path: "icons/brand-helm.svg",
    kind: "brand",
    source: "https://helm.sh",
    license: {
      type: "See upstream brand guidelines",
      url: "https://helm.sh",
    },
  },
  {
    id: "brand-terraform",
    title: "Terraform",
    path: "icons/brand-terraform.svg",
    kind: "brand",
    source: "https://www.hashicorp.com/brand",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.hashicorp.com/brand",
    },
  },
  {
    id: "brand-opentofu",
    title: "OpenTofu",
    path: "icons/brand-opentofu.svg",
    kind: "brand",
    source:
      "https://github.com/opentofu/brand-artifacts/blob/0d4d0d6050ca0ff06471400bc3249a64c145f659/symbol-only/transparent/SVG/on-light-mono.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/opentofu/brand-artifacts/blob/0d4d0d6050ca0ff06471400bc3249a64c145f659/symbol-only/transparent/SVG/on-light-mono.svg",
    },
  },
  {
    id: "brand-pulumi",
    title: "Pulumi",
    path: "icons/brand-pulumi.svg",
    kind: "brand",
    source: "https://www.pulumi.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.pulumi.com",
    },
  },
  {
    id: "brand-ansible",
    title: "Ansible",
    path: "icons/brand-ansible.svg",
    kind: "brand",
    source: "https://www.ansible.com/logos",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.ansible.com/logos",
    },
  },
  {
    id: "brand-puppet",
    title: "Puppet",
    path: "icons/brand-puppet.svg",
    kind: "brand",
    source: "https://puppet.com/company/press-room/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://puppet.com/company/press-room/",
    },
  },
  {
    id: "brand-chef",
    title: "Chef",
    path: "icons/brand-chef.svg",
    kind: "brand",
    source: "https://www.chef.io",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.chef.io",
    },
  },
  {
    id: "brand-vagrant",
    title: "Vagrant",
    path: "icons/brand-vagrant.svg",
    kind: "brand",
    source: "https://www.hashicorp.com/brand",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.hashicorp.com/brand",
    },
  },
  {
    id: "brand-packer",
    title: "Packer",
    path: "icons/brand-packer.svg",
    kind: "brand",
    source: "https://www.hashicorp.com/brand",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.hashicorp.com/brand",
    },
  },
  {
    id: "brand-nomad",
    title: "Nomad",
    path: "icons/brand-nomad.svg",
    kind: "brand",
    source: "https://www.hashicorp.com/brand",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.hashicorp.com/brand",
    },
  },
  {
    id: "brand-consul",
    title: "Consul",
    path: "icons/brand-consul.svg",
    kind: "brand",
    source: "https://www.hashicorp.com/brand",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.hashicorp.com/brand",
    },
  },
  {
    id: "brand-vault",
    title: "Vault",
    path: "icons/brand-vault.svg",
    kind: "brand",
    source: "https://www.hashicorp.com/brand",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.hashicorp.com/brand",
    },
  },
  {
    id: "brand-nginx",
    title: "NGINX",
    path: "icons/brand-nginx.svg",
    kind: "brand",
    source: "https://www.nginx.com/press/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.nginx.com/press/",
    },
  },
  {
    id: "brand-apache",
    title: "Apache",
    path: "icons/brand-apache.svg",
    kind: "brand",
    source: "https://www.apache.org/foundation/press/kit",
    license: {
      type: "Apache-2.0",
      url: "https://spdx.org/licenses/Apache-2.0",
    },
  },
  {
    id: "brand-caddy",
    title: "Caddy",
    path: "icons/brand-caddy.svg",
    kind: "brand",
    source: "https://caddyserver.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://caddyserver.com",
    },
  },
  {
    id: "brand-istio",
    title: "Istio",
    path: "icons/brand-istio.svg",
    kind: "brand",
    source:
      "https://github.com/istio/istio/blob/5a047251817eb2523af297607b7614120812e47a/logo/istio-bluelogo-whitebackground-unframed.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/istio/istio/blob/5a047251817eb2523af297607b7614120812e47a/logo/istio-bluelogo-whitebackground-unframed.svg",
    },
  },
  {
    id: "brand-linkerd",
    title: "Linkerd",
    path: "icons/brand-linkerd.svg",
    kind: "brand",
    source: "https://cncf-branding.netlify.app/projects/linkerd/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://cncf-branding.netlify.app/projects/linkerd/",
    },
  },
  {
    id: "brand-tailscale",
    title: "Tailscale",
    path: "icons/brand-tailscale.svg",
    kind: "brand",
    source: "https://tailscale.com/press",
    license: {
      type: "See upstream brand guidelines",
      url: "https://tailscale.com/press",
    },
  },
  {
    id: "brand-wireguard",
    title: "WireGuard",
    path: "icons/brand-wireguard.svg",
    kind: "brand",
    source: "https://www.wireguard.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.wireguard.com",
    },
  },
  {
    id: "brand-openvpn",
    title: "OpenVPN",
    path: "icons/brand-openvpn.svg",
    kind: "brand",
    source: "https://openvpn.net",
    license: {
      type: "See upstream brand guidelines",
      url: "https://openvpn.net",
    },
  },
  {
    id: "brand-authentik",
    title: "Authentik",
    path: "icons/brand-authentik.svg",
    kind: "brand",
    source:
      "https://github.com/goauthentik/authentik/blob/2c64f72ebc57dad9789c1fb799dd7cd39003d043/web/icons/icon.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/goauthentik/authentik/blob/2c64f72ebc57dad9789c1fb799dd7cd39003d043/web/icons/icon.svg",
    },
  },
  {
    id: "brand-authelia",
    title: "Authelia",
    path: "icons/brand-authelia.svg",
    kind: "brand",
    source:
      "https://github.com/authelia/authelia/blob/8316cd4eb7a6f0778c8f480c61ad76a88416fc3a/docs/static/images/branding/logo.svg",
    license: {
      type: "Apache-2.0",
      url: "https://spdx.org/licenses/Apache-2.0",
    },
  },
  {
    id: "brand-keycloak",
    title: "Keycloak",
    path: "icons/brand-keycloak.svg",
    kind: "brand",
    source:
      "https://github.com/keycloak/keycloak-misc/blob/dee033f2d6d6b5c3a6ce8eb84e285f7e5626dbf6/logo/icon-black.svg",
    license: {
      type: "custom",
      url: "https://www.linuxfoundation.org/legal/trademark-usage",
    },
  },
  {
    id: "brand-auth0",
    title: "Auth0",
    path: "icons/brand-auth0.svg",
    kind: "brand",
    source: "https://auth0.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://auth0.com",
    },
  },
  {
    id: "brand-clerk",
    title: "Clerk",
    path: "icons/brand-clerk.svg",
    kind: "brand",
    source: "https://clerk.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://clerk.com",
    },
  },
  {
    id: "brand-okta",
    title: "Okta",
    path: "icons/brand-okta.svg",
    kind: "brand",
    source: "https://www.okta.com/press-room/media-assets/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.okta.com/press-room/media-assets/",
    },
  },
  {
    id: "brand-jsonwebtokens",
    title: "JSON Web Tokens",
    path: "icons/brand-jsonwebtokens.svg",
    kind: "brand",
    source: "https://jwt.io",
    license: {
      type: "See upstream brand guidelines",
      url: "https://jwt.io",
    },
  },
  {
    id: "brand-letsencrypt",
    title: "Let's Encrypt",
    path: "icons/brand-letsencrypt.svg",
    kind: "brand",
    source: "https://letsencrypt.org/trademarks/",
    license: {
      type: "CC-BY-NC-4.0",
      url: "https://spdx.org/licenses/CC-BY-NC-4.0",
    },
  },
  {
    id: "brand-stripe",
    title: "Stripe",
    path: "icons/brand-stripe.svg",
    kind: "brand",
    source: "https://stripe.com/newsroom/information",
    license: {
      type: "See upstream brand guidelines",
      url: "https://stripe.com/newsroom/information",
    },
  },
  {
    id: "brand-paypal",
    title: "PayPal",
    path: "icons/brand-paypal.svg",
    kind: "brand",
    source: "https://www.paypal.com/us",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.paypal.com/us",
    },
  },
  {
    id: "brand-lemonsqueezy",
    title: "Lemon Squeezy",
    path: "icons/brand-lemonsqueezy.svg",
    kind: "brand",
    source: "https://www.lemonsqueezy.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.lemonsqueezy.com",
    },
  },
  {
    id: "brand-paddle",
    title: "Paddle",
    path: "icons/brand-paddle.svg",
    kind: "brand",
    source: "https://www.paddle.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.paddle.com",
    },
  },
  {
    id: "brand-razorpay",
    title: "Razorpay",
    path: "icons/brand-razorpay.svg",
    kind: "brand",
    source: "https://razorpay.com/newsroom/brand-assets/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://razorpay.com/newsroom/brand-assets/",
    },
  },
  {
    id: "brand-adyen",
    title: "Adyen",
    path: "icons/brand-adyen.svg",
    kind: "brand",
    source: "https://www.adyen.com/press-and-media/presskit",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.adyen.com/press-and-media/presskit",
    },
  },
  {
    id: "brand-braintree",
    title: "Braintree",
    path: "icons/brand-braintree.svg",
    kind: "brand",
    source: "https://www.braintreepayments.com/press",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.braintreepayments.com/press",
    },
  },
  {
    id: "brand-square",
    title: "Square",
    path: "icons/brand-square.svg",
    kind: "brand",
    source: "https://squareup.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://squareup.com",
    },
  },
  {
    id: "brand-wise",
    title: "Wise",
    path: "icons/brand-wise.svg",
    kind: "brand",
    source: "https://wise.design/foundations/logo",
    license: {
      type: "See upstream brand guidelines",
      url: "https://wise.design/foundations/logo",
    },
  },
  {
    id: "brand-revolut",
    title: "Revolut",
    path: "icons/brand-revolut.svg",
    kind: "brand",
    source:
      "https://developer.revolut.com/docs/resources/marketing-assets-guidelines/marketing-guidelines",
    license: {
      type: "See upstream brand guidelines",
      url: "https://developer.revolut.com/docs/resources/marketing-assets-guidelines/marketing-guidelines",
    },
  },
  {
    id: "brand-shopify",
    title: "Shopify",
    path: "icons/brand-shopify.svg",
    kind: "brand",
    source: "https://www.shopify.com/brand-assets",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.shopify.com/brand-assets",
    },
  },
  {
    id: "brand-woocommerce",
    title: "WooCommerce",
    path: "icons/brand-woocommerce.svg",
    kind: "brand",
    source: "https://woocommerce.com/style-guide",
    license: {
      type: "See upstream brand guidelines",
      url: "https://woocommerce.com/style-guide",
    },
  },
  {
    id: "brand-bigcommerce",
    title: "BigCommerce",
    path: "icons/brand-bigcommerce.svg",
    kind: "brand",
    source: "https://www.bigcommerce.co.uk/press",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.bigcommerce.co.uk/press",
    },
  },
  {
    id: "brand-medusa",
    title: "Medusa",
    path: "icons/brand-medusa.svg",
    kind: "brand",
    source:
      "https://github.com/medusajs/medusa/blob/5b91a3503af41b94697a5c27c35268c29e9bd135/www/docs/static/img/logo.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/medusajs/medusa/blob/5b91a3503af41b94697a5c27c35268c29e9bd135/www/docs/static/img/logo.svg",
    },
  },
  {
    id: "brand-sanity",
    title: "Sanity",
    path: "icons/brand-sanity.svg",
    kind: "brand",
    source:
      "https://github.com/sanity-io/logos/blob/e298a1ac2757c83910fe08b496a115bc9aef06bd/src/sanityMonogram.tsx",
    license: {
      type: "MIT",
      url: "https://spdx.org/licenses/MIT",
    },
  },
  {
    id: "brand-contentful",
    title: "Contentful",
    path: "icons/brand-contentful.svg",
    kind: "brand",
    source: "https://press.contentful.com/media_kits",
    license: {
      type: "See upstream brand guidelines",
      url: "https://press.contentful.com/media_kits",
    },
  },
  {
    id: "brand-strapi",
    title: "Strapi",
    path: "icons/brand-strapi.svg",
    kind: "brand",
    source: "https://handbook.strapi.io/strapi-brand-book-2022/strapi-logo",
    license: {
      type: "See upstream brand guidelines",
      url: "https://handbook.strapi.io/strapi-brand-book-2022/strapi-logo",
    },
  },
  {
    id: "brand-directus",
    title: "Directus",
    path: "icons/brand-directus.svg",
    kind: "brand",
    source: "https://directus.io",
    license: {
      type: "See upstream brand guidelines",
      url: "https://directus.io",
    },
  },
  {
    id: "brand-ghost",
    title: "Ghost",
    path: "icons/brand-ghost.svg",
    kind: "brand",
    source:
      "https://github.com/TryGhost/Admin/blob/e3e1fa3353767c3729b1658ad42cc35f883470c5/public/assets/icons/icon.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/TryGhost/Admin/blob/e3e1fa3353767c3729b1658ad42cc35f883470c5/public/assets/icons/icon.svg",
    },
  },
  {
    id: "brand-wordpress",
    title: "WordPress",
    path: "icons/brand-wordpress.svg",
    kind: "brand",
    source: "https://wordpress.org/about/logos",
    license: {
      type: "See upstream brand guidelines",
      url: "https://wordpress.org/about/logos",
    },
  },
  {
    id: "brand-drupal",
    title: "Drupal",
    path: "icons/brand-drupal.svg",
    kind: "brand",
    source: "https://www.drupal.org/about/media-kit/logos",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.drupal.org/about/media-kit/logos",
    },
  },
  {
    id: "brand-webflow",
    title: "Webflow",
    path: "icons/brand-webflow.svg",
    kind: "brand",
    source: "https://brand-at.webflow.io/resources#logos",
    license: {
      type: "See upstream brand guidelines",
      url: "https://brand-at.webflow.io/resources#logos",
    },
  },
  {
    id: "brand-framer",
    title: "Framer",
    path: "icons/brand-framer.svg",
    kind: "brand",
    source: "https://framer.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://framer.com",
    },
  },
  {
    id: "brand-wix",
    title: "Wix",
    path: "icons/brand-wix.svg",
    kind: "brand",
    source: "https://www.wix.com/about/design-assets",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.wix.com/about/design-assets",
    },
  },
  {
    id: "brand-squarespace",
    title: "Squarespace",
    path: "icons/brand-squarespace.svg",
    kind: "brand",
    source: "https://www.squarespace.com/logo-guidelines",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.squarespace.com/logo-guidelines",
    },
  },
  {
    id: "brand-notion",
    title: "Notion",
    path: "icons/brand-notion.svg",
    kind: "brand",
    source: "https://www.notion.so",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.notion.so",
    },
  },
  {
    id: "brand-obsidian",
    title: "Obsidian",
    path: "icons/brand-obsidian.svg",
    kind: "brand",
    source: "https://obsidian.md",
    license: {
      type: "See upstream brand guidelines",
      url: "https://obsidian.md",
    },
  },
  {
    id: "brand-logseq",
    title: "Logseq",
    path: "icons/brand-logseq.svg",
    kind: "brand",
    source:
      "https://github.com/logseq/logseq/blob/c4d15ec8487c9fb6b6f41780fc1abddab89491e4/resources/icon.png",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/logseq/logseq/blob/c4d15ec8487c9fb6b6f41780fc1abddab89491e4/resources/icon.png",
    },
  },
  {
    id: "brand-evernote",
    title: "Evernote",
    path: "icons/brand-evernote.svg",
    kind: "brand",
    source: "https://evernote.com/about-us",
    license: {
      type: "See upstream brand guidelines",
      url: "https://evernote.com/about-us",
    },
  },
  {
    id: "brand-dropbox",
    title: "Dropbox",
    path: "icons/brand-dropbox.svg",
    kind: "brand",
    source: "https://www.dropbox.com/branding",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.dropbox.com/branding",
    },
  },
  {
    id: "brand-googledrive",
    title: "Google Drive",
    path: "icons/brand-googledrive.svg",
    kind: "brand",
    source: "https://developers.google.com/drive/web/branding",
    license: {
      type: "See upstream brand guidelines",
      url: "https://developers.google.com/drive/web/branding",
    },
  },
  {
    id: "brand-icloud",
    title: "iCloud",
    path: "icons/brand-icloud.svg",
    kind: "brand",
    source: "https://commons.wikimedia.org/wiki/File:ICloud_logo.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://commons.wikimedia.org/wiki/File:ICloud_logo.svg",
    },
  },
  {
    id: "brand-box",
    title: "Box",
    path: "icons/brand-box.svg",
    kind: "brand",
    source: "https://www.box.com/en-gb/about-us/press",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.box.com/en-gb/about-us/press",
    },
  },
  {
    id: "brand-protondrive",
    title: "Proton Drive",
    path: "icons/brand-protondrive.svg",
    kind: "brand",
    source: "https://proton.me/media/kit",
    license: {
      type: "See upstream brand guidelines",
      url: "https://proton.me/media/kit",
    },
  },
  {
    id: "brand-discord",
    title: "Discord",
    path: "icons/brand-discord.svg",
    kind: "brand",
    source: "https://discord.com/branding",
    license: {
      type: "See upstream brand guidelines",
      url: "https://discord.com/branding",
    },
  },
  {
    id: "brand-telegram",
    title: "Telegram",
    path: "icons/brand-telegram.svg",
    kind: "brand",
    source: "https://telegram.org/tour/screenshots",
    license: {
      type: "See upstream brand guidelines",
      url: "https://telegram.org/tour/screenshots",
    },
  },
  {
    id: "brand-whatsapp",
    title: "WhatsApp",
    path: "icons/brand-whatsapp.svg",
    kind: "brand",
    source: "https://about.meta.com/brand/resources/whatsapp/whatsapp-brand",
    license: {
      type: "See upstream brand guidelines",
      url: "https://about.meta.com/brand/resources/whatsapp/whatsapp-brand",
    },
  },
  {
    id: "brand-signal",
    title: "Signal",
    path: "icons/brand-signal.svg",
    kind: "brand",
    source: "https://signal.org/brand",
    license: {
      type: "See upstream brand guidelines",
      url: "https://signal.org/brand",
    },
  },
  {
    id: "brand-matrix",
    title: "Matrix",
    path: "icons/brand-matrix.svg",
    kind: "brand",
    source: "https://matrix.org",
    license: {
      type: "See upstream brand guidelines",
      url: "https://matrix.org",
    },
  },
  {
    id: "brand-mattermost",
    title: "Mattermost",
    path: "icons/brand-mattermost.svg",
    kind: "brand",
    source: "https://www.mattermost.org/brand-guidelines/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.mattermost.org/brand-guidelines/",
    },
  },
  {
    id: "brand-zulip",
    title: "Zulip",
    path: "icons/brand-zulip.svg",
    kind: "brand",
    source:
      "https://github.com/zulip/zulip/blob/df9e40491dc77b658d943cff36a816d46e32ce1b/static/images/logo/zulip-org-logo.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/zulip/zulip/blob/df9e40491dc77b658d943cff36a816d46e32ce1b/static/images/logo/zulip-org-logo.svg",
    },
  },
  {
    id: "brand-zoom",
    title: "Zoom",
    path: "icons/brand-zoom.svg",
    kind: "brand",
    source: "https://brand.zoom.us/media-library/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://brand.zoom.us/media-library/",
    },
  },
  {
    id: "brand-googlemeet",
    title: "Google Meet",
    path: "icons/brand-googlemeet.svg",
    kind: "brand",
    source: "https://about.google/brand-resource-center/logos-list/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://about.google/brand-resource-center/logos-list/",
    },
  },
  {
    id: "brand-webex",
    title: "Webex",
    path: "icons/brand-webex.svg",
    kind: "brand",
    source:
      "https://github.com/momentum-design/momentum-ui/blob/970c5bec962a3f72e17e0b7ed69f2c38d298c405/icons-rebrand/svg/webex-helix-filled.svg",
    license: {
      type: "custom",
      url: "https://www.cisco.com/c/en/us/about/legal/trademarks.html",
    },
  },
  {
    id: "brand-jitsi",
    title: "Jitsi",
    path: "icons/brand-jitsi.svg",
    kind: "brand",
    source:
      "https://github.com/jitsi/jitsi-meet/blob/767101497c9a52abf8cef7893e8d6e7e4283bbfc/images/watermark.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/jitsi/jitsi-meet/blob/767101497c9a52abf8cef7893e8d6e7e4283bbfc/images/watermark.svg",
    },
  },
  {
    id: "brand-linear",
    title: "Linear",
    path: "icons/brand-linear.svg",
    kind: "brand",
    source: "https://linear.app",
    license: {
      type: "See upstream brand guidelines",
      url: "https://linear.app",
    },
  },
  {
    id: "brand-jira",
    title: "Jira",
    path: "icons/brand-jira.svg",
    kind: "brand",
    source: "https://atlassian.design/resources/logo-library",
    license: {
      type: "See upstream brand guidelines",
      url: "https://atlassian.design/resources/logo-library",
    },
  },
  {
    id: "brand-trello",
    title: "Trello",
    path: "icons/brand-trello.svg",
    kind: "brand",
    source: "https://atlassian.design/resources/logo-library",
    license: {
      type: "See upstream brand guidelines",
      url: "https://atlassian.design/resources/logo-library",
    },
  },
  {
    id: "brand-asana",
    title: "Asana",
    path: "icons/brand-asana.svg",
    kind: "brand",
    source: "https://asana.com/brand",
    license: {
      type: "See upstream brand guidelines",
      url: "https://asana.com/brand",
    },
  },
  {
    id: "brand-clickup",
    title: "ClickUp",
    path: "icons/brand-clickup.svg",
    kind: "brand",
    source: "https://clickup.com/brand",
    license: {
      type: "See upstream brand guidelines",
      url: "https://clickup.com/brand",
    },
  },
  {
    id: "brand-todoist",
    title: "Todoist",
    path: "icons/brand-todoist.svg",
    kind: "brand",
    source: "https://doist.com/press",
    license: {
      type: "See upstream brand guidelines",
      url: "https://doist.com/press",
    },
  },
  {
    id: "brand-ticktick",
    title: "TickTick",
    path: "icons/brand-ticktick.svg",
    kind: "brand",
    source: "https://ticktick.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://ticktick.com",
    },
  },
  {
    id: "brand-basecamp",
    title: "Basecamp",
    path: "icons/brand-basecamp.svg",
    kind: "brand",
    source: "https://basecamp.com/about/press",
    license: {
      type: "See upstream brand guidelines",
      url: "https://basecamp.com/about/press",
    },
  },
  {
    id: "brand-redmine",
    title: "Redmine",
    path: "icons/brand-redmine.svg",
    kind: "brand",
    source: "https://www.redmine.org/projects/redmine/wiki/logo",
    license: {
      type: "CC-BY-SA-2.5",
      url: "https://spdx.org/licenses/CC-BY-SA-2.5",
    },
  },
  {
    id: "brand-plane",
    title: "Plane",
    path: "icons/brand-plane.svg",
    kind: "brand",
    source: "https://plane.so/brand-logos/logo-with-wordmark.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://plane.so/brand-logos/logo-with-wordmark.svg",
    },
  },
  {
    id: "brand-shortcut",
    title: "Shortcut",
    path: "icons/brand-shortcut.svg",
    kind: "brand",
    source: "https://www.shortcut.com/branding",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.shortcut.com/branding",
    },
  },
  {
    id: "brand-figma",
    title: "Figma",
    path: "icons/brand-figma.svg",
    kind: "brand",
    source: "https://www.figma.com/using-the-figma-brand/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.figma.com/using-the-figma-brand/",
    },
  },
  {
    id: "brand-sketch",
    title: "Sketch",
    path: "icons/brand-sketch.svg",
    kind: "brand",
    source: "https://www.sketch.com/about-us/#press",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.sketch.com/about-us/#press",
    },
  },
  {
    id: "brand-penpot",
    title: "Penpot",
    path: "icons/brand-penpot.svg",
    kind: "brand",
    source: "https://penpot.app",
    license: {
      type: "See upstream brand guidelines",
      url: "https://penpot.app",
    },
  },
  {
    id: "brand-excalidraw",
    title: "Excalidraw",
    path: "icons/brand-excalidraw.svg",
    kind: "brand",
    source: "https://excalidraw.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://excalidraw.com",
    },
  },
  {
    id: "brand-miro",
    title: "Miro",
    path: "icons/brand-miro.svg",
    kind: "brand",
    source: "https://miro.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://miro.com",
    },
  },
  {
    id: "brand-tldraw",
    title: "tldraw",
    path: "icons/brand-tldraw.svg",
    kind: "brand",
    source: "https://tldraw.dev",
    license: {
      type: "See upstream brand guidelines",
      url: "https://tldraw.dev",
    },
  },
  {
    id: "brand-inkscape",
    title: "Inkscape",
    path: "icons/brand-inkscape.svg",
    kind: "brand",
    source:
      "https://inkscape.org/gallery/=inkscape-branding/inkscape-brand-assets/",
    license: {
      type: "CC-BY-SA-3.0",
      url: "https://spdx.org/licenses/CC-BY-SA-3.0",
    },
  },
  {
    id: "brand-blender",
    title: "Blender",
    path: "icons/brand-blender.svg",
    kind: "brand",
    source: "https://www.blender.org/about/logo",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.blender.org/about/logo",
    },
  },
  {
    id: "brand-gimp",
    title: "GIMP",
    path: "icons/brand-gimp.svg",
    kind: "brand",
    source:
      "https://gitlab.gnome.org/GNOME/gimp-data/-/blob/e62f1905dcef7ec831ea6c052bb035eb37eaa69e/images/logo/gimp-logo-unicolor.svg",
    license: {
      type: "CC-BY-SA-4.0",
      url: "https://spdx.org/licenses/CC-BY-SA-4.0",
    },
  },
  {
    id: "brand-krita",
    title: "Krita",
    path: "icons/brand-krita.svg",
    kind: "brand",
    source: "https://krita.org/en/about/press/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://krita.org/en/about/press/",
    },
  },
  {
    id: "brand-githubactions",
    title: "GitHub Actions",
    path: "icons/brand-githubactions.svg",
    kind: "brand",
    source: "https://github.com/features/actions",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/features/actions",
    },
  },
  {
    id: "brand-circleci",
    title: "CircleCI",
    path: "icons/brand-circleci.svg",
    kind: "brand",
    source: "https://circleci.com/press",
    license: {
      type: "See upstream brand guidelines",
      url: "https://circleci.com/press",
    },
  },
  {
    id: "brand-travisci",
    title: "Travis CI",
    path: "icons/brand-travisci.svg",
    kind: "brand",
    source: "https://travis-ci.com/logo",
    license: {
      type: "See upstream brand guidelines",
      url: "https://travis-ci.com/logo",
    },
  },
  {
    id: "brand-jenkins",
    title: "Jenkins",
    path: "icons/brand-jenkins.svg",
    kind: "brand",
    source: "https://get.jenkins.io/art/",
    license: {
      type: "CC-BY-SA-3.0",
      url: "https://spdx.org/licenses/CC-BY-SA-3.0",
    },
  },
  {
    id: "brand-buildkite",
    title: "Buildkite",
    path: "icons/brand-buildkite.svg",
    kind: "brand",
    source: "https://buildkite.com/brand-assets",
    license: {
      type: "See upstream brand guidelines",
      url: "https://buildkite.com/brand-assets",
    },
  },
  {
    id: "brand-teamcity",
    title: "TeamCity",
    path: "icons/brand-teamcity.svg",
    kind: "brand",
    source: "https://www.jetbrains.com/company/brand/logos",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.jetbrains.com/company/brand/logos",
    },
  },
  {
    id: "brand-drone",
    title: "Drone",
    path: "icons/brand-drone.svg",
    kind: "brand",
    source:
      "https://github.com/drone/brand/tree/f3ba7a1ad3c35abfe9571ea9c3ea93dff9912955",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/drone/brand/tree/f3ba7a1ad3c35abfe9571ea9c3ea93dff9912955",
    },
  },
  {
    id: "brand-argo",
    title: "Argo",
    path: "icons/brand-argo.svg",
    kind: "brand",
    source:
      "https://github.com/cncf/artwork/blob/c2e619cdf85e8bac090ceca7c0834c5cfedf9426/projects/argo/icon/black/argo-icon-black.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/cncf/artwork/blob/c2e619cdf85e8bac090ceca7c0834c5cfedf9426/projects/argo/icon/black/argo-icon-black.svg",
    },
  },
  {
    id: "brand-codeship",
    title: "Codeship",
    path: "icons/brand-codeship.svg",
    kind: "brand",
    source: "https://app.codeship.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://app.codeship.com",
    },
  },
  {
    id: "brand-codecov",
    title: "Codecov",
    path: "icons/brand-codecov.svg",
    kind: "brand",
    source: "https://codecov.io",
    license: {
      type: "See upstream brand guidelines",
      url: "https://codecov.io",
    },
  },
  {
    id: "brand-coveralls",
    title: "Coveralls",
    path: "icons/brand-coveralls.svg",
    kind: "brand",
    source: "https://coveralls.io",
    license: {
      type: "See upstream brand guidelines",
      url: "https://coveralls.io",
    },
  },
  {
    id: "brand-codacy",
    title: "Codacy",
    path: "icons/brand-codacy.svg",
    kind: "brand",
    source: "https://www.codacy.com/blog/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.codacy.com/blog/",
    },
  },
  {
    id: "brand-coderabbit",
    title: "CodeRabbit",
    path: "icons/brand-coderabbit.svg",
    kind: "brand",
    source: "https://www.coderabbit.ai/brand",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.coderabbit.ai/brand",
    },
  },
  {
    id: "brand-snyk",
    title: "Snyk",
    path: "icons/brand-snyk.svg",
    kind: "brand",
    source: "https://snyk.io/press-kit",
    license: {
      type: "See upstream brand guidelines",
      url: "https://snyk.io/press-kit",
    },
  },
  {
    id: "brand-socket",
    title: "Socket",
    path: "icons/brand-socket.svg",
    kind: "brand",
    source:
      "https://github.com/SocketDev/vscode-socket-security/blob/06c5fdc59fad40ae87b3d42c5c42cd17c6edaf17/logo-red.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/SocketDev/vscode-socket-security/blob/06c5fdc59fad40ae87b3d42c5c42cd17c6edaf17/logo-red.svg",
    },
  },
  {
    id: "brand-dependabot",
    title: "Dependabot",
    path: "icons/brand-dependabot.svg",
    kind: "brand",
    source: "https://dependabot.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://dependabot.com",
    },
  },
  {
    id: "brand-renovate",
    title: "Renovate",
    path: "icons/brand-renovate.svg",
    kind: "brand",
    source:
      "https://github.com/user-attachments/assets/8533178e-b2c4-4e15-bb3d-8df9e19e3760",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/user-attachments/assets/8533178e-b2c4-4e15-bb3d-8df9e19e3760",
    },
  },
  {
    id: "brand-trivy",
    title: "Trivy",
    path: "icons/brand-trivy.svg",
    kind: "brand",
    source: "https://www.aquasec.com/brand",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.aquasec.com/brand",
    },
  },
  {
    id: "brand-checkmarx",
    title: "Checkmarx",
    path: "icons/brand-checkmarx.svg",
    kind: "brand",
    source: "https://www.checkmarx.com/resources/datasheets/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.checkmarx.com/resources/datasheets/",
    },
  },
  {
    id: "brand-saucelabs",
    title: "Sauce Labs",
    path: "icons/brand-saucelabs.svg",
    kind: "brand",
    source: "https://saucelabs.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://saucelabs.com",
    },
  },
  {
    id: "brand-postman",
    title: "Postman",
    path: "icons/brand-postman.svg",
    kind: "brand",
    source: "https://www.getpostman.com/resources/media-assets/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.getpostman.com/resources/media-assets/",
    },
  },
  {
    id: "brand-insomnia",
    title: "Insomnia",
    path: "icons/brand-insomnia.svg",
    kind: "brand",
    source: "https://insomnia.rest",
    license: {
      type: "See upstream brand guidelines",
      url: "https://insomnia.rest",
    },
  },
  {
    id: "brand-bruno",
    title: "Bruno",
    path: "icons/brand-bruno.svg",
    kind: "brand",
    source: "https://www.usebruno.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.usebruno.com",
    },
  },
  {
    id: "brand-hoppscotch",
    title: "Hoppscotch",
    path: "icons/brand-hoppscotch.svg",
    kind: "brand",
    source: "https://hoppscotch.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://hoppscotch.com",
    },
  },
  {
    id: "brand-swagger",
    title: "Swagger",
    path: "icons/brand-swagger.svg",
    kind: "brand",
    source: "https://swagger.io",
    license: {
      type: "See upstream brand guidelines",
      url: "https://swagger.io",
    },
  },
  {
    id: "brand-graphql",
    title: "GraphQL",
    path: "icons/brand-graphql.svg",
    kind: "brand",
    source: "https://graphql.org/brand",
    license: {
      type: "See upstream brand guidelines",
      url: "https://graphql.org/brand",
    },
  },
  {
    id: "brand-apollographql",
    title: "Apollo GraphQL",
    path: "icons/brand-apollographql.svg",
    kind: "brand",
    source: "https://www.apollographql.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.apollographql.com",
    },
  },
  {
    id: "brand-relay",
    title: "Relay",
    path: "icons/brand-relay.svg",
    kind: "brand",
    source: "https://relay.dev",
    license: {
      type: "See upstream brand guidelines",
      url: "https://relay.dev",
    },
  },
  {
    id: "brand-trpc",
    title: "tRPC",
    path: "icons/brand-trpc.svg",
    kind: "brand",
    source:
      "https://github.com/trpc/trpc/blob/e0df4a2d5b498dd953a65901e04915c6e3f7ecc5/www/static/img/logo-no-text.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/trpc/trpc/blob/e0df4a2d5b498dd953a65901e04915c6e3f7ecc5/www/static/img/logo-no-text.svg",
    },
  },
  {
    id: "brand-socketdotio",
    title: "Socket.io",
    path: "icons/brand-socketdotio.svg",
    kind: "brand",
    source: "https://socket.io",
    license: {
      type: "See upstream brand guidelines",
      url: "https://socket.io",
    },
  },
  {
    id: "brand-webauthn",
    title: "WebAuthn",
    path: "icons/brand-webauthn.svg",
    kind: "brand",
    source:
      "https://github.com/webauthn-open-source/webauthn-logos/blob/b21be672811eb4a5caadaba41044970cae299a55/final-webauthn-logo-logo-black.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/webauthn-open-source/webauthn-logos/blob/b21be672811eb4a5caadaba41044970cae299a55/final-webauthn-logo-logo-black.svg",
    },
  },
  {
    id: "brand-webassembly",
    title: "WebAssembly",
    path: "icons/brand-webassembly.svg",
    kind: "brand",
    source: "https://webassembly.org",
    license: {
      type: "See upstream brand guidelines",
      url: "https://webassembly.org",
    },
  },
  {
    id: "brand-pwa",
    title: "PWA",
    path: "icons/brand-pwa.svg",
    kind: "brand",
    source:
      "https://github.com/webmaxru/progressive-web-apps-logo/blob/77744cd5c0a4d484bb3d082c6ac458c44202da03/pwalogo-white.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/webmaxru/progressive-web-apps-logo/blob/77744cd5c0a4d484bb3d082c6ac458c44202da03/pwalogo-white.svg",
    },
  },
  {
    id: "brand-mdnwebdocs",
    title: "MDN Web Docs",
    path: "icons/brand-mdnwebdocs.svg",
    kind: "brand",
    source:
      "https://github.com/mdn/yari/blob/77e6cda02f7013219e9da27a00b9424085e60fdb/client/src/assets/mdn-logo.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/mdn/yari/blob/77e6cda02f7013219e9da27a00b9424085e60fdb/client/src/assets/mdn-logo.svg",
    },
  },
  {
    id: "brand-googlechrome",
    title: "Google Chrome",
    path: "icons/brand-googlechrome.svg",
    kind: "brand",
    source: "https://www.google.com/chrome",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.google.com/chrome",
    },
  },
  {
    id: "brand-firefox",
    title: "Firefox",
    path: "icons/brand-firefox.svg",
    kind: "brand",
    source: "https://mozilla.design/firefox/logos-usage/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://mozilla.design/firefox/logos-usage/",
    },
  },
  {
    id: "brand-safari",
    title: "Safari",
    path: "icons/brand-safari.svg",
    kind: "brand",
    source: "https://apps.apple.com/us/app/safari/id1146562112",
    license: {
      type: "See upstream brand guidelines",
      url: "https://apps.apple.com/us/app/safari/id1146562112",
    },
  },
  {
    id: "brand-brave",
    title: "Brave",
    path: "icons/brand-brave.svg",
    kind: "brand",
    source: "https://brave.com/brave-branding-assets",
    license: {
      type: "See upstream brand guidelines",
      url: "https://brave.com/brave-branding-assets",
    },
  },
  {
    id: "brand-opera",
    title: "Opera",
    path: "icons/brand-opera.svg",
    kind: "brand",
    source: "https://brand.opera.com/1472-2/opera-logos/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://brand.opera.com/1472-2/opera-logos/",
    },
  },
  {
    id: "brand-linux",
    title: "Linux",
    path: "icons/brand-linux.svg",
    kind: "brand",
    source: "https://www.linuxfoundation.org/the-linux-mark/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.linuxfoundation.org/the-linux-mark/",
    },
  },
  {
    id: "brand-ubuntu",
    title: "Ubuntu",
    path: "icons/brand-ubuntu.svg",
    kind: "brand",
    source: "https://design.ubuntu.com/resources",
    license: {
      type: "See upstream brand guidelines",
      url: "https://design.ubuntu.com/resources",
    },
  },
  {
    id: "brand-debian",
    title: "Debian",
    path: "icons/brand-debian.svg",
    kind: "brand",
    source: "https://www.debian.org/logos",
    license: {
      type: "CC-BY-SA-3.0",
      url: "https://spdx.org/licenses/CC-BY-SA-3.0",
    },
  },
  {
    id: "brand-fedora",
    title: "Fedora",
    path: "icons/brand-fedora.svg",
    kind: "brand",
    source: "https://docs.fedoraproject.org/en-US/project/brand/",
    license: {
      type: "custom",
      url: "https://docs.fedoraproject.org/en-US/project/brand/",
    },
  },
  {
    id: "brand-archlinux",
    title: "Arch Linux",
    path: "icons/brand-archlinux.svg",
    kind: "brand",
    source: "https://www.archlinux.org/art",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.archlinux.org/art",
    },
  },
  {
    id: "brand-linuxmint",
    title: "Linux Mint",
    path: "icons/brand-linuxmint.svg",
    kind: "brand",
    source:
      "https://github.com/linuxmint/brand-logo/blob/540ac3b08e987866d77a340f557f994c988ac2ae/ring-mono-green.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/linuxmint/brand-logo/blob/540ac3b08e987866d77a340f557f994c988ac2ae/ring-mono-green.svg",
    },
  },
  {
    id: "brand-nixos",
    title: "NixOS",
    path: "icons/brand-nixos.svg",
    kind: "brand",
    source:
      "https://brand.nixos.org/logos/nixos-logomark-black-flat-minimal.svg",
    license: {
      type: "CC-BY-4.0",
      url: "https://spdx.org/licenses/CC-BY-4.0",
    },
  },
  {
    id: "brand-manjaro",
    title: "Manjaro",
    path: "icons/brand-manjaro.svg",
    kind: "brand",
    source: "https://manjaro.org",
    license: {
      type: "See upstream brand guidelines",
      url: "https://manjaro.org",
    },
  },
  {
    id: "brand-redhat",
    title: "Red Hat",
    path: "icons/brand-redhat.svg",
    kind: "brand",
    source: "https://www.redhat.com/en/about/brand/new-brand/details",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.redhat.com/en/about/brand/new-brand/details",
    },
  },
  {
    id: "brand-freebsd",
    title: "FreeBSD",
    path: "icons/brand-freebsd.svg",
    kind: "brand",
    source: "https://www.freebsdfoundation.org/about/project/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.freebsdfoundation.org/about/project/",
    },
  },
  {
    id: "brand-openbsd",
    title: "OpenBSD",
    path: "icons/brand-openbsd.svg",
    kind: "brand",
    source: "https://en.wikipedia.org/wiki/OpenBSD",
    license: {
      type: "See upstream brand guidelines",
      url: "https://en.wikipedia.org/wiki/OpenBSD",
    },
  },
  {
    id: "brand-macos",
    title: "macOS",
    path: "icons/brand-macos.svg",
    kind: "brand",
    source: "https://commons.wikimedia.org/wiki/File:MacOS_wordmark_(2017).svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://commons.wikimedia.org/wiki/File:MacOS_wordmark_(2017).svg",
    },
  },
  {
    id: "brand-raspberrypi",
    title: "Raspberry Pi",
    path: "icons/brand-raspberrypi.svg",
    kind: "brand",
    source: "https://www.raspberrypi.org/trademark-rules",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.raspberrypi.org/trademark-rules",
    },
  },
  {
    id: "brand-arduino",
    title: "Arduino",
    path: "icons/brand-arduino.svg",
    kind: "brand",
    source: "https://www.arduino.cc",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.arduino.cc",
    },
  },
  {
    id: "brand-espressif",
    title: "Espressif",
    path: "icons/brand-espressif.svg",
    kind: "brand",
    source: "https://www.espressif.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.espressif.com",
    },
  },
  {
    id: "brand-platformio",
    title: "PlatformIO",
    path: "icons/brand-platformio.svg",
    kind: "brand",
    source: "https://piolabs.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://piolabs.com",
    },
  },
  {
    id: "brand-homeassistant",
    title: "Home Assistant",
    path: "icons/brand-homeassistant.svg",
    kind: "brand",
    source:
      "https://github.com/home-assistant/assets/blob/0f69676da79c3881e7dfca6d6c0a5739f88273d8/logo/home-assistant-logo.zip",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/home-assistant/assets/blob/0f69676da79c3881e7dfca6d6c0a5739f88273d8/logo/home-assistant-logo.zip",
    },
  },
  {
    id: "brand-openhab",
    title: "openHAB",
    path: "icons/brand-openhab.svg",
    kind: "brand",
    source: "https://www.openhab.org/artwork.html",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.openhab.org/artwork.html",
    },
  },
  {
    id: "brand-portainer",
    title: "Portainer",
    path: "icons/brand-portainer.svg",
    kind: "brand",
    source: "https://www.portainer.io",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.portainer.io",
    },
  },
  {
    id: "brand-podman",
    title: "Podman",
    path: "icons/brand-podman.svg",
    kind: "brand",
    source: "https://podman.io",
    license: {
      type: "See upstream brand guidelines",
      url: "https://podman.io",
    },
  },
  {
    id: "brand-rancher",
    title: "Rancher",
    path: "icons/brand-rancher.svg",
    kind: "brand",
    source: "https://rancher.com/brand-guidelines/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://rancher.com/brand-guidelines/",
    },
  },
  {
    id: "brand-k3s",
    title: "K3s",
    path: "icons/brand-k3s.svg",
    kind: "brand",
    source: "https://k3s.io",
    license: {
      type: "See upstream brand guidelines",
      url: "https://k3s.io",
    },
  },
  {
    id: "brand-proxmox",
    title: "Proxmox",
    path: "icons/brand-proxmox.svg",
    kind: "brand",
    source: "https://www.proxmox.com/en/news/media-kit",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.proxmox.com/en/news/media-kit",
    },
  },
  {
    id: "brand-vmware",
    title: "VMware",
    path: "icons/brand-vmware.svg",
    kind: "brand",
    source: "https://myvmware.workspaceair.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://myvmware.workspaceair.com",
    },
  },
  {
    id: "brand-virtualbox",
    title: "VirtualBox",
    path: "icons/brand-virtualbox.svg",
    kind: "brand",
    source: "https://www.virtualbox.org/svn/vbox/trunk/src/VBox/Artwork/OSE",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.virtualbox.org/svn/vbox/trunk/src/VBox/Artwork/OSE",
    },
  },
  {
    id: "brand-qemu",
    title: "QEMU",
    path: "icons/brand-qemu.svg",
    kind: "brand",
    source: "https://wiki.qemu.org/Logo",
    license: {
      type: "See upstream brand guidelines",
      url: "https://wiki.qemu.org/Logo",
    },
  },
  {
    id: "brand-ceph",
    title: "Ceph",
    path: "icons/brand-ceph.svg",
    kind: "brand",
    source:
      "https://github.com/ceph/ceph/blob/b106a03dcddaee80493825e85bc5e399ab4d8746/src/pybind/mgr/dashboard/frontend/src/assets/Ceph_Logo.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/ceph/ceph/blob/b106a03dcddaee80493825e85bc5e399ab4d8746/src/pybind/mgr/dashboard/frontend/src/assets/Ceph_Logo.svg",
    },
  },
  {
    id: "brand-minio",
    title: "MinIO",
    path: "icons/brand-minio.svg",
    kind: "brand",
    source: "https://min.io",
    license: {
      type: "See upstream brand guidelines",
      url: "https://min.io",
    },
  },
  {
    id: "brand-backblaze",
    title: "Backblaze",
    path: "icons/brand-backblaze.svg",
    kind: "brand",
    source: "https://www.backblaze.com/company/news.html",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.backblaze.com/company/news.html",
    },
  },
  {
    id: "brand-wasabi",
    title: "Wasabi",
    path: "icons/brand-wasabi.svg",
    kind: "brand",
    source: "https://wasabi.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://wasabi.com",
    },
  },
  {
    id: "brand-ipfs",
    title: "IPFS",
    path: "icons/brand-ipfs.svg",
    kind: "brand",
    source:
      "https://github.com/ipfs-inactive/logo/tree/73169b495332415b174ac2f37ec27c4b2ee8da83",
    license: {
      type: "CC-BY-SA-3.0",
      url: "https://spdx.org/licenses/CC-BY-SA-3.0",
    },
  },
  {
    id: "brand-gunicorn",
    title: "Gunicorn",
    path: "icons/brand-gunicorn.svg",
    kind: "brand",
    source:
      "https://github.com/benoitc/gunicorn/blob/ff58e0c6da83d5520916bc4cc109a529258d76e1/docs/logo/gunicorn.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/benoitc/gunicorn/blob/ff58e0c6da83d5520916bc4cc109a529258d76e1/docs/logo/gunicorn.svg",
    },
  },
  {
    id: "brand-fastify",
    title: "Fastify",
    path: "icons/brand-fastify.svg",
    kind: "brand",
    source:
      "https://github.com/fastify/graphics/blob/91e8a3d4754807de3b69440f66c72a737a5fde94/fastify-1000px-square-02.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/fastify/graphics/blob/91e8a3d4754807de3b69440f66c72a737a5fde94/fastify-1000px-square-02.svg",
    },
  },
  {
    id: "brand-express",
    title: "Express",
    path: "icons/brand-express.svg",
    kind: "brand",
    source:
      "https://github.com/openjs-foundation/artwork/blob/3816245ebbf4707bdafde748350ac8476b6b5b62/projects/express/express-icon-black.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/openjs-foundation/artwork/blob/3816245ebbf4707bdafde748350ac8476b6b5b62/projects/express/express-icon-black.svg",
    },
  },
  {
    id: "brand-nestjs",
    title: "NestJS",
    path: "icons/brand-nestjs.svg",
    kind: "brand",
    source: "https://nestjs.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://nestjs.com",
    },
  },
  {
    id: "brand-koa",
    title: "Koa",
    path: "icons/brand-koa.svg",
    kind: "brand",
    source: "https://koajs.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://koajs.com",
    },
  },
  {
    id: "brand-hono",
    title: "Hono",
    path: "icons/brand-hono.svg",
    kind: "brand",
    source:
      "https://github.com/honojs/hono/blob/76dbc74407329c46870af6aa4fab0c04036d8ae2/docs/images/hono-logo.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/honojs/hono/blob/76dbc74407329c46870af6aa4fab0c04036d8ae2/docs/images/hono-logo.svg",
    },
  },
  {
    id: "brand-adonisjs",
    title: "AdonisJS",
    path: "icons/brand-adonisjs.svg",
    kind: "brand",
    source: "https://adonisjs.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://adonisjs.com",
    },
  },
  {
    id: "brand-meteor",
    title: "Meteor",
    path: "icons/brand-meteor.svg",
    kind: "brand",
    source: "https://meteor.com/brand-assets",
    license: {
      type: "See upstream brand guidelines",
      url: "https://meteor.com/brand-assets",
    },
  },
  {
    id: "brand-loopback",
    title: "LoopBack",
    path: "icons/brand-loopback.svg",
    kind: "brand",
    source: "https://loopback.io/resources",
    license: {
      type: "See upstream brand guidelines",
      url: "https://loopback.io/resources",
    },
  },
  {
    id: "brand-keystone",
    title: "Keystone",
    path: "icons/brand-keystone.svg",
    kind: "brand",
    source: "https://keystonejs.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://keystonejs.com",
    },
  },
  {
    id: "brand-sequelize",
    title: "Sequelize",
    path: "icons/brand-sequelize.svg",
    kind: "brand",
    source:
      "https://github.com/sequelize/website/blob/e6a482fa58a839b15ace80e3c8901ed2887be45e/static/img/logo-simple.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/sequelize/website/blob/e6a482fa58a839b15ace80e3c8901ed2887be45e/static/img/logo-simple.svg",
    },
  },
  {
    id: "brand-prisma",
    title: "Prisma",
    path: "icons/brand-prisma.svg",
    kind: "brand",
    source:
      "https://github.com/prisma/presskit/tree/4bcb64181f266723439d955d60afa1c55fefa715",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/prisma/presskit/tree/4bcb64181f266723439d955d60afa1c55fefa715",
    },
  },
  {
    id: "brand-drizzle",
    title: "Drizzle",
    path: "icons/brand-drizzle.svg",
    kind: "brand",
    source: "https://orm.drizzle.team",
    license: {
      type: "See upstream brand guidelines",
      url: "https://orm.drizzle.team",
    },
  },
  {
    id: "brand-typeorm",
    title: "TypeORM",
    path: "icons/brand-typeorm.svg",
    kind: "brand",
    source:
      "https://github.com/typeorm/typeorm/blob/e7649d2746f907ff36b1efb600402dedd5f5a499/resources/logo_big.png",
    license: {
      type: "MIT",
      url: "https://spdx.org/licenses/MIT",
    },
  },
  {
    id: "brand-mongoose",
    title: "Mongoose",
    path: "icons/brand-mongoose.svg",
    kind: "brand",
    source:
      "https://github.com/Automattic/mongoose/blob/7971a4dbd55888f0b005e65b06024109af8352f7/docs/images/mongoose.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/Automattic/mongoose/blob/7971a4dbd55888f0b005e65b06024109af8352f7/docs/images/mongoose.svg",
    },
  },
  {
    id: "brand-doctrine",
    title: "Doctrine",
    path: "icons/brand-doctrine.svg",
    kind: "brand",
    source: "https://www.doctrine-project.org",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.doctrine-project.org",
    },
  },
  {
    id: "brand-hibernate",
    title: "Hibernate",
    path: "icons/brand-hibernate.svg",
    kind: "brand",
    source: "https://hibernate.org",
    license: {
      type: "See upstream brand guidelines",
      url: "https://hibernate.org",
    },
  },
  {
    id: "brand-sqlalchemy",
    title: "SQLAlchemy",
    path: "icons/brand-sqlalchemy.svg",
    kind: "brand",
    source: "https://commons.wikimedia.org/wiki/File:SQLAlchemy.svg",
    license: {
      type: "MIT",
      url: "https://spdx.org/licenses/MIT",
    },
  },
  {
    id: "brand-liquibase",
    title: "Liquibase",
    path: "icons/brand-liquibase.svg",
    kind: "brand",
    source: "https://www.liquibase.com/brand",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.liquibase.com/brand",
    },
  },
  {
    id: "brand-flyway",
    title: "Flyway",
    path: "icons/brand-flyway.svg",
    kind: "brand",
    source:
      "https://github.com/flyway/flywaydb.org/blob/8a7923cb9ead016442d4c5caf2e8ba5a9bfad5cf/assets/logo/flyway-logo.png",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/flyway/flywaydb.org/blob/8a7923cb9ead016442d4c5caf2e8ba5a9bfad5cf/assets/logo/flyway-logo.png",
    },
  },
  {
    id: "brand-goland",
    title: "GoLand",
    path: "icons/brand-goland.svg",
    kind: "brand",
    source:
      "https://www.jetbrains.com/company/brand/#logos-and-icons-jetbrains-logos",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.jetbrains.com/company/brand/#logos-and-icons-jetbrains-logos",
    },
  },
  {
    id: "brand-intellijidea",
    title: "IntelliJ IDEA",
    path: "icons/brand-intellijidea.svg",
    kind: "brand",
    source: "https://www.jetbrains.com/idea/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.jetbrains.com/idea/",
    },
  },
  {
    id: "brand-webstorm",
    title: "WebStorm",
    path: "icons/brand-webstorm.svg",
    kind: "brand",
    source: "https://www.jetbrains.com/company/brand/logos",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.jetbrains.com/company/brand/logos",
    },
  },
  {
    id: "brand-pycharm",
    title: "PyCharm",
    path: "icons/brand-pycharm.svg",
    kind: "brand",
    source: "https://www.jetbrains.com/company/brand/logos/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.jetbrains.com/company/brand/logos/",
    },
  },
  {
    id: "brand-phpstorm",
    title: "PhpStorm",
    path: "icons/brand-phpstorm.svg",
    kind: "brand",
    source: "https://www.jetbrains.com/company/brand/logos/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.jetbrains.com/company/brand/logos/",
    },
  },
  {
    id: "brand-rubymine",
    title: "RubyMine",
    path: "icons/brand-rubymine.svg",
    kind: "brand",
    source: "https://www.jetbrains.com/company/brand/logos",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.jetbrains.com/company/brand/logos",
    },
  },
  {
    id: "brand-rider",
    title: "Rider",
    path: "icons/brand-rider.svg",
    kind: "brand",
    source: "https://www.jetbrains.com/company/brand/logos/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.jetbrains.com/company/brand/logos/",
    },
  },
  {
    id: "brand-clion",
    title: "CLion",
    path: "icons/brand-clion.svg",
    kind: "brand",
    source: "https://www.jetbrains.com/company/brand/logos/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.jetbrains.com/company/brand/logos/",
    },
  },
  {
    id: "brand-datagrip",
    title: "DataGrip",
    path: "icons/brand-datagrip.svg",
    kind: "brand",
    source: "https://www.jetbrains.com/company/brand/logos/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.jetbrains.com/company/brand/logos/",
    },
  },
  {
    id: "brand-cursor",
    title: "Cursor",
    path: "icons/brand-cursor.svg",
    kind: "brand",
    source: "https://cursor.com/brand",
    license: {
      type: "See upstream brand guidelines",
      url: "https://cursor.com/brand",
    },
  },
  {
    id: "brand-neovim",
    title: "Neovim",
    path: "icons/brand-neovim.svg",
    kind: "brand",
    source: "https://neovim.io",
    license: {
      type: "CC-BY-SA-3.0",
      url: "https://spdx.org/licenses/CC-BY-SA-3.0",
    },
  },
  {
    id: "brand-vim",
    title: "Vim",
    path: "icons/brand-vim.svg",
    kind: "brand",
    source: "https://commons.wikimedia.org/wiki/File:Vimlogo.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://commons.wikimedia.org/wiki/File:Vimlogo.svg",
    },
  },
  {
    id: "brand-vscodium",
    title: "VSCodium",
    path: "icons/brand-vscodium.svg",
    kind: "brand",
    source:
      "https://github.com/VSCodium/vscodium.github.io/blob/ed028c57f10e6432ec55dfc34d4db1a83fba941d/img/codium_cnl.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/VSCodium/vscodium.github.io/blob/ed028c57f10e6432ec55dfc34d4db1a83fba941d/img/codium_cnl.svg",
    },
  },
  {
    id: "brand-notepadplusplus",
    title: "Notepad++",
    path: "icons/brand-notepadplusplus.svg",
    kind: "brand",
    source:
      "https://github.com/notepad-plus-plus/notepad-plus-plus/blob/1f2c63cce173e3e1dc5922637c81a851693e2856/PowerEditor/misc/chameleon/chameleon-pencil.eps",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/notepad-plus-plus/notepad-plus-plus/blob/1f2c63cce173e3e1dc5922637c81a851693e2856/PowerEditor/misc/chameleon/chameleon-pencil.eps",
    },
  },
  {
    id: "brand-androidstudio",
    title: "Android Studio",
    path: "icons/brand-androidstudio.svg",
    kind: "brand",
    source: "https://developer.android.com/studio",
    license: {
      type: "See upstream brand guidelines",
      url: "https://developer.android.com/studio",
    },
  },
  {
    id: "brand-xcode",
    title: "Xcode",
    path: "icons/brand-xcode.svg",
    kind: "brand",
    source: "https://developer.apple.com/develop",
    license: {
      type: "See upstream brand guidelines",
      url: "https://developer.apple.com/develop",
    },
  },
  {
    id: "brand-posit",
    title: "Posit",
    path: "icons/brand-posit.svg",
    kind: "brand",
    source: "https://docs.posit.co",
    license: {
      type: "See upstream brand guidelines",
      url: "https://docs.posit.co",
    },
  },
  {
    id: "brand-codesandbox",
    title: "CodeSandbox",
    path: "icons/brand-codesandbox.svg",
    kind: "brand",
    source: "https://codesandbox.io/CodeSandbox-Press-Kit.zip",
    license: {
      type: "See upstream brand guidelines",
      url: "https://codesandbox.io/CodeSandbox-Press-Kit.zip",
    },
  },
  {
    id: "brand-stackblitz",
    title: "StackBlitz",
    path: "icons/brand-stackblitz.svg",
    kind: "brand",
    source: "https://stackblitz.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://stackblitz.com",
    },
  },
  {
    id: "brand-replit",
    title: "Replit",
    path: "icons/brand-replit.svg",
    kind: "brand",
    source: "https://repl.it",
    license: {
      type: "See upstream brand guidelines",
      url: "https://repl.it",
    },
  },
  {
    id: "brand-gitpod",
    title: "Gitpod",
    path: "icons/brand-gitpod.svg",
    kind: "brand",
    source: "https://www.gitpod.io",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.gitpod.io",
    },
  },
  {
    id: "brand-codeberg",
    title: "Codeberg",
    path: "icons/brand-codeberg.svg",
    kind: "brand",
    source:
      "https://codeberg.org/Codeberg/Design/src/commit/ac514aa9aaa2457d4af3c3e13df3ab136d22a49a/logo/special/codeberg-logo_special_fake-transaprency.svg",
    license: {
      type: "CC0-1.0",
      url: "https://spdx.org/licenses/CC0-1.0",
    },
  },
  {
    id: "brand-gitea",
    title: "Gitea",
    path: "icons/brand-gitea.svg",
    kind: "brand",
    source:
      "https://github.com/go-gitea/gitea/blob/e0c753e770a64cda5e3900aa1da3d7e1f3263c9a/assets/logo.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/go-gitea/gitea/blob/e0c753e770a64cda5e3900aa1da3d7e1f3263c9a/assets/logo.svg",
    },
  },
  {
    id: "brand-forgejo",
    title: "Forgejo",
    path: "icons/brand-forgejo.svg",
    kind: "brand",
    source:
      "https://codeberg.org/forgejo/meta/raw/branch/readme/branding/logo/forgejo-monochrome.svg",
    license: {
      type: "CC-BY-SA-4.0",
      url: "https://spdx.org/licenses/CC-BY-SA-4.0",
    },
  },
  {
    id: "brand-sourcehut",
    title: "SourceHut",
    path: "icons/brand-sourcehut.svg",
    kind: "brand",
    source: "https://sourcehut.org/logo/",
    license: {
      type: "CC0-1.0",
      url: "https://spdx.org/licenses/CC0-1.0",
    },
  },
  {
    id: "brand-sourcetree",
    title: "Sourcetree",
    path: "icons/brand-sourcetree.svg",
    kind: "brand",
    source: "https://atlassian.design/resources/logo-library",
    license: {
      type: "See upstream brand guidelines",
      url: "https://atlassian.design/resources/logo-library",
    },
  },
  {
    id: "brand-git",
    title: "Git",
    path: "icons/brand-git.svg",
    kind: "brand",
    source: "https://git-scm.com/community/logos",
    license: {
      type: "CC-BY-3.0",
      url: "https://spdx.org/licenses/CC-BY-3.0",
    },
  },
  {
    id: "brand-gitextensions",
    title: "Git Extensions",
    path: "icons/brand-gitextensions.svg",
    kind: "brand",
    source:
      "https://github.com/gitextensions/gitextensions/blob/273a0f6fd3e07858f837cdc19d50827871e32319/Logo/Artwork/git-extensions-logo.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/gitextensions/gitextensions/blob/273a0f6fd3e07858f837cdc19d50827871e32319/Logo/Artwork/git-extensions-logo.svg",
    },
  },
  {
    id: "brand-gitkraken",
    title: "GitKraken",
    path: "icons/brand-gitkraken.svg",
    kind: "brand",
    source: "https://www.gitkraken.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.gitkraken.com",
    },
  },
  {
    id: "brand-tower",
    title: "Tower",
    path: "icons/brand-tower.svg",
    kind: "brand",
    source: "https://www.git-tower.com/company/press",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.git-tower.com/company/press",
    },
  },
  {
    id: "brand-zsh",
    title: "Zsh",
    path: "icons/brand-zsh.svg",
    kind: "brand",
    source:
      "https://github.com/Zsh-art/logo/blob/17617f2f6c70c65943a48745c91d997e7561f19d/svg/white_logomark.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/Zsh-art/logo/blob/17617f2f6c70c65943a48745c91d997e7561f19d/svg/white_logomark.svg",
    },
  },
  {
    id: "brand-gnu",
    title: "GNU",
    path: "icons/brand-gnu.svg",
    kind: "brand",
    source: "https://gnu.org",
    license: {
      type: "CC-BY-SA-2.0",
      url: "https://spdx.org/licenses/CC-BY-SA-2.0",
    },
  },
  {
    id: "brand-cmake",
    title: "CMake",
    path: "icons/brand-cmake.svg",
    kind: "brand",
    source: "https://www.kitware.com/platforms/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.kitware.com/platforms/",
    },
  },
  {
    id: "brand-bazel",
    title: "Bazel",
    path: "icons/brand-bazel.svg",
    kind: "brand",
    source: "https://bazel.build",
    license: {
      type: "See upstream brand guidelines",
      url: "https://bazel.build",
    },
  },
  {
    id: "brand-task",
    title: "Task",
    path: "icons/brand-task.svg",
    kind: "brand",
    source:
      "https://github.com/go-task/task/blob/84ad0056e49e2206bf5903863cdf972a7305072c/docs/static/img/logo_mono.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/go-task/task/blob/84ad0056e49e2206bf5903863cdf972a7305072c/docs/static/img/logo_mono.svg",
    },
  },
  {
    id: "brand-just",
    title: "Just",
    path: "icons/brand-just.svg",
    kind: "brand",
    source: "https://just.systems",
    license: {
      type: "See upstream brand guidelines",
      url: "https://just.systems",
    },
  },
  {
    id: "brand-dotenv",
    title: ".ENV",
    path: "icons/brand-dotenv.svg",
    kind: "brand",
    source:
      "https://github.com/motdotla/dotenv/blob/40e75440337d1de2345dc8326d6108331f583fd8/dotenv.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/motdotla/dotenv/blob/40e75440337d1de2345dc8326d6108331f583fd8/dotenv.svg",
    },
  },
  {
    id: "brand-homebrew",
    title: "Homebrew",
    path: "icons/brand-homebrew.svg",
    kind: "brand",
    source:
      "https://github.com/Homebrew/brew.sh/blob/2e576aaca83e62dda41a188597bb4bd20e75e385/assets/img/homebrew.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/Homebrew/brew.sh/blob/2e576aaca83e62dda41a188597bb4bd20e75e385/assets/img/homebrew.svg",
    },
  },
  {
    id: "brand-chocolatey",
    title: "Chocolatey",
    path: "icons/brand-chocolatey.svg",
    kind: "brand",
    source: "https://chocolatey.org/media-kit",
    license: {
      type: "See upstream brand guidelines",
      url: "https://chocolatey.org/media-kit",
    },
  },
  {
    id: "brand-snapcraft",
    title: "Snapcraft",
    path: "icons/brand-snapcraft.svg",
    kind: "brand",
    source: "https://design.ubuntu.com/resources",
    license: {
      type: "CC-BY-SA-3.0",
      url: "https://spdx.org/licenses/CC-BY-SA-3.0",
    },
  },
  {
    id: "brand-flatpak",
    title: "Flatpak",
    path: "icons/brand-flatpak.svg",
    kind: "brand",
    source: "https://flatpak.org/press",
    license: {
      type: "CC-BY-3.0",
      url: "https://spdx.org/licenses/CC-BY-3.0",
    },
  },
  {
    id: "brand-appimage",
    title: "AppImage",
    path: "icons/brand-appimage.svg",
    kind: "brand",
    source: "https://appimage.org",
    license: {
      type: "See upstream brand guidelines",
      url: "https://appimage.org",
    },
  },
  {
    id: "brand-curl",
    title: "curl",
    path: "icons/brand-curl.svg",
    kind: "brand",
    source: "https://curl.haxx.se/logo/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://curl.haxx.se/logo/",
    },
  },
  {
    id: "brand-openssl",
    title: "OpenSSL",
    path: "icons/brand-openssl.svg",
    kind: "brand",
    source: "https://www.openssl.org",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.openssl.org",
    },
  },
  {
    id: "brand-libuv",
    title: "libuv",
    path: "icons/brand-libuv.svg",
    kind: "brand",
    source:
      "https://github.com/libuv/libuv/blob/e4087dedf837f415056a45a838f639a3d9dc3ced/img/logos.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/libuv/libuv/blob/e4087dedf837f415056a45a838f639a3d9dc3ced/img/logos.svg",
    },
  },
  {
    id: "brand-boost",
    title: "Boost",
    path: "icons/brand-boost.svg",
    kind: "brand",
    source: "https://www.boostmobile.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.boostmobile.com",
    },
  },
  {
    id: "brand-toml",
    title: "TOML",
    path: "icons/brand-toml.svg",
    kind: "brand",
    source:
      "https://github.com/toml-lang/toml/blob/625f62b55c5acdfb9924c78e1d0bf4cf0be23d91/logos/toml.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/toml-lang/toml/blob/625f62b55c5acdfb9924c78e1d0bf4cf0be23d91/logos/toml.svg",
    },
  },
  {
    id: "brand-yaml",
    title: "YAML",
    path: "icons/brand-yaml.svg",
    kind: "brand",
    source: "https://commons.wikimedia.org/wiki/File:Official_YAML_Logo.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://commons.wikimedia.org/wiki/File:Official_YAML_Logo.svg",
    },
  },
  {
    id: "brand-json",
    title: "JSON",
    path: "icons/brand-json.svg",
    kind: "brand",
    source: "https://commons.wikimedia.org/wiki/File:JSON_vector_logo.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://commons.wikimedia.org/wiki/File:JSON_vector_logo.svg",
    },
  },
  {
    id: "brand-markdown",
    title: "Markdown",
    path: "icons/brand-markdown.svg",
    kind: "brand",
    source:
      "https://github.com/dcurtis/markdown-mark/tree/360a3657fef7f6ad0b303296a95ad52985caa0d3",
    license: {
      type: "CC0-1.0",
      url: "https://spdx.org/licenses/CC0-1.0",
    },
  },
  {
    id: "brand-asciidoctor",
    title: "Asciidoctor",
    path: "icons/brand-asciidoctor.svg",
    kind: "brand",
    source:
      "https://github.com/asciidoctor/brand/blob/b9cf5e276616f4770c4f1227e646e7daee0cbf24/logo/logo-fill-bw.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/asciidoctor/brand/blob/b9cf5e276616f4770c4f1227e646e7daee0cbf24/logo/logo-fill-bw.svg",
    },
  },
  {
    id: "brand-mdx",
    title: "MDX",
    path: "icons/brand-mdx.svg",
    kind: "brand",
    source:
      "https://github.com/mdx-js/mdx/blob/b8a76c95deb14f7297bafdac1aa3eddd2b0fbb8f/docs/_static/icon.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/mdx-js/mdx/blob/b8a76c95deb14f7297bafdac1aa3eddd2b0fbb8f/docs/_static/icon.svg",
    },
  },
  {
    id: "brand-docusaurus",
    title: "Docusaurus",
    path: "icons/brand-docusaurus.svg",
    kind: "brand",
    source:
      "https://github.com/facebook/docusaurus/blob/67c40069d1062b5aae530b696e6f66bf9618a696/website/static/img/docusaurus.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/facebook/docusaurus/blob/67c40069d1062b5aae530b696e6f66bf9618a696/website/static/img/docusaurus.svg",
    },
  },
  {
    id: "brand-vitepress",
    title: "VitePress",
    path: "icons/brand-vitepress.svg",
    kind: "brand",
    source:
      "https://github.com/vuejs/vitepress/blob/f7aef3ca23dae39e226c85d7bb2579dbf7c758f3/art/vitepress-logo-mini.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/vuejs/vitepress/blob/f7aef3ca23dae39e226c85d7bb2579dbf7c758f3/art/vitepress-logo-mini.svg",
    },
  },
  {
    id: "brand-readthedocs",
    title: "Read the Docs",
    path: "icons/brand-readthedocs.svg",
    kind: "brand",
    source:
      "https://github.com/readthedocs/readthedocs.org/blob/d8f71fff113d8f63e7eeed1fc1f5456a132b2d3e/docs/img/logo.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/readthedocs/readthedocs.org/blob/d8f71fff113d8f63e7eeed1fc1f5456a132b2d3e/docs/img/logo.svg",
    },
  },
  {
    id: "brand-sphinx",
    title: "Sphinx",
    path: "icons/brand-sphinx.svg",
    kind: "brand",
    source:
      "https://github.com/sphinx-doc/sphinx/blob/ed84d63e6f2c4fd43b97fc43ee8be4156a13af9e/doc/_static/favicon.svg",
    license: {
      type: "BSD-3-Clause",
      url: "https://spdx.org/licenses/BSD-3-Clause",
    },
  },
  {
    id: "brand-gitbook",
    title: "GitBook",
    path: "icons/brand-gitbook.svg",
    kind: "brand",
    source: "https://www.gitbook.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.gitbook.com",
    },
  },
  {
    id: "brand-mintlify",
    title: "Mintlify",
    path: "icons/brand-mintlify.svg",
    kind: "brand",
    source: "https://mintlify.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://mintlify.com",
    },
  },
  {
    id: "brand-docsify",
    title: "Docsify",
    path: "icons/brand-docsify.svg",
    kind: "brand",
    source:
      "https://github.com/docsifyjs/docsify/blob/d01841fd9d829adeeae6cde1d5818ce8798c7e58/docs/_media/icon.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/docsifyjs/docsify/blob/d01841fd9d829adeeae6cde1d5818ce8798c7e58/docs/_media/icon.svg",
    },
  },
  {
    id: "brand-slides",
    title: "Slides",
    path: "icons/brand-slides.svg",
    kind: "brand",
    source: "https://slides.com/about",
    license: {
      type: "See upstream brand guidelines",
      url: "https://slides.com/about",
    },
  },
  {
    id: "brand-mermaid",
    title: "Mermaid",
    path: "icons/brand-mermaid.svg",
    kind: "brand",
    source:
      "https://github.com/mermaid-js/mermaid/blob/f5bd1e08098fa688ef889e73c8b06696e75e62d8/docs/public/mermaid-logo.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/mermaid-js/mermaid/blob/f5bd1e08098fa688ef889e73c8b06696e75e62d8/docs/public/mermaid-logo.svg",
    },
  },
  {
    id: "brand-chartdotjs",
    title: "Chart.js",
    path: "icons/brand-chartdotjs.svg",
    kind: "brand",
    source: "https://www.chartjs.org",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.chartjs.org",
    },
  },
  {
    id: "brand-plotly",
    title: "Plotly",
    path: "icons/brand-plotly.svg",
    kind: "brand",
    source: "https://plotly.com/brand-guidelines",
    license: {
      type: "See upstream brand guidelines",
      url: "https://plotly.com/brand-guidelines",
    },
  },
  {
    id: "brand-observable",
    title: "Observable",
    path: "icons/brand-observable.svg",
    kind: "brand",
    source: "https://observablehq.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://observablehq.com",
    },
  },
  {
    id: "brand-visx",
    title: "visx",
    path: "icons/brand-visx.svg",
    kind: "brand",
    source: "https://airbnb.io/visx",
    license: {
      type: "See upstream brand guidelines",
      url: "https://airbnb.io/visx",
    },
  },
  {
    id: "brand-vega",
    title: "Vega",
    path: "icons/brand-vega.svg",
    kind: "brand",
    source:
      "https://github.com/vega/logos/blob/af32bc29f0c09c8de826aaafb037935fb69e960a/assets/VG_Black.svg",
    license: {
      type: "BSD-3-Clause",
      url: "https://spdx.org/licenses/BSD-3-Clause",
    },
  },
  {
    id: "brand-leaflet",
    title: "Leaflet",
    path: "icons/brand-leaflet.svg",
    kind: "brand",
    source:
      "https://github.com/Leaflet/Leaflet/blob/d843c3b88486713827d7e860b58bdba75bfbd5a2/src/images/logo.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/Leaflet/Leaflet/blob/d843c3b88486713827d7e860b58bdba75bfbd5a2/src/images/logo.svg",
    },
  },
  {
    id: "brand-mapbox",
    title: "Mapbox",
    path: "icons/brand-mapbox.svg",
    kind: "brand",
    source: "https://www.mapbox.com/about/press/brand-guidelines",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.mapbox.com/about/press/brand-guidelines",
    },
  },
  {
    id: "brand-maplibre",
    title: "MapLibre",
    path: "icons/brand-maplibre.svg",
    kind: "brand",
    source:
      "https://github.com/maplibre/maplibre-gl-js-docs/blob/e916a4cdd671890126f88b26b2b16c04220dc4b0/docs/pages/assets/favicon/maplibregl-favicon.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/maplibre/maplibre-gl-js-docs/blob/e916a4cdd671890126f88b26b2b16c04220dc4b0/docs/pages/assets/favicon/maplibregl-favicon.svg",
    },
  },
  {
    id: "brand-openstreetmap",
    title: "OpenStreetMap",
    path: "icons/brand-openstreetmap.svg",
    kind: "brand",
    source: "https://www.openstreetmap.org",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.openstreetmap.org",
    },
  },
  {
    id: "brand-googlemaps",
    title: "Google Maps",
    path: "icons/brand-googlemaps.svg",
    kind: "brand",
    source: "https://commons.wikimedia.org/wiki/File:Google_Maps_icon.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://commons.wikimedia.org/wiki/File:Google_Maps_icon.svg",
    },
  },
  {
    id: "brand-tomtom",
    title: "TomTom",
    path: "icons/brand-tomtom.svg",
    kind: "brand",
    source: "https://brandguide.tomtom.com/design/logo",
    license: {
      type: "See upstream brand guidelines",
      url: "https://brandguide.tomtom.com/design/logo",
    },
  },
  {
    id: "brand-here",
    title: "HERE",
    path: "icons/brand-here.svg",
    kind: "brand",
    source: "https://www.here.com/company/media-assets",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.here.com/company/media-assets",
    },
  },
  {
    id: "brand-cesium",
    title: "Cesium",
    path: "icons/brand-cesium.svg",
    kind: "brand",
    source: "https://cesium.com/press/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://cesium.com/press/",
    },
  },
  {
    id: "brand-openlayers",
    title: "Openlayers",
    path: "icons/brand-openlayers.svg",
    kind: "brand",
    source:
      "https://github.com/openlayers/openlayers.github.io/blob/5b93e18b8d302eb49a812fb96abb529895ceb7a2/assets/logo.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/openlayers/openlayers.github.io/blob/5b93e18b8d302eb49a812fb96abb529895ceb7a2/assets/logo.svg",
    },
  },
  {
    id: "brand-babylondotjs",
    title: "Babylon.js",
    path: "icons/brand-babylondotjs.svg",
    kind: "brand",
    source:
      "https://github.com/BabylonJS/Brand-Toolkit/blob/8583d4d9bf252a233fa480fa02ac6f367d5207a1/babylon_logo/monochrome/babylon_logo_monochrome_dark.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/BabylonJS/Brand-Toolkit/blob/8583d4d9bf252a233fa480fa02ac6f367d5207a1/babylon_logo/monochrome/babylon_logo_monochrome_dark.svg",
    },
  },
  {
    id: "brand-p5dotjs",
    title: "p5.js",
    path: "icons/brand-p5dotjs.svg",
    kind: "brand",
    source: "https://p5js.org",
    license: {
      type: "See upstream brand guidelines",
      url: "https://p5js.org",
    },
  },
  {
    id: "brand-gsap",
    title: "GSAP",
    path: "icons/brand-gsap.svg",
    kind: "brand",
    source: "https://gsap.com/brand/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://gsap.com/brand/",
    },
  },
  {
    id: "brand-lottiefiles",
    title: "LottieFiles",
    path: "icons/brand-lottiefiles.svg",
    kind: "brand",
    source: "https://lottiefiles.github.io/lottie-docs/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://lottiefiles.github.io/lottie-docs/",
    },
  },
  {
    id: "brand-rive",
    title: "Rive",
    path: "icons/brand-rive.svg",
    kind: "brand",
    source: "https://rive.app",
    license: {
      type: "See upstream brand guidelines",
      url: "https://rive.app",
    },
  },
  {
    id: "brand-pug",
    title: "Pug",
    path: "icons/brand-pug.svg",
    kind: "brand",
    source:
      "https://github.com/pugjs/pug-logo/blob/61429fc45b5a411b83bdb5c99a61084d3054d1e6/SVG/pug-final-logo_-mono-64.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/pugjs/pug-logo/blob/61429fc45b5a411b83bdb5c99a61084d3054d1e6/SVG/pug-final-logo_-mono-64.svg",
    },
  },
  {
    id: "brand-ejs",
    title: "EJS",
    path: "icons/brand-ejs.svg",
    kind: "brand",
    source:
      "https://github.com/mde/ejs-site/blob/dd845093a46b373df42108b888a0ad80085a5c94/ejs.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/mde/ejs-site/blob/dd845093a46b373df42108b888a0ad80085a5c94/ejs.svg",
    },
  },
  {
    id: "brand-nunjucks",
    title: "Nunjucks",
    path: "icons/brand-nunjucks.svg",
    kind: "brand",
    source:
      "https://github.com/mozilla/nunjucks/blob/fd500902d7c88672470c87170796de52fc0f791a/docs/img/favicon.png",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/mozilla/nunjucks/blob/fd500902d7c88672470c87170796de52fc0f791a/docs/img/favicon.png",
    },
  },
  {
    id: "brand-jinja",
    title: "Jinja",
    path: "icons/brand-jinja.svg",
    kind: "brand",
    source: "https://jinja.palletsprojects.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://jinja.palletsprojects.com",
    },
  },
  {
    id: "brand-hugo",
    title: "Hugo",
    path: "icons/brand-hugo.svg",
    kind: "brand",
    source: "https://gohugo.io",
    license: {
      type: "See upstream brand guidelines",
      url: "https://gohugo.io",
    },
  },
  {
    id: "brand-eleventy",
    title: "Eleventy",
    path: "icons/brand-eleventy.svg",
    kind: "brand",
    source: "https://www.11ty.dev",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.11ty.dev",
    },
  },
  {
    id: "brand-jekyll",
    title: "Jekyll",
    path: "icons/brand-jekyll.svg",
    kind: "brand",
    source:
      "https://github.com/jekyll/brand/blob/8302ad3ecf045054a095020729a8d2cc7005faf8/jekyll-logo-black.svg",
    license: {
      type: "CC-BY-4.0",
      url: "https://spdx.org/licenses/CC-BY-4.0",
    },
  },
  {
    id: "brand-hexo",
    title: "Hexo",
    path: "icons/brand-hexo.svg",
    kind: "brand",
    source: "https://hexo.io",
    license: {
      type: "See upstream brand guidelines",
      url: "https://hexo.io",
    },
  },
  {
    id: "brand-gatsby",
    title: "Gatsby",
    path: "icons/brand-gatsby.svg",
    kind: "brand",
    source: "https://www.gatsbyjs.com/guidelines/logo",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.gatsbyjs.com/guidelines/logo",
    },
  },
  {
    id: "brand-gridsome",
    title: "Gridsome",
    path: "icons/brand-gridsome.svg",
    kind: "brand",
    source: "https://gridsome.org/logo/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://gridsome.org/logo/",
    },
  },
  {
    id: "brand-pelican",
    title: "Pelican",
    path: "icons/brand-pelican.svg",
    kind: "brand",
    source: "https://blog.getpelican.com/pages/gratitude.html",
    license: {
      type: "CC-BY-4.0",
      url: "https://spdx.org/licenses/CC-BY-4.0",
    },
  },
  {
    id: "brand-zola",
    title: "Zola",
    path: "icons/brand-zola.svg",
    kind: "brand",
    source:
      "https://github.com/getzola/zola/blob/c3a3d78dfddd34debf5254d293558e8fa045fd51/docs/static/logos/Zola-icon-cream-on-coffee.svg",
    license: {
      type: "CC-BY-SA-4.0",
      url: "https://spdx.org/licenses/CC-BY-SA-4.0",
    },
  },
  {
    id: "brand-falcon",
    title: "Falcon",
    path: "icons/brand-falcon.svg",
    kind: "brand",
    source: "https://falconframework.org",
    license: {
      type: "See upstream brand guidelines",
      url: "https://falconframework.org",
    },
  },
  {
    id: "brand-rocket",
    title: "Rocket",
    path: "icons/brand-rocket.svg",
    kind: "brand",
    source: "https://rocket.rs",
    license: {
      type: "See upstream brand guidelines",
      url: "https://rocket.rs",
    },
  },
  {
    id: "brand-actix",
    title: "Actix",
    path: "icons/brand-actix.svg",
    kind: "brand",
    source:
      "https://github.com/actix/actix-website/issues/18#issuecomment-393581556",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/actix/actix-website/issues/18#issuecomment-393581556",
    },
  },
  {
    id: "brand-tokio",
    title: "Tokio",
    path: "icons/brand-tokio.svg",
    kind: "brand",
    source: "https://tokio.rs/img/icons/tokio.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://tokio.rs/img/icons/tokio.svg",
    },
  },
  {
    id: "brand-warp",
    title: "Warp",
    path: "icons/brand-warp.svg",
    kind: "brand",
    source: "https://warp.dev",
    license: {
      type: "See upstream brand guidelines",
      url: "https://warp.dev",
    },
  },
  {
    id: "brand-bevy",
    title: "Bevy",
    path: "icons/brand-bevy.svg",
    kind: "brand",
    source:
      "https://github.com/bevyengine/bevy/blob/371c90f6faecf318ff66e3c6efa6f9f48781f63f/assets/branding/bevy_bird_simpleicons.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/bevyengine/bevy/blob/371c90f6faecf318ff66e3c6efa6f9f48781f63f/assets/branding/bevy_bird_simpleicons.svg",
    },
  },
  {
    id: "brand-iced",
    title: "Iced",
    path: "icons/brand-iced.svg",
    kind: "brand",
    source: "https://iced.rs",
    license: {
      type: "See upstream brand guidelines",
      url: "https://iced.rs",
    },
  },
  {
    id: "brand-leptos",
    title: "Leptos",
    path: "icons/brand-leptos.svg",
    kind: "brand",
    source:
      "https://github.com/leptos-rs/leptos/blob/6fac92cb6298f1bfa72464de47e33e47b5e5857d/logos/Simple_Icon.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/leptos-rs/leptos/blob/6fac92cb6298f1bfa72464de47e33e47b5e5857d/logos/Simple_Icon.svg",
    },
  },
  {
    id: "brand-yew",
    title: "Yew",
    path: "icons/brand-yew.svg",
    kind: "brand",
    source:
      "https://github.com/yewstack/yew/blob/38e2478d9a2b7a251f6fd068675618326d18fd5a/website/static/img/logo.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/yewstack/yew/blob/38e2478d9a2b7a251f6fd068675618326d18fd5a/website/static/img/logo.svg",
    },
  },
  {
    id: "brand-wails",
    title: "Wails",
    path: "icons/brand-wails.svg",
    kind: "brand",
    source: "https://wails.io",
    license: {
      type: "See upstream brand guidelines",
      url: "https://wails.io",
    },
  },
  {
    id: "brand-wgpu",
    title: "wgpu",
    path: "icons/brand-wgpu.svg",
    kind: "brand",
    source: "https://wgpu.rs",
    license: {
      type: "See upstream brand guidelines",
      url: "https://wgpu.rs",
    },
  },
  {
    id: "brand-vulkan",
    title: "Vulkan",
    path: "icons/brand-vulkan.svg",
    kind: "brand",
    source: "https://www.khronos.org/legal/trademarks",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.khronos.org/legal/trademarks",
    },
  },
  {
    id: "brand-opengl",
    title: "OpenGL",
    path: "icons/brand-opengl.svg",
    kind: "brand",
    source: "https://www.khronos.org/legal/trademarks",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.khronos.org/legal/trademarks",
    },
  },
  {
    id: "brand-webgl",
    title: "WebGL",
    path: "icons/brand-webgl.svg",
    kind: "brand",
    source: "https://www.khronos.org/legal/trademarks",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.khronos.org/legal/trademarks",
    },
  },
  {
    id: "brand-webgpu",
    title: "WebGPU",
    path: "icons/brand-webgpu.svg",
    kind: "brand",
    source: "https://www.w3.org/2023/02/webgpu-logos.html",
    license: {
      type: "CC-BY-4.0",
      url: "https://spdx.org/licenses/CC-BY-4.0",
    },
  },
  {
    id: "brand-ffmpeg",
    title: "FFmpeg",
    path: "icons/brand-ffmpeg.svg",
    kind: "brand",
    source: "https://commons.wikimedia.org/wiki/File:FFmpeg_Logo_new.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://commons.wikimedia.org/wiki/File:FFmpeg_Logo_new.svg",
    },
  },
  {
    id: "brand-opencv",
    title: "OpenCV",
    path: "icons/brand-opencv.svg",
    kind: "brand",
    source: "https://opencv.org/resources/media-kit/",
    license: {
      type: "See upstream brand guidelines",
      url: "https://opencv.org/resources/media-kit/",
    },
  },
  {
    id: "brand-mediapipe",
    title: "MediaPipe",
    path: "icons/brand-mediapipe.svg",
    kind: "brand",
    source:
      "https://developers.google.com/static/mediapipe/images/mediapipe_icon.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://developers.google.com/static/mediapipe/images/mediapipe_icon.svg",
    },
  },
  {
    id: "brand-onnx",
    title: "ONNX",
    path: "icons/brand-onnx.svg",
    kind: "brand",
    source:
      "https://github.com/onnx/onnx.github.io/blob/382e7036b616ce1555499ac41730245a2478513c/images/ONNX-ICON.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://github.com/onnx/onnx.github.io/blob/382e7036b616ce1555499ac41730245a2478513c/images/ONNX-ICON.svg",
    },
  },
  {
    id: "brand-nvidia",
    title: "NVIDIA",
    path: "icons/brand-nvidia.svg",
    kind: "brand",
    source: "https://www.nvidia.com/en-us",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.nvidia.com/en-us",
    },
  },
  {
    id: "brand-amd",
    title: "AMD",
    path: "icons/brand-amd.svg",
    kind: "brand",
    source: "https://www.amd.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.amd.com",
    },
  },
  {
    id: "brand-intel",
    title: "Intel",
    path: "icons/brand-intel.svg",
    kind: "brand",
    source:
      "https://www.intel.com/content/www/us/en/newsroom/resources/press-kits-intel-overview.html",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.intel.com/content/www/us/en/newsroom/resources/press-kits-intel-overview.html",
    },
  },
  {
    id: "brand-qualcomm",
    title: "Qualcomm",
    path: "icons/brand-qualcomm.svg",
    kind: "brand",
    source: "https://www.qualcomm.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.qualcomm.com",
    },
  },
  {
    id: "brand-broadcom",
    title: "Broadcom",
    path: "icons/brand-broadcom.svg",
    kind: "brand",
    source: "https://www.broadcom.com/support",
    license: {
      type: "custom",
      url: "https://logorequest.broadcom.com/Home.aspx",
    },
  },
  {
    id: "brand-arm",
    title: "Arm",
    path: "icons/brand-arm.svg",
    kind: "brand",
    source: "https://www.arm.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.arm.com",
    },
  },
  {
    id: "brand-elevenlabs",
    title: "ElevenLabs",
    path: "icons/brand-elevenlabs.svg",
    kind: "brand",
    source: "https://elevenlabs.io/brand",
    license: {
      type: "See upstream brand guidelines",
      url: "https://elevenlabs.io/brand",
    },
  },
  {
    id: "brand-deepgram",
    title: "Deepgram",
    path: "icons/brand-deepgram.svg",
    kind: "brand",
    source: "https://deepgram.com/company/newsroom",
    license: {
      type: "See upstream brand guidelines",
      url: "https://deepgram.com/company/newsroom",
    },
  },
  {
    id: "brand-livekit",
    title: "LiveKit",
    path: "icons/brand-livekit.svg",
    kind: "brand",
    source: "https://livekit.io/brand",
    license: {
      type: "See upstream brand guidelines",
      url: "https://livekit.io/brand",
    },
  },
  {
    id: "brand-vonage",
    title: "Vonage",
    path: "icons/brand-vonage.svg",
    kind: "brand",
    source: "https://www.vonage.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.vonage.com",
    },
  },
  {
    id: "brand-resend",
    title: "Resend",
    path: "icons/brand-resend.svg",
    kind: "brand",
    source: "https://resend.com/brand",
    license: {
      type: "See upstream brand guidelines",
      url: "https://resend.com/brand",
    },
  },
  {
    id: "brand-mailgun",
    title: "Mailgun",
    path: "icons/brand-mailgun.svg",
    kind: "brand",
    source: "https://mailgun.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://mailgun.com",
    },
  },
  {
    id: "brand-mailchimp",
    title: "MailChimp",
    path: "icons/brand-mailchimp.svg",
    kind: "brand",
    source: "https://mailchimp.com/about/brand-assets",
    license: {
      type: "See upstream brand guidelines",
      url: "https://mailchimp.com/about/brand-assets",
    },
  },
  {
    id: "brand-brevo",
    title: "Brevo",
    path: "icons/brand-brevo.svg",
    kind: "brand",
    source: "https://www.brevo.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.brevo.com",
    },
  },
  {
    id: "brand-loops",
    title: "Loops",
    path: "icons/brand-loops.svg",
    kind: "brand",
    source: "https://app.loops.so/loops.svg",
    license: {
      type: "See upstream brand guidelines",
      url: "https://app.loops.so/loops.svg",
    },
  },
  {
    id: "brand-hubspot",
    title: "HubSpot",
    path: "icons/brand-hubspot.svg",
    kind: "brand",
    source: "https://www.hubspot.com/style-guide",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.hubspot.com/style-guide",
    },
  },
  {
    id: "brand-intercom",
    title: "Intercom",
    path: "icons/brand-intercom.svg",
    kind: "brand",
    source: "https://www.intercom.com/press",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.intercom.com/press",
    },
  },
  {
    id: "brand-zendesk",
    title: "Zendesk",
    path: "icons/brand-zendesk.svg",
    kind: "brand",
    source: "https://brandland.zendesk.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://brandland.zendesk.com",
    },
  },
  {
    id: "brand-helpscout",
    title: "Help Scout",
    path: "icons/brand-helpscout.svg",
    kind: "brand",
    source: "https://www.helpscout.com",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.helpscout.com",
    },
  },
  {
    id: "brand-discourse",
    title: "Discourse",
    path: "icons/brand-discourse.svg",
    kind: "brand",
    source: "https://www.discourse.org",
    license: {
      type: "See upstream brand guidelines",
      url: "https://www.discourse.org",
    },
  },
  {
    id: "brand-disqus",
    title: "Disqus",
    path: "icons/brand-disqus.svg",
    kind: "brand",
    source: "https://disqus.com/brand",
    license: {
      type: "See upstream brand guidelines",
      url: "https://disqus.com/brand",
    },
  },
  {
    id: "work-bug",
    title: "Bug",
    path: "icons/work-bug.svg",
    kind: "work",
    source: "https://lucide.dev/icons/bug",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-bug-off",
    title: "Bug Off",
    path: "icons/work-bug-off.svg",
    kind: "work",
    source: "https://lucide.dev/icons/bug-off",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-bug-play",
    title: "Bug Play",
    path: "icons/work-bug-play.svg",
    kind: "work",
    source: "https://lucide.dev/icons/bug-play",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-shield-alert",
    title: "Shield Alert",
    path: "icons/work-shield-alert.svg",
    kind: "work",
    source: "https://lucide.dev/icons/shield-alert",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-shield-check",
    title: "Shield Check",
    path: "icons/work-shield-check.svg",
    kind: "work",
    source: "https://lucide.dev/icons/shield-check",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-shield-x",
    title: "Shield X",
    path: "icons/work-shield-x.svg",
    kind: "work",
    source: "https://lucide.dev/icons/shield-x",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-shield",
    title: "Shield",
    path: "icons/work-shield.svg",
    kind: "work",
    source: "https://lucide.dev/icons/shield",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-lock",
    title: "Lock",
    path: "icons/work-lock.svg",
    kind: "work",
    source: "https://lucide.dev/icons/lock",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-lock-keyhole",
    title: "Lock Keyhole",
    path: "icons/work-lock-keyhole.svg",
    kind: "work",
    source: "https://lucide.dev/icons/lock-keyhole",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-unlock",
    title: "Unlock",
    path: "icons/work-unlock.svg",
    kind: "work",
    source: "https://lucide.dev/icons/unlock",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-key",
    title: "Key",
    path: "icons/work-key.svg",
    kind: "work",
    source: "https://lucide.dev/icons/key",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-key-round",
    title: "Key Round",
    path: "icons/work-key-round.svg",
    kind: "work",
    source: "https://lucide.dev/icons/key-round",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-fingerprint",
    title: "Fingerprint",
    path: "icons/work-fingerprint.svg",
    kind: "work",
    source: "https://lucide.dev/icons/fingerprint",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-scan-face",
    title: "Scan Face",
    path: "icons/work-scan-face.svg",
    kind: "work",
    source: "https://lucide.dev/icons/scan-face",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-scan-eye",
    title: "Scan Eye",
    path: "icons/work-scan-eye.svg",
    kind: "work",
    source: "https://lucide.dev/icons/scan-eye",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-eye",
    title: "Eye",
    path: "icons/work-eye.svg",
    kind: "work",
    source: "https://lucide.dev/icons/eye",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-eye-off",
    title: "Eye Off",
    path: "icons/work-eye-off.svg",
    kind: "work",
    source: "https://lucide.dev/icons/eye-off",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-scan-search",
    title: "Scan Search",
    path: "icons/work-scan-search.svg",
    kind: "work",
    source: "https://lucide.dev/icons/scan-search",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-search",
    title: "Search",
    path: "icons/work-search.svg",
    kind: "work",
    source: "https://lucide.dev/icons/search",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-search-check",
    title: "Search Check",
    path: "icons/work-search-check.svg",
    kind: "work",
    source: "https://lucide.dev/icons/search-check",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-search-x",
    title: "Search X",
    path: "icons/work-search-x.svg",
    kind: "work",
    source: "https://lucide.dev/icons/search-x",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-file-search",
    title: "File Search",
    path: "icons/work-file-search.svg",
    kind: "work",
    source: "https://lucide.dev/icons/file-search",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-file-warning",
    title: "File Warning",
    path: "icons/work-file-warning.svg",
    kind: "work",
    source: "https://lucide.dev/icons/file-warning",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-file-x",
    title: "File X",
    path: "icons/work-file-x.svg",
    kind: "work",
    source: "https://lucide.dev/icons/file-x",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-file-code",
    title: "File Code",
    path: "icons/work-file-code.svg",
    kind: "work",
    source: "https://lucide.dev/icons/file-code",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-file-json",
    title: "File Json",
    path: "icons/work-file-json.svg",
    kind: "work",
    source: "https://lucide.dev/icons/file-json",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-file-text",
    title: "File Text",
    path: "icons/work-file-text.svg",
    kind: "work",
    source: "https://lucide.dev/icons/file-text",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-file-stack",
    title: "File Stack",
    path: "icons/work-file-stack.svg",
    kind: "work",
    source: "https://lucide.dev/icons/file-stack",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-files",
    title: "Files",
    path: "icons/work-files.svg",
    kind: "work",
    source: "https://lucide.dev/icons/files",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-file-check",
    title: "File Check",
    path: "icons/work-file-check.svg",
    kind: "work",
    source: "https://lucide.dev/icons/file-check",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-folder",
    title: "Folder",
    path: "icons/work-folder.svg",
    kind: "work",
    source: "https://lucide.dev/icons/folder",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-folder-open",
    title: "Folder Open",
    path: "icons/work-folder-open.svg",
    kind: "work",
    source: "https://lucide.dev/icons/folder-open",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-folder-git",
    title: "Folder Git",
    path: "icons/work-folder-git.svg",
    kind: "work",
    source: "https://lucide.dev/icons/folder-git",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-folder-archive",
    title: "Folder Archive",
    path: "icons/work-folder-archive.svg",
    kind: "work",
    source: "https://lucide.dev/icons/folder-archive",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-archive",
    title: "Archive",
    path: "icons/work-archive.svg",
    kind: "work",
    source: "https://lucide.dev/icons/archive",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-archive-restore",
    title: "Archive Restore",
    path: "icons/work-archive-restore.svg",
    kind: "work",
    source: "https://lucide.dev/icons/archive-restore",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-archive-x",
    title: "Archive X",
    path: "icons/work-archive-x.svg",
    kind: "work",
    source: "https://lucide.dev/icons/archive-x",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-boxes",
    title: "Boxes",
    path: "icons/work-boxes.svg",
    kind: "work",
    source: "https://lucide.dev/icons/boxes",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-box",
    title: "Box",
    path: "icons/work-box.svg",
    kind: "work",
    source: "https://lucide.dev/icons/box",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-package",
    title: "Package",
    path: "icons/work-package.svg",
    kind: "work",
    source: "https://lucide.dev/icons/package",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-package-check",
    title: "Package Check",
    path: "icons/work-package-check.svg",
    kind: "work",
    source: "https://lucide.dev/icons/package-check",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-package-open",
    title: "Package Open",
    path: "icons/work-package-open.svg",
    kind: "work",
    source: "https://lucide.dev/icons/package-open",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-package-search",
    title: "Package Search",
    path: "icons/work-package-search.svg",
    kind: "work",
    source: "https://lucide.dev/icons/package-search",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-package-x",
    title: "Package X",
    path: "icons/work-package-x.svg",
    kind: "work",
    source: "https://lucide.dev/icons/package-x",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-container",
    title: "Container",
    path: "icons/work-container.svg",
    kind: "work",
    source: "https://lucide.dev/icons/container",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-ship",
    title: "Ship",
    path: "icons/work-ship.svg",
    kind: "work",
    source: "https://lucide.dev/icons/ship",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-server",
    title: "Server",
    path: "icons/work-server.svg",
    kind: "work",
    source: "https://lucide.dev/icons/server",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-server-cog",
    title: "Server Cog",
    path: "icons/work-server-cog.svg",
    kind: "work",
    source: "https://lucide.dev/icons/server-cog",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-server-crash",
    title: "Server Crash",
    path: "icons/work-server-crash.svg",
    kind: "work",
    source: "https://lucide.dev/icons/server-crash",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-server-off",
    title: "Server Off",
    path: "icons/work-server-off.svg",
    kind: "work",
    source: "https://lucide.dev/icons/server-off",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-database",
    title: "Database",
    path: "icons/work-database.svg",
    kind: "work",
    source: "https://lucide.dev/icons/database",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-database-backup",
    title: "Database Backup",
    path: "icons/work-database-backup.svg",
    kind: "work",
    source: "https://lucide.dev/icons/database-backup",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-database-zap",
    title: "Database Zap",
    path: "icons/work-database-zap.svg",
    kind: "work",
    source: "https://lucide.dev/icons/database-zap",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-database-check",
    title: "Database Check",
    path: "icons/work-database-check.svg",
    kind: "work",
    source: "https://lucide.dev/icons/database-check",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-database-search",
    title: "Database Search",
    path: "icons/work-database-search.svg",
    kind: "work",
    source: "https://lucide.dev/icons/database-search",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-hard-drive",
    title: "Hard Drive",
    path: "icons/work-hard-drive.svg",
    kind: "work",
    source: "https://lucide.dev/icons/hard-drive",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-hard-drive-download",
    title: "Hard Drive Download",
    path: "icons/work-hard-drive-download.svg",
    kind: "work",
    source: "https://lucide.dev/icons/hard-drive-download",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-hard-drive-upload",
    title: "Hard Drive Upload",
    path: "icons/work-hard-drive-upload.svg",
    kind: "work",
    source: "https://lucide.dev/icons/hard-drive-upload",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-memory-stick",
    title: "Memory Stick",
    path: "icons/work-memory-stick.svg",
    kind: "work",
    source: "https://lucide.dev/icons/memory-stick",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-cpu",
    title: "Cpu",
    path: "icons/work-cpu.svg",
    kind: "work",
    source: "https://lucide.dev/icons/cpu",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-circuit-board",
    title: "Circuit Board",
    path: "icons/work-circuit-board.svg",
    kind: "work",
    source: "https://lucide.dev/icons/circuit-board",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-microchip",
    title: "Microchip",
    path: "icons/work-microchip.svg",
    kind: "work",
    source: "https://lucide.dev/icons/microchip",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-network",
    title: "Network",
    path: "icons/work-network.svg",
    kind: "work",
    source: "https://lucide.dev/icons/network",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-wifi",
    title: "Wifi",
    path: "icons/work-wifi.svg",
    kind: "work",
    source: "https://lucide.dev/icons/wifi",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-wifi-off",
    title: "Wifi Off",
    path: "icons/work-wifi-off.svg",
    kind: "work",
    source: "https://lucide.dev/icons/wifi-off",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-router",
    title: "Router",
    path: "icons/work-router.svg",
    kind: "work",
    source: "https://lucide.dev/icons/router",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-radio",
    title: "Radio",
    path: "icons/work-radio.svg",
    kind: "work",
    source: "https://lucide.dev/icons/radio",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-antenna",
    title: "Antenna",
    path: "icons/work-antenna.svg",
    kind: "work",
    source: "https://lucide.dev/icons/antenna",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-cable",
    title: "Cable",
    path: "icons/work-cable.svg",
    kind: "work",
    source: "https://lucide.dev/icons/cable",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-plug",
    title: "Plug",
    path: "icons/work-plug.svg",
    kind: "work",
    source: "https://lucide.dev/icons/plug",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-plug-zap",
    title: "Plug Zap",
    path: "icons/work-plug-zap.svg",
    kind: "work",
    source: "https://lucide.dev/icons/plug-zap",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-unplug",
    title: "Unplug",
    path: "icons/work-unplug.svg",
    kind: "work",
    source: "https://lucide.dev/icons/unplug",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-cloud",
    title: "Cloud",
    path: "icons/work-cloud.svg",
    kind: "work",
    source: "https://lucide.dev/icons/cloud",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-cloud-cog",
    title: "Cloud Cog",
    path: "icons/work-cloud-cog.svg",
    kind: "work",
    source: "https://lucide.dev/icons/cloud-cog",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-cloud-download",
    title: "Cloud Download",
    path: "icons/work-cloud-download.svg",
    kind: "work",
    source: "https://lucide.dev/icons/cloud-download",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-cloud-upload",
    title: "Cloud Upload",
    path: "icons/work-cloud-upload.svg",
    kind: "work",
    source: "https://lucide.dev/icons/cloud-upload",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-cloud-off",
    title: "Cloud Off",
    path: "icons/work-cloud-off.svg",
    kind: "work",
    source: "https://lucide.dev/icons/cloud-off",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-cloud-alert",
    title: "Cloud Alert",
    path: "icons/work-cloud-alert.svg",
    kind: "work",
    source: "https://lucide.dev/icons/cloud-alert",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-cloud-check",
    title: "Cloud Check",
    path: "icons/work-cloud-check.svg",
    kind: "work",
    source: "https://lucide.dev/icons/cloud-check",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-cloud-lightning",
    title: "Cloud Lightning",
    path: "icons/work-cloud-lightning.svg",
    kind: "work",
    source: "https://lucide.dev/icons/cloud-lightning",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-upload",
    title: "Upload",
    path: "icons/work-upload.svg",
    kind: "work",
    source: "https://lucide.dev/icons/upload",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-download",
    title: "Download",
    path: "icons/work-download.svg",
    kind: "work",
    source: "https://lucide.dev/icons/download",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-refresh-cw",
    title: "Refresh Cw",
    path: "icons/work-refresh-cw.svg",
    kind: "work",
    source: "https://lucide.dev/icons/refresh-cw",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-refresh-ccw",
    title: "Refresh Ccw",
    path: "icons/work-refresh-ccw.svg",
    kind: "work",
    source: "https://lucide.dev/icons/refresh-ccw",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-rotate-ccw",
    title: "Rotate Ccw",
    path: "icons/work-rotate-ccw.svg",
    kind: "work",
    source: "https://lucide.dev/icons/rotate-ccw",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-rotate-cw",
    title: "Rotate Cw",
    path: "icons/work-rotate-cw.svg",
    kind: "work",
    source: "https://lucide.dev/icons/rotate-cw",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-repeat",
    title: "Repeat",
    path: "icons/work-repeat.svg",
    kind: "work",
    source: "https://lucide.dev/icons/repeat",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-repeat2",
    title: "Repeat2",
    path: "icons/work-repeat2.svg",
    kind: "work",
    source: "https://lucide.dev/icons/repeat2",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-workflow",
    title: "Workflow",
    path: "icons/work-workflow.svg",
    kind: "work",
    source: "https://lucide.dev/icons/workflow",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-git-branch",
    title: "Git Branch",
    path: "icons/work-git-branch.svg",
    kind: "work",
    source: "https://lucide.dev/icons/git-branch",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-git-commit-horizontal",
    title: "Git Commit Horizontal",
    path: "icons/work-git-commit-horizontal.svg",
    kind: "work",
    source: "https://lucide.dev/icons/git-commit-horizontal",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-git-merge",
    title: "Git Merge",
    path: "icons/work-git-merge.svg",
    kind: "work",
    source: "https://lucide.dev/icons/git-merge",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-git-pull-request",
    title: "Git Pull Request",
    path: "icons/work-git-pull-request.svg",
    kind: "work",
    source: "https://lucide.dev/icons/git-pull-request",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-git-pull-request-closed",
    title: "Git Pull Request Closed",
    path: "icons/work-git-pull-request-closed.svg",
    kind: "work",
    source: "https://lucide.dev/icons/git-pull-request-closed",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-git-pull-request-draft",
    title: "Git Pull Request Draft",
    path: "icons/work-git-pull-request-draft.svg",
    kind: "work",
    source: "https://lucide.dev/icons/git-pull-request-draft",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-git-compare",
    title: "Git Compare",
    path: "icons/work-git-compare.svg",
    kind: "work",
    source: "https://lucide.dev/icons/git-compare",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-git-fork",
    title: "Git Fork",
    path: "icons/work-git-fork.svg",
    kind: "work",
    source: "https://lucide.dev/icons/git-fork",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-git-graph",
    title: "Git Graph",
    path: "icons/work-git-graph.svg",
    kind: "work",
    source: "https://lucide.dev/icons/git-graph",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-git-commit-vertical",
    title: "Git Commit Vertical",
    path: "icons/work-git-commit-vertical.svg",
    kind: "work",
    source: "https://lucide.dev/icons/git-commit-vertical",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-webhook",
    title: "Webhook",
    path: "icons/work-webhook.svg",
    kind: "work",
    source: "https://lucide.dev/icons/webhook",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-webhook-off",
    title: "Webhook Off",
    path: "icons/work-webhook-off.svg",
    kind: "work",
    source: "https://lucide.dev/icons/webhook-off",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-bot",
    title: "Bot",
    path: "icons/work-bot.svg",
    kind: "work",
    source: "https://lucide.dev/icons/bot",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-bot-message-square",
    title: "Bot Message Square",
    path: "icons/work-bot-message-square.svg",
    kind: "work",
    source: "https://lucide.dev/icons/bot-message-square",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-brain",
    title: "Brain",
    path: "icons/work-brain.svg",
    kind: "work",
    source: "https://lucide.dev/icons/brain",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-brain-circuit",
    title: "Brain Circuit",
    path: "icons/work-brain-circuit.svg",
    kind: "work",
    source: "https://lucide.dev/icons/brain-circuit",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-sparkles",
    title: "Sparkles",
    path: "icons/work-sparkles.svg",
    kind: "work",
    source: "https://lucide.dev/icons/sparkles",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-wand",
    title: "Wand",
    path: "icons/work-wand.svg",
    kind: "work",
    source: "https://lucide.dev/icons/wand",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-wand-sparkles",
    title: "Wand Sparkles",
    path: "icons/work-wand-sparkles.svg",
    kind: "work",
    source: "https://lucide.dev/icons/wand-sparkles",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-terminal",
    title: "Terminal",
    path: "icons/work-terminal.svg",
    kind: "work",
    source: "https://lucide.dev/icons/terminal",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-square-terminal",
    title: "Square Terminal",
    path: "icons/work-square-terminal.svg",
    kind: "work",
    source: "https://lucide.dev/icons/square-terminal",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-code",
    title: "Code",
    path: "icons/work-code.svg",
    kind: "work",
    source: "https://lucide.dev/icons/code",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-code-xml",
    title: "Code Xml",
    path: "icons/work-code-xml.svg",
    kind: "work",
    source: "https://lucide.dev/icons/code-xml",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-braces",
    title: "Braces",
    path: "icons/work-braces.svg",
    kind: "work",
    source: "https://lucide.dev/icons/braces",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-brackets",
    title: "Brackets",
    path: "icons/work-brackets.svg",
    kind: "work",
    source: "https://lucide.dev/icons/brackets",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-binary",
    title: "Binary",
    path: "icons/work-binary.svg",
    kind: "work",
    source: "https://lucide.dev/icons/binary",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-regex",
    title: "Regex",
    path: "icons/work-regex.svg",
    kind: "work",
    source: "https://lucide.dev/icons/regex",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-variable",
    title: "Variable",
    path: "icons/work-variable.svg",
    kind: "work",
    source: "https://lucide.dev/icons/variable",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-function-square",
    title: "Function Square",
    path: "icons/work-function-square.svg",
    kind: "work",
    source: "https://lucide.dev/icons/function-square",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-file-terminal",
    title: "File Terminal",
    path: "icons/work-file-terminal.svg",
    kind: "work",
    source: "https://lucide.dev/icons/file-terminal",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-square-code",
    title: "Square Code",
    path: "icons/work-square-code.svg",
    kind: "work",
    source: "https://lucide.dev/icons/square-code",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-monitor",
    title: "Monitor",
    path: "icons/work-monitor.svg",
    kind: "work",
    source: "https://lucide.dev/icons/monitor",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-monitor-cog",
    title: "Monitor Cog",
    path: "icons/work-monitor-cog.svg",
    kind: "work",
    source: "https://lucide.dev/icons/monitor-cog",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-monitor-check",
    title: "Monitor Check",
    path: "icons/work-monitor-check.svg",
    kind: "work",
    source: "https://lucide.dev/icons/monitor-check",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-monitor-x",
    title: "Monitor X",
    path: "icons/work-monitor-x.svg",
    kind: "work",
    source: "https://lucide.dev/icons/monitor-x",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-monitor-smartphone",
    title: "Monitor Smartphone",
    path: "icons/work-monitor-smartphone.svg",
    kind: "work",
    source: "https://lucide.dev/icons/monitor-smartphone",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-laptop",
    title: "Laptop",
    path: "icons/work-laptop.svg",
    kind: "work",
    source: "https://lucide.dev/icons/laptop",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-smartphone",
    title: "Smartphone",
    path: "icons/work-smartphone.svg",
    kind: "work",
    source: "https://lucide.dev/icons/smartphone",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-tablet",
    title: "Tablet",
    path: "icons/work-tablet.svg",
    kind: "work",
    source: "https://lucide.dev/icons/tablet",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-watch",
    title: "Watch",
    path: "icons/work-watch.svg",
    kind: "work",
    source: "https://lucide.dev/icons/watch",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-tv",
    title: "Tv",
    path: "icons/work-tv.svg",
    kind: "work",
    source: "https://lucide.dev/icons/tv",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-camera",
    title: "Camera",
    path: "icons/work-camera.svg",
    kind: "work",
    source: "https://lucide.dev/icons/camera",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-webcam",
    title: "Webcam",
    path: "icons/work-webcam.svg",
    kind: "work",
    source: "https://lucide.dev/icons/webcam",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-mic",
    title: "Mic",
    path: "icons/work-mic.svg",
    kind: "work",
    source: "https://lucide.dev/icons/mic",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-mic-off",
    title: "Mic Off",
    path: "icons/work-mic-off.svg",
    kind: "work",
    source: "https://lucide.dev/icons/mic-off",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-video",
    title: "Video",
    path: "icons/work-video.svg",
    kind: "work",
    source: "https://lucide.dev/icons/video",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-video-off",
    title: "Video Off",
    path: "icons/work-video-off.svg",
    kind: "work",
    source: "https://lucide.dev/icons/video-off",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-bell",
    title: "Bell",
    path: "icons/work-bell.svg",
    kind: "work",
    source: "https://lucide.dev/icons/bell",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-bell-ring",
    title: "Bell Ring",
    path: "icons/work-bell-ring.svg",
    kind: "work",
    source: "https://lucide.dev/icons/bell-ring",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-bell-off",
    title: "Bell Off",
    path: "icons/work-bell-off.svg",
    kind: "work",
    source: "https://lucide.dev/icons/bell-off",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-bell-dot",
    title: "Bell Dot",
    path: "icons/work-bell-dot.svg",
    kind: "work",
    source: "https://lucide.dev/icons/bell-dot",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-calendar",
    title: "Calendar",
    path: "icons/work-calendar.svg",
    kind: "work",
    source: "https://lucide.dev/icons/calendar",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-calendar-check",
    title: "Calendar Check",
    path: "icons/work-calendar-check.svg",
    kind: "work",
    source: "https://lucide.dev/icons/calendar-check",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-calendar-clock",
    title: "Calendar Clock",
    path: "icons/work-calendar-clock.svg",
    kind: "work",
    source: "https://lucide.dev/icons/calendar-clock",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-calendar-days",
    title: "Calendar Days",
    path: "icons/work-calendar-days.svg",
    kind: "work",
    source: "https://lucide.dev/icons/calendar-days",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-calendar-range",
    title: "Calendar Range",
    path: "icons/work-calendar-range.svg",
    kind: "work",
    source: "https://lucide.dev/icons/calendar-range",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-clock",
    title: "Clock",
    path: "icons/work-clock.svg",
    kind: "work",
    source: "https://lucide.dev/icons/clock",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-clock-alert",
    title: "Clock Alert",
    path: "icons/work-clock-alert.svg",
    kind: "work",
    source: "https://lucide.dev/icons/clock-alert",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-clock-fading",
    title: "Clock Fading",
    path: "icons/work-clock-fading.svg",
    kind: "work",
    source: "https://lucide.dev/icons/clock-fading",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-timer",
    title: "Timer",
    path: "icons/work-timer.svg",
    kind: "work",
    source: "https://lucide.dev/icons/timer",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-alarm-clock",
    title: "Alarm Clock",
    path: "icons/work-alarm-clock.svg",
    kind: "work",
    source: "https://lucide.dev/icons/alarm-clock",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-hourglass",
    title: "Hourglass",
    path: "icons/work-hourglass.svg",
    kind: "work",
    source: "https://lucide.dev/icons/hourglass",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-gauge",
    title: "Gauge",
    path: "icons/work-gauge.svg",
    kind: "work",
    source: "https://lucide.dev/icons/gauge",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-activity",
    title: "Activity",
    path: "icons/work-activity.svg",
    kind: "work",
    source: "https://lucide.dev/icons/activity",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-heart-pulse",
    title: "Heart Pulse",
    path: "icons/work-heart-pulse.svg",
    kind: "work",
    source: "https://lucide.dev/icons/heart-pulse",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-chart-line",
    title: "Chart Line",
    path: "icons/work-chart-line.svg",
    kind: "work",
    source: "https://lucide.dev/icons/chart-line",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-chart-bar",
    title: "Chart Bar",
    path: "icons/work-chart-bar.svg",
    kind: "work",
    source: "https://lucide.dev/icons/chart-bar",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-chart-area",
    title: "Chart Area",
    path: "icons/work-chart-area.svg",
    kind: "work",
    source: "https://lucide.dev/icons/chart-area",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-chart-pie",
    title: "Chart Pie",
    path: "icons/work-chart-pie.svg",
    kind: "work",
    source: "https://lucide.dev/icons/chart-pie",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-trending-up",
    title: "Trending Up",
    path: "icons/work-trending-up.svg",
    kind: "work",
    source: "https://lucide.dev/icons/trending-up",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-trending-down",
    title: "Trending Down",
    path: "icons/work-trending-down.svg",
    kind: "work",
    source: "https://lucide.dev/icons/trending-down",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-chart-network",
    title: "Chart Network",
    path: "icons/work-chart-network.svg",
    kind: "work",
    source: "https://lucide.dev/icons/chart-network",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-chart-no-axes-combined",
    title: "Chart No Axes Combined",
    path: "icons/work-chart-no-axes-combined.svg",
    kind: "work",
    source: "https://lucide.dev/icons/chart-no-axes-combined",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-signal",
    title: "Signal",
    path: "icons/work-signal.svg",
    kind: "work",
    source: "https://lucide.dev/icons/signal",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-satellite",
    title: "Satellite",
    path: "icons/work-satellite.svg",
    kind: "work",
    source: "https://lucide.dev/icons/satellite",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-radar",
    title: "Radar",
    path: "icons/work-radar.svg",
    kind: "work",
    source: "https://lucide.dev/icons/radar",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-telescope",
    title: "Telescope",
    path: "icons/work-telescope.svg",
    kind: "work",
    source: "https://lucide.dev/icons/telescope",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-compass",
    title: "Compass",
    path: "icons/work-compass.svg",
    kind: "work",
    source: "https://lucide.dev/icons/compass",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-map",
    title: "Map",
    path: "icons/work-map.svg",
    kind: "work",
    source: "https://lucide.dev/icons/map",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-map-pin",
    title: "Map Pin",
    path: "icons/work-map-pin.svg",
    kind: "work",
    source: "https://lucide.dev/icons/map-pin",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-globe",
    title: "Globe",
    path: "icons/work-globe.svg",
    kind: "work",
    source: "https://lucide.dev/icons/globe",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-globe-lock",
    title: "Globe Lock",
    path: "icons/work-globe-lock.svg",
    kind: "work",
    source: "https://lucide.dev/icons/globe-lock",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-languages",
    title: "Languages",
    path: "icons/work-languages.svg",
    kind: "work",
    source: "https://lucide.dev/icons/languages",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-earth",
    title: "Earth",
    path: "icons/work-earth.svg",
    kind: "work",
    source: "https://lucide.dev/icons/earth",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-route",
    title: "Route",
    path: "icons/work-route.svg",
    kind: "work",
    source: "https://lucide.dev/icons/route",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-navigation",
    title: "Navigation",
    path: "icons/work-navigation.svg",
    kind: "work",
    source: "https://lucide.dev/icons/navigation",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-navigation2",
    title: "Navigation2",
    path: "icons/work-navigation2.svg",
    kind: "work",
    source: "https://lucide.dev/icons/navigation2",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-milestone",
    title: "Milestone",
    path: "icons/work-milestone.svg",
    kind: "work",
    source: "https://lucide.dev/icons/milestone",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-flag",
    title: "Flag",
    path: "icons/work-flag.svg",
    kind: "work",
    source: "https://lucide.dev/icons/flag",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-flag-triangle-right",
    title: "Flag Triangle Right",
    path: "icons/work-flag-triangle-right.svg",
    kind: "work",
    source: "https://lucide.dev/icons/flag-triangle-right",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-target",
    title: "Target",
    path: "icons/work-target.svg",
    kind: "work",
    source: "https://lucide.dev/icons/target",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-crosshair",
    title: "Crosshair",
    path: "icons/work-crosshair.svg",
    kind: "work",
    source: "https://lucide.dev/icons/crosshair",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-circle-dot",
    title: "Circle Dot",
    path: "icons/work-circle-dot.svg",
    kind: "work",
    source: "https://lucide.dev/icons/circle-dot",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-circle-check",
    title: "Circle Check",
    path: "icons/work-circle-check.svg",
    kind: "work",
    source: "https://lucide.dev/icons/circle-check",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-circle-check-big",
    title: "Circle Check Big",
    path: "icons/work-circle-check-big.svg",
    kind: "work",
    source: "https://lucide.dev/icons/circle-check-big",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-circle-x",
    title: "Circle X",
    path: "icons/work-circle-x.svg",
    kind: "work",
    source: "https://lucide.dev/icons/circle-x",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-circle-alert",
    title: "Circle Alert",
    path: "icons/work-circle-alert.svg",
    kind: "work",
    source: "https://lucide.dev/icons/circle-alert",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-circle-help",
    title: "Circle Help",
    path: "icons/work-circle-help.svg",
    kind: "work",
    source: "https://lucide.dev/icons/circle-help",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-triangle-alert",
    title: "Triangle Alert",
    path: "icons/work-triangle-alert.svg",
    kind: "work",
    source: "https://lucide.dev/icons/triangle-alert",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-octagon-alert",
    title: "Octagon Alert",
    path: "icons/work-octagon-alert.svg",
    kind: "work",
    source: "https://lucide.dev/icons/octagon-alert",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-octagon-x",
    title: "Octagon X",
    path: "icons/work-octagon-x.svg",
    kind: "work",
    source: "https://lucide.dev/icons/octagon-x",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-ban",
    title: "Ban",
    path: "icons/work-ban.svg",
    kind: "work",
    source: "https://lucide.dev/icons/ban",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-proportions",
    title: "Proportions",
    path: "icons/work-proportions.svg",
    kind: "work",
    source: "https://lucide.dev/icons/proportions",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-accessibility",
    title: "Accessibility",
    path: "icons/work-accessibility.svg",
    kind: "work",
    source: "https://lucide.dev/icons/accessibility",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-person-standing",
    title: "Person Standing",
    path: "icons/work-person-standing.svg",
    kind: "work",
    source: "https://lucide.dev/icons/person-standing",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-users",
    title: "Users",
    path: "icons/work-users.svg",
    kind: "work",
    source: "https://lucide.dev/icons/users",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-user",
    title: "User",
    path: "icons/work-user.svg",
    kind: "work",
    source: "https://lucide.dev/icons/user",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-user-check",
    title: "User Check",
    path: "icons/work-user-check.svg",
    kind: "work",
    source: "https://lucide.dev/icons/user-check",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-user-cog",
    title: "User Cog",
    path: "icons/work-user-cog.svg",
    kind: "work",
    source: "https://lucide.dev/icons/user-cog",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-user-lock",
    title: "User Lock",
    path: "icons/work-user-lock.svg",
    kind: "work",
    source: "https://lucide.dev/icons/user-lock",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-user-plus",
    title: "User Plus",
    path: "icons/work-user-plus.svg",
    kind: "work",
    source: "https://lucide.dev/icons/user-plus",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-contact",
    title: "Contact",
    path: "icons/work-contact.svg",
    kind: "work",
    source: "https://lucide.dev/icons/contact",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-contact-round",
    title: "Contact Round",
    path: "icons/work-contact-round.svg",
    kind: "work",
    source: "https://lucide.dev/icons/contact-round",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-shield-user",
    title: "Shield User",
    path: "icons/work-shield-user.svg",
    kind: "work",
    source: "https://lucide.dev/icons/shield-user",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-id-card",
    title: "Id Card",
    path: "icons/work-id-card.svg",
    kind: "work",
    source: "https://lucide.dev/icons/id-card",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-badge-check",
    title: "Badge Check",
    path: "icons/work-badge-check.svg",
    kind: "work",
    source: "https://lucide.dev/icons/badge-check",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-badge-alert",
    title: "Badge Alert",
    path: "icons/work-badge-alert.svg",
    kind: "work",
    source: "https://lucide.dev/icons/badge-alert",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-badge-help",
    title: "Badge Help",
    path: "icons/work-badge-help.svg",
    kind: "work",
    source: "https://lucide.dev/icons/badge-help",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-badge-info",
    title: "Badge Info",
    path: "icons/work-badge-info.svg",
    kind: "work",
    source: "https://lucide.dev/icons/badge-info",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-badge-x",
    title: "Badge X",
    path: "icons/work-badge-x.svg",
    kind: "work",
    source: "https://lucide.dev/icons/badge-x",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-credit-card",
    title: "Credit Card",
    path: "icons/work-credit-card.svg",
    kind: "work",
    source: "https://lucide.dev/icons/credit-card",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-banknote",
    title: "Banknote",
    path: "icons/work-banknote.svg",
    kind: "work",
    source: "https://lucide.dev/icons/banknote",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-wallet",
    title: "Wallet",
    path: "icons/work-wallet.svg",
    kind: "work",
    source: "https://lucide.dev/icons/wallet",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-receipt",
    title: "Receipt",
    path: "icons/work-receipt.svg",
    kind: "work",
    source: "https://lucide.dev/icons/receipt",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-dollar-sign",
    title: "Dollar Sign",
    path: "icons/work-dollar-sign.svg",
    kind: "work",
    source: "https://lucide.dev/icons/dollar-sign",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-coins",
    title: "Coins",
    path: "icons/work-coins.svg",
    kind: "work",
    source: "https://lucide.dev/icons/coins",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-shopping-cart",
    title: "Shopping Cart",
    path: "icons/work-shopping-cart.svg",
    kind: "work",
    source: "https://lucide.dev/icons/shopping-cart",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-shopping-bag",
    title: "Shopping Bag",
    path: "icons/work-shopping-bag.svg",
    kind: "work",
    source: "https://lucide.dev/icons/shopping-bag",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-store",
    title: "Store",
    path: "icons/work-store.svg",
    kind: "work",
    source: "https://lucide.dev/icons/store",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-landmark",
    title: "Landmark",
    path: "icons/work-landmark.svg",
    kind: "work",
    source: "https://lucide.dev/icons/landmark",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-building",
    title: "Building",
    path: "icons/work-building.svg",
    kind: "work",
    source: "https://lucide.dev/icons/building",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-building2",
    title: "Building2",
    path: "icons/work-building2.svg",
    kind: "work",
    source: "https://lucide.dev/icons/building2",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-briefcase",
    title: "Briefcase",
    path: "icons/work-briefcase.svg",
    kind: "work",
    source: "https://lucide.dev/icons/briefcase",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-briefcase-business",
    title: "Briefcase Business",
    path: "icons/work-briefcase-business.svg",
    kind: "work",
    source: "https://lucide.dev/icons/briefcase-business",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-handshake",
    title: "Handshake",
    path: "icons/work-handshake.svg",
    kind: "work",
    source: "https://lucide.dev/icons/handshake",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-scale",
    title: "Scale",
    path: "icons/work-scale.svg",
    kind: "work",
    source: "https://lucide.dev/icons/scale",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-gavel",
    title: "Gavel",
    path: "icons/work-gavel.svg",
    kind: "work",
    source: "https://lucide.dev/icons/gavel",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-book",
    title: "Book",
    path: "icons/work-book.svg",
    kind: "work",
    source: "https://lucide.dev/icons/book",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-book-open",
    title: "Book Open",
    path: "icons/work-book-open.svg",
    kind: "work",
    source: "https://lucide.dev/icons/book-open",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-notebook",
    title: "Notebook",
    path: "icons/work-notebook.svg",
    kind: "work",
    source: "https://lucide.dev/icons/notebook",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-notebook-pen",
    title: "Notebook Pen",
    path: "icons/work-notebook-pen.svg",
    kind: "work",
    source: "https://lucide.dev/icons/notebook-pen",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-sticky-note",
    title: "Sticky Note",
    path: "icons/work-sticky-note.svg",
    kind: "work",
    source: "https://lucide.dev/icons/sticky-note",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-newspaper",
    title: "Newspaper",
    path: "icons/work-newspaper.svg",
    kind: "work",
    source: "https://lucide.dev/icons/newspaper",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-scroll-text",
    title: "Scroll Text",
    path: "icons/work-scroll-text.svg",
    kind: "work",
    source: "https://lucide.dev/icons/scroll-text",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-clipboard",
    title: "Clipboard",
    path: "icons/work-clipboard.svg",
    kind: "work",
    source: "https://lucide.dev/icons/clipboard",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-clipboard-check",
    title: "Clipboard Check",
    path: "icons/work-clipboard-check.svg",
    kind: "work",
    source: "https://lucide.dev/icons/clipboard-check",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-clipboard-list",
    title: "Clipboard List",
    path: "icons/work-clipboard-list.svg",
    kind: "work",
    source: "https://lucide.dev/icons/clipboard-list",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-clipboard-pen",
    title: "Clipboard Pen",
    path: "icons/work-clipboard-pen.svg",
    kind: "work",
    source: "https://lucide.dev/icons/clipboard-pen",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-list",
    title: "List",
    path: "icons/work-list.svg",
    kind: "work",
    source: "https://lucide.dev/icons/list",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-list-checks",
    title: "List Checks",
    path: "icons/work-list-checks.svg",
    kind: "work",
    source: "https://lucide.dev/icons/list-checks",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-list-todo",
    title: "List Todo",
    path: "icons/work-list-todo.svg",
    kind: "work",
    source: "https://lucide.dev/icons/list-todo",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-list-filter",
    title: "List Filter",
    path: "icons/work-list-filter.svg",
    kind: "work",
    source: "https://lucide.dev/icons/list-filter",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-list-tree",
    title: "List Tree",
    path: "icons/work-list-tree.svg",
    kind: "work",
    source: "https://lucide.dev/icons/list-tree",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-list-ordered",
    title: "List Ordered",
    path: "icons/work-list-ordered.svg",
    kind: "work",
    source: "https://lucide.dev/icons/list-ordered",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-list-restart",
    title: "List Restart",
    path: "icons/work-list-restart.svg",
    kind: "work",
    source: "https://lucide.dev/icons/list-restart",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-check",
    title: "Check",
    path: "icons/work-check.svg",
    kind: "work",
    source: "https://lucide.dev/icons/check",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-check-check",
    title: "Check Check",
    path: "icons/work-check-check.svg",
    kind: "work",
    source: "https://lucide.dev/icons/check-check",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-x",
    title: "X",
    path: "icons/work-x.svg",
    kind: "work",
    source: "https://lucide.dev/icons/x",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-plus",
    title: "Plus",
    path: "icons/work-plus.svg",
    kind: "work",
    source: "https://lucide.dev/icons/plus",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-minus",
    title: "Minus",
    path: "icons/work-minus.svg",
    kind: "work",
    source: "https://lucide.dev/icons/minus",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-trash",
    title: "Trash",
    path: "icons/work-trash.svg",
    kind: "work",
    source: "https://lucide.dev/icons/trash",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-trash2",
    title: "Trash2",
    path: "icons/work-trash2.svg",
    kind: "work",
    source: "https://lucide.dev/icons/trash2",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-undo",
    title: "Undo",
    path: "icons/work-undo.svg",
    kind: "work",
    source: "https://lucide.dev/icons/undo",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-undo2",
    title: "Undo2",
    path: "icons/work-undo2.svg",
    kind: "work",
    source: "https://lucide.dev/icons/undo2",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-redo",
    title: "Redo",
    path: "icons/work-redo.svg",
    kind: "work",
    source: "https://lucide.dev/icons/redo",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-redo2",
    title: "Redo2",
    path: "icons/work-redo2.svg",
    kind: "work",
    source: "https://lucide.dev/icons/redo2",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-eraser",
    title: "Eraser",
    path: "icons/work-eraser.svg",
    kind: "work",
    source: "https://lucide.dev/icons/eraser",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-brush",
    title: "Brush",
    path: "icons/work-brush.svg",
    kind: "work",
    source: "https://lucide.dev/icons/brush",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-paintbrush",
    title: "Paintbrush",
    path: "icons/work-paintbrush.svg",
    kind: "work",
    source: "https://lucide.dev/icons/paintbrush",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-paint-bucket",
    title: "Paint Bucket",
    path: "icons/work-paint-bucket.svg",
    kind: "work",
    source: "https://lucide.dev/icons/paint-bucket",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-palette",
    title: "Palette",
    path: "icons/work-palette.svg",
    kind: "work",
    source: "https://lucide.dev/icons/palette",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-pipette",
    title: "Pipette",
    path: "icons/work-pipette.svg",
    kind: "work",
    source: "https://lucide.dev/icons/pipette",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-pen",
    title: "Pen",
    path: "icons/work-pen.svg",
    kind: "work",
    source: "https://lucide.dev/icons/pen",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-pencil",
    title: "Pencil",
    path: "icons/work-pencil.svg",
    kind: "work",
    source: "https://lucide.dev/icons/pencil",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-pen-tool",
    title: "Pen Tool",
    path: "icons/work-pen-tool.svg",
    kind: "work",
    source: "https://lucide.dev/icons/pen-tool",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-ruler",
    title: "Ruler",
    path: "icons/work-ruler.svg",
    kind: "work",
    source: "https://lucide.dev/icons/ruler",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-layout-dashboard",
    title: "Layout Dashboard",
    path: "icons/work-layout-dashboard.svg",
    kind: "work",
    source: "https://lucide.dev/icons/layout-dashboard",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-panels-top-left",
    title: "Panels Top Left",
    path: "icons/work-panels-top-left.svg",
    kind: "work",
    source: "https://lucide.dev/icons/panels-top-left",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-panel-left",
    title: "Panel Left",
    path: "icons/work-panel-left.svg",
    kind: "work",
    source: "https://lucide.dev/icons/panel-left",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-panel-right",
    title: "Panel Right",
    path: "icons/work-panel-right.svg",
    kind: "work",
    source: "https://lucide.dev/icons/panel-right",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-rows3",
    title: "Rows3",
    path: "icons/work-rows3.svg",
    kind: "work",
    source: "https://lucide.dev/icons/rows3",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-columns3",
    title: "Columns3",
    path: "icons/work-columns3.svg",
    kind: "work",
    source: "https://lucide.dev/icons/columns3",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-grid2-x2",
    title: "Grid2X2",
    path: "icons/work-grid2-x2.svg",
    kind: "work",
    source: "https://lucide.dev/icons/grid2-x2",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-table",
    title: "Table",
    path: "icons/work-table.svg",
    kind: "work",
    source: "https://lucide.dev/icons/table",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-table-properties",
    title: "Table Properties",
    path: "icons/work-table-properties.svg",
    kind: "work",
    source: "https://lucide.dev/icons/table-properties",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-component",
    title: "Component",
    path: "icons/work-component.svg",
    kind: "work",
    source: "https://lucide.dev/icons/component",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-shapes",
    title: "Shapes",
    path: "icons/work-shapes.svg",
    kind: "work",
    source: "https://lucide.dev/icons/shapes",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-layers",
    title: "Layers",
    path: "icons/work-layers.svg",
    kind: "work",
    source: "https://lucide.dev/icons/layers",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-layers2",
    title: "Layers2",
    path: "icons/work-layers2.svg",
    kind: "work",
    source: "https://lucide.dev/icons/layers2",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-squares-intersect",
    title: "Squares Intersect",
    path: "icons/work-squares-intersect.svg",
    kind: "work",
    source: "https://lucide.dev/icons/squares-intersect",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-combine",
    title: "Combine",
    path: "icons/work-combine.svg",
    kind: "work",
    source: "https://lucide.dev/icons/combine",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-split",
    title: "Split",
    path: "icons/work-split.svg",
    kind: "work",
    source: "https://lucide.dev/icons/split",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-ungroup",
    title: "Ungroup",
    path: "icons/work-ungroup.svg",
    kind: "work",
    source: "https://lucide.dev/icons/ungroup",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-group",
    title: "Group",
    path: "icons/work-group.svg",
    kind: "work",
    source: "https://lucide.dev/icons/group",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-focus",
    title: "Focus",
    path: "icons/work-focus.svg",
    kind: "work",
    source: "https://lucide.dev/icons/focus",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-fullscreen",
    title: "Fullscreen",
    path: "icons/work-fullscreen.svg",
    kind: "work",
    source: "https://lucide.dev/icons/fullscreen",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-expand",
    title: "Expand",
    path: "icons/work-expand.svg",
    kind: "work",
    source: "https://lucide.dev/icons/expand",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-shrink",
    title: "Shrink",
    path: "icons/work-shrink.svg",
    kind: "work",
    source: "https://lucide.dev/icons/shrink",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-crop",
    title: "Crop",
    path: "icons/work-crop.svg",
    kind: "work",
    source: "https://lucide.dev/icons/crop",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-image",
    title: "Image",
    path: "icons/work-image.svg",
    kind: "work",
    source: "https://lucide.dev/icons/image",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-image-off",
    title: "Image Off",
    path: "icons/work-image-off.svg",
    kind: "work",
    source: "https://lucide.dev/icons/image-off",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-images",
    title: "Images",
    path: "icons/work-images.svg",
    kind: "work",
    source: "https://lucide.dev/icons/images",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-gallery-horizontal-end",
    title: "Gallery Horizontal End",
    path: "icons/work-gallery-horizontal-end.svg",
    kind: "work",
    source: "https://lucide.dev/icons/gallery-horizontal-end",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-gallery-vertical-end",
    title: "Gallery Vertical End",
    path: "icons/work-gallery-vertical-end.svg",
    kind: "work",
    source: "https://lucide.dev/icons/gallery-vertical-end",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-mouse",
    title: "Mouse",
    path: "icons/work-mouse.svg",
    kind: "work",
    source: "https://lucide.dev/icons/mouse",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-mouse-pointer",
    title: "Mouse Pointer",
    path: "icons/work-mouse-pointer.svg",
    kind: "work",
    source: "https://lucide.dev/icons/mouse-pointer",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-mouse-pointer-click",
    title: "Mouse Pointer Click",
    path: "icons/work-mouse-pointer-click.svg",
    kind: "work",
    source: "https://lucide.dev/icons/mouse-pointer-click",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-mouse-pointer2",
    title: "Mouse Pointer2",
    path: "icons/work-mouse-pointer2.svg",
    kind: "work",
    source: "https://lucide.dev/icons/mouse-pointer2",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-keyboard",
    title: "Keyboard",
    path: "icons/work-keyboard.svg",
    kind: "work",
    source: "https://lucide.dev/icons/keyboard",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-command",
    title: "Command",
    path: "icons/work-command.svg",
    kind: "work",
    source: "https://lucide.dev/icons/command",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-option",
    title: "Option",
    path: "icons/work-option.svg",
    kind: "work",
    source: "https://lucide.dev/icons/option",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-corner-down-left",
    title: "Corner Down Left",
    path: "icons/work-corner-down-left.svg",
    kind: "work",
    source: "https://lucide.dev/icons/corner-down-left",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-arrow-right",
    title: "Arrow Right",
    path: "icons/work-arrow-right.svg",
    kind: "work",
    source: "https://lucide.dev/icons/arrow-right",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-arrow-up-right",
    title: "Arrow Up Right",
    path: "icons/work-arrow-up-right.svg",
    kind: "work",
    source: "https://lucide.dev/icons/arrow-up-right",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-move",
    title: "Move",
    path: "icons/work-move.svg",
    kind: "work",
    source: "https://lucide.dev/icons/move",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-move-right",
    title: "Move Right",
    path: "icons/work-move-right.svg",
    kind: "work",
    source: "https://lucide.dev/icons/move-right",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-link",
    title: "Link",
    path: "icons/work-link.svg",
    kind: "work",
    source: "https://lucide.dev/icons/link",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-link2",
    title: "Link2",
    path: "icons/work-link2.svg",
    kind: "work",
    source: "https://lucide.dev/icons/link2",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-link2-off",
    title: "Link2Off",
    path: "icons/work-link2-off.svg",
    kind: "work",
    source: "https://lucide.dev/icons/link2-off",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-external-link",
    title: "External Link",
    path: "icons/work-external-link.svg",
    kind: "work",
    source: "https://lucide.dev/icons/external-link",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-unlink",
    title: "Unlink",
    path: "icons/work-unlink.svg",
    kind: "work",
    source: "https://lucide.dev/icons/unlink",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-paperclip",
    title: "Paperclip",
    path: "icons/work-paperclip.svg",
    kind: "work",
    source: "https://lucide.dev/icons/paperclip",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-mail",
    title: "Mail",
    path: "icons/work-mail.svg",
    kind: "work",
    source: "https://lucide.dev/icons/mail",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-mail-check",
    title: "Mail Check",
    path: "icons/work-mail-check.svg",
    kind: "work",
    source: "https://lucide.dev/icons/mail-check",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-mail-warning",
    title: "Mail Warning",
    path: "icons/work-mail-warning.svg",
    kind: "work",
    source: "https://lucide.dev/icons/mail-warning",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-mail-x",
    title: "Mail X",
    path: "icons/work-mail-x.svg",
    kind: "work",
    source: "https://lucide.dev/icons/mail-x",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-inbox",
    title: "Inbox",
    path: "icons/work-inbox.svg",
    kind: "work",
    source: "https://lucide.dev/icons/inbox",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-send",
    title: "Send",
    path: "icons/work-send.svg",
    kind: "work",
    source: "https://lucide.dev/icons/send",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-message-circle",
    title: "Message Circle",
    path: "icons/work-message-circle.svg",
    kind: "work",
    source: "https://lucide.dev/icons/message-circle",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-message-square",
    title: "Message Square",
    path: "icons/work-message-square.svg",
    kind: "work",
    source: "https://lucide.dev/icons/message-square",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-messages-square",
    title: "Messages Square",
    path: "icons/work-messages-square.svg",
    kind: "work",
    source: "https://lucide.dev/icons/messages-square",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-message-circle-warning",
    title: "Message Circle Warning",
    path: "icons/work-message-circle-warning.svg",
    kind: "work",
    source: "https://lucide.dev/icons/message-circle-warning",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-message-square-warning",
    title: "Message Square Warning",
    path: "icons/work-message-square-warning.svg",
    kind: "work",
    source: "https://lucide.dev/icons/message-square-warning",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-message-square-text",
    title: "Message Square Text",
    path: "icons/work-message-square-text.svg",
    kind: "work",
    source: "https://lucide.dev/icons/message-square-text",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-message-square-code",
    title: "Message Square Code",
    path: "icons/work-message-square-code.svg",
    kind: "work",
    source: "https://lucide.dev/icons/message-square-code",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-message-square-share",
    title: "Message Square Share",
    path: "icons/work-message-square-share.svg",
    kind: "work",
    source: "https://lucide.dev/icons/message-square-share",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-loader",
    title: "Loader",
    path: "icons/work-loader.svg",
    kind: "work",
    source: "https://lucide.dev/icons/loader",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-loader-circle",
    title: "Loader Circle",
    path: "icons/work-loader-circle.svg",
    kind: "work",
    source: "https://lucide.dev/icons/loader-circle",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-asterisk",
    title: "Asterisk",
    path: "icons/work-asterisk.svg",
    kind: "work",
    source: "https://lucide.dev/icons/asterisk",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-zap",
    title: "Zap",
    path: "icons/work-zap.svg",
    kind: "work",
    source: "https://lucide.dev/icons/zap",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-zap-off",
    title: "Zap Off",
    path: "icons/work-zap-off.svg",
    kind: "work",
    source: "https://lucide.dev/icons/zap-off",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-flame",
    title: "Flame",
    path: "icons/work-flame.svg",
    kind: "work",
    source: "https://lucide.dev/icons/flame",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-flame-kindling",
    title: "Flame Kindling",
    path: "icons/work-flame-kindling.svg",
    kind: "work",
    source: "https://lucide.dev/icons/flame-kindling",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-fire-extinguisher",
    title: "Fire Extinguisher",
    path: "icons/work-fire-extinguisher.svg",
    kind: "work",
    source: "https://lucide.dev/icons/fire-extinguisher",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-lightbulb",
    title: "Lightbulb",
    path: "icons/work-lightbulb.svg",
    kind: "work",
    source: "https://lucide.dev/icons/lightbulb",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-lightbulb-off",
    title: "Lightbulb Off",
    path: "icons/work-lightbulb-off.svg",
    kind: "work",
    source: "https://lucide.dev/icons/lightbulb-off",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-sun",
    title: "Sun",
    path: "icons/work-sun.svg",
    kind: "work",
    source: "https://lucide.dev/icons/sun",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-moon",
    title: "Moon",
    path: "icons/work-moon.svg",
    kind: "work",
    source: "https://lucide.dev/icons/moon",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-sunrise",
    title: "Sunrise",
    path: "icons/work-sunrise.svg",
    kind: "work",
    source: "https://lucide.dev/icons/sunrise",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-sunset",
    title: "Sunset",
    path: "icons/work-sunset.svg",
    kind: "work",
    source: "https://lucide.dev/icons/sunset",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-star",
    title: "Star",
    path: "icons/work-star.svg",
    kind: "work",
    source: "https://lucide.dev/icons/star",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-stars",
    title: "Stars",
    path: "icons/work-stars.svg",
    kind: "work",
    source: "https://lucide.dev/icons/stars",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-sparkle",
    title: "Sparkle",
    path: "icons/work-sparkle.svg",
    kind: "work",
    source: "https://lucide.dev/icons/sparkle",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-rocket",
    title: "Rocket",
    path: "icons/work-rocket.svg",
    kind: "work",
    source: "https://lucide.dev/icons/rocket",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-rabbit",
    title: "Rabbit",
    path: "icons/work-rabbit.svg",
    kind: "work",
    source: "https://lucide.dev/icons/rabbit",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-snail",
    title: "Snail",
    path: "icons/work-snail.svg",
    kind: "work",
    source: "https://lucide.dev/icons/snail",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-turtle",
    title: "Turtle",
    path: "icons/work-turtle.svg",
    kind: "work",
    source: "https://lucide.dev/icons/turtle",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-bird",
    title: "Bird",
    path: "icons/work-bird.svg",
    kind: "work",
    source: "https://lucide.dev/icons/bird",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-fish",
    title: "Fish",
    path: "icons/work-fish.svg",
    kind: "work",
    source: "https://lucide.dev/icons/fish",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-paw-print",
    title: "Paw Print",
    path: "icons/work-paw-print.svg",
    kind: "work",
    source: "https://lucide.dev/icons/paw-print",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-cat",
    title: "Cat",
    path: "icons/work-cat.svg",
    kind: "work",
    source: "https://lucide.dev/icons/cat",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-dog",
    title: "Dog",
    path: "icons/work-dog.svg",
    kind: "work",
    source: "https://lucide.dev/icons/dog",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-rat",
    title: "Rat",
    path: "icons/work-rat.svg",
    kind: "work",
    source: "https://lucide.dev/icons/rat",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-squirrel",
    title: "Squirrel",
    path: "icons/work-squirrel.svg",
    kind: "work",
    source: "https://lucide.dev/icons/squirrel",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-test-tube",
    title: "Test Tube",
    path: "icons/work-test-tube.svg",
    kind: "work",
    source: "https://lucide.dev/icons/test-tube",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-test-tube-diagonal",
    title: "Test Tube Diagonal",
    path: "icons/work-test-tube-diagonal.svg",
    kind: "work",
    source: "https://lucide.dev/icons/test-tube-diagonal",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-test-tubes",
    title: "Test Tubes",
    path: "icons/work-test-tubes.svg",
    kind: "work",
    source: "https://lucide.dev/icons/test-tubes",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-flask-conical",
    title: "Flask Conical",
    path: "icons/work-flask-conical.svg",
    kind: "work",
    source: "https://lucide.dev/icons/flask-conical",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-flask-conical-off",
    title: "Flask Conical Off",
    path: "icons/work-flask-conical-off.svg",
    kind: "work",
    source: "https://lucide.dev/icons/flask-conical-off",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-flask-round",
    title: "Flask Round",
    path: "icons/work-flask-round.svg",
    kind: "work",
    source: "https://lucide.dev/icons/flask-round",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-microscope",
    title: "Microscope",
    path: "icons/work-microscope.svg",
    kind: "work",
    source: "https://lucide.dev/icons/microscope",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-dna",
    title: "Dna",
    path: "icons/work-dna.svg",
    kind: "work",
    source: "https://lucide.dev/icons/dna",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-atom",
    title: "Atom",
    path: "icons/work-atom.svg",
    kind: "work",
    source: "https://lucide.dev/icons/atom",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-beaker",
    title: "Beaker",
    path: "icons/work-beaker.svg",
    kind: "work",
    source: "https://lucide.dev/icons/beaker",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-magnet",
    title: "Magnet",
    path: "icons/work-magnet.svg",
    kind: "work",
    source: "https://lucide.dev/icons/magnet",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-radiation",
    title: "Radiation",
    path: "icons/work-radiation.svg",
    kind: "work",
    source: "https://lucide.dev/icons/radiation",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-biohazard",
    title: "Biohazard",
    path: "icons/work-biohazard.svg",
    kind: "work",
    source: "https://lucide.dev/icons/biohazard",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-construction",
    title: "Construction",
    path: "icons/work-construction.svg",
    kind: "work",
    source: "https://lucide.dev/icons/construction",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-wrench",
    title: "Wrench",
    path: "icons/work-wrench.svg",
    kind: "work",
    source: "https://lucide.dev/icons/wrench",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-hammer",
    title: "Hammer",
    path: "icons/work-hammer.svg",
    kind: "work",
    source: "https://lucide.dev/icons/hammer",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-pickaxe",
    title: "Pickaxe",
    path: "icons/work-pickaxe.svg",
    kind: "work",
    source: "https://lucide.dev/icons/pickaxe",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-drill",
    title: "Drill",
    path: "icons/work-drill.svg",
    kind: "work",
    source: "https://lucide.dev/icons/drill",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-cog",
    title: "Cog",
    path: "icons/work-cog.svg",
    kind: "work",
    source: "https://lucide.dev/icons/cog",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-settings",
    title: "Settings",
    path: "icons/work-settings.svg",
    kind: "work",
    source: "https://lucide.dev/icons/settings",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-settings2",
    title: "Settings2",
    path: "icons/work-settings2.svg",
    kind: "work",
    source: "https://lucide.dev/icons/settings2",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-sliders-horizontal",
    title: "Sliders Horizontal",
    path: "icons/work-sliders-horizontal.svg",
    kind: "work",
    source: "https://lucide.dev/icons/sliders-horizontal",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-sliders-vertical",
    title: "Sliders Vertical",
    path: "icons/work-sliders-vertical.svg",
    kind: "work",
    source: "https://lucide.dev/icons/sliders-vertical",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-bolt",
    title: "Bolt",
    path: "icons/work-bolt.svg",
    kind: "work",
    source: "https://lucide.dev/icons/bolt",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-nut",
    title: "Nut",
    path: "icons/work-nut.svg",
    kind: "work",
    source: "https://lucide.dev/icons/nut",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-waypoints",
    title: "Waypoints",
    path: "icons/work-waypoints.svg",
    kind: "work",
    source: "https://lucide.dev/icons/waypoints",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-blocks",
    title: "Blocks",
    path: "icons/work-blocks.svg",
    kind: "work",
    source: "https://lucide.dev/icons/blocks",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-puzzle",
    title: "Puzzle",
    path: "icons/work-puzzle.svg",
    kind: "work",
    source: "https://lucide.dev/icons/puzzle",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-file-question-mark",
    title: "File Question Mark",
    path: "icons/work-file-question-mark.svg",
    kind: "work",
    source: "https://lucide.dev/icons/file-question-mark",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-file-heart",
    title: "File Heart",
    path: "icons/work-file-heart.svg",
    kind: "work",
    source: "https://lucide.dev/icons/file-heart",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-badge-percent",
    title: "Badge Percent",
    path: "icons/work-badge-percent.svg",
    kind: "work",
    source: "https://lucide.dev/icons/badge-percent",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-percent",
    title: "Percent",
    path: "icons/work-percent.svg",
    kind: "work",
    source: "https://lucide.dev/icons/percent",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-hash",
    title: "Hash",
    path: "icons/work-hash.svg",
    kind: "work",
    source: "https://lucide.dev/icons/hash",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-tag",
    title: "Tag",
    path: "icons/work-tag.svg",
    kind: "work",
    source: "https://lucide.dev/icons/tag",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-tags",
    title: "Tags",
    path: "icons/work-tags.svg",
    kind: "work",
    source: "https://lucide.dev/icons/tags",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-bookmark",
    title: "Bookmark",
    path: "icons/work-bookmark.svg",
    kind: "work",
    source: "https://lucide.dev/icons/bookmark",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-bookmark-check",
    title: "Bookmark Check",
    path: "icons/work-bookmark-check.svg",
    kind: "work",
    source: "https://lucide.dev/icons/bookmark-check",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-pin",
    title: "Pin",
    path: "icons/work-pin.svg",
    kind: "work",
    source: "https://lucide.dev/icons/pin",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-pin-off",
    title: "Pin Off",
    path: "icons/work-pin-off.svg",
    kind: "work",
    source: "https://lucide.dev/icons/pin-off",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-list-collapse",
    title: "List Collapse",
    path: "icons/work-list-collapse.svg",
    kind: "work",
    source: "https://lucide.dev/icons/list-collapse",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-circle-dashed",
    title: "Circle Dashed",
    path: "icons/work-circle-dashed.svg",
    kind: "work",
    source: "https://lucide.dev/icons/circle-dashed",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-circle-fading-plus",
    title: "Circle Fading Plus",
    path: "icons/work-circle-fading-plus.svg",
    kind: "work",
    source: "https://lucide.dev/icons/circle-fading-plus",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-circle-slash",
    title: "Circle Slash",
    path: "icons/work-circle-slash.svg",
    kind: "work",
    source: "https://lucide.dev/icons/circle-slash",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-square-dashed",
    title: "Square Dashed",
    path: "icons/work-square-dashed.svg",
    kind: "work",
    source: "https://lucide.dev/icons/square-dashed",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-square-check",
    title: "Square Check",
    path: "icons/work-square-check.svg",
    kind: "work",
    source: "https://lucide.dev/icons/square-check",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-square-x",
    title: "Square X",
    path: "icons/work-square-x.svg",
    kind: "work",
    source: "https://lucide.dev/icons/square-x",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-square-dot",
    title: "Square Dot",
    path: "icons/work-square-dot.svg",
    kind: "work",
    source: "https://lucide.dev/icons/square-dot",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-square-equal",
    title: "Square Equal",
    path: "icons/work-square-equal.svg",
    kind: "work",
    source: "https://lucide.dev/icons/square-equal",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
  {
    id: "work-equal",
    title: "Equal",
    path: "icons/work-equal.svg",
    kind: "work",
    source: "https://lucide.dev/icons/equal",
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  },
];

// lib/icon-catalog.ts
var iconCatalog = catalog_default;
var generic = /* @__PURE__ */ new Set([
  "icons/file.svg",
  "icons/dashboard.svg",
  "icons/hierarchy.svg",
  "icons/todo.svg",
]);
var isGenericIcon = (icon) => generic.has(icon);
var aliases = {
  nextdotjs: ["nextjs", "next.js", "next-js"],
  nodedotjs: ["nodejs", "node.js"],
  postgresql: ["postgres"],
  mongodb: ["mongo"],
  googlegemini: ["gemini"],
};
var brandMatchers = catalog_default
  .filter((i) => i.kind === "brand")
  .sort((a, b) => b.title.length - a.title.length)
  .map((icon) => {
    const slug = icon.id.replace("brand-", ""),
      title = icon.title.toLowerCase();
    const patterns = [
      slug,
      title,
      title.replace(/[^a-z0-9]+/g, "-"),
      ...(aliases[slug] || []),
    ]
      .filter((term) => term.length > 2)
      .map(
        (term) =>
          new RegExp(
            `(^|[^a-z0-9])${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z0-9]|$)`,
            "i",
          ),
      );
    return { icon, patterns };
  });
function inferIcon(file, titles = []) {
  const name = file.toLowerCase().replace(/\.json$/, ""),
    text = titles.slice(0, 30).join(" ").slice(0, 1e4).toLowerCase();
  const match = (input) =>
    brandMatchers.find(({ patterns }) =>
      patterns.some((pattern) => pattern.test(input)),
    )?.icon;
  const brand = match(name);
  if (brand) return brand.path;
  const rules = [
    [/todo/, "list-todo"],
    [/migration|archive/, "archive-restore"],
    [/bulk|completed|checklist/, "list-checks"],
    [/notif|remind/, "bell-ring"],
    [/quota|security|permission|auth/, "shield-check"],
    [/database|storage|persist/, "database"],
    [/docker|container/, "container"],
    [/server|backend|api/, "server"],
    [/crash|exception/, "bug-off"],
    [/regression/, "bug-play"],
    [/observability|analytics|metric/, "chart-line"],
    [/test|verify|qa/, "flask-conical"],
    [/viewer|dashboard|interface|design/, "panels-top-left"],
    [/integration|sync/, "plug"],
    [/release|deploy/, "rocket"],
  ];
  const topic = rules.find(([rule]) => rule.test(name))?.[1];
  if (!topic) {
    const contextual = match(text);
    if (contextual) return contextual.path;
  }
  const id =
    topic ||
    (/bug\./.test(name)
      ? "bug"
      : /feature\./.test(name)
        ? "sparkles"
        : "file-text");
  return (
    catalog_default.find((i) => i.id === "work-" + id)?.path || "icons/file.svg"
  );
}

// lib/store.ts
import { promises as fs } from "node:fs";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { isDeepStrictEqual } from "node:util";

// lib/project-config.ts
var DEFAULT_CONFIGURATION = {
  statuses: [
    { name: "To do", complete: false, color: 220 },
    { name: "Doing", complete: false, color: 32 },
    { name: "Waiting", complete: false, color: 48 },
    { name: "Done", complete: true, color: 150 },
  ],
  categories: [],
  fields: [],
  fieldLabels: {},
};
var CORE_FIELDS = /* @__PURE__ */ new Set([
  "id",
  "status",
  "statusAt",
  "createdAt",
  "done",
  "doneAt",
  "task",
  "bug",
  "comments",
  "progress",
  "est",
  "difficulty",
  "category",
  "section",
  "severity",
  "rootCause",
  "howFixed",
  "evidence",
  "verification",
  "limitations",
  "retestingSummary",
  "retestingFindings",
  "referenceChecklist",
  "report",
  "reportState",
  "researchSources",
  "pullRequests",
  "statusDetail",
  "delete",
  "fields",
  "__proto__",
  "prototype",
  "constructor",
]);
function configurationErrors(input) {
  const errors = [];
  if (!input || typeof input !== "object" || Array.isArray(input))
    return ["Expected project configuration."];
  const c = input;
  if (
    Object.keys(c).some(
      (k) => !["statuses", "categories", "fields", "fieldLabels"].includes(k),
    )
  )
    errors.push("Unknown configuration key.");
  const names = (rows, kind, max) => {
    if (!Array.isArray(rows) || rows.length > max) {
      errors.push(`${kind} must be an array with at most ${max} entries.`);
      return false;
    }
    const used = /* @__PURE__ */ new Set();
    for (const row of rows) {
      if (
        !row ||
        typeof row !== "object" ||
        typeof row.name !== "string" ||
        !row.name.trim() ||
        (kind === "Status" &&
          (row.name !== row.name.trim() || row.name.length > 60)) ||
        used.has(kind === "Status" ? row.name.toLowerCase() : row.name)
      )
        errors.push(
          kind === "Status"
            ? "Status names must be unique, trimmed text (1\u201360 characters)."
            : "Category names must be unique nonempty text.",
        );
      else used.add(kind === "Status" ? row.name.toLowerCase() : row.name);
      if (!Number.isInteger(row?.color) || row.color < 0 || row.color > 360)
        errors.push(`${kind} colors must be a hue from 0\u2013360.`);
    }
    return true;
  };
  if (names(c.statuses, "Status", 24)) {
    if (
      c.statuses.some(
        (s) =>
          !s ||
          typeof s.complete !== "boolean" ||
          (typeof s.name === "string" &&
            ["active", "all"].includes(s.name.toLowerCase())),
      )
    )
      errors.push(
        "Statuses need a completion rule and cannot be named Active or All.",
      );
    if (
      !c.statuses.some((s) => s?.complete === false) ||
      !c.statuses.some((s) => s?.complete === true)
    )
      errors.push("Include at least one unfinished and one complete status.");
  }
  names(c.categories, "Category", 100);
  if (!Array.isArray(c.fields) || c.fields.length > 40)
    errors.push("Fields must be an array with at most 40 entries.");
  else {
    const keys = /* @__PURE__ */ new Set();
    for (const f of c.fields) {
      if (
        !f ||
        typeof f.key !== "string" ||
        !/^[a-zA-Z][a-zA-Z0-9_]{0,49}$/.test(f.key) ||
        CORE_FIELDS.has(f.key) ||
        keys.has(f.key)
      )
        errors.push(
          "Custom field keys must be unique identifiers and cannot replace protected core fields.",
        );
      else keys.add(f.key);
      if (
        !f ||
        typeof f.label !== "string" ||
        !f.label.trim() ||
        f.label.length > 80 ||
        !["text", "number", "boolean"].includes(f.type)
      )
        errors.push(
          "Each custom field needs a label and text, number, or boolean type.",
        );
    }
  }
  if (
    !c.fieldLabels ||
    typeof c.fieldLabels !== "object" ||
    Array.isArray(c.fieldLabels) ||
    Object.entries(c.fieldLabels).some(
      ([k, v]) =>
        !k.trim() ||
        k.length > 100 ||
        ["__proto__", "constructor", "prototype"].includes(k) ||
        typeof v !== "string" ||
        !v.trim() ||
        v.length > 80,
    )
  )
    errors.push("Field labels must be nonempty text, up to 80 characters.");
  return errors;
}
function rowConfigurationErrors(rows, file, c) {
  const errors = [];
  for (const row of rows) {
    if (
      file !== "data/todo.json" &&
      !c.statuses.some((s) => s.name === row.status)
    )
      errors.push(
        `${row.id}: status ${JSON.stringify(row.status)} is not configured for this project.`,
      );
    for (const f of c.fields) {
      if (!Object.hasOwn(row, f.key)) continue;
      const value = row[f.key];
      if (
        (f.type === "text" && typeof value !== "string") ||
        (f.type === "number" &&
          (typeof value !== "number" || !Number.isFinite(value))) ||
        (f.type === "boolean" && typeof value !== "boolean")
      )
        errors.push(`${row.id}.${f.key} must be ${f.type}.`);
    }
  }
  return errors;
}
var completeStatus = (status, c = DEFAULT_CONFIGURATION) =>
  c.statuses.some((s) => s.name === status && s.complete);

// lib/model.ts
var TODO = "data/todo.json";

// lib/store.ts
var execute = promisify(execFile);
var require2 = createRequire(import.meta.url);
var validator = require2("../tracker-validator.js");
var StoreError = class extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
};
var digest = (text) => createHash("sha256").update(text).digest("hex");
function createStore(root, repositoryRoot = root) {
  let busy = false;
  async function locked(work) {
    if (busy)
      throw new StoreError(
        409,
        "Another operation is running; try again shortly.",
      );
    busy = true;
    const lock = path.join(repositoryRoot, ".petal-write-lock");
    let acquired = false;
    try {
      try {
        await fs.mkdir(lock);
        acquired = true;
        await fs.writeFile(
          path.join(lock, "owner.json"),
          JSON.stringify({
            pid: process.pid,
            at: /* @__PURE__ */ new Date().toISOString(),
          }),
        );
      } catch (error) {
        if (error.code === "EEXIST")
          throw new StoreError(
            409,
            `Another Petal writer holds ${lock}. If its process is no longer running, remove the stale lock and retry.`,
          );
        throw error;
      }
      await recoverConfiguration();
      return await work();
    } finally {
      if (acquired) await fs.rm(lock, { recursive: true, force: true });
      busy = false;
    }
  }
  async function json(file) {
    return JSON.parse(await fs.readFile(path.join(root, file), "utf8"));
  }
  async function validate(rows, file, configuration) {
    const schema = JSON.parse(
      await fs.readFile(
        path.join(
          process.env.PETAL_APP_ROOT || process.cwd(),
          "tracker.schema.json",
        ),
        "utf8",
      ),
    );
    if (digest(JSON.stringify(schema)) !== validator.schemaHash)
      throw new StoreError(
        503,
        "Tracker validator is stale. Run npm run build:validator before saving.",
      );
    const result = validator.checkRows(rows, file);
    if (!result.valid)
      throw new StoreError(422, `Invalid tracker ${file}`, result.errors);
    const errors = rowConfigurationErrors(
      rows,
      file,
      configuration || (await projectConfiguration()).configuration,
    );
    if (errors.length)
      throw new StoreError(422, `Invalid project fields in ${file}`, errors);
  }
  async function resolveFile(file) {
    if (
      typeof file !== "string" ||
      !/^data\/.+\.json$/.test(file) ||
      file.split("/").some((p) => p === ".." || p === ".") ||
      file.includes("\\")
    )
      throw new StoreError(400, "Expected a JSON file inside data/.");
    let resolved;
    try {
      resolved = await fs.realpath(path.join(root, file));
    } catch (error) {
      if (error.code === "ENOENT")
        throw new StoreError(404, `${file} no longer exists.`);
      throw error;
    }
    const dataRoot = await fs.realpath(path.join(root, "data"));
    if (!resolved.startsWith(dataRoot + path.sep))
      throw new StoreError(400, "File must stay inside data/.");
    if (!(await fs.stat(resolved)).isFile())
      throw new StoreError(400, "Expected a file.");
    return resolved;
  }
  async function atomic(file, value) {
    const temp = `${file}.${randomUUID()}.tmp`;
    try {
      await fs.writeFile(temp, JSON.stringify(value, null, 2) + "\n", {
        flag: "wx",
      });
      await fs.rename(temp, file);
    } finally {
      await fs.rm(temp, { force: true });
    }
  }
  const configPath = path.join(root, "project-settings.json"),
    transactionPath = path.join(root, ".petal-config-transaction.json");
  async function optionalText(file) {
    try {
      return await fs.readFile(file, "utf8");
    } catch (error) {
      if (error.code === "ENOENT") return null;
      throw error;
    }
  }
  async function atomicText(file, text) {
    const temp = file + "." + randomUUID() + ".tmp";
    try {
      await fs.writeFile(temp, text, { flag: "wx" });
      await fs.rename(temp, file);
    } finally {
      await fs.rm(temp, { force: true });
    }
  }
  async function projectConfiguration() {
    await ensureConfigurationRecovered();
    const text = await optionalText(configPath),
      configuration =
        text === null
          ? structuredClone(DEFAULT_CONFIGURATION)
          : JSON.parse(text);
    const errors = configurationErrors(configuration);
    if (errors.length)
      throw new StoreError(422, "Invalid project-settings.json", errors);
    return {
      configuration,
      revision: digest(text ?? JSON.stringify(DEFAULT_CONFIGURATION)),
    };
  }
  async function recoverConfiguration() {
    const text = await optionalText(transactionPath);
    if (!text) return;
    const transaction = JSON.parse(text);
    if (transaction.state !== "committed") {
      if (
        !Array.isArray(transaction.files) ||
        transaction.files.some(
          (f) =>
            typeof f.file !== "string" ||
            !/^data\/.+\.json$/.test(f.file) ||
            f.file.split("/").includes("..") ||
            typeof f.before !== "string",
        )
      )
        throw new StoreError(
          503,
          "Invalid configuration recovery journal; inspect it before retrying.",
        );
      const currentConfiguration = await optionalText(configPath);
      if (
        currentConfiguration !== transaction.beforeConfiguration &&
        currentConfiguration !== transaction.afterConfiguration
      )
        throw new StoreError(
          503,
          "Project configuration was edited outside an unfinished migration; inspect the recovery journal before proceeding.",
        );
      for (const f of transaction.files) {
        const current = await fs.readFile(await resolveFile(f.file), "utf8");
        if (current !== f.before && current !== f.after)
          throw new StoreError(
            503,
            `${f.file} was edited outside an unfinished migration; recovery will not overwrite it.`,
          );
      }
      for (const f of transaction.files)
        await atomicText(await resolveFile(f.file), f.before);
      if (transaction.beforeConfiguration === null)
        await fs.rm(configPath, { force: true });
      else await atomicText(configPath, transaction.beforeConfiguration);
    }
    await fs.rm(transactionPath, { force: true });
  }
  async function ensureConfigurationRecovered() {
    if (await optionalText(transactionPath)) {
      if (busy)
        throw new StoreError(
          409,
          "Project settings migration is running; retry shortly.",
        );
      await locked(async () => {});
    }
  }
  async function configurationPlan(input, revision, mapping = {}) {
    await ensureConfigurationRecovered();
    const current = await projectConfiguration();
    if (current.revision !== revision)
      throw new StoreError(
        409,
        "Project settings changed. Reload Settings before retrying.",
      );
    const errors = configurationErrors(input);
    if (errors.length)
      throw new StoreError(422, "Invalid project configuration", errors);
    if (
      !mapping ||
      typeof mapping !== "object" ||
      Array.isArray(mapping) ||
      Object.entries(mapping).some(
        ([k, v]) =>
          ["__proto__", "constructor", "prototype"].includes(k) ||
          typeof v !== "string",
      )
    )
      throw new StoreError(400, "Expected explicit status mappings.");
    const configuration = input,
      files = [],
      revisions = {};
    for (const file of await list()) {
      const before = await fs.readFile(await resolveFile(file), "utf8"),
        rows = JSON.parse(before);
      await validate(rows, file, current.configuration);
      revisions[file] = digest(before);
      let changed = 0;
      for (const row of rows) {
        if (file !== TODO) {
          const oldStatus = row.status;
          const name = Object.hasOwn(mapping, row.status)
            ? mapping[row.status]
            : row.status;
          if (!configuration.statuses.some((s) => s.name === name))
            throw new StoreError(
              422,
              `${file}: map status ${JSON.stringify(row.status)} to a configured status before applying.`,
            );
          if (name !== row.status) {
            row.status = name;
            changed++;
          }
          const wasComplete = completeStatus(oldStatus, current.configuration);
          if (completeStatus(name, configuration)) {
            if (row.progress !== 100) {
              row.progress = 100;
              changed++;
            }
          } else if (row.progress === 100 && wasComplete) {
            delete row.progress;
            changed++;
          }
        }
      }
      await validate(rows, file, configuration);
      const after = JSON.stringify(rows, null, 2) + "\n";
      if (changed) files.push({ file, before, after, rows: changed });
    }
    const token = digest(
      JSON.stringify({ configuration, mapping, revision, revisions }),
    );
    return { configuration, files, token };
  }
  async function previewConfiguration(input, revision, mapping) {
    const plan = await configurationPlan(input, revision, mapping);
    return {
      token: plan.token,
      files: plan.files.map((f) => ({ file: f.file, changes: f.rows })),
      totalChanges: plan.files.reduce((n, f) => n + f.rows, 0),
    };
  }
  async function saveConfiguration(input, revision, mapping, token) {
    return locked(async () => {
      const plan = await configurationPlan(input, revision, mapping);
      if (typeof token !== "string" || token !== plan.token)
        throw new StoreError(
          409,
          "Preview is stale. Preview the current files again before applying.",
        );
      const beforeConfiguration = await optionalText(configPath),
        id = randomUUID(),
        journal = {
          state: "pending",
          id,
          beforeConfiguration,
          afterConfiguration:
            JSON.stringify(plan.configuration, null, 2) + "\n",
          files: plan.files,
        };
      await atomic(transactionPath, journal);
      try {
        for (const f of plan.files)
          await atomicText(await resolveFile(f.file), f.after);
        await atomic(configPath, plan.configuration);
        await fs.mkdir(path.join(root, "migrations"), { recursive: true });
        await atomic(
          path.join(root, "migrations", `project-settings-${id}.json`),
          {
            at: /* @__PURE__ */ new Date().toISOString(),
            before:
              beforeConfiguration === null
                ? DEFAULT_CONFIGURATION
                : JSON.parse(beforeConfiguration),
            after: plan.configuration,
            files: plan.files,
          },
        );
        await atomic(transactionPath, { ...journal, state: "committed" });
      } catch (error) {
        try {
          await recoverConfiguration();
        } catch (recovery) {
          throw new StoreError(
            503,
            "Settings migration failed and rollback needs recovery. Do not edit tracker files until the next successful writer recovers the journal.",
            { cause: String(error), recovery: String(recovery) },
          );
        }
        throw error;
      }
      await fs.rm(transactionPath, { force: true });
      return {
        ok: true,
        ...(await projectConfiguration()),
        migratedFiles: plan.files.length,
      };
    });
  }
  async function list(dir = "data") {
    const entries = await fs.readdir(
      /* turbopackIgnore: true */
      path.join(
        /* turbopackIgnore: true */
        root,
        dir,
      ),
      { withFileTypes: true },
    );
    const arrays = await Promise.all(
      entries.map(async (e) =>
        e.isDirectory()
          ? list(`${dir}/${e.name}`)
          : e.isFile() && e.name.endsWith(".json")
            ? [`${dir}/${e.name}`]
            : [],
      ),
    );
    return arrays.flat().sort();
  }
  async function workspace() {
    await ensureConfigurationRecovered();
    const { configuration, revision: configRevision } =
      await projectConfiguration();
    const warnings = [];
    let icons = {};
    let estimates = [];
    try {
      icons = await json("file-icons.json");
      if (!icons || typeof icons !== "object" || Array.isArray(icons))
        throw new Error("Expected an icon map");
    } catch (error) {
      warnings.push(`file-icons.json: ${String(error)}`);
      icons = {};
    }
    try {
      const value = await json("opened-date-estimates.json");
      const rows = Array.isArray(value) ? value : value.rows;
      if (!Array.isArray(rows)) throw new Error("Expected estimates rows");
      estimates = rows;
    } catch (error) {
      if (error.code !== "ENOENT")
        warnings.push(`opened-date-estimates.json: ${String(error)}`);
    }
    const files = await Promise.all(
      (await list()).map(async (file) => {
        let icon =
          typeof icons[file]?.icon === "string"
            ? icons[file].icon
            : "icons/file.svg";
        if (
          !/^icons\/[a-z0-9._-]+\.(svg|png|webp)$/i.test(icon) &&
          !/^https:\/\//.test(icon)
        )
          icon = "icons/file.svg";
        try {
          const text = await fs.readFile(await resolveFile(file), "utf8");
          const rows = JSON.parse(text);
          await validate(rows, file, configuration);
          if (isGenericIcon(icon))
            icon = inferIcon(
              file,
              rows.map((r) => String(r.task || r.bug || "")),
            );
          return { path: file, rows, revision: digest(text), icon };
        } catch (error) {
          return {
            path: file,
            rows: [],
            revision: "",
            icon,
            error:
              error instanceof StoreError
                ? `${error.message}: ${JSON.stringify(error.details || "")}`
                : String(error),
          };
        }
      }),
    );
    if (
      (await optionalText(transactionPath)) ||
      (await projectConfiguration()).revision !== configRevision
    )
      throw new StoreError(
        409,
        "Project configuration changed during refresh. Retry shortly.",
      );
    return { files, estimates, warnings, configuration };
  }
  async function save(file, revision, edits) {
    return locked(async () => {
      if (!Array.isArray(edits) || !edits.length)
        throw new StoreError(400, "No edits supplied.");
      const resolved = await resolveFile(file);
      const text = await fs.readFile(resolved, "utf8");
      if (typeof revision !== "string" || digest(text) !== revision)
        throw new StoreError(
          409,
          `${file} changed since you started editing. Your draft is kept. Reload the latest file and review it before retrying.`,
        );
      const rows = JSON.parse(text);
      await validate(rows, file);
      const { configuration } = await projectConfiguration();
      const ids = /* @__PURE__ */ new Set();
      for (const edit of edits) {
        if (
          !edit ||
          typeof edit.id !== "string" ||
          ids.has(edit.id) ||
          Object.keys(edit).some(
            (k) =>
              ![
                "id",
                "comments",
                "status",
                "done",
                "delete",
                "fields",
                "category",
              ].includes(k),
          )
        )
          throw new StoreError(400, "Invalid or duplicate edit.");
        ids.add(edit.id);
        const row = rows.find((r) => r.id === edit.id);
        if (!row) throw new StoreError(409, `Row ${edit.id} no longer exists.`);
        if ("delete" in edit && typeof edit.delete !== "boolean")
          throw new StoreError(400, "Invalid deletion value.");
        if ("comments" in edit) {
          if (typeof edit.comments !== "string")
            throw new StoreError(400, "Comment must be text.");
          row.comments = edit.comments;
        }
        if ("category" in edit) {
          if (
            file !== TODO ||
            typeof edit.category !== "string" ||
            !edit.category.trim()
          )
            throw new StoreError(
              400,
              "A to-do category must be nonempty text.",
            );
          row.category = edit.category;
        }
        if ("status" in edit) {
          if (
            file === TODO ||
            !configuration.statuses.some((s) => s.name === edit.status)
          )
            throw new StoreError(400, "Invalid progress status.");
          if (row.status !== edit.status) {
            row.status = edit.status;
            row.statusAt = /* @__PURE__ */ new Date().toISOString();
            if (completeStatus(row.status, configuration)) row.progress = 100;
            else if (row.progress === 100) delete row.progress;
          }
        }
        if ("fields" in edit) {
          if (
            !edit.fields ||
            typeof edit.fields !== "object" ||
            Array.isArray(edit.fields) ||
            Object.keys(edit.fields).some(
              (k) => !configuration.fields.some((f) => f.key === k),
            )
          )
            throw new StoreError(
              400,
              "Only configured custom fields can be edited here.",
            );
          for (const [key, value] of Object.entries(edit.fields)) {
            if (value === null) delete row[key];
            else row[key] = value;
          }
        }
        if ("done" in edit) {
          if (file !== TODO || typeof edit.done !== "boolean")
            throw new StoreError(400, "Invalid to-do completion.");
          if (row.done !== edit.done) {
            row.done = edit.done;
            row.doneAt = edit.done
              ? /* @__PURE__ */ new Date().toISOString()
              : null;
            if (edit.done) row.progress = 100;
            else if (row.progress === 100) delete row.progress;
          }
        }
      }
      const deleteIds = new Set(edits.filter((e) => e.delete).map((e) => e.id));
      const next = rows.filter((r) => !deleteIds.has(r.id));
      await validate(next, file);
      await atomic(resolved, next);
      return {
        ok: true,
        file,
        rows: next.length,
        revision: digest(await fs.readFile(resolved, "utf8")),
      };
    });
  }
  async function saveRows(file, rows, baseRows) {
    return locked(async () => {
      const resolved = await resolveFile(file);
      const previous = JSON.parse(await fs.readFile(resolved, "utf8"));
      if (!Array.isArray(baseRows) || !isDeepStrictEqual(previous, baseRows))
        throw new StoreError(
          409,
          "The file changed or no baseRows were provided; reload before saving.",
        );
      await validate(rows, file);
      for (const row of rows) {
        const old = previous.find((r) => r.id === row.id);
        if (!old && row.createdAt === null)
          throw new StoreError(422, `New row ${row.id} requires createdAt.`);
        if (old && row.createdAt !== old.createdAt)
          throw new StoreError(422, `createdAt for ${row.id} is immutable.`);
        if (old && row.status !== old.status && row.statusAt === old.statusAt)
          throw new StoreError(
            422,
            `Changing status for ${row.id} requires a new statusAt.`,
          );
      }
      await atomic(resolved, rows);
      return { ok: true, file, rows: rows.length };
    });
  }
  async function git(...args) {
    try {
      return (
        await execute("git", args, {
          cwd: root,
          timeout: 18e4,
          maxBuffer: 4 * 1024 * 1024,
          env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
        })
      ).stdout.trim();
    } catch (error) {
      const e = error;
      throw new StoreError(
        500,
        `git ${args[0]} failed: ${e.stderr || e.message}`,
      );
    }
  }
  async function checkpoint() {
    return locked(async () => {
      const branch = await git("branch", "--show-current");
      if (!branch)
        throw new StoreError(409, "Cannot checkpoint a detached HEAD.");
      const repo = await fs.realpath(
        /* turbopackIgnore: true */
        await git("rev-parse", "--show-toplevel"),
      );
      const canonical = await fs.realpath(
        /* turbopackIgnore: true */
        repositoryRoot,
      );
      const relative = path.relative(repo, canonical) || ".";
      const scope =
        relative === "." ? ":(top,glob)**" : `:(top,glob)${relative}/**`;
      const exclude = ":(top,exclude,glob)**/.petal-write-lock/**";
      const data = await workspace();
      if (data.files.some((f) => f.error) || data.warnings.length)
        throw new StoreError(
          422,
          "Fix tracker or metadata errors before checkpointing.",
        );
      if (repositoryRoot !== root) {
        for (const entry of await fs.readdir(
          path.join(repositoryRoot, "projects"),
          { withFileTypes: true },
        )) {
          if (!entry.isDirectory()) continue;
          const checked = await createStore(
            path.join(repositoryRoot, "projects", entry.name),
          ).workspace();
          if (checked.files.some((f) => f.error) || checked.warnings.length)
            throw new StoreError(
              422,
              `Fix tracker errors in project ${entry.name} before checkpointing.`,
            );
        }
      }
      await git("add", "-A", "--", scope, exclude);
      const files = (
        await git("diff", "--cached", "--name-only", "--", scope, exclude)
      )
        .split("\n")
        .filter(Boolean);
      let commit = null;
      if (files.length) {
        await git(
          "commit",
          "--only",
          "-m",
          `chore(petal): checkpoint ${files.length} files`,
          "--",
          scope,
          exclude,
        );
        commit = await git("rev-parse", "--short", "HEAD");
      }
      const hasOrigin = (await git("remote")).split("\n").includes("origin");
      try {
        if (hasOrigin) await git("push", "origin", `HEAD:${branch}`);
      } catch (error) {
        throw new StoreError(
          500,
          `${error.message}${commit ? " \u2014 commit exists locally but was not published." : ""}`,
          { commit, committed: !!commit, files },
        );
      }
      return {
        ok: true,
        committed: !!commit,
        commit,
        files,
        pushed: hasOrigin,
        branch,
      };
    });
  }
  async function assignIcon(file, id) {
    return locked(async () => {
      await resolveFile(file);
      const entry =
        iconCatalog.find((i) => i.id === id || i.path === id) ||
        iconCatalog.find((i) => i.id === `brand-${id}`) ||
        iconCatalog.find((i) => i.id === `work-${id}`);
      if (!entry)
        throw new StoreError(
          400,
          "Unknown icon. Run petal icons list to choose a catalog ID.",
        );
      const current = await json("file-icons.json");
      if (!current || typeof current !== "object" || Array.isArray(current))
        throw new StoreError(422, "file-icons.json must be an icon map.");
      current[file] = { ...current[file], icon: entry.path };
      await atomic(path.join(root, "file-icons.json"), current);
      return { file, icon: entry.path };
    });
  }
  async function autoIcons() {
    return locked(async () => {
      const ws = await workspace();
      if (ws.files.some((f) => f.error) || ws.warnings.length)
        throw new StoreError(
          422,
          "Fix tracker and metadata errors before assigning icons.",
        );
      const current = await json("file-icons.json");
      const updates = ws.files.map((f) => ({
        file: f.path,
        icon: inferIcon(
          f.path,
          f.rows.map((r) => String(r.task || r.bug || "")),
        ),
      }));
      for (const update of updates)
        current[update.file] = { ...current[update.file], icon: update.icon };
      await atomic(path.join(root, "file-icons.json"), current);
      return { updates };
    });
  }
  async function deleteFile(file, revision) {
    return locked(async () => {
      if (path.basename(file).toLowerCase() === "todo.json")
        throw new StoreError(403, "The to-do file cannot be deleted.");
      const resolved = await resolveFile(file);
      const text = await fs.readFile(resolved, "utf8");
      if (digest(text) !== revision)
        throw new StoreError(
          409,
          "File changed; reload and review before deleting.",
        );
      const catalog = await json("file-icons.json");
      delete catalog[file];
      const oldCatalog = await fs.readFile(
        path.join(root, "file-icons.json"),
        "utf8",
      );
      await atomic(path.join(root, "file-icons.json"), catalog);
      try {
        await fs.unlink(resolved);
      } catch (error) {
        await fs.writeFile(path.join(root, "file-icons.json"), oldCatalog);
        throw error;
      }
      return { ok: true, file, published: false };
    });
  }
  async function addTask(file, title, category = "General") {
    return locked(async () => {
      if (!title.trim()) throw new StoreError(400, "A title is required.");
      const resolved = await resolveFile(file);
      const rows = JSON.parse(await fs.readFile(resolved, "utf8"));
      const { configuration } = await projectConfiguration();
      const now = /* @__PURE__ */ new Date().toISOString();
      const row = {
        id: `${file === TODO ? "T" : "W"}-${randomUUID().slice(0, 8)}`,
        createdAt: now,
        progress: 0,
        ...(file === TODO
          ? { task: title, category, done: false, doneAt: null }
          : {
              status: configuration.statuses.find((s) => !s.complete).name,
              statusAt: now,
              ...(/(?:^|\/)bug\./.test(file)
                ? { bug: title }
                : { task: title }),
            }),
      };
      rows.push(row);
      await validate(rows, file);
      await atomic(resolved, rows);
      return { ok: true, row };
    });
  }
  async function updateTask(file, id, patch, revision) {
    return locked(async () => {
      const resolved = await resolveFile(file);
      const text = await fs.readFile(resolved, "utf8");
      if (digest(text) !== revision)
        throw new StoreError(
          409,
          "File changed. Read it again before updating.",
        );
      if (
        !patch ||
        typeof patch !== "object" ||
        Array.isArray(patch) ||
        [
          "id",
          "createdAt",
          "statusAt",
          "doneAt",
          "__proto__",
          "constructor",
        ].some((k) => k in patch && Object.hasOwn(patch, k))
      )
        throw new StoreError(
          400,
          "Patch cannot replace IDs or lifecycle timestamps.",
        );
      const rows = JSON.parse(text);
      const row = rows.find((r) => r.id === id);
      if (!row) throw new StoreError(404, `Unknown item ${id}`);
      const status = row.status,
        done = row.done;
      Object.assign(row, patch);
      if (row.status !== status)
        row.statusAt = /* @__PURE__ */ new Date().toISOString();
      if (row.done !== done)
        row.doneAt = row.done ? /* @__PURE__ */ new Date().toISOString() : null;
      const { configuration } = await projectConfiguration();
      for (const f of configuration.fields)
        if (Object.hasOwn(patch, f.key) && patch[f.key] === null)
          delete row[f.key];
      if (completeStatus(row.status, configuration) || row.done)
        row.progress = 100;
      else if (
        row.progress === 100 &&
        (row.status !== status || row.done !== done)
      )
        delete row.progress;
      await validate(rows, file);
      await atomic(resolved, rows);
      return { ok: true, row };
    });
  }
  return {
    projectConfiguration,
    previewConfiguration,
    saveConfiguration,
    assignIcon,
    autoIcons,
    withLock: locked,
    workspace,
    save,
    saveRows,
    deleteFile,
    checkpoint,
    list,
    resolveFile,
    addTask,
    updateTask,
  };
}

// lib/vault.ts
var execute2 = promisify2(execFile2);
var configDir =
  process.env.PETAL_HOME || path2.join(os.homedir(), ".config", "petal");
var vaultDir = path2.join(configDir, "data");
async function atomicJSON(file, value) {
  const temp = file + "." + randomUUID2() + ".tmp";
  try {
    await fs2.writeFile(temp, JSON.stringify(value, null, 2) + "\n", {
      flag: "wx",
      mode: 384,
    });
    await fs2.rename(temp, file);
  } finally {
    await fs2.rm(temp, { force: true });
  }
}
async function gitVault(...args) {
  try {
    return (
      await execute2("git", args, {
        cwd: vaultDir,
        timeout: 3e4,
        env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
      })
    ).stdout.trim();
  } catch (error) {
    const e = error;
    throw new StoreError(
      500,
      `Data repository: git ${args[0]} failed: ${e.stderr || e.message}`,
    );
  }
}
async function vaultLock(work) {
  await fs2.mkdir(configDir, { recursive: true });
  const lock = path2.join(configDir, "registry.lock");
  try {
    await fs2.mkdir(lock);
  } catch (error) {
    if (error.code === "EEXIST")
      throw new StoreError(
        409,
        "Another storage operation is running. Retry shortly.",
      );
    throw error;
  }
  try {
    return await work();
  } finally {
    await fs2.rm(lock, { recursive: true, force: true });
  }
}
async function ensureVault() {
  await fs2.mkdir(path2.join(vaultDir, "projects"), {
    recursive: true,
    mode: 448,
  });
  try {
    await fs2.access(path2.join(vaultDir, ".git"));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    await gitVault("init", "-b", "main");
    await gitVault("config", "user.name", "Petal");
    await gitVault("config", "user.email", "petal@localhost");
  }
  await fs2.writeFile(
    path2.join(vaultDir, ".gitignore"),
    ".petal-write-lock/\n**/.petal-write-lock/\n*.tmp\n**/*.tmp\n**/.petal-config-transaction.json\n",
  );
}
async function readProjects() {
  try {
    const list = JSON.parse(
      await fs2.readFile(path2.join(configDir, "projects.json"), "utf8"),
    );
    if (
      !Array.isArray(list) ||
      list.some(
        (p) =>
          !p ||
          !/^[a-zA-Z0-9_-]+$/.test(p.id) ||
          typeof p.name !== "string" ||
          !path2.isAbsolute(p.root) ||
          !path2.isAbsolute(p.dataDir),
      )
    )
      throw new StoreError(500, "Invalid project registry.");
    return list;
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}
async function snapshot(source) {
  const files = /* @__PURE__ */ new Map();
  async function walk(relative) {
    for (const entry of await fs2.readdir(path2.join(source, relative), {
      withFileTypes: true,
    })) {
      if (
        [".git", "node_modules", ".next", ".petal-write-lock"].includes(
          entry.name,
        )
      )
        continue;
      const name = path2.join(relative, entry.name);
      if (entry.isDirectory()) await walk(name);
      else if (entry.name.endsWith(".json")) {
        if (!entry.isFile())
          throw new StoreError(
            409,
            `Cannot import symlink or special JSON file: ${name}`,
          );
        files.set(name, await fs2.readFile(path2.join(source, name)));
      }
    }
  }
  await walk("");
  return files;
}
async function importProject(project) {
  const target = path2.join(vaultDir, "projects", project.id);
  try {
    if ((await fs2.realpath(project.dataDir)) === (await fs2.realpath(target)))
      return { ...project, dataDir: target };
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  const before = await snapshot(project.dataDir);
  if (!before.has(path2.join("data", "todo.json")))
    throw new StoreError(422, `${project.name}: data/todo.json is missing.`);
  const temp = target + "." + randomUUID2() + ".tmp";
  await fs2.mkdir(temp, { recursive: true });
  try {
    for (const [name, bytes] of before) {
      await fs2.mkdir(path2.dirname(path2.join(temp, name)), {
        recursive: true,
      });
      await fs2.writeFile(path2.join(temp, name), bytes);
    }
    const after = await snapshot(project.dataDir),
      copied = await snapshot(temp);
    if (
      before.size !== after.size ||
      before.size !== copied.size ||
      [...before].some(
        ([name, bytes]) =>
          !after.get(name)?.equals(bytes) || !copied.get(name)?.equals(bytes),
      )
    )
      throw new StoreError(
        409,
        `${project.name}: source changed during import. Registry was not changed.`,
      );
    try {
      const existing = await snapshot(target);
      if (
        existing.size === before.size &&
        [...before].every(([name, bytes]) => existing.get(name)?.equals(bytes))
      )
        return { ...project, dataDir: target };
      throw new StoreError(
        409,
        `Import target already exists with different content: ${target}. Review it before retrying.`,
      );
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
    await fs2.rename(temp, target);
    return { ...project, dataDir: target };
  } finally {
    await fs2.rm(temp, { recursive: true, force: true });
  }
}
async function projects() {
  const list = await readProjects();
  if (!list.some((p) => p.dataDir !== path2.join(vaultDir, "projects", p.id)))
    return list;
  return vaultLock(async () => {
    await ensureVault();
    const current = await readProjects(),
      next = [];
    await fs2.copyFile(
      path2.join(configDir, "projects.json"),
      path2.join(configDir, `projects.backup.${Date.now()}.json`),
    );
    for (const p of current) next.push(await importProject(p));
    await atomicJSON(path2.join(configDir, "projects.json"), next);
    return next;
  });
}
async function storageSettings() {
  await ensureVault();
  const remotes = (await gitVault("remote")).split("\n");
  const origin = remotes.includes("origin")
    ? await gitVault("remote", "get-url", "origin")
    : "";
  return { directory: vaultDir, origin };
}
async function setStorageOrigin(value) {
  if (typeof value !== "string")
    throw new StoreError(400, "Origin must be text.");
  const origin = value.trim();
  if (
    origin &&
    (!/^(https:\/\/[^\s]+|ssh:\/\/[^\s]+|git@[^\s:]+:[^\s]+)$/.test(origin) ||
      /[\r\n\x00]/.test(origin))
  )
    throw new StoreError(
      400,
      "Use an HTTPS or SSH Git repository URL, or leave blank for local only.",
    );
  if (origin.startsWith("https://") && new URL(origin).password)
    throw new StoreError(
      400,
      "Use your Git credential manager instead of a password in the URL.",
    );
  return vaultLock(async () => {
    await ensureVault();
    return createStore(vaultDir).withLock(async () => {
      const previous = await storageSettings();
      if (origin)
        await gitVault(
          "remote",
          previous.origin ? "set-url" : "add",
          "origin",
          origin,
        );
      else if (previous.origin) await gitVault("remote", "remove", "origin");
      return storageSettings();
    });
  });
}
export {
  atomicJSON,
  configDir,
  ensureVault,
  gitVault,
  importProject,
  projects,
  readProjects,
  setStorageOrigin,
  storageSettings,
  vaultDir,
  vaultLock,
};
