import { useState, type FormEvent } from 'react';
import { getConfig } from '@edx/frontend-platform';
import { useNavigate } from 'react-router';
import { ROUTES } from '@src/routes';
import './cusc-catalog.scss';

/**
 * The CUSC home hero only uses frontend-app-catalog's existing router.
 * It does not submit the obsolete Django /courses form.
 */
const CuscHero = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const lmsBaseUrl = String(getConfig().LMS_BASE_URL || 'http://local.openedx.io:8000').replace(/\/$/, '');
  const canExplore = Boolean(getConfig().ENABLE_COURSE_DISCOVERY) && !getConfig().NON_BROWSABLE_COURSES;

  const goToCourses = (search = '') => {
    const params = new URLSearchParams();
    if (search.trim()) params.set('search_query', search.trim());
    navigate(`${ROUTES.COURSES}${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    goToCourses(query);
  };

  return (
    <section className="cusc-catalog cusc-hero" aria-labelledby="cusc-hero-title" data-testid="cusc-home-banner">
      <div className="cusc-hero__glow cusc-hero__glow--one" aria-hidden="true" />
      <div className="cusc-hero__glow cusc-hero__glow--two" aria-hidden="true" />
      <div className="cusc-hero__content">
        {/* <div className="cusc-hero__eyebrow"><span className="cusc-hero__spark" aria-hidden="true" /> NỀN TẢNG HỌC TẬP CTU · CUSC</div> */}
        <div className="cusc-hero__eyebrow">Dành cho học viên và giảng viên</div>
        <h1 id="cusc-hero-title">Khám phá các khóa học<br /><span>và mở rộng tương lai.</span></h1>
        <p className="cusc-hero__lead">
          Học lập trình, dữ liệu, thiết kế và nhiều lĩnh vực khác với lộ trình rõ ràng và nội dung chất lượng cao.
        </p>

        {canExplore && (
          <form className="cusc-hero__search" onSubmit={onSearch} role="search" aria-label="Tìm kiếm khóa học">
            <label className="cusc-visually-hidden" htmlFor="cusc-catalog-search">Từ khóa tìm kiếm khóa học</label>
            <svg className="cusc-hero__search-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="10.8" cy="10.8" r="6.4" /><path d="m16 16 4.5 4.5" />
            </svg>
            <input
              id="cusc-catalog-search"
              type="search"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Bạn muốn học điều gì hôm nay?"
              autoComplete="off"
            />
            <button type="submit" className="cusc-hero__submit">Tìm khóa học <span aria-hidden="true">→</span></button>
          </form>
        )}

        <div className="cusc-hero__bottom">
          {canExplore && (
            <div className="cusc-hero__suggestions" aria-label="Chủ đề gợi ý">
              <span>Chủ đề gợi ý:</span>
              {['Lập trình', 'Thiết kế web', 'Dữ liệu'].map(topic => (
                <button key={topic} type="button" onClick={() => goToCourses(topic)}>{topic}</button>
              ))}
            </div>
          )}
          <a className="cusc-hero__dashboard" href={`${lmsBaseUrl}/dashboard`}>
            {/* Các khóa học của tôi <span aria-hidden="true">↗</span> */}
            Các khóa học của tôi
          </a>
        </div>
      </div>
    </section>
  );
};

export default CuscHero;
