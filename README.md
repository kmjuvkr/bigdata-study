# 빅데이터분석 학습 앱 — 배포

빅데이터분석기사 필기 대비 PWA (설치형 웹앱).

## GitHub Pages 배포 방법

1. GitHub에서 새 저장소 `bigdata-study` 생성 (Public).
2. 이 폴더의 **5개 파일**을 저장소 루트에 업로드:
   - `index.html`
   - `manifest.webmanifest`
   - `sw.js`
   - `icon-192.png`
   - `icon-512.png`
   - (`README.md`는 올려도 되고 안 올려도 됨)
3. 저장소 **Settings → Pages → Source: `main` 브랜치 / `/ (root)`** 선택 후 저장.
4. 1~2분 뒤 접속: **https://kmjuvkr.github.io/bigdata-study/**
5. 휴대폰 크롬/사파리로 접속 → 메뉴 → **"홈 화면에 추가"** 하면 앱처럼 설치됨.

## 내용 수정 후 재배포

1. 로컬 `빅데이터분석.html`(원본)에서 개념·문제 수정.
2. 그 내용을 `index.html`에 반영 (또는 이 폴더의 index.html을 직접 수정).
3. **`sw.js`의 `const CACHE = "bda-v1"` 버전을 올림** (`bda-v2` 등) — 안 올리면 기기에 이전 버전이 캐시되어 갱신이 안 보임.
4. 변경된 파일을 GitHub에 다시 업로드.

## 학습 기록

각 기기의 브라우저 `localStorage`에 저장됨 (`bda.v2` 키). 기기·브라우저마다 별도, 서버 전송 없음.
