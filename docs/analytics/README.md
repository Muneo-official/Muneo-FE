# GA4 · GTM 설정 가이드

문어 web 앱(`www.muneo.kr`)의 사용자 행동을 **우리 팀 Google 계정이 소유한** GA4 속성과 GTM 컨테이너로 수집하기 위한 설정 절차다. 처음부터 새로 만드는 것을 전제로 한다.

## 0. 한눈에 보기

```
브라우저 (Next.js 코드)                Google Tag Manager                 Google Analytics 4
───────────────────────               ─────────────────────              ──────────────────
trackEvent('sign_up', …)  ── push ──▶  window.dataLayer   ── 트리거 ──▶  GA4 이벤트 태그  ── 전송 ──▶  보고서 · 탐색
setAnalyticsUser(user)    ── push ──▶  (user_id 등 보관)
```

- **코드**는 "무슨 일이 일어났는지"만 `window.dataLayer`에 기록한다. GA4 측정 ID는 코드에 없다.
- **GTM**이 dataLayer를 읽어 GA4로 보낸다. 어디로(측정 ID), 무엇을(파라미터) 보낼지는 GTM 화면에서 관리한다.
- 코드와 GTM을 잇는 값은 환경 변수 **`NEXT_PUBLIC_GTM_ID` 하나뿐**이다.

### 현재 사용 중인 ID

| 항목            | 값             |
| --------------- | -------------- |
| GA4 측정 ID     | `G-SQEYTRD2DP` |
| GTM 컨테이너 ID | `GTM-THC48L8D` |

2026-09 이전에 `muneo.kr` 도메인을 쓰던 다른 제품의 GA4·GTM 계정은 이 제품과 관계없다. 2026-09-26 기준 프로덕션에는 `NEXT_PUBLIC_GTM_ID`가 설정돼 있지 않아 GTM이 로드되지 않았다.

### 진행 순서 (약 1시간, 보고서 반영은 24~48시간 뒤)

| 단계 | 할 일                               | 결과물                       |
| ---- | ----------------------------------- | ---------------------------- |
| 1    | 준비                                | 사용할 Google 계정           |
| 2    | GA4 속성 만들기                     | 측정 ID `G-XXXXXXXXXX`       |
| 3    | GA4 기본 설정                       | 중복 집계·개인정보 방지      |
| 4    | GTM 컨테이너 만들기 + 구성 가져오기 | 컨테이너 ID `GTM-XXXXXXX`    |
| 5    | Vercel 환경 변수 교체 + 재배포      | 사이트에 새 컨테이너 연결    |
| 6    | 미리보기로 검증                     | 이벤트 흐름 확인             |
| 7    | GTM 게시                            | 실제 방문자 수집 시작        |
| 8    | 권한 공유                           | 한 사람만 접근하는 상황 방지 |

---

## 1. 준비

- **팀이 계속 쓸 Google 계정.** 개인 계정으로 만들어도 되지만 8단계에서 반드시 두 번째 관리자를 추가한다.
- **Vercel 프로젝트의 환경 변수 수정 권한.**
- 이 폴더의 **`gtm-container.json`** (GTM 구성 파일).

---

## 2. GA4 속성 만들기

1. <https://analytics.google.com> 접속 → 왼쪽 아래 톱니바퀴 **관리(Admin)** → **만들기(Create) → 계정(Account)**
   - 계정 이름: `Muneo`
   - 데이터 공유 설정: 기본값 그대로
2. 이어서 **속성(Property)** 만들기
   - 속성 이름: `문어 웹 (www.muneo.kr)`
   - 보고 시간대: **대한민국**, 통화: **대한민국 원(₩)**
   - 비즈니스 정보·목표: 아무거나 골라도 된다 (기본 보고서 구성에만 영향)
3. 데이터 수집 시작 → 플랫폼 **웹(Web)**
   - 웹사이트 URL: `https://www.muneo.kr`
   - 스트림 이름: `www.muneo.kr`
   - "향상된 측정"은 켠 채로 **스트림 만들기**
