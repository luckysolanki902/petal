import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import * as brands from "simple-icons";
import * as lucide from "lucide-react";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { optimize } from "svgo";
const root = fileURLToPath(new URL("../", import.meta.url));
const brandSlugs =
  `posthog googlecalendar github gitlab bitbucket docker nextdotjs react reactrouter reactquery angular vuedotjs nuxt svelte astro solid remix qwik preact jquery bootstrap tailwindcss bulma chakraui radixui shadcnui mui antidesign daisyui styledcomponents sass less css html5 javascript typescript nodedotjs nodejs deno bun npm pnpm yarn vite webpack rollup esbuild babel swc turborepo vitest jest mocha cypress playwright testinglibrary storybook chromatic selenium puppeteer python django flask fastapi pydantic uv poetry anaconda jupyter pandas numpy scipy pytorch tensorflow keras scikitlearn huggingface ollama langchain openai anthropic claude googlegemini grok mistralai perplexity deepseek cohere replicate togetherai modal lightning ai datasette rust go ruby rubyonrails php laravel symfony composer java kotlin spring springboot quarkus scala clojure elixir phoenix erlang haskell ocaml dart flutter swift apple android jetpackcompose expo reactnative unity unrealengine godotengine electron tauri capacitor ionic dotnet cplusplus c sharp zig lua perl r julia matlab mongodb postgresql mysql mariadb sqlite redis valkey firebase supabase appwrite convex neon planetscale cockroachlabs clickhouse snowflake databricks elasticsearch opensearch meilisearch algolia typesense milvus qdrant pinecone weaviate chromadb influxdb prometheus grafana loki opentelemetry sentry datadog newrelic logrocket mixpanel amplitude plausibleanalytics umami segment heap fullstory honeycomb betterstack axiom highlight zapier n8n make temporal apacheairflow prefect dagster triggerdotdev inngest bullmq rabbitmq apachekafka apachepulsar nats mqtt apacheflink apachespark dbt airbyte fivetran vercel netlify cloudflare flydotio railway render heroku digitalocean hetzner ovhcloud scaleway vultr linode amazonwebservices aws googlecloud microsoftazure oraclecloud ibmcloud alibabacloud tencentcloud kubernetes helm terraform opentofu pulumi ansible puppet chef vagrant packer nomad consul vault nginx apache caddy traefik envoy istio linkerd twingate tailscale wireguard openvpn authentik authelia keycloak auth0 clerk okta oauth jsonwebtokens letsencrypt certbot stripe paypal lemonsqueezy paddle razorpay adyen braintree square wise revolut shopify woocommerce bigcommerce medusa saleor sanity contentful strapi directus payload ghost wordpress drupal webflow framer wix squarespace notion obsidian logseq evernote onenote dropbox googledrive icloud box protondrive slack discord telegram whatsapp signal matrix mattermost rocketchat zulip zoom googlemeet webex jitsi linear jira trello asana clickup todoist ticktick basecamp height youtrack redmine plane shortcut figma sketch penpot canva adobephotoshop adobeillustrator affinitydesigner excalidraw miro tldraw inkscape blender gimp krita inkscape affinityphoto githubactions circleci travisci jenkins buildkite teamcity drone argo fluxcd harness semaphore codeship codecov coveralls codacy sonarqube coderabbit semgrep snyk socket dependabot renovate trivy checkmarx veracode checkly browserstack lambdatest saucelabs applitools reqbin postman insomnia bruno hoppscotch swagger openapi graphql apollographql relay trpc grpc socketdotio webauthn webassembly webcomponents pwa w3c mdnwebdocs googlechrome firefox safari brave opera microsoftedge linux ubuntu debian fedora archlinux alpine linuxmint nixos manjaro redhat freebsd openbsd kali windows apple macos raspberrypi arduino espressif platformio homeassistant openhab portainer podman rancher k3s multipass proxmox vmware virtualbox parallels qemu ceph minio backblaze wasabi storj ipfs filecoin gunicorn uvicorn fastify express nestjs hapi koa hono adonisjs sails meteor loopback feathersjs keystone sequelize prisma drizzle typeorm mongoose kysely objection knex bookshelf doctrine hibernate sqlalchemy peewee sqlmodel beanie tortoiseorm alembic liquibase flyway goose atlas goland intellijidea webstorm pycharm phpstorm rubymine rider clion datagrip zed cursor neovim vim emacs visualstudiocode vscodium sublime textmate notepadplusplus androidstudio xcode posit eclipse apache netbeans codesandbox stackblitz replit gitpod githubcodespaces codeberg gitea forgejo sourcehut sourcetree git gitextensions gitkraken tower lazygit bash zsh fish powershell gnu gnumake cmake ninja meson bazel buck2 task just direnv dotenv homebrew chocolatey scoop nix snapcraft flatpak appimage apt brew curl wget openssl libuv boost fmt spdlog catch2 googletest doctest benchmark rapidjson nlohmannjson protobuf capnproto flatbuffers msgpack toml yaml json markdown asciidoctor mdx docusaurus vitepress vuepress mkdocs readthedocs sphinx gitbook mintlify starlight docsify revealjs slides shiki highlightdotjs prism mermaid plantuml graphviz d3dotjs chartdotjs echarts plotly highcharts observable victory recharts visx nivo amcharts vega leaflet mapbox maplibre openstreetmap googlemaps tomtom here cesium openlayers deckgl keplergl threejs babylondotjs pixijs phaser p5dotjs processing gsap motion lottiefiles rive theatrejs animejs handlebars mustache pug ejs liquid nunjucks twig jinja hugo eleventy jekyll hexo gatsby gridsome pelican zola falcon rocket axum actix tokio warp bevy iced egui leptos yew dioxus wails fyne gioui wgpu vulkan opengl webgl webgpu ffmpeg imagemagick sharp libvips tesseract opencv mediapipe onnx coreml tensorrt nvidia amd intel qualcomm broadcom arm risc-v mistralai elevenlabs assemblyai deepgram daily livekit twilio vonage telnyx resend sendgrid mailgun postmark mailchimp brevo loops buttondown convertkit customerio hubspot intercom crisp tawkto zendesk freshdesk helpscout discourse disqus utterances giscus`.split(
    /\s+/,
  );
