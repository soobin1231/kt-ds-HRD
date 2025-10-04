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
│   ├── DocumentChunksModal.vue # 문서 청크 모달
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
│   ├── api.ts              # API 클라이언트 (hrBackendApi + chatbotApi)
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

### 🤖 AI 기능 (Chatbot Service 연동)
- **EduBot**: AI 채팅봇으로 교육 관련 질문 답변 (포트 8001)
- **문서 분석**: 워드, PDF, PPT, XLSX 문서 업로드 및 분석
- **벡터 데이터베이스**: Qdrant 기반 문서 임베딩 및 의미 검색 기능
- **문서 청킹**: 문서를 의미있는 단위로 분할하여 처리
- **임베딩 관리**: OpenAI API를 통한 벡터 임베딩 생성 및 관리
- **실시간 처리**: 문서 업로드부터 임베딩 생성까지 실시간 상태 추적

### 📰 교육뉴스 관리
- 교육 관련 뉴스 등록 및 관리
- 우선순위별 뉴스 표시 (High, Medium, Low)
- 미려한 글래스 효과 UI

### 🗃️ 벡터 DB 관리 (Chatbot Service)
- 벡터 데이터베이스 대시보드 (Qdrant 연동)
- 문서 임베딩 관리 및 상태 모니터링
- 청킹 설정 및 미리보기 기능
- 벡터 문서 테이블 관리
- 실시간 임베딩 생성 진행률 추적

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

## 🏗️ 시스템 아키텍처

### 전체 구조도
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   hr-front      │    │   hr-backend    │    │hr-chatbot-service│
│   (Vue.js 3)    │◄──►│   (포트 8000)   │    │   (포트 8001)   │
│                 │    │                 │    │                 │
│ - 교육자료 관리   │    │ - 메타데이터 관리 │    │ - AI 채팅봇      │
│ - 교육뉴스 관리   │    │ - 파일 업로드    │    │ - 문서 임베딩    │
│ - 교육시스템 관리 │    │ - 카테고리 관리   │    │ - 벡터 DB 관리   │
│ - 벡터 DB 관리   │    │ - 교육뉴스 관리   │    │ - 문서 청킹     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 서비스 분리 이유
- **관심사 분리**: 메타데이터 관리와 AI 기능을 독립적으로 개발/배포
- **확장성**: 각 서비스를 독립적으로 스케일링 가능
- **유지보수성**: 기능별로 명확한 책임 분담
- **기술 스택**: AI 기능은 별도의 기술 스택(Qdrant, OpenAI) 사용

### API 통신 흐름
1. **교육자료 관리**: Frontend → HR Backend (8000)
2. **AI 기능**: Frontend → Chatbot Service (8001)
3. **벡터 검색**: Frontend → Chatbot Service (8001) → Qdrant
4. **문서 분석**: Frontend → Chatbot Service (8001) → OpenAI API

## 🔌 API 연동

### 백엔드 아키텍처
프론트엔드는 두 개의 독립적인 백엔드 서비스와 통신합니다:

#### 📊 HR Backend (포트 8000) - 메타데이터 관리
- **역할**: 교육자료, 카테고리, 교육뉴스, 교육시스템 관리
- **API 클라이언트**: `hrBackendApi`
- **주요 기능**:
  - 교육자료 CRUD 작업
  - 카테고리 관리
  - 교육뉴스 관리
  - 교육시스템 관리
  - 파일 업로드/다운로드

#### 🤖 Chatbot Service (포트 8001) - AI 및 벡터 관리
- **역할**: AI 채팅봇, 문서 임베딩, 벡터 데이터베이스 관리
- **API 클라이언트**: `chatbotApi`
- **주요 기능**:
  - 문서 분석 및 청킹
  - 임베딩 생성 및 관리
  - 벡터 데이터베이스 조작
  - AI 채팅봇 서비스

### API 엔드포인트