4. 이어서 `gtag.js` 코드를 `<head>`에 붙여 넣으라는 "태그 설치 안내" 화면이 뜨는데, **붙여 넣지 말고 닫는다.** GA4는 GTM이 로드하므로 이 코드까지 넣으면 모든 이벤트가 두 번 집계된다.
5. 스트림 상세 화면 오른쪽 위의 **측정 ID(`G-XXXXXXXXXX`)를 복사**해 둔다. 현재 속성의 측정 ID는 `G-SQEYTRD2DP`이며 `gtm-container.json`에 이미 들어 있다. 속성을 새로 만들었다면 4단계에서 바꾼다.

---

## 3. GA4 기본 설정

모두 **관리 → 데이터 수집 및 수정(Data collection and modification) → 데이터 스트림(Data streams) → 방금 만든 웹 스트림**에서 시작한다.

### 3-1. 자동 페이지뷰 중 "브라우저 기록" 끄기 — 필수

Next.js는 화면을 이동할 때 새로고침 없이 주소만 바꾼다. 코드(`PageViewTracker`)가 이동할 때마다 `page_view`를 직접 보내므로, GA4의 자동 감지를 끄지 않으면 **page_view가 두 번씩 집계된다.**

- **향상된 측정(Enhanced measurement)** 옆 톱니 → **페이지 조회수(Page views)** → **고급 설정 표시(Show advanced settings)**
- **브라우저 기록 이벤트 기반 페이지 변경(Page changes based on browser history events) 체크 해제** → 저장
- 스크롤, 이탈 클릭, 파일 다운로드 등 나머지 항목은 켜 둬도 된다.

> 첫 진입 page_view도 코드가 보내므로 GTM의 Google 태그에서도 `send_page_view=false`로 자동 page_view를 끈다. 가져오기 파일에 이미 들어 있다.

### 3-2. 데이터 수정(Redact data) — 필수

카카오 가입 콜백 주소(`/auth/callback/signup?ticket=…`)에는 1회용 가입 티켓이 실린다. 코드가 보내는 이벤트에서는 이미 지우지만, GA4가 스스로 수집하는 이벤트(스크롤 등)는 코드를 거치지 않으므로 GA4에서도 막는다.

- 스트림 상세 → 이벤트 영역의 **데이터 수정(Redact data)**
- 이메일 항목이 켜져 있는지 확인
- **URL 쿼리 매개변수(URL query parameters)** 를 켜고 `ticket` 입력 후 Enter → 저장

### 3-3. 원치 않는 추천(Unwanted referrals) — 권장

카카오 로그인은 `kakao.com`을 거쳐 돌아온다. 설정하지 않으면 로그인한 사용자의 유입 경로가 "kakao.com에서 들어옴"으로 잘못 잡힐 수 있다.

- 스트림 상세 → **태그 설정 구성(Configure tag settings)** → 설정 **모두 보기** → **원치 않는 추천 나열(List unwanted referrals)**
- 조건: 추천 도메인 **포함(contains)** `kakao.com` → 저장

### 3-4. 내부 트래픽 제외 — 권장

팀원의 사용 기록이 섞이면 수치가 부풀려진다.

- **코드에서 자동 처리:** ADMIN 권한 계정으로 로그인하면 이벤트에 `traffic_type=internal`이 붙는다.
- **사무실 등 고정 IP가 있다면:** 태그 설정 구성 → **내부 트래픽 정의(Define internal traffic)** → 규칙 이름 `office`, `traffic_type` 값 `internal`, IP 주소 조건 추가.
- **필터 활성화:** 관리 → 데이터 수집 및 수정 → **데이터 필터(Data filters)** 에 `Internal Traffic` 필터가 "테스트" 상태로 이미 있다. **7단계까지 마친 뒤 "활성"으로 바꾼다.** 활성 필터로 걸러진 데이터는 되살릴 수 없으므로 검증이 끝난 다음에 켠다.

