import { Container } from '@openedx/paragon';

type Props = { organizations: string[] };

/**
 * Legacy Django used organizations.api.get_organizations() which does not run
 * inside React. Catalog search results expose org codes; use those until a
 * dedicated organizations API is integrated.
 */
const CuscOrganizations = ({ organizations }: Props) => (
  <section className="cusc-operators" aria-labelledby="cusc-operators-title">
    <Container size="xl">
      <div className="cusc-section-heading">
        <div>
          {/* <span className="cusc-section-heading__eyebrow">CÙNG XÂY DỰNG TRI THỨC</span> */}
          <h2 id="cusc-operators-title">Đơn vị vận hành và cơ sở đào tạo</h2>
        </div>
      </div>
      <p className="cusc-section-heading__intro">Bộ nhận diện CTU – CUSC và các cơ sở có khóa học công khai trên Catalog.</p>
      <div className="cusc-brand-partners" aria-label="Đơn vị đồng hành">
        <span className="cusc-brand-partners__ctu" role="img" aria-label="Đại học Cần Thơ" />
        <span className="cusc-brand-partners__cusc" role="img" aria-label="CUSC" />
      </div>
      {organizations.length > 0 ? (
        <div className="cusc-operators__grid">
          {organizations.map(org => (
            <div className="cusc-operator" key={org}>
              <span className="cusc-operator__avatar" aria-hidden="true">{org.slice(0, 2).toUpperCase()}</span>
              <span>{org}</span>
            </div>
          ))}
        </div>
      ) : <p className="cusc-news__empty">Danh sách cơ sở đào tạo sẽ hiển thị khi có khóa học công khai.</p>}
      <p className="cusc-note">Các mã cơ sở đào tạo bên dưới được trích từ khóa học đang tải; chúng không phải dữ liệu đầy đủ của API tổ chức Django.</p>
    </Container>
  </section>
);

export default CuscOrganizations;
