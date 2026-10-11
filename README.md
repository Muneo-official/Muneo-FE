# 문어 프론트엔드

인테리어 가견적 생성·견적서 진단 서비스. pnpm 모노레포로 고객용 웹(`apps/web`, Next.js), 어드민(`apps/admin`, Vite), 공유 UI(`packages/design-system`)를 관리한다.

2026-10-11 기준 실행·QA·운영 핵심 안내다. 지난 작업 내역은 `git log`와 `git show <커밋>`으로 확인한다.

## 실행

Node.js 22와 pnpm 10.33.0을 사용한다. 루트에서 `pnpm install --frozen-lockfile` 실행 후 필요한 앱을 켠다.

| 목적                  | 명령             | 기본 주소·계정                               |
| --------------------- | ---------------- | -------------------------------------------- |
| 고객 웹               | `pnpm dev:web`   | `http://localhost:3000`, 백엔드의 USER 계정  |
| 실제 API 연결 어드민  | `pnpm dev:admin` | `http://localhost:5173`, 백엔드의 ADMIN 계정 |
| 가상 데이터 어드민 QA | `pnpm qa:admin`  | `http://127.0.0.1:5174`, 아래 QA 전용 계정   |
| 두 앱 동시 실행       | `pnpm dev`       | 위 웹·어드민 주소                            |

환경 변수는 각 앱의 `.env.local`에서 관리하며 변경 후 재시작·재빌드한다.

| 앱    | 변수                                      | 설정                                                                 |
| ----- | ----------------------------------------- | -------------------------------------------------------------------- |
| web   | `NEXT_PUBLIC_API_BASE_URL`                | 개발 API `https://api-dev.muneo.kr`                                  |
| admin | `VITE_API_BASE_URL`                       | 개발 기본값 `https://api-dev.muneo.kr`; 운영은 배포 환경에 맞게 설정 |
| web   | `NEXT_PUBLIC_DIAGNOSIS_FEEDBACK_MODE`     | 미설정/`api`: 서버 연동, `preview`: 체험, `disabled`: 숨김           |
| web   | `MAINTENANCE_MODE`, `MAINTENANCE_MESSAGE` | `true`로 계획 점검 활성화, 안내 문구 설정                            |
| web   | `NEXT_PUBLIC_GTM_ID`                      | 분석 수집이 필요한 환경에 팀 소유 `GTM-…` 설정                       |

웹 브라우저 요청은 Next.js 프록시를 거치고, 어드민 개발 요청은 Vite 프록시를 거친다. 실제 데이터 대조 시 두 앱이 같은 백엔드를 사용해야 한다.

## 구현된 기능

| 영역          | 현재 동작                                                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 가견적·홈     | 화장실 개수와 필수 입력 검증, 공정 전체 선택/해제, 미입력 항목 이동. 홈에서 가견적·진단으로 바로 진입                          |
| 종합 인사이트 | 우선 확인할 항목 3개, 진단 근거 이동, 업체 질문 전체 복사                                                                      |
| 진단 피드백   | 저장된 진단에 good/bad, 이유 최대 3개, 의견 최대 500자. 조회·저장·수정·삭제, 409 충돌/503 장애 시 초안 보존                    |
| 어드민        | 사용자 검색·상세·계정 관리. 사용자별 저장 견적·진단·피드백 3개 탭, 10건 단위 페이지, 상세 펼치기·새로고침                      |
| 인증          | 이메일 로그인 후 원래 화면 복귀, 카카오 실패 안내, 세션 갱신 보완. 어드민은 서버 세션·ADMIN 권한 확인 및 로그아웃 시 캐시 정리 |
| 점검          | `/maintenance`, 502/503/504 안내, 입력 유지. 요청은 사용자가 직접 재시도                                                       |
| 개인정보·약관 | `/privacy`, `/terms`에 검토용 초안 0.1, 푸터·가입 화면 링크                                                                    |
| 챗봇          | 사용자 기능·전용 API·상태·이벤트와 소개 문구 제거                                                                              |

항목별 **실제 문제 여부는 수집하지 않는다.** 어드민은 응답 소유자·형식·페이지 정보를 검사하고, 권한/조회 오류를 ‘기록 0건’과 구분한다.

## 실제 서버 QA

백엔드가 전달한 피드백·어드민 명세를 반영했다. 개발 서버 OpenAPI의 경로 등록은 확인했지만, **실제 ADMIN 로그인과 DB 데이터 대조는 아직 별도 QA가 필요하다.** 실서버 로그인에는 백엔드에 등록된 관리자 계정이 필요하며 이 저장소에서 계정이나 비밀번호를 발급하지 않는다.