### 3-5. 데이터 보관 기간 — 필수

기본값(2개월)이면 탐색(Explore) 보고서에서 2개월이 지난 데이터를 볼 수 없다.

- 관리 → 데이터 수집 및 수정 → **데이터 보존(Data retention)** → 이벤트 데이터 보존 **14개월** → 저장

### 3-6. 맞춤 정의(Custom definitions) — 필수

GA4는 등록한 파라미터만 보고서의 측정기준으로 보여 준다. **등록 전에 들어온 데이터에는 소급 적용되지 않으므로** 지금 등록한다.

관리 → 데이터 표시(Data display) → **맞춤 정의** → **맞춤 측정기준 만들기**

| 측정기준 이름 | 범위   | 이벤트 매개변수 / 사용자 속성 | 용도                        |
| ------------- | ------ | ----------------------------- | --------------------------- |
| CTA 위치      | 이벤트 | `position`                    | 어느 위치의 버튼이 눌렸는지 |
| 견적 단계     | 이벤트 | `step`                        | 견적 단계별 이탈 분석       |
| 가입 경로     | 사용자 | `auth_provider`               | 이메일·카카오 가입자 비교   |

같은 화면의 **맞춤 측정항목** 탭:

| 측정항목 이름 | 범위   | 이벤트 매개변수 | 측정 단위 |
| ------------- | ------ | --------------- | --------- |
| 선택 공정 수  | 이벤트 | `process_count` | 표준      |
| 첨부 파일 수  | 이벤트 | `file_count`    | 표준      |

`method`(로그인·가입 방식), `link_text`, `link_url`, `page_referrer`는 GA4 기본 측정기준(방법, 링크 텍스트, 링크 URL, 페이지 리퍼러)으로 이미 제공되므로 등록하지 않는다.

### 3-7. 주요 이벤트(Key events) 지정 — 필수

전환으로 볼 이벤트를 지정한다. 이벤트가 아직 한 번도 들어오지 않았어도 이름으로 미리 만들 수 있다.

관리 → 데이터 표시 → **이벤트** → **이벤트 만들기**에서 아래 이름마다 한 번씩 만든다.

1. 이벤트 이름 입력
2. **주요 이벤트로 표시** 켜기
   - 기본 주요 이벤트 값: **설정 안함** (금액을 넣으면 가입 1건마다 매출이 생긴 것처럼 기록된다)
   - 계산 방법: **이벤트당 한 번**
3. 이벤트 생성 방법: **코드로 만들기** 선택. 이 이벤트들은 이미 코드가 GTM을 거쳐 보낸다. 화면에 설치 코드가 나와도 붙여 넣지 않는다.
   - "코드 없이 만들기"는 기존 이벤트를 조건으로 새 이벤트를 파생시키는 기능이라, 코드가 보내는 이벤트와 겹쳐 두 번 집계될 수 있다.
4. **만들기**

- `sign_up` — 회원가입 완료
- `estimate_generate_success` — 가견적 생성 완료
- `analysis_submit_success` — 견적서 진단 완료

---

## 4. GTM 컨테이너 만들기

1. <https://tagmanager.google.com> → **계정 만들기**
   - 계정 이름 `Muneo`, 국가 **대한민국**
   - 컨테이너 이름 `www.muneo.kr`, 타겟 플랫폼 **웹**
   - 약관 동의
2. "Google 태그 관리자 설치" 팝업이 뜨면 닫는다. 코드(`apps/web/src/app/layout.tsx`의 `<GoogleTagManager>`)가 이미 처리한다.
3. 화면 위쪽의 **컨테이너 ID(`GTM-XXXXXXX`)를 복사**해 둔다. 5단계에서 쓴다.

### 4-1. 구성 가져오기 (권장)

