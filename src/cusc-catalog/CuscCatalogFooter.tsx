import { getConfig } from '@edx/frontend-platform';
import './cusc-catalog.scss';

/**
 * Catalog-only footer. It does not modify LMS, CMS, Authn or Dashboard.
 * The contact details are carried over from the supplied CUSC theme screenshot.
 */
const CuscCatalogFooter = () => {
  const lmsBaseUrl = String(getConfig().LMS_BASE_URL || 'http://local.openedx.io:8000').replace(/\/$/, '');
  const year = new Date().getFullYear();

  return (
    <footer className="cusc-catalog cusc-site-footer">
      <div className="cusc-footer__inner">
        <div className="cusc-footer__about">
          <div className="cusc-footer__brand">
            <span className="cusc-footer__brand-ctu" role="img" aria-label="Logo Đại học Cần Thơ" />
            <span className="cusc-footer__brand-cusc" role="img" aria-label="Logo CUSC" />
          </div>
          <strong>Nền tảng học tập CUSC</strong>
          <p>Đồng hành cùng bạn trên hành trình khám phá kiến thức và phát triển kỹ năng.</p>
        </div>
        <nav className="cusc-footer__links" aria-label="Liên kết nhanh">
          <h2>Liên kết nhanh</h2>
          <a href={`${lmsBaseUrl}/`}>Trang chủ</a>
          <a href={`${lmsBaseUrl}/courses`}>Các khóa học</a>
          <a href={`${lmsBaseUrl}/about`}>Giới thiệu</a>
          <a href={`${lmsBaseUrl}/contact`}>Liên hệ</a>
        </nav>
        <div className="cusc-footer__contact">
          <h2>Liên hệ CUSC</h2>
          <a href="mailto:info@cusc.vn">info@cusc.vn</a>
          <a href="tel:+842923835579">+84 292 3835 579</a>
          <p>01 Lý Tự Trọng, Ninh Kiều, Cần Thơ, Việt Nam</p>
        </div>
      </div>
      <div className="cusc-footer__bottom">
        <span>© {year} CUSC. Bảo lưu mọi quyền.</span>
        <div><a href={`${lmsBaseUrl}/privacy`}>Chính sách bảo mật</a><a href={`${lmsBaseUrl}/tos`}>Điều khoản sử dụng</a></div>
      </div>
    </footer>
  );
};

export default CuscCatalogFooter;