#### HR Backend API (8000포트)
```
GET    /api/materials              # 교육자료 목록
GET    /api/materials/:id         # 교육자료 상세
GET    /api/materials/:id/download # 파일 다운로드
POST   /api/materials              # 교육자료 업로드
PUT    /api/materials/:id          # 교육자료 수정
DELETE /api/materials/:id          # 교육자료 삭제

GET    /api/categories            # 카테고리 목록
GET    /api/categories/:id        # 카테고리 상세

GET    /api/education-news        # 교육뉴스 목록
POST   /api/education-news        # 교육뉴스 생성
PUT    /api/education-news/:id    # 교육뉴스 수정
DELETE /api/education-news/:id    # 교육뉴스 삭제

POST   /api/education-systems/upload-excel # 엑셀 업로드
POST   /api/education-systems/bulk-create   # 일괄 생성
```

#### Chatbot Service API (8001포트)
```
POST   /api/embedding/upload-xlsx     # XLSX 파일 임베딩
POST   /api/embedding/upload-text     # 텍스트 파일 임베딩
POST   /api/embedding/preview-xlsx    # XLSX 청킹 미리보기
POST   /api/embedding/preview-text    # 텍스트 청킹 미리보기
GET    /api/embedding/status/:fileId  # 처리 상태 조회
DELETE /api/embedding/:fileId         # 임베딩 삭제

GET    /api/embedding/documents       # 벡터 문서 목록
GET    /api/embedding/vdb-status      # 벡터 DB 상태
DELETE /api/embedding/documents/:id   # 벡터 문서 삭제
GET    /api/embedding/documents/:id/chunks # 문서 청크 조회

POST   /api/chat                      # AI 채팅봇 대화
GET    /api/health                    # 서비스 상태 확인
```

## 🚢 배포

### 환경 변수 설정
```bash
# HR Backend (메타데이터 관리)
VITE_HR_BACKEND_URL=http://localhost:8000

# Chatbot Service (AI 및 벡터 관리)
VITE_CHATBOT_API_URL=http://localhost:8001

# 앱 설정
VITE_APP_TITLE=DS University HR 교육 플랫폼
```

### 백엔드 서비스 실행
프론트엔드가 정상 작동하려면 두 개의 백엔드 서비스가 모두 실행되어야 합니다:

```bash
# HR Backend 실행 (포트 8000)
cd hr-backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Chatbot Service 실행 (포트 8001)
cd hr-chatbot-service
python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

### 빌드 및 배포
```bash
# 프로덕션 빌드
npm run build

# dist/ 폴더를 웹 서버에 배포
```

## 🔄 개발 워크플로우

### 전체 시스템 실행 순서
1. **백엔드 서비스 실행**:
   ```bash
   # HR Backend (포트 8000) - 메타데이터 관리
   cd hr-backend && python -m uvicorn app.main:app --port 8000 --reload
   
   # Chatbot Service (포트 8001) - AI 및 벡터 관리  
   cd hr-chatbot-service && python -m uvicorn app.main:app --port 8001 --reload
   ```

2. **프론트엔드 개발 서버 실행**: `npm run dev`

3. **개발 작업**:
   - TypeScript + Vue 3 Composition API로 코드 작성
   - Tailwind CSS 클래스 사용하여 스타일링
   - Pinia 스토어를 활용한 상태 관리
   - `hrBackendApi` (8000포트) 또는 `chatbotApi` (8001포트) 사용

4. **타입 체크**: `npm run build`로 TypeScript 검증

## 📝 향후 계획

### 🚀 단기 목표 (v1.1)
- [x] 백엔드 API 연동 완성 (HR Backend + Chatbot Service)
- [x] 문서 분석 성능 최적화
- [x] 벡터 검색 정확도 향상
- [x] 교육뉴스 관리 기능 확장
- [ ] 사용자 권한 관리 시스템
- [ ] 챗봇 대화 이력 저장

### 🔮 중기 목표 (v1.2-1.3)
- [ ] **실시간 AI 채팅**: 대화형 EduBot 고도화
- [ ] **고급 문서 처리**: 더 많은 파일 형식 지원 (Excel, 한글 문서 등)
- [ ] **스마트 추천 시스템**: AI 기반 교육자료 추천
- [ ] **학습 진도 관리**: 개인별 학습 상태 추적

---

**Made with ❤️ using Vue.js 3 + TypeScript**