1. **관리(Admin) → 컨테이너 가져오기(Import Container)**
2. 가져올 파일: 이 폴더의 `gtm-container.json`
3. 작업공간: **기존(Existing)** → `Default Workspace`
4. 가져오기 옵션: **병합(Merge)** → **충돌하는 태그, 트리거, 변수 이름 바꾸기(Rename conflicting tags, triggers, and variables)**
5. 요약에 **태그 2개, 트리거 1개, 변수 15개 추가**가 보이면 확인
6. **변수 → `const - GA4 측정 ID`** 를 열어 값이 2단계의 측정 ID(현재 `G-SQEYTRD2DP`)와 같은지 확인한다. 다르면 바꾸고 저장

> `gtm-container.json`은 Google 공식 도구와 공개된 실제 GTM export 파일의 형식에 맞춰 작성했지만, 이 저장소에서 실제 GTM 계정에 가져오기를 해 본 적은 없다. 가져오기 오류가 나거나 결과가 아래 4-2와 다르면 4-2대로 직접 만든다.

### 4-2. 직접 구성 (가져오기가 안 될 때, 또는 구성을 이해하고 싶을 때)

가져오기 결과도 이것과 같다.

**① 기본 제공 변수 확인** — 변수 → 기본 제공 변수 → 구성 → **Event** 가 체크돼 있는지 확인 (보통 기본으로 켜져 있다).

**② 사용자 정의 변수** — 변수 → 사용자 정의 변수 → 새로 만들기

| 이름                               | 유형                     | 설정                                           |
| ---------------------------------- | ------------------------ | ---------------------------------------------- |
| `const - GA4 측정 ID`              | 상수                     | 값: `G-SQEYTRD2DP` (2단계의 측정 ID)           |
| `dlv - event_params.page_location` | 데이터 영역 변수         | 변수 이름 `event_params.page_location`, 버전 2 |
| `dlv - event_params.page_referrer` | 데이터 영역 변수         | `event_params.page_referrer`                   |
| `dlv - event_params.page_title`    | 데이터 영역 변수         | `event_params.page_title`                      |
| `dlv - event_params.link_text`     | 데이터 영역 변수         | `event_params.link_text`                       |
| `dlv - event_params.link_url`      | 데이터 영역 변수         | `event_params.link_url`                        |
| `dlv - event_params.position`      | 데이터 영역 변수         | `event_params.position`                        |
| `dlv - event_params.method`        | 데이터 영역 변수         | `event_params.method`                          |
| `dlv - event_params.step`          | 데이터 영역 변수         | `event_params.step`                            |
| `dlv - event_params.process_count` | 데이터 영역 변수         | `event_params.process_count`                   |
| `dlv - event_params.file_count`    | 데이터 영역 변수         | `event_params.file_count`                      |
| `dlv - user_id`                    | 데이터 영역 변수         | `user_id`                                      |
| `dlv - user_auth_provider`         | 데이터 영역 변수         | `user_auth_provider`                           |
| `dlv - traffic_type`               | 데이터 영역 변수         | `traffic_type`                                 |
| `GA4 - 공통 이벤트 설정`           | Google 태그: 이벤트 설정 | 아래 표                                        |

`GA4 - 공통 이벤트 설정`의 이벤트 매개변수 — 모든 GA4 이벤트에 공통으로 붙는다.

| 매개변수        | 값                                     |
| --------------- | -------------------------------------- |
| `page_location` | `{{dlv - event_params.page_location}}` |
| `user_id`       | `{{dlv - user_id}}`                    |
| `traffic_type`  | `{{dlv - traffic_type}}`               |

**③ 트리거** — 트리거 → 새로 만들기

- 이름: `CE - 문어 dataLayer 이벤트`
- 유형: **맞춤 이벤트(Custom Event)**
- 이벤트 이름: `^(page_view|login|sign_up|click_cta_.+|estimate_.+|analysis_.+|chat_.+)$`
- **정규 표현식 일치 사용** 체크, 실행 조건 **모든 맞춤 이벤트**

