# 백엔드 전달용: 사용자별 어드민 이용 내역 조회

2026-10-07. **아래는 프론트에 구현한 계약안이며 배포된 API 존재를 확인한 명세가 아니다.** 실제 필드/경로 변경 시 `apps/admin/src/api/activity/`도 맞춰야 한다.

## 요청 요약

현재 어드민은 계정 정보만 조회합니다. 사용자 상세에서 저장된 예상 견적·견적서 진단·진단 피드백을 확인하도록 아래 관리자 전용 GET API 3개가 필요합니다.

| 메서드·경로                                     | 데이터                                  |
| ----------------------------------------------- | --------------------------------------- |
| `GET /api/v1/admin/users/{userId}/estimates`    | 사용자별 저장 예상 견적 입력/결과       |
| `GET /api/v1/admin/users/{userId}/risk-reports` | 사용자별 저장 견적서 진단 입력/결과     |
| `GET /api/v1/admin/users/{userId}/feedback`     | 진단 good/bad·선택 이유·500자 이내 의견 |

공통 쿼리: `page=0&size=10` (0부터 시작, 현재 UI는 10건씩). 최신 생성일 내림차순 + ID를 보조 정렬 기준으로 사용해 중복/누락 없는 페이지를 반환해 주세요. 사용자 계정이 존재하며 저장 기록만 없는 경우에만 정상 0건을 반환합니다. 페이지 조회 및 total count는 같은 필터와 일관된 데이터 기준을 사용해야 합니다.

공통 응답은 기존 어드민 envelope + PagedResult입니다.

```json
{
  "success": true,
  "status": 200,
  "code": "SUCCESS",
  "timestamp": "2026-10-07T00:00:00Z",
  "message": "조회 성공",
  "result": {
    "content": [],
    "page": 0,
    "size": 10,
    "totalElements": 0,
    "totalPages": 0,
    "first": true,
    "last": true
  }
}
```

기록이 있을 경우 `content` 각 항목은 아래 형식입니다. `totalPages = ceil(totalElements / size)`. 빈 전체 결과의 first/last는 모두 true입니다. 페이지 범위를 벗어나면 빈 content, 실제 total, last=true를 반환할 수 있습니다. 형식/페이지/소유자가 어긋나면 프론트는 오류 안내 후 내용을 표시하지 않습니다.

예상 견적·진단:

```json
{
  "id": "saved-record-id",
  "user_id": "101",
  "created_at": "2026-10-07T00:00:00Z",
  "input": {},
  "result": {}
}
```

- `input`, `result`는 현재 저장된 스냅샷 전체. 예상 견적의 `총_견적_범위` 등 기존 한국어 필드, 진단의 `result.report`를 유지해 주세요. 객체 내용은 위 예시의 빈 값 대신 실제 저장값을 반환합니다.
- ID는 문자열, 사용자 ID는 문자열(숫자도 수용), 날짜는 Z 또는 UTC offset이 포함된 ISO 8601 문자열입니다. Mongo `_id`는 `id`로 직렬화합니다.
- 요약은 UI에서 읽기 쉽게 표시하고, 저장된 결과 전체를 별도로 펼쳐볼 수 있게 구현했습니다. 원본 파일 바이트, 비밀번호, 토큰, 내부 인증키는 이 응답에 넣지 않습니다.

진단 피드백:

```json
{
  "id": "feedback-id",
  "user_id": "101",
  "report_id": "saved-report-id",
  "schema_version": 1,
  "rating": "good",
  "reasons": ["found_risks", "useful_questions"],
  "comment": "업체에 확인할 내용을 정리할 수 있었어요.",
  "created_at": "2026-10-07T00:00:00Z",
  "updated_at": "2026-10-07T00:05:00Z"
}
```

피드백 저장 API는 별도 [기존 요청문](./backend-request.md)·[계약 제안](./backend-contract.md)의 `PUT /api/v1/risk-detector/{reportId}/feedback`과 연결해 주세요. 최초 생성일은 유지하고 수정일만 갱신합니다. 사용자+진단당 최종 평가 1개를 조회합니다. **항목별 실제 문제 여부, item_reviews는 요청 범위에서 제외**합니다.

## 서버 구현 및 권한 확인

로컬 소스에서 확인한 연결 지점:

- `../Muneo-Server/.../domain/user/controller/AdminUserController.java`: 계정 목록·상세·수정만 제공.
- `../Muneo-Server/.../domain/ai/controller/AiController.java` 및 `AiServiceImpl.java`: 기존 이력 GET은 인증 주체 본인 ID로 조회. 관리자가 선택한 다른 사용자 조회 용도로 재사용하면 안 됩니다.
- `../Muneo-Server/.../domain/ai/repository/AiApiRepositoryImpl.java`: Spring → AI 서비스 요청 연결 지점. 관리자 인증 후 서버에서 대상 userId를 전달해야 합니다.
- `../AI/estimate/estimate_service.py`, `../AI/risk_detector/report_service.py`: `user_id` 기반 Mongo 저장/조회. 현재 목록은 최대 100건으로 제한됩니다. 이 함수를 그대로 재사용하면 전체 건수·페이지가 정확하지 않으므로 대상 사용자 필터 + count + skip/limit 등 실제 페이지 조회가 필요합니다.

위 Java 파일 경로의 `...`는 `src/main/java/com/example/muneoserver`입니다. 소스 기준 조사이며 개발 서버의 현재 배포 버전은 별도 확인해야 합니다.

1. ADMIN 권한을 서버에서 검증하고 URL의 대상 사용자 존재 여부를 확인합니다. 일반 사용자 403, 미인증 401, 없는 사용자 404, 서버 장애 5xx로 구분합니다. 장애를 빈 배열 200으로 반환하지 않습니다.
2. AI 저장소 user_id와 Spring 사용자 ID가 같은 식별자인지 확인합니다. 프론트가 조작 가능한 헤더만으로 관리자 조회 권한을 허용하지 않습니다. AI 저장소 조회는 인증된 내부 경로에서 처리합니다.
3. 응답은 개인화된 관리자 데이터이므로 `Cache-Control: no-store`. 운영 시 관리자 ID·대상 사용자 ID·시각·조회 종류 중심 감사 기록을 권장하며 원문 의견·토큰은 일반 로그에 남기지 않습니다.
4. 관리자 계정 정보에 가입/수정/최근 접속 시간을 추가할 경우 실제 수집되는 필드와 nullable 규칙부터 합의합니다. 임의로 생성한 시각을 기록처럼 반환하지 않습니다.
5. 약관 동의 이력은 별도의 동의 수집·버전 저장 구현이 먼저 필요합니다. 파일 조회는 보관 정책·관리자 다운로드 권한·만료 링크까지 별도 설계가 필요합니다.

백엔드 배포 후 [실제 데이터 QA 순서](./admin-qa.md#2-실제-서버-데이터-확인)에 따라 웹 저장 → 어드민 조회 → 다른 사용자 격리 → 평가 수정 반영을 확인해 주세요.
