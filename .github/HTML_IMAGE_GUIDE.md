# HTML 이미지 작업 가이드

## ⚠️ 반드시 지켜야 할 규칙

### 1. 스마트 따옴표 절대 금지
**문제**: HTML에 스마트 따옴표(" " ' ')를 사용하면 브라우저가 URL을 인식하지 못해 이미지 로딩 실패

**원인**: 
- 복사/붙여넣기로 이미지 경로 작성 시 자동으로 스마트 따옴표가 삽입됨
- 마크다운이나 워드 등에서 복사한 텍스트

**해결책**:
```html
<!-- ❌ 잘못된 예 -->
<img src="../images/project.png" alt="설명">

<!-- ✅ 올바른 예 -->
<img src="../images/project.png" alt="설명">
```

**검증 방법**:
```bash
# 스마트 따옴표 체크
grep -o '"' *.html | wc -l

# 스마트 따옴표 일괄 수정
LC_ALL=C sed -i.bak "s/\xe2\x80\x9c/\"/g; s/\xe2\x80\x9d/\"/g" *.html
```

### 2. 이미지 파일 권한 설정

**문제**: 파일 권한이 600 (rw-------)이면 HTTP 서버가 읽을 수 없어 403 에러 발생

**해결책**:
```bash
# 이미지 추가 후 반드시 권한 설정
chmod 644 images/**/*.png
chmod 644 images/**/*.jpg

# 확인
ls -la images/projects/*/
```

### 3. 배포 전 체크리스트

1. **로컬 테스트**
   ```bash
   python3 -m http.server 8000
   # http://localhost:8000 에서 이미지 로딩 확인
   ```

2. **브라우저 개발자 도구 확인**
   - Network 탭에서 404 에러 없는지 확인
   - Console 탭에서 에러 없는지 확인

3. **HTML 검증**
   ```bash
   # 스마트 따옴표 체크
   grep '"' projects/*.html
   
   # 이미지 경로 검증
   grep -o 'src="[^"]*"' projects/*.html
   ```

4. **이미지 파일 존재 여부**
   ```bash
   # HTML에서 참조하는 모든 이미지가 실제로 존재하는지 확인
   for img in $(grep -oh 'src="[^"]*\.(png|jpg)"' projects/*.html | cut -d'"' -f2); do
       [ -f "projects/$img" ] || echo "Missing: $img"
   done
   ```

## 이번 실수 사례

### 발생한 문제
1. 이미지 파일에 스마트 따옴표 사용 → 404 에러
2. 복사한 이미지 파일 권한이 600 → 403 에러

### 재발 방지
- HTML 파일 작성 시 항상 일반 따옴표만 사용
- 이미지 파일 추가 후 `chmod 644` 실행
- 배포 전 로컬 서버로 테스트