**④ 태그** — 태그 → 새로 만들기

`GA4 - Google 태그`

- 유형: **Google 태그**, 태그 ID: `{{const - GA4 측정 ID}}`
- 구성 설정 → 구성 매개변수 `send_page_view` = `false`
- 트리거: **Initialization - All Pages** (초기화 - 모든 페이지)

`GA4 - 문어 이벤트`

- 유형: **Google 애널리틱스: GA4 이벤트**
- 측정 ID: `{{const - GA4 측정 ID}}`, 이벤트 이름: `{{Event}}`
- 이벤트 매개변수 → 이벤트 설정 변수: `{{GA4 - 공통 이벤트 설정}}`
- 이벤트 매개변수 표: `page_referrer`, `page_title`, `link_text`, `link_url`, `position`, `method`, `step`, `process_count`, `file_count` 각각을 같은 이름의 `{{dlv - event_params.…}}` 변수와 연결
- 사용자 속성: `auth_provider` = `{{dlv - user_auth_provider}}`
- 트리거: `CE - 문어 dataLayer 이벤트`

#### 태그 하나로 모든 이벤트를 보내는 이유

이벤트 이름을 `{{Event}}`로 받으므로 코드가 보낸 dataLayer 이벤트 이름이 그대로 GA4 이벤트 이름이 된다. 이벤트마다 파라미터가 다르지만, 코드가 이벤트를 보내기 직전에 `event_params`를 비우기 때문에 그 이벤트에 없는 파라미터는 빈 값(undefined)이 되고 GA4로 전송되지 않는다. 그래서 이벤트를 추가해도 태그를 새로 만들 필요가 없다.

---

## 5. 새 컨테이너를 사이트에 연결 (Vercel)

1. Vercel 대시보드 → web 프로젝트 → **Settings → Environment Variables**
2. `NEXT_PUBLIC_GTM_ID`를 찾는다.
   - **있으면**(이전 컨테이너 ID) → Edit → 값을 새 `GTM-XXXXXXX`로 바꾼다.
   - **없으면** → Add New → Key `NEXT_PUBLIC_GTM_ID`, Value `GTM-XXXXXXX`
   - Environments: **Production만** 체크한다. Preview에도 넣으면 PR 미리보기 배포의 트래픽이 섞인다.
   - Secret(Sensitive) 타입으로 만들지 않는다. `NEXT_PUBLIC_*`은 빌드가 평문으로 읽어야 한다.
3. **Deployments → 최신 Production 배포 → ⋯ → Redeploy.** `NEXT_PUBLIC_*` 값은 빌드할 때 코드에 박히므로 재배포해야 반영된다.
4. 반영 확인: `https://www.muneo.kr`을 열고 개발자 도구 → Network 탭 → `gtm.js` 검색 → 요청 주소의 `id=`가 새 컨테이너 ID인지 본다. 아직 7단계(게시) 전이면 이 요청이 실패(404)할 수 있는데 정상이다.

> **로컬에서 확인하고 싶다면** `apps/web/.env.local`에 `NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX`를 잠깐 추가하고 `pnpm dev:web`. 단, 로컬 트래픽도 같은 GA4 속성에 쌓이므로 확인이 끝나면 지운다. 평소에는 이 값이 없어서 로컬에서는 GTM이 로드되지 않는다.

---

## 6. 미리보기로 검증

미리보기는 내 브라우저에만 적용되고 실제 방문자에게는 영향이 없다.

1. GTM 작업공간 오른쪽 위 **미리보기(Preview)** → URL `https://www.muneo.kr` → **Connect**
2. 새 창에 사이트가 열리고 Tag Assistant 탭에 "Connected"가 뜬다.
3. 아래 행동을 하면서 Tag Assistant 왼쪽 이벤트 목록을 확인한다. 각 이벤트를 누르면 **Tags** 탭에서 `GA4 - 문어 이벤트`가 **Fired**인지, **Variables** 탭에서 값이 맞는지 볼 수 있다.

