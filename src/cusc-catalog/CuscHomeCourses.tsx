import { useMemo, useState } from 'react';
import { getConfig } from '@edx/frontend-platform';
import { useNavigate } from 'react-router';
import { Alert, CardGrid, Container } from '@openedx/paragon';
import { useCourseListSearch } from '@src/data/course-list-search/hooks';
import { DEFAULT_PAGE_INDEX } from '@src/data/course-list-search/constants';
import { DEFAULT_COURSES_COUNT } from '@src/home/constants';
import HomeCourseCardSlot from '@src/plugin-slots/HomeCourseCardSlot';
import { ROUTES } from '@src/routes';
import CuscFeaturedCourses from './CuscFeaturedCourses';
import CuscNews from './CuscNews';
import CuscOrganizations from './CuscOrganizations';
import './cusc-catalog.scss';

/**
 * All course records come from Open edX's real Catalog search API.
 * The organization dropdown only filters the homepage batch; it never claims
 * to be a full-platform filter.
 */
const CuscHomeCourses = () => {
  const navigate = useNavigate();
  const [organization, setOrganization] = useState('');
  const configuredMax = Number(getConfig().HOMEPAGE_COURSE_MAX || DEFAULT_COURSES_COUNT);
  const maxCourses = Number.isFinite(configuredMax) && configuredMax > 0 ? Math.min(Math.floor(configuredMax), 24) : 9;
  const { data, isLoading, isError } = useCourseListSearch({
    pageSize: maxCourses,
    pageIndex: DEFAULT_PAGE_INDEX,
    enableCourseSortingByStartDate: Boolean(getConfig().ENABLE_COURSE_SORTING_BY_START_DATE),
  });

  const courses = data?.results || [];
  const orgs = useMemo(
    () => Array.from(new Set(courses.map(course => course.data.org).filter(Boolean))).sort(),
    [courses],
  );
  const visibleCourses = organization ? courses.filter(course => course.data.org === organization) : courses;
  const hasMore = (data?.total || 0) > maxCourses;
  const gridLayout = { xs: 12, md: 6, lg: 4 };

  if (getConfig().NON_BROWSABLE_COURSES) return null;

  return (
    <div className="cusc-catalog cusc-home-main" id="cusc-catalog-courses">
      <section className="cusc-home-courses" aria-labelledby="cusc-courses-title">
        <Container size="xl">
          <div className="cusc-section-heading">
            <div>
              {/* <span className="cusc-section-heading__eyebrow">KHÔNG NGỪNG HỌC HỎI</span> */}
              <h2 id="cusc-courses-title">Danh sách khóa học</h2>
              <p className="cusc-section-heading__intro">Khám phá các khóa học công khai từ Open edX và tìm chương trình phù hợp với bạn.</p>
            </div>
            {!isLoading && !isError && typeof data?.total === 'number' && (
              <span className="cusc-courses-count">{data.total} khóa học</span>
            )}
          </div>

          {orgs.length > 0 && (
            <div className="cusc-filter-bar">
              <div className="cusc-filter-control">
                <label htmlFor="cusc-org-filter">Lọc theo cơ sở đào tạo</label>
                <select
                  id="cusc-org-filter"
                  value={organization}
                  onChange={event => setOrganization(event.target.value)}
                >
                  <option value="">Tất cả đơn vị</option>
                  {orgs.map(org => <option key={org} value={org}>{org}</option>)}
                </select>
              </div>
              <p role="status" className="cusc-filter-count">
                {organization ? `${visibleCourses.length} khóa học phù hợp trong nhóm đang hiển thị` : 'Bộ lọc áp dụng cho các khóa học đang tải trên trang chủ'}
              </p>
            </div>
          )}

          {isLoading && (
            <div className="cusc-course-grid" aria-label="Đang tải các khóa học" aria-busy="true">
              <CardGrid columnSizes={gridLayout}>
                {Array.from({ length: 6 }, (_, index) => (
                  <HomeCourseCardSlot key={`cusc-loading-${index}`} isLoading />
                ))}
              </CardGrid>
            </div>
          )}
          {isError && (
            <Alert variant="danger">Không tải được khóa học. Vui lòng kiểm tra kết nối và thử tải lại trang.</Alert>
          )}
          {!isLoading && !isError && courses.length === 0 && (
            <div className="cusc-empty-state" role="status">
              <div className="cusc-empty-state__icon" aria-hidden="true">▤</div>
              <h3>Chưa có khóa học công khai</h3>
              <p>Khi có khóa học được công bố, danh sách sẽ xuất hiện tại đây.</p>
            </div>
          )}
          {!isLoading && !isError && courses.length > 0 && (
            <>
              {visibleCourses.length ? (
                <div className="cusc-course-grid">
                  <CardGrid columnSizes={gridLayout}>
                    {visibleCourses.map(course => (
                      <HomeCourseCardSlot key={course.id} original={course} />
                    ))}
                  </CardGrid>
                </div>
              ) : (
                <div className="cusc-empty-state" role="status">
                  <h3>Không có khóa học phù hợp</h3>
                  <p>Hãy thử chọn đơn vị đào tạo khác.</p>
                  <button type="button" className="cusc-outline-btn" onClick={() => setOrganization('')}>Xem tất cả đơn vị</button>
                </div>
              )}
              {hasMore && (
                <div className="cusc-view-all">
                  <button type="button" onClick={() => navigate(ROUTES.COURSES)}>
                    Xem toàn bộ khóa học <span aria-hidden="true">→</span>
                  </button>
                </div>
              )}
            </>
          )}
        </Container>
      </section>
      {!isLoading && !isError && <CuscFeaturedCourses courses={visibleCourses} />}
      <CuscNews />
      <CuscOrganizations organizations={orgs} />
      <section className="cusc-benefits" aria-label="Lợi ích học tập">
        <Container size="xl">
          <div className="cusc-benefits__grid">
            <div><span aria-hidden="true">✦</span><strong>Học chủ động</strong><p>Lựa chọn khóa học phù hợp với mục tiêu cá nhân.</p></div>
            <div><span aria-hidden="true">⌘</span><strong>Khám phá kỹ năng</strong><p>Tìm hiểu nhiều chủ đề từ cùng một nền tảng.</p></div>
            <div><span aria-hidden="true">↗</span><strong>Tiến bộ từng bước</strong><p>Tiếp tục hành trình học tập từ bảng điều khiển.</p></div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default CuscHomeCourses;