1. 웹과 어드민을 실행하고, **서로 다른 브라우저 프로필**에서 USER와 ADMIN으로 로그인한다. localhost 쿠키는 포트별로 분리되지 않는다.
2. 웹에서 가견적·진단을 생성하고 각각 **결과 저장**한다. 저장 전 결과는 어드민 조회 대상이 아니다.
3. 저장된 진단에 피드백 제출 → 새로고침으로 복원 → 수정 → 재진입으로 변경 반영을 확인한다.
4. 어드민에서 같은 이메일 검색 → 사용자 상세 → 이용 내역 3개 탭을 연다. 사용자 ID·진단 ID·내용·총 건수·페이지를 대조한다.
5. 웹에서 피드백 삭제 → 어드민 새로고침. 피드백만 사라지고 원래 진단은 남아 있어야 한다.
6. USER B의 타인 기록 접근·일반 USER의 관리자 API 접근 차단, 409/503·네트워크 실패 시 입력 보존과 재시도를 개발 환경에서 확인한다.

합동 QA 역할: **FE**는 화면·요청·입력 보존, **AI**는 정상/누락/읽기 어려운 견적서의 근거·분류 품질, **BE/infra**는 DB 연결·권한·중복/삭제·쿠키/CORS를 확인한다. 이슈에는 환경, FE/BE/AI 버전, 재현 순서, 예상/실제 결과, 사용자·진단 ID, 발생 시각, 오류 코드, 담당·재검증 결과를 남긴다. 비밀번호·토큰·개인정보는 가린다.

주요 API는 다음과 같다. 상세 필드·검증은 [피드백 타입](apps/web/src/api/feedback/types.ts)과 [어드민 이용 내역 타입](apps/admin/src/api/activity/types.ts)을 기준으로 확인한다.

| 기능             | 경로·처리                                                                                     |
| ---------------- | --------------------------------------------------------------------------------------------- |
| 관리자 로그인    | `POST /api/v1/admin/login`; 401은 로그인 정보 불일치, 403은 관리자 권한 없음                  |
| 피드백           | `GET/PUT/DELETE /api/v1/risk-detector/{reportId}/feedback`; GET 200/미작성 204, 저장·삭제 204 |
| 관리자 이용 내역 | `GET /api/v1/admin/users/{userId}/estimates`, `/risk-reports`, `/feedback`; `page=0&size=10`  |

피드백은 쿠키로 인증하며 사용자 ID를 본문에 보내지 않는다. PUT은 `schema_version: 1`, 평가·이유·의견과 `item_reviews: []`를 전송해 전체 교체한다. 409에서는 최신 의견을 확인하고 선택한 뒤 다시 제출한다. 기록이 안 보이면 **같은 API 환경인지 → 실제 저장했는지 → 사용자 ID → 응답 상태** 순서로 확인한다.

## 가상 QA·화면 미리보기

- `pnpm qa:admin`: **가상 계정** `admin@example.test / MuneoQa123!`. 이 정보는 실제 서버 로그인에 사용할 수 없다. 고정 데이터만 표시하며 실제 웹에서 저장한 내용은 나타나지 않는다.
- QA 사용자: 101 정상·페이지 이동, 102 빈 기록, 103 일반 404, 104 장애, 105 소유자 불일치, 106 권한 없음, 107 삭제된 사용자. QA 모드는 실제 API로 전달하지 않으며 계정 변경과 QA 프로덕션 빌드를 차단한다.
- 웹 `/preview/diagnosis`: 로그인 없이 인사이트·피드백을 체험하며 서버에 저장하지 않는다. 프로덕션에서는 기본 404이고 리뷰 배포에서만 `ENABLE_UI_PREVIEWS=true`로 공개할 수 있다.
- `/maintenance`, `/privacy`, `/terms`: 점검 안내와 정책 초안을 확인한다.

## 운영 전 남은 확인

운영자는 **김승찬**, 사업자등록 없는 개인 운영, 문의는 **muneo777@naver.com**이다. 정책 본문은 [privacy.ts](<apps/web/src/app/(legal)/_content/privacy.ts>)·[terms.ts](<apps/web/src/app/(legal)/_content/terms.ts>), 버전은 [policies.ts](apps/web/src/constants/policies.ts)에서 관리한다. 현재 시행일은 미정이고 가입 동의 기록 수집은 구현 전이다.