| 행동                      | 목록에 보여야 할 이벤트                                   | 확인할 값                                                 |
| ------------------------- | --------------------------------------------------------- | --------------------------------------------------------- |
| 첫 접속                   | `Initialization`(Google 태그 실행) → `page_view`          | page_view가 **한 번만**                                   |
| 랜딩 헤더 "시작하기" 클릭 | `click_cta_landing_header_signup` → `page_view`           | `dlv - event_params.position` = `header`                  |
| 이메일 로그인             | `login` → `page_view`(/home)                              | `method` = `email`, page_view에서 `dlv - user_id` 값 있음 |
| 카카오 로그인             | `page_view`(/home) 직전에 `login`                         | `method` = `kakao`                                        |
| 견적 1~3단계 진행         | `estimate_step_complete` ×3 → `estimate_generate_success` | `step` = 1, 2, 3                                          |
| 견적서 진단 실행          | `analysis_submit_success`                                 | `file_count`                                              |
| 챗 메시지 전송            | `chat_message_send`                                       |                                                           |
| 사이드바로 화면 이동      | 이동마다 `page_view` 한 번씩                              | 두 번씩 뜨면 3-1 다시 확인                                |

4. 동시에 GA4 → 관리 → **DebugView**를 열면 같은 이벤트가 몇 초 안에 들어온다. 미리보기 모드의 트래픽은 자동으로 디버그 표시가 붙는다.

---

## 7. 게시

1. GTM 오른쪽 위 **제출(Submit)** → 버전 이름 `v1 - GA4 기본 이벤트` → **게시(Publish)**
2. 이 순간부터 모든 방문자에게 적용된다. GA4 → 보고서 → **실시간(Realtime)** 에서 사용자가 잡히는지 확인한다.
3. 3-4의 `Internal Traffic` 데이터 필터를 **활성**으로 바꾼다.
4. 표준 보고서에는 24~48시간 뒤부터 데이터가 나온다.

GTM은 게시할 때마다 버전이 남는다. 문제가 생기면 **버전 → 이전 버전 → 게시**로 바로 되돌릴 수 있다.

---

## 8. 권한 공유 (재발 방지)

이번처럼 한 사람만 접근할 수 있는 상황을 막기 위해 **관리자를 최소 2명** 둔다.

- **GA4:** 관리 → **계정 액세스 관리** → `+` → 팀원 이메일 → 역할 **관리자**(최소 1명 더), 보기만 할 사람은 **뷰어**
- **GTM:** 관리 → **사용자 관리** → 계정 권한 **관리자**, 컨테이너 권한 **게시**
- 팀원이 나갈 때는 권한을 옮긴 뒤 제거한다.

---

## 9. 데이터 보는 법

| 알고 싶은 것                 | 위치                                  | 팁                                                                                           |
| ---------------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------- |
| 지금 누가 들어와 있나        | 보고서 → 실시간                       |                                                                                              |
| 어느 화면을 많이 보나        | 보고서 → 참여도 → 페이지 및 화면      | 로그인 후 화면들은 제목이 같으므로 측정기준을 **페이지 경로**로 바꿔서 본다                  |
| 어디서 들어오나              | 보고서 → 획득 → 트래픽 획득           | 홍보 링크에는 `?utm_source=instagram&utm_medium=social&utm_campaign=launch`처럼 UTM을 붙인다 |
| 어디서 이탈하나              | 탐색 → **유입경로 탐색 분석**         | 아래 예시                                                                                    |
| 특정 사용자가 뭘 했나        | 탐색 → **사용자 탐색기**              | GA4 `user_id` = 백엔드 사용자 id. 어드민에서 id를 확인해 검색                                |
| 이메일 vs 카카오 가입자 차이 | 아무 보고서 → 비교 추가 → `가입 경로` | 3-6 등록 이후 데이터부터 나온다                                                              |

