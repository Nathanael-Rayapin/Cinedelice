import './Pagination-Controls.scss';

interface PaginationControlsProps {
  currentPage: number;
  pageNumbers: (number | string)[];
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
}

const PaginationControls = ({
  currentPage,
  pageNumbers,
  goToPage,
  goToNextPage,
  goToPreviousPage,
}: PaginationControlsProps) => (
  <div className="pagination">
    <button onClick={goToPreviousPage} disabled={currentPage === 1} className="pagination-button">
      Précédent
    </button>

    {pageNumbers.map((number, idx) =>
      typeof number === 'number' ? (
        <button
          key={idx}
          onClick={() => goToPage(number)}
          className={currentPage === number ? 'active' : ''}
        >
          {number}
        </button>
      ) : (
        <span key={idx} className="dots">{number}</span>
      )
    )}

    <button onClick={goToNextPage} disabled={currentPage === pageNumbers[pageNumbers.length - 1]} className="pagination-button">
      Suivant
    </button>
  </div>
);

export default PaginationControls;
