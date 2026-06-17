interface VideoPlayerProps {
  videoUrl: string;
}

function getYouTubeEmbedUrl(url: string): string {
  // 이미 임베드 URL인 경우 그대로 반환
  if (url.includes('youtube.com/embed/')) {
    return url;
  }

  // YouTube 비디오 ID 추출
  let videoId = '';
  
  // 다양한 YouTube URL 형식 처리
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      videoId = match[1];
      break;
    }
  }

  // 비디오 ID를 찾은 경우 임베드 URL 반환
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // YouTube URL이 아닌 경우 원본 URL 반환
  return url;
}

export default function VideoPlayer({ videoUrl }: VideoPlayerProps) {
  const embedUrl = getYouTubeEmbedUrl(videoUrl);
  
  return (
    <div className="w-full aspect-video rounded-card overflow-hidden bg-black border border-suwon-blue/10">
      <iframe
        src={embedUrl}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="응원법 안내 영상"
      />
    </div>
  );
}
