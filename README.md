# 🎓 DS University HR 교육 플랫폼 - Frontend

Vue.js 3 + TypeScript + AI 기술로 구축된 지능형 HR 교육 관리 시스템입니다.  
교육과정 관리, 교육자료 고도화, AI 채팅봇, 벡터 DB 기반 의미검색까지 포함한 차세대 교육 플랫폼입니다.

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
├── components/              # 재사용 가능한 컴포넌트
│   ├── AuroraDemo.vue         # OpenAI Aurora 데모
│   ├── ChunkingSettings.vue  # 문서 청킹 설정
│   ├── ChunkPreview.vue      # 청크 미리보기
│   ├── CourseDetailModal.vue # 과정 상세 모달
│   ├── DeleteConfirmationModal.vue # 삭제 확인 모달
│   ├── DocumentAnalysisForm.vue # 문서 분석 폼
│   ├── EduBot.vue             # AI 교육봇
│   ├── EducationNewsForm.vue  # 교육뉴스 폼
│   ├── GlassCardNews.vue     # 미려한 뉴스 카드
│   ├── MaterialCard.vue      # 교육자료 카드
│   ├── NewsUploadForm.vue    # 뉴스 업로드 폼
│   ├── SearchBar.vue         # 검색바
│   ├── VectorDbDashboard.vue # 벡터DB 대시보드
│   └── VectorDocumentTable.vue # 벡터 문서 테이블
├── views/                # 페이지 컴포넌트
│   ├── AdminView.vue        # 관리자 페이지
│   ├── EducationSystemView.vue # 교육시스템 관리
│   ├── EducationView.vue    # 교육과정 관리
│   ├── EmbeddingView.vue    # 임베딩 관리
│   ├── HomeView.vue         # 홈페이지
│   ├── MaterialDetailView.vue # 교육자료 상세
│   ├── MaterialsView.vue    # 교육자료 목록
│   ├── NotFoundView.vue     # 404 페이지
│   └── VectorManagementView.vue # 벡터 데이터 관리
├── stores/              # Pinia 상태 관리
│   ├── categories.ts        # 카테고리 상태
│   ├── education-news.ts    # 교육뉴스 상태
│   ├── education-system.ts  # 교육시스템 상태
│   ├── education.ts         # 교육과정 상태
│   └── materials.ts         # 교육자료 상태
├── services/            # API 통신
│   ├── api.ts              # API 클라이언트
│   └── dummyData.ts        # 테스트 데이터
├── types/               # TypeScript 타입 정의
│   ├── category.ts         # 카테고리 타입
│   ├── education-news.ts   # 교육뉴스 타입
│   ├── education-system.ts # 교육시스템 타입
│   ├── education.ts        # 교육과정 타입
│   ├── embedding.ts        # 임베딩 타입
 │   └── material.ts        # 교육자료 타입
├── utils/               # 유틸리티 함수
│   ├── documentAnalyzer.ts # 문서 분석기
│   ├── fileParser.ts       # 파일 파서
│   ├── format.ts          # 포맷팅 함수
│   └── wordParser.ts      # 워드 파서
├── router/              # Vue Router 설정
│   └── index.ts
├── App.vue             # 메인 앱 컴포넌트
├── main.ts             # 앱 진입점
└── style.css           # 전역 스타일
```

## ✨ 주요 기능

### 🏠 홈페이지
- 시스템 소개 및 주요 기능 안내
- 교육뉴스 카드 슬라이더
- 빠른 이동 기능 (교육 프로그램, 교육자료, 관리자)

### 📚 교육자료 관리
- 교육자료 목록 조회 및 관리
- 카테고리별 필터링
- 제목/내용/태그 기반 검색
- 상세 정보 및 다운로드

### 🎓 교육과정 관리
- 엑셀 파일 업로드를 통한 교육과정 등록 (.xlsx 지원)
- 대학별 교육과정 분류 (Cloud College, SW College, IA College, AI College)
- 교육과정 상세 정보 및 강의 정보 관리
- 템플릿 파일 다운로드 시스템

### 🤖 AI 기능
- **EduBot**: AI 채팅봇으로 교육 관련 질문 답변
- **문서 분석**: 워드, PDF, PPT 문서 업로드 및 분석
- **벡터 데이터베이스**: 문서 임베딩 및 의미 검색 기능
- **문서 청킹**: 문서를 의미있는 단위로 분할하여 처리

### 📰 교육뉴스 관리
- 교육 관련 뉴스 등록 및 관리
- 우선순위별 뉴스 표시 (High, Medium, Low)
- 미려한 글래스 효과 UI

### 🗃️ 벡터 DB 관리
- 벡터 데이터베이스 대시보드
- 문서 임베딩 관리
- 청킹 설정 및 미리보기 기능
- 벡터 문서 테이블 관리

### ⚙️ 관리자 기능
- 교육자료 업로드 및 관리
- 통계大시보드
- 문서 분석 및 처리

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

- **Frontend Framework**: Vue.js 3 (Composition API)
- **Language**: TypeScript (타입 안전성)
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **HTTP Client**: Axios
- **UI Framework**: Tailwind CSS (유틸리티 우선 CSS)
- **Build Tool**: Vite 5
- **File Processing**: 
  - `xlsx` - 엑셀 파일 처리
  - `mammoth` - Word 문서 처리
  - `pptx2json` - PowerPoint 파일 처리
- **Icons**: Lucide Vue Next
- **Date Handling**: Day.js
- **Additional**: @VueUse/core (Vue Composition API 유틸리티)

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

### 🚀 단기 목표 (v1.1)
- [ ] 백엔드 API 연동 완성
- [ ] 문서 분석 성능 최적화
- [ ] 벡터 검색 정확도 향상
- [ ] 교육뉴스 관리 기능 확장
- [ ] 사용자 권한 관리 시스템

### 🔮 중기 목표 (v1.2-1.3)
- [ ] **실시간 AI 채팅**: 대화형 EduBot 고도화
- [ ] **고급 문서 처리**: 더 많은 파일 형식 지원 (Excel, 한글 문서 등)
- [ ] **스마트 추천 시스템**: AI 기반 교육자료 추천
- [ ] **학습 진도 관리**: 개인별 학습 상태 추적
- [ ] **모바일 앱**: React Native 또는 Vue Native 버전

### 🌟 장기 목표 (v2.0+)
- [ ] **다국어 지원**: i18n을 통한 글로벌 확장
- [ ] **PWA 지원**: 오프라인 접근 및 설치형 앱
- [ ] **다크 모드**: 사용자 경험 개선
- [ ] **음성 인식**: 음성으로 교육자료 검색 및 채팅
- [ ] **AR/VR 지원**: 가상교육 콘텐츠 연동

---

**Made with ❤️ using Vue.js 3 + TypeScript**