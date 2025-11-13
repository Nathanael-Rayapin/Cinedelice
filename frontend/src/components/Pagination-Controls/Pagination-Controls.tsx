interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    goToPage: (page: number) => void;
    goToNextPage: () => void;
    goToPreviousPage: () => void;
}

const PaginationControls = ({
    currentPage,
    totalPages,
    goToPage,
    goToNextPage,
    goToPreviousPage,
}: PaginationControlsProps) => (
    <div className="pagination">
        <button onClick={goToPreviousPage} disabled={currentPage === 1} className="pagination-button">
            Précédent
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
                key={number}
                onClick={() => goToPage(number)}
                className={currentPage === number ? 'active' : ''}
            >
                {number}
            </button>
        ))}

        <button onClick={goToNextPage} disabled={currentPage === totalPages} className="pagination-button">
            Suivant
        </button>
    </div>
);

export default PaginationControls;
