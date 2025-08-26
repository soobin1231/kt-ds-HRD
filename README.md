# HR 교육자료 관리 시스템 - Frontend

Vue.js 3 + TypeScript + Tailwind CSS로 구축된 HR 교육자료 관리 시스템의 프론트엔드입니다.

## 🚀 시작하기

### 필요 조건
- Node.js 18+ 
- npm 또는 yarn

### 설치 및 실행
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── MaterialCard.vue    # 교육자료 카드
│   └── SearchBar.vue       # 검색바
├── views/              # 페이지 컴포넌트
│   ├── HomeView.vue        # 홈페이지
│   ├── MaterialsView.vue   # 교육자료 목록
│   ├── MaterialDetailView.vue # 교육자료 상세
│   ├── AdminView.vue       # 관리자 페이지
│   └── NotFoundView.vue    # 404 페이지
├── stores/             # Pinia 상태 관리
│   ├── materials.ts        # 교육자료 상태
│   └── categories.ts       # 카테고리 상태
├── services/           # API 통신
│   └── api.ts             # API 클라이언트
├── types/              # TypeScript 타입 정의
│   ├── material.ts        # 교육자료 타입
│   └── category.ts        # 카테고리 타입
├── utils/              # 유틸리티 함수
│   └── format.ts          # 포맷팅 함수
├── router/             # Vue Router 설정
│   └── index.ts
├── App.vue             # 메인 앱 컴포넌트
├── main.ts             # 앱 진입점
└── style.css           # 전역 스타일
```

## ✨ 주요 기능

### 🏠 홈페이지
- 시스템 소개 및 주요 기능 안내
- 추천 교육자료 섹션
- 빠른 검색 기능

### 📚 교육자료 관리
- 교육자료 목록 조회 (무한 스크롤)
- 카테고리별 필터링
- 제목/내용/태그 기반 검색
- 정렬 기능 (최신순, 다운로드순, 조회순 등)
- 그리드/리스트 뷰 전환

### 📄 교육자료 상세
- 상세 정보 및 통계 표시
- 파일 다운로드
- 관련 자료 추천
- 태그 기반 검색

### ⚙️ 관리자 기능
- 교육자료 업로드 (드래그앤드롭 지원)
- 통계 대시보드
- 최근 업로드 자료 관리

## 🎨 디자인 시스템

### Tailwind CSS 커스텀 컴포넌트
```css
.btn-primary        # 주요 버튼
.btn-secondary      # 보조 버튼  
.btn-outline        # 외곽선 버튼
.card              # 카드 컨테이너
.input             # 입력 필드
```

### 색상 팔레트
- Primary: Blue 600 (#2563eb)
- Gray scale: 50-900
- Status colors: Green, Yellow, Red

## 🔧 기술 스택

- **Vue.js 3** - Composition API 사용
- **TypeScript** - 타입 안전성
- **Pinia** - 상태 관리
- **Vue Router** - 라우팅  
- **Axios** - HTTP 클라이언트
- **Tailwind CSS** - 유틸리티 우선 CSS
- **Vite** - 빌드 도구

## 📱 반응형 디자인

- **Mobile First** 접근법
- **Breakpoints**: sm(640px), md(768px), lg(1024px), xl(1280px)
- 모든 디바이스에서 최적화된 사용자 경험

## 🔌 API 연동

백엔드 API와의 통신을 위한 설정:

```typescript
// .env.local
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_TITLE=HR 교육자료 관리 시스템
```

### API 엔드포인트
- `GET /api/materials` - 교육자료 목록
- `GET /api/materials/:id` - 교육자료 상세
- `GET /api/materials/:id/download` - 파일 다운로드  
- `POST /api/materials` - 교육자료 업로드
- `GET /api/categories` - 카테고리 목록

## 🚢 배포

### 환경 변수 설정
```bash
# 프로덕션 환경
VITE_API_BASE_URL=https://api.yourcompany.com
VITE_APP_TITLE=HR 교육자료 관리 시스템
```

### 빌드 및 배포
```bash
# 프로덕션 빌드
npm run build

# dist/ 폴더를 웹 서버에 배포
```

## 🔄 개발 워크플로우

1. **개발 서버 실행**: `npm run dev`
2. **코드 작성**: TypeScript + Vue 3 Composition API
3. **스타일링**: Tailwind CSS 클래스 사용
4. **상태 관리**: Pinia 스토어 활용
5. **타입 체크**: `npm run build`로 TypeScript 검증

## 📝 향후 계획

- [ ] PWA 지원 (오프라인 접근)
- [ ] 다크 모드 지원
- [ ] 다국어 지원 (i18n)
- [ ] 무한 스크롤 성능 최적화
- [ ] 고급 검색 필터
- [ ] 실시간 알림 시스템

---

**Made with ❤️ using Vue.js 3 + TypeScript**