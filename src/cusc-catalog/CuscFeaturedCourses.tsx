
import { useEffect, useMemo, useState } from 'react';
import { CardGrid, Container } from '@openedx/paragon';
import { getConfig } from '@edx/frontend-platform';
import {
  getAuthenticatedHttpClient,
  getAuthenticatedUser,
} from '@edx/frontend-platform/auth';

import type { CourseListSearchResponse } from '@src/data/course-list-search/types';
import HomeCourseCardSlot from '@src/plugin-slots/HomeCourseCardSlot';

type Course = CourseListSearchResponse['results'][number];

type Props = {
  courses: Course[];
};

type Status = 'all' | 'upcoming' | 'started' | 'learning';

type LearningState =
  | 'idle'
  | 'guest'
  | 'loading'
  | 'ready'
  | 'error';

type Enrollment = {
  course_id?: string;
  is_active?: boolean;
  course_details?: {
    course_id?: string;
  };
};

const tabs: { value: Status; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'upcoming', label: 'Sắp bắt đầu' },
  { value: 'started', label: 'Đã bắt đầu' },
  { value: 'learning', label: 'Đang học' },
];

const CuscFeaturedCourses = ({ courses }: Props) => {
  const [status, setStatus] = useState<Status>('all');

  const [learningCourseIds, setLearningCourseIds] = useState<string[]>([]);

  const [learningState, setLearningState] =
    useState<LearningState>('idle');

  // Chỉ tải danh sách ghi danh khi người dùng chọn "Đang học".
  useEffect(() => {
    if (status !== 'learning') return undefined;

    let cancelled = false;

    const loadEnrollments = async () => {
      const user = getAuthenticatedUser();

      if (!user) {
        setLearningCourseIds([]);
        setLearningState('guest');
        return;
      }

      setLearningState('loading');

      try {
        const url = `${getConfig().LMS_BASE_URL}/api/enrollment/v1/enrollment`;

        const response = await getAuthenticatedHttpClient().get(url);

        const payload = response.data as
          | Enrollment[]
          | { results?: Enrollment[] };

        const enrollments = Array.isArray(payload)
          ? payload
          : (payload.results ?? []);

        const ids = enrollments
          .filter(enrollment => enrollment.is_active !== false)
          .map(enrollment =>
            enrollment.course_details?.course_id
            ?? enrollment.course_id
            ?? ''
          )
          .filter(Boolean);

        if (!cancelled) {
          setLearningCourseIds(ids);
          setLearningState('ready');
        }
      } catch (error) {
        console.error('Không tải được danh sách đang học:', error);

        if (!cancelled) {
          setLearningCourseIds([]);
          setLearningState('error');
        }
      }
    };

    loadEnrollments();

    return () => {
      cancelled = true;
    };
  }, [status]);

  const featured = useMemo(() => {
    const now = Date.now();
    const enrolledIds = new Set(learningCourseIds);

    return courses.filter(course => {
      const start = course.data.start
        ? Date.parse(course.data.start)
        : NaN;

      switch (status) {
        case 'upcoming':
          return !Number.isNaN(start) && start > now;

        case 'started':
          return !Number.isNaN(start) && start <= now;

        case 'learning': {
          const courseIds = [
            course.id,
            course.data.id,
            course.data.course,
          ];

          const enrolled = courseIds.some(id => enrolledIds.has(id));

          // Không tính khóa chưa khai giảng là "đang học".
          const started = Number.isNaN(start) || start <= now;

          return enrolled && started;
        }

        case 'all':
        default:
          return true;
      }
    }).slice(0, 3);
  }, [courses, status, learningCourseIds]);

  if (courses.length === 0) return null;

  const isLearningLoading =
    status === 'learning' &&
    (learningState === 'loading' || learningState === 'idle');

  const showCourses = !isLearningLoading
    && status !== 'learning'
      ? true
      : status === 'learning' && learningState === 'ready';

  return (
    <section
      className="cusc-featured"
      aria-labelledby="cusc-featured-title"
    >
      <Container size="xl">
        <div className="cusc-section-heading">
          <div>
            <h2 id="cusc-featured-title">
              Khóa học nổi bật
            </h2>

            <p className="cusc-section-heading__intro">
              Khám phá các khóa học và lọc theo trạng thái.
            </p>
          </div>
        </div>

        <div
          className="cusc-tabs"
          role="group"
          aria-label="Lọc khóa học"
        >
          {tabs.map(tab => (
            <button
              key={tab.value}
              type="button"
              className={
                `cusc-tab${status === tab.value ? ' cusc-tab--active' : ''}`
              }
              aria-pressed={status === tab.value}
              onClick={() => setStatus(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {status === 'learning' && learningState === 'guest' && (
          <p role="status">
            Vui lòng đăng nhập để xem các khóa học bạn đang học.
          </p>
        )}

        {isLearningLoading && (
          <p role="status">
            Đang tải danh sách khóa học của bạn...
          </p>
        )}

        {status === 'learning' && learningState === 'error' && (
          <p role="alert">
            Không thể tải danh sách đang học. Vui lòng thử lại.
          </p>
        )}

        {showCourses && (
          featured.length > 0 ? (
            <div className="cusc-course-grid">
              <CardGrid columnSizes={{
                xs: 12,
                md: 6,
                lg: 4,
                xl: 3,
              }}
              >
                {featured.map(course => (
                  <HomeCourseCardSlot
                    key={`featured-${course.id}`}
                    original={course}
                  />
                ))}
              </CardGrid>
            </div>
          ) : (
            <p role="status">
              {status === 'learning'
                ? 'Không có khóa học đang học trong danh sách được hiển thị.'
                : 'Không có khóa học phù hợp với bộ lọc đang chọn.'}
            </p>
          )
        )}

        <p className="cusc-note">
          {status === 'learning'
            ? 'Hiển thị các khóa học đã ghi danh, đã bắt đầu và có trong danh sách Catalog hiện tại.'
            : 'Các khóa học được giới thiệu từ danh sách công khai, không phải xếp hạng theo lượt đăng ký.'}
        </p>
      </Container>
    </section>
  );
};

export default CuscFeaturedCourses;