**유입경로 탐색 분석 예시 — 랜딩에서 가견적까지**

1. `page_view` (페이지 경로 = `/`)
2. `click_cta_landing_hero_signup` 또는 `click_cta_landing_header_signup`
3. `sign_up`
4. `estimate_step_complete` (견적 단계 = 1)
5. `estimate_generate_success`

---

## 10. 이벤트 사전 (코드 ↔ GTM 약속)

이벤트 이름과 파라미터 타입은 `apps/web/src/constants/analyticsEvents.ts`의 `AnalyticsEventMap`이 기준이다. 보내는 로직은 `apps/web/src/lib/analytics.ts`에 있다.

### dataLayer에 실제로 쌓이는 모양

```js
// 사용자 정보 — (main) 영역에 들어올 때 한 번, event 없이 넣는다. 이후 모든 이벤트가 이 값을 읽는다.
{ user_id: '42', user_auth_provider: 'kakao', traffic_type: undefined }

// 이벤트 — 매번 두 번 넣는다. 첫 줄은 앞 이벤트의 파라미터가 섞이지 않도록 비우는 용도다.
{ event_params: null }
{ event: 'sign_up', event_params: { page_location: 'https://www.muneo.kr/signup', method: 'email' } }
```

브라우저 콘솔에서 `window.dataLayer`를 입력하면 지금까지 쌓인 내용을 볼 수 있다.

### 이벤트 목록

모든 이벤트에 공통으로 `page_location`(`ticket` 제거), 로그인 상태면 `user_id`·`traffic_type`, 사용자 속성 `auth_provider`가 붙는다.

| 이벤트                            | 언제                                                | 파라미터                                        | 코드 위치 (`apps/web/src/`)                                                   |
| --------------------------------- | --------------------------------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------- |
| `page_view`                       | 모든 화면 진입·이동                                 | `page_title`, `page_referrer`(두 번째 화면부터) | `components/analytics/PageViewTracker.tsx`                                    |
| `click_cta_landing_header_signup` | 랜딩 헤더 "시작하기" 클릭                           | `link_text`, `link_url`, `position`             | `app/(landing)/_components/Header/Header.tsx`                                 |
| `click_cta_landing_hero_signup`   | 랜딩 히어로 CTA 클릭                                | `link_text`, `link_url`, `position`             | `app/(landing)/_components/HeroSection/HeroCtaButton.tsx`                     |
| `click_cta_chat_open`             | 플로팅 챗 열기                                      | `link_text`, `position`                         | `components/FloatingChatLauncher/FloatingChatLauncher.tsx`                    |
| `click_cta_chat_login_redirect`   | 챗의 "로그인하러 가기" 클릭                         | `link_text`, `link_url`, `position`             | `components/FloatingChatLauncher/FloatingChatLauncher.tsx`                    |
| `login`                           | 이메일 로그인 성공 / 카카오 로그인 후 `(main)` 도착 | `method`: `email` \| `kakao`                    | `app/(auth)/_hooks/useLoginForm.ts`, `components/analytics/AnalyticsUser.tsx` |
| `sign_up`                         | 이메일 가입 성공 / 카카오 추가 정보 제출 성공       | `method`: `email` \| `kakao`                    | `app/(auth)/_hooks/useSignupForm.ts`, `useSocialSignupForm.ts`                |
| `estimate_step_complete`          | 견적 다음 단계로 이동 (1→2, 2→3, 3→4)               | `step`: 완료한 단계(1~3)                        | `app/(main)/estimate/_store/estimateStore.ts`                                 |
| `estimate_generate_success`       | 가견적 생성 성공                                    | `process_count`                                 | `app/(main)/estimate/page.tsx`                                                |
| `estimate_generate_error`         | 가견적 생성 실패                                    | `process_count`                                 | `app/(main)/estimate/page.tsx`                                                |
| `analysis_submit_success`         | 견적서 진단 성공                                    | `file_count`                                    | `app/(main)/analysis/_store/analysisStore.ts`                                 |
| `analysis_submit_error`           | 견적서 진단 실패 (사용자가 취소한 경우 제외)        | `file_count`                                    | `app/(main)/analysis/_store/analysisStore.ts`                                 |
| `chat_message_send`               | 챗 메시지 전송                                      | 없음                                            | `components/FloatingChatLauncher/useChatMessages.ts`                          |