| 담당              | 확인·후속 작업                                                                                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FE + BE/infra     | 실제 USER/ADMIN QA, 운영 어드민 도메인과 쿠키·CORS·세션 갱신, 피드백 날짜의 시간대 표기                                                                             |
| BE/infra + 운영자 | 회원·파일·OCR·진단·피드백·로그별 보관 기간, 탈퇴/백업 삭제, 외부 AI/OCR/클라우드 업체·전달 항목·저장 국가                                                           |
| 운영자 + FE/BE    | 가입 연령·수집 항목·무료 범위·이용 제한 확정 → 정책 본문·시행일·버전 확정 → 필요한 동의 저장 API 연결                                                               |
| BE/infra          | 전용 readiness API와 프론트 호스팅 자체 중단 안내. 현재 `/api/service-status`는 무인증 `/users/me`의 2xx/401로 도달 여부만 확인하며 AI·DB 전체 복구를 보장하지 않음 |
| 기획 + AI/BE      | 공사 시기·거주 중 공사·트럭 접근·건물 연식의 실제 산출 반영, 자재 분류·데이터 부족 기준. 가입 최소화·카카오 목적지 복귀·비밀번호 재설정 후속 설계                   |

어드민의 원본 업로드 파일 다운로드, 약관 동의 이력, 가입/최근 접속 일시, 미저장 결과·삭제 기록 복구는 현재 API 범위 밖이며 별도 계약이 필요하다.

## 분석 수집

코드 → `window.dataLayer` → GTM → GA4 흐름이다. 이벤트·파라미터의 원본은 [analyticsEvents.ts](apps/web/src/constants/analyticsEvents.ts), 전송 로직은 [analytics.ts](apps/web/src/lib/analytics.ts)다.

1. 팀 GA4 속성과 GTM 컨테이너를 준비하고 [gtm-container.json](docs/analytics/gtm-container.json)을 검토해 가져온다. 측정 ID를 실제 속성과 맞추고 `NEXT_PUBLIC_GTM_ID` 반영 후 재빌드한다. 이 파일의 실제 GTM 가져오기 성공은 별도 확인이 필요하다.
2. 앱이 `page_view`를 직접 보내므로 Google 태그의 `send_page_view=false`와 GA4의 브라우저 기록 기반 자동 페이지뷰 비활성화를 확인한다. 별도 `gtag.js`를 중복 설치하지 않는다.
3. Tag Assistant·GA4 DebugView에서 페이지 이동, 가입, 견적 생성, 진단 이벤트를 확인한 뒤 게시한다. 이벤트 추가 시 코드 타입·GTM 트리거/변수·필요한 GA4 맞춤 정의를 함께 수정한다.
4. 맞춤 정의는 `position`, `step`, `auth_provider`, `process_count`, `file_count`를 사용한다. 주요 이벤트는 `sign_up`, `estimate_generate_success`, `analysis_submit_success`다. ADMIN의 `traffic_type=internal`과 내부 트래픽 필터를 검증한다.
5. 이메일·전화번호·주소·업체명·자유 의견을 이벤트에 넣지 않는다. URL의 `ticket` 제거 설정, 실제 태그·보관 기간·수집 거부 안내, 팀 관리 권한을 운영 담당자와 확정한다.

## 검사·배포

```bash
pnpm lint
pnpm format:check
pnpm test
pnpm build
pnpm test:e2e:type-check
pnpm exec playwright install chromium
pnpm test:e2e
pnpm test:e2e:admin
```

웹 E2E는 mock API(4000)·웹(3000), 어드민 E2E는 가상 QA(5174)를 사용한다. 기존 서버와 포트 충돌을 피한다. 로컬 Chrome으로 실행하려면 테스트 명령 앞에 `PLAYWRIGHT_CHANNEL=chrome`을 붙인다.

- 10월 10일 검증: 웹 단위 테스트 199개·어드민 53개, 어드민 E2E 2개, 타입·린트·두 앱 빌드 통과. 기존 `ToastProvider.tsx` 린트 경고 1개가 있다.
- 10월 11일: `58a43a3`에서 [Linux 웹 E2E 52개 전체 통과](https://github.com/Muneo-official/Muneo-FE/actions/runs/38066967351). 자동 테스트는 mock 데이터 검증이며 실제 DB QA를 대신하지 않는다.
- 시각 회귀 기준은 `e2e/visual.spec.ts-snapshots/`의 Linux 이미지다. 의도한 UI 변경은 CI의 expected/actual/diff를 대조한 뒤 Linux 캡처로 갱신한다. 같은 환경의 재생성 명령은 `pnpm test:e2e:update e2e/visual.spec.ts`. macOS 이미지로 덮어쓰거나 허용치를 높여 통과시키지 않는다.
- `main` 푸시는 웹 운영 배포와 E2E를 각각 실행한다. E2E 통과 여부와 배포 성공 여부는 별도로 확인한다. 어드민의 실제 운영 배포 주소는 FE/infra 확인이 필요하다.
