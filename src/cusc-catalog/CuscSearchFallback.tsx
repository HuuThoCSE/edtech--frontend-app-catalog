import { CardGrid } from '@openedx/paragon';
import { useCourseListSearch } from '../data/course-list-search/hooks';
import HomeCourseCardSlot from '../plugin-slots/HomeCourseCardSlot';
import './cusc-search-fallback.scss';

type Props = {
  searchString: string;
  onReset: () => void;
};

/**
 * Used only when a Catalog search has zero matches.
 * Recommendations are fetched without searchString, so they are REAL
 * public courses and are not falsely labeled as matching the query.
 * The normal Catalog search field stays mounted above this component.
 */
const CuscSearchFallback = ({ searchString, onReset }: Props) => {
  const { data, isLoading, isError } = useCourseListSearch({
    pageSize: 9,
    pageIndex: 0,
    searchString: '',
  });
  const suggestions = data?.results || [];

  return (
    <section className="cusc-search-fallback" aria-labelledby="cusc-search-fallback-title">
      <div className="cusc-search-fallback__notice" role="status">
        <span className="cusc-search-fallback__symbol" aria-hidden="true">🔍</span>
        <div className="cusc-search-fallback__message">
          <h2 id="cusc-search-fallback-title">
            Không tìm thấy khóa học phù hợp với “{searchString}”
          </h2>
          <p>
            Bạn có thể nhập từ khóa khác trong ô tìm kiếm phía trên,
            hoặc khám phá các khóa học hiện có bên dưới.
          </p>
          <button type="button" className="cusc-search-fallback__reset" onClick={onReset}>
            Xem tất cả khóa học
            <span aria-hidden="true"> →</span>
          </button>
        </div>
      </div>

      <div className="cusc-search-fallback__list" aria-label="Suggested public courses">
        <div className="cusc-search-fallback__heading">
          <div>
            <span className="cusc-search-fallback__eyebrow">GỢI Ý CHO BẠN</span>
            <h3>Các khóa học khác bạn có thể quan tâm</h3>
          </div>
          {!isLoading && !isError && suggestions.length > 0 && (
            <span className="cusc-search-fallback__count">{suggestions.length} khóa học gợi ý</span>
          )}
        </div>
        {isLoading && <p role="status">Đang tải các khóa học gợi ý...</p>}
        {isError && <p role="alert">Không tải được danh sách gợi ý. Bạn hãy thử tìm lại.</p>}
        {!isLoading && !isError && suggestions.length === 0 && (
          <p>Hiện chưa có khóa học công khai để gợi ý.</p>
        )}
        {!isLoading && !isError && suggestions.length > 0 && (
          <div className="cusc-search-fallback__cards">
            <CardGrid columnSizes={{ xs: 12, md: 6, lg: 4 }}>
              {suggestions.map(course => (
                <HomeCourseCardSlot key={course.id} original={course} />
              ))}
            </CardGrid>
          </div>
        )}
      </div>
    </section>
  );
};

export default CuscSearchFallback;