const workNames =
  `Bug BugOff BugPlay ShieldBug ShieldAlert ShieldCheck ShieldX Shield Lock LockKeyhole Unlock Key KeyRound Fingerprint ScanFace ScanEye Eye EyeOff ScanSearch Search SearchCheck SearchX FileSearch FileWarning FileX FileCode FileJson FileText FileStack Files FileCheck Folder FolderOpen FolderGit FolderArchive Archive ArchiveRestore ArchiveX Boxes Box Package PackageCheck PackageOpen PackageSearch PackageX Container Ship Server ServerCog ServerCrash ServerOff ServerCrash Database DatabaseBackup DatabaseZap DatabaseCheck DatabaseSearch HardDrive HardDriveDownload HardDriveUpload MemoryStick Cpu CircuitBoard Microchip Network NetworkX Wifi WifiOff Ethernet Router Radio Antenna Cable Plug PlugZap Unplug Cloud CloudCog CloudDownload CloudUpload CloudOff CloudAlert CloudCheck CloudLightning Upload Download RefreshCw RefreshCcw RotateCcw RotateCw Repeat Repeat2 Workflow GitBranch GitCommitHorizontal GitMerge GitPullRequest GitPullRequestClosed GitPullRequestDraft GitCompare GitFork GitGraph GitCommitVertical Webhook WebhookOff Bot BotMessageSquare Brain BrainCircuit Sparkles Wand WandSparkles Terminal SquareTerminal Code CodeXml Braces Brackets Binary Regex Variable FunctionSquare FileTerminal SquareCode Monitor MonitorCog MonitorCheck MonitorX MonitorSmartphone Laptop Smartphone Tablet Watch Tv Camera Webcam Mic MicOff Video VideoOff Bell BellRing BellOff BellDot Calendar CalendarCheck CalendarClock CalendarDays CalendarRange Clock ClockAlert ClockFading Timer AlarmClock Hourglass Gauge Activity HeartPulse ChartLine ChartBar ChartArea ChartPie TrendingUp TrendingDown ChartNetwork ChartNoAxesCombined Signal Satellite Radar Telescope Compass Map MapPin Globe GlobeLock Languages Earth Route Navigation Navigation2 Milestone Flag FlagTriangleRight Target Crosshair CircleDot CircleCheck CircleCheckBig CircleX CircleAlert CircleHelp TriangleAlert OctagonAlert OctagonX Ban Proportions Accessibility PersonStanding Users User UserCheck UserCog UserLock UserPlus Contact ContactRound ShieldUser IdCard BadgeCheck BadgeAlert BadgeHelp BadgeInfo BadgeX CreditCard Banknote Wallet Receipt DollarSign Coins ShoppingCart ShoppingBag Store Landmark Building Building2 Briefcase BriefcaseBusiness Handshake Scale Gavel Book BookOpen Notebook NotebookPen StickyNote Newspaper ScrollText Clipboard ClipboardCheck ClipboardList ClipboardPen List ListChecks ListTodo ListFilter ListTree ListOrdered ListRestart Check CheckCheck X Plus Minus Trash Trash2 Undo Undo2 Redo Redo2 Eraser Brush Paintbrush PaintBucket Palette Pipette Pen Pencil PenTool Ruler LayoutDashboard PanelsTopLeft PanelLeft PanelRight Rows3 Columns3 Grid2X2 Table TableProperties Component Shapes Layers Layers2 SquaresIntersect Combine Split Ungroup Group Focus Fullscreen Expand Shrink Crop Image ImageOff Images GalleryHorizontalEnd GalleryVerticalEnd Mouse MousePointer MousePointerClick MousePointer2 Keyboard Command Option CornerDownLeft ArrowRight ArrowUpRight Move MoveRight Link Link2 Link2Off ExternalLink Unlink Paperclip Attachment Mail MailCheck MailWarning MailX Inbox Send MessageCircle MessageSquare MessagesSquare MessageCircleWarning MessageSquareWarning MessageSquareText MessageSquareCode MessageSquareShare Loader LoaderCircle LoaderPin Asterisk Zap ZapOff Flame FlameKindling FireExtinguisher Lightbulb LightbulbOff Sun Moon Sunrise Sunset Star Stars Sparkle Rocket Rabbit Snail Turtle Bird Fish PawPrint Cat Dog Rat Squirrel TestTube TestTubeDiagonal TestTubes FlaskConical FlaskConicalOff FlaskRound Microscope Dna Atom Beaker Magnet Radiation Biohazard Construction Wrench Hammer Pickaxe Drill Cog Settings Settings2 SlidersHorizontal SlidersVertical Bolt Nut Waypoints Blocks Puzzle FileQuestionMark FileHeart BadgePercent Percent Hash Tag Tags Bookmark BookmarkCheck Pin PinOff ListCollapse Expand CircleDashed CircleFadingPlus CircleSlash SquareDashed SquareCheck SquareX SquareDot SquareEqual Equal NotEqual`.split(
    /\s+/,
  );
