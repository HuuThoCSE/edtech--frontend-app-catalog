import { useState } from 'react';
import { Container } from '@openedx/paragon';

/**
 * Original theme has only skeleton/placeholder news, no backend feed.
 * Replace NEWS with real editorial records after a news data source exists.
 */
/**
 * Điền các bài viết ĐÃ CÔNG BỐ vào mảng bên dưới khi có nguồn tin xác thực.
 * Tuyệt đối không đưa thông tin giả hoặc liên kết mẫu lên website công khai.
 * Ví dụ cấu trúc: { id: 'tin-1', title: '...', summary: '...', url: 'https://...', imageUrl: 'https://...' }
 */
const NEWS: { id: string; title: string; summary: string; url: string; imageUrl?: string }[] = [];

const CuscNews = () => {
  const [expanded, setExpanded] = useState(true);

  return (
    <section className="cusc-news" aria-labelledby="cusc-news-title">
      <Container size="xl">
        <div className="cusc-section-heading">
          <div>
            {/* <span className="cusc-section-heading__eyebrow">THÔNG TIN MỚI</span> */}
            <h2 id="cusc-news-title">Tin tức đáng chú ý</h2>
          </div>
          <button type="button" className="cusc-text-link" aria-expanded={expanded} aria-controls="cusc-news-content" onClick={() => setExpanded(value => !value)}>
            {expanded ? 'Ẩn tin tức ↑' : 'Hiện tin tức ↓'}
          </button>
        </div>
        {expanded && (
          <div id="cusc-news-content">
            {NEWS.length ? (
              <div className="cusc-news__grid">
                {NEWS.map(item => (
                  <article className="cusc-news__card" key={item.id}>
                    {item.imageUrl && <img src={item.imageUrl} alt="" loading="lazy" />}
                    <h3><a href={item.url}>{item.title}</a></h3>
                    <p>{item.summary}</p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="cusc-news__empty">Chưa có tin tức được kết nối.</p>
              // <p className="cusc-news__empty">Chưa có tin tức được kết nối. Quản trị viên có thể bổ sung bài viết đã công bố vào CuscNews.tsx.</p>
            )}
          </div>
        )}
      </Container>
    </section>
  );
};

export default CuscNews;