**카카오 로그인을 잡는 방법:** 카카오 로그인은 서버 리다이렉트(`/auth/callback/success` → `/home`)로 끝나서 브라우저가 성공 순간을 알 수 없다. 그래서 카카오 버튼을 누를 때 `sessionStorage`에 표시를 남기고, `(main)` 영역에 도착하면 `AnalyticsUser`가 표시를 꺼내 `login`(`kakao`)을 보낸다. 신규 회원은 가입 폼 제출 때 `sign_up`을 보내면서 표시를 지우므로 `login`이 중복되지 않는다.

### 새 이벤트 추가하기

1. `constants/analyticsEvents.ts`의 `AnalyticsEventMap`에 이벤트 이름과 파라미터를 추가한다. 이름은 영문 소문자와 밑줄, 40자 이내.
2. 원하는 위치에서 `trackEvent('이벤트_이름', { ... })`를 호출한다.
3. 이름이 `click_cta_` / `estimate_` / `analysis_` / `chat_`으로 시작하면 GTM 트리거는 고칠 필요가 없다. 아니면 트리거 정규식에 이름을 추가한다.
4. **새 파라미터**라면: GTM에 `dlv - event_params.새이름` 변수 추가 → `GA4 - 문어 이벤트` 태그의 이벤트 매개변수 표에 추가 → GA4 맞춤 정의(3-6)에 등록.
5. 미리보기로 검증 → 게시 → 이 문서의 이벤트 목록을 갱신한다.

---

## 11. 개인정보 주의

- **이메일·이름·전화번호처럼 개인을 직접 알아볼 수 있는 정보를 GA4로 보내지 않는다.** Google 약관 위반이며 속성 데이터가 삭제될 수 있다. `user_id`는 내부 숫자 id만 보낸다. 사용자가 입력한 값(주소, 업체명, 챗 내용 등)도 파라미터로 보내지 않는다.
- 개인정보처리방침에 **행태정보 수집(Google Analytics 사용, 쿠키 수집과 거부 방법)** 항목이 있는지 확인한다. 개인정보보호법상 자동 수집 장치의 설치·운영과 거부 방법을 알려야 한다. 문구는 법무 검토를 권장한다.

---

## 12. 문제 해결

| 증상                                     | 확인할 것                                                                  |
| ---------------------------------------- | -------------------------------------------------------------------------- |
| page_view가 화면 이동 한 번에 두 번 찍힘 | 3-1의 "브라우저 기록 이벤트" 체크 해제 여부                                |
| Tag Assistant가 연결되지 않음            | 광고 차단 확장 프로그램 끄기, 5단계 재배포 여부, 주소가 `www.muneo.kr`인지 |
| DebugView에는 오는데 보고서에 없음       | 24~48시간 대기. 맞춤 측정기준은 등록 이후 데이터부터 나온다                |
| `GA4 - 문어 이벤트`가 Not Fired          | 이벤트 이름이 트리거 정규식에 맞는지, 기본 제공 변수 `Event`가 켜져 있는지 |
| 로컬에서 아무것도 안 잡힘                | 정상. 로컬 `.env.local`에는 `NEXT_PUBLIC_GTM_ID`가 없다                    |
| 실제 방문자보다 수치가 적어 보임         | 광고 차단기를 쓰는 사용자는 수집되지 않는다. 일부 누락은 피할 수 없다      |
