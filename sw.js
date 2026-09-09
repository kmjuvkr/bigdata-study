/* 빅데이터분석 학습 앱 서비스 워커
   앱 내용을 수정해 재배포할 때는 CACHE 버전 문자열을 올린다 (예: v8 -> v9). */
const CACHE = "bda-v8";
const CORE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    // 최신 내용을 확실히 받도록 HTTP 캐시를 우회해 프리캐시
    await Promise.all(CORE.map(async (u) => {
      try {
        const res = await fetch(u, { cache: "reload" });
        if (res && res.ok) await c.put(u, res);
      } catch (err) {}
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  // 앱 문서: 항상 네트워크 우선, 실패 시에만 캐시(오프라인 대비)
  if (req.mode === "navigate" || (sameOrigin && url.pathname.endsWith("index.html"))) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put("./index.html", copy));
          return res;
        })
        .catch(() => caches.match("./index.html").then((r) => r || caches.match("./")))
    );
    return;
  }

  // 그 외(아이콘, Google Fonts 등): 캐시 우선 + 백그라운드 갱신
  e.respondWith(
    caches.match(req).then((cached) => {
      const fetching = fetch(req)
        .then((res) => {
          if (res && (res.ok || res.type === "opaque")) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || fetching;
    })
  );
});