const selected = [...new Set(brandSlugs)]
  .map((slug) => Object.values(brands).find((i) => i?.slug === slug))
  .filter(Boolean);
const entries = [];
const emitted = [];
for (const icon of selected) {
  const id = `brand-${icon.slug}`,
    file = `icons/${id}.svg`;
  const svg = optimize(icon.svg, { multipass: true }).data;
  await fs.writeFile(path.join(root, file), svg + "\n");
  emitted.push(svg);
  entries.push({
    id,
    title: icon.title,
    path: file,
    kind: "brand",
    source: icon.source,
    license: icon.license || {
      type: "See upstream brand guidelines",
      url: icon.source,
    },
  });
}
for (const name of [...new Set(workNames)]) {
  if (!lucide[name]) continue;
  const id =
      "work-" + name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(),
    file = `icons/${id}.svg`;
  const svg = optimize(
    renderToStaticMarkup(
      React.createElement(lucide[name], { size: 24, strokeWidth: 1.8 }),
    ),
    { multipass: true },
  ).data;
  await fs.writeFile(path.join(root, file), svg + "\n");
  emitted.push(svg);
  entries.push({
    id,
    title: name.replace(/([a-z])([A-Z])/g, "$1 $2"),
    path: file,
    kind: "work",
    source: "https://lucide.dev/icons/" + id.slice(5),
    license: {
      type: "ISC",
      url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
    },
  });
}
for (const slug of ["posthog", "github", "docker", "nextdotjs"])
  if (!entries.some((e) => e.kind === "brand" && e.id === `brand-${slug}`))
    throw Error(`Missing required brand ${slug}`);
await fs.writeFile(
  path.join(root, "icons/catalog.json"),
  JSON.stringify(entries, null, 2) + "\n",
);
await fs.copyFile(
  path.join(root, "node_modules/simple-icons/LICENSE.md"),
  path.join(root, "icons/SIMPLE-ICONS-LICENSE.txt"),
);
await fs.copyFile(
  path.join(root, "node_modules/simple-icons/DISCLAIMER.md"),
  path.join(root, "icons/SIMPLE-ICONS-DISCLAIMER.md"),
);
await fs.copyFile(
  path.join(root, "node_modules/lucide-react/LICENSE"),
  path.join(root, "icons/LUCIDE-LICENSE.txt"),
);
console.log(
  `${entries.length} icons: ${entries.filter((e) => e.kind === "brand").length} brands, ${entries.filter((e) => e.kind === "work").length} work icons. SVG ${Buffer.byteLength(emitted.join(""))} bytes; gzip ${gzipSync(emitted.join("")).length} bytes.`,
);
