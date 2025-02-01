import { Pagination } from "react-bootstrap";

const getPaginationItems = (
  currentPage: number,
  totalPages: number,
  handlePageChange: (page: number) => void,
) => {
  const paginationItems = [];
  const visiblePages = 5; // Number of pages to show before and after the current page

  // Add the first page
  paginationItems.push(
    <Pagination.Item
      key={1}
      active={currentPage === 1}
      onClick={() => handlePageChange(1)}
    >
      1
    </Pagination.Item>,
  );

  // Add ellipsis if there are pages between the first page and the visible range
  if (currentPage > visiblePages + 1) {
    paginationItems.push(<Pagination.Ellipsis key="startEllipsis" />);
  }

  // Determine the start and end of the visible range
  const startPage = Math.max(currentPage - visiblePages, 2);
  const endPage = Math.min(currentPage + visiblePages, totalPages - 1);

  // Add the visible range of pages
  for (let page = startPage; page <= endPage; page++) {
    paginationItems.push(
      <Pagination.Item
        key={page}
        active={page === currentPage}
        onClick={() => handlePageChange(page)}
      >
        {page}
      </Pagination.Item>,
    );
  }

  // Add ellipsis if there are pages between the visible range and the last page
  if (currentPage + visiblePages < totalPages - 1) {
    paginationItems.push(<Pagination.Ellipsis key="endEllipsis" />);
  }

  // Add the last page
  paginationItems.push(
    <Pagination.Item
      key={totalPages}
      active={currentPage === totalPages}
      onClick={() => handlePageChange(totalPages)}
    >
      {totalPages}
    </Pagination.Item>,
  );

  return paginationItems;
};

export default getPaginationItems;
