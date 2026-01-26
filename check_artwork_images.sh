#!/bin/bash
# 작품 이미지 파일 검증 스크립트

echo "🎨 작품 이미지 파일 검증 중..."
echo ""

cd "$(dirname "$0")/images/artworks"

# 문제가 있는 파일 확인
problem_files=0

for file in *.jpg; do
    file_type=$(file "$file" | cut -d: -f2)
    
    if echo "$file_type" | grep -q "HTML document"; then
        echo "❌ $file - HTML 문서 (이미지 파일로 교체 필요)"
        problem_files=$((problem_files + 1))
    elif echo "$file_type" | grep -q "JPEG\|PNG\|WebP\|RIFF"; then
        echo "✅ $file - 정상 이미지 파일"
    else
        echo "⚠️  $file - 알 수 없는 형식: $file_type"
        problem_files=$((problem_files + 1))
    fi
done

echo ""
if [ $problem_files -eq 0 ]; then
    echo "🎉 모든 이미지 파일이 정상입니다!"
else
    echo "⚠️  $problem_files 개의 파일에 문제가 있습니다."
fi
