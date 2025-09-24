import React, { useState, useMemo, useCallback, useRef, useEffect, type CSSProperties, type ChangeEvent } from 'react';
import { Upload, Download, RotateCcw, Search, Filter, ChevronUp, ChevronDown, Loader, Edit3, RefreshCw } from 'lucide-react';
import * as Papa from 'papaparse';
import { faker } from '@faker-js/faker';

interface Book {
    Title: string;
    Author: string;
    Genre: string;
    PublishedYear: number;
    ISBN: string;
}

interface Filters {
    search: string;
    genre: string;
    yearFrom: string;
    yearTo: string;
}

interface SortConfig {
    key: keyof Book | null;
    direction: 'asc' | 'desc';
}

interface VirtualRowProps {
    book: Book;
    index: number;
    onEdit: (index: number, newData: Book) => void;
    isModified: boolean;
    style: CSSProperties;
}

// Generate realistic book data using Faker.js book module
const generateFakeBooks = (count: number = 10000): Book[] => {
    const books: Book[] = [];

    for (let i = 0; i < count; i++) {
        // Use faker.book methods for realistic book data
        const title: string = faker.book.title();
        const author: string = Math.random() > 0.3 ? faker.book.author() : faker.person.fullName();
        const genre: string = faker.book.genre();
        const year: number = faker.date.between({ from: '1950-01-01', to: '2024-12-31' }).getFullYear();
        const isbn: string = faker.commerce.isbn();

        books.push({
            Title: title,
            Author: author,
            Genre: genre,
            PublishedYear: year,
            ISBN: isbn
        });
    }

    return books;
};

// Virtualized table row component for performance
const VirtualRow: React.FC<VirtualRowProps> = React.memo(({ book, index, onEdit, isModified, style }) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editData, setEditData] = useState<Book>(book);

    const handleSave = useCallback((): void => {
        onEdit(index, editData);
        setIsEditing(false);
    }, [index, editData, onEdit]);

    const handleCancel = useCallback((): void => {
        setEditData(book);
        setIsEditing(false);
    }, [book]);

    const handleInputChange = useCallback((field: keyof Book) => (
        e: ChangeEvent<HTMLInputElement>
    ): void => {
        const value = field === 'PublishedYear' ? parseInt(e.target.value) || 0 : e.target.value;
        setEditData(prev => ({ ...prev, [field]: value }));
    }, []);

    return (
        <div
            style={style}
            className={`grid grid-cols-7 gap-2 p-2 border-b text-sm ${isModified ? 'bg-yellow-100 border-yellow-300' : 'hover:bg-gray-50'
                }`}
        >
            <div className="font-medium text-xs text-gray-500">#{index + 1}</div>
            {isEditing ? (
                <>
                    <input
                        value={editData.Title}
                        onChange={handleInputChange('Title')}
                        className="px-2 py-1 border rounded text-xs"
                        placeholder="Title"
                    />
                    <input
                        value={editData.Author}
                        onChange={handleInputChange('Author')}
                        className="px-2 py-1 border rounded text-xs"
                        placeholder="Author"
                    />
                    <input
                        value={editData.Genre}
                        onChange={handleInputChange('Genre')}
                        className="px-2 py-1 border rounded text-xs"
                        placeholder="Genre"
                        list="genre-options"
                    />
                    <datalist id="genre-options">
                        <option value="Fiction" />
                        <option value="Non-Fiction" />
                        <option value="Mystery" />
                        <option value="Romance" />
                        <option value="Science Fiction" />
                        <option value="Fantasy" />
                        <option value="Biography" />
                        <option value="History" />
                        <option value="Science" />
                        <option value="Philosophy" />
                        <option value="Thriller" />
                        <option value="Horror" />
                        <option value="Adventure" />
                        <option value="Self-Help" />
                        <option value="Poetry" />
                    </datalist>
                    <input
                        type="number"
                        value={editData.PublishedYear}
                        onChange={handleInputChange('PublishedYear')}
                        className="px-2 py-1 border rounded text-xs"
                        placeholder="Year"
                        min="1800"
                        max="2024"
                    />
                    <input
                        value={editData.ISBN}
                        onChange={handleInputChange('ISBN')}
                        className="px-2 py-1 border rounded text-xs"
                        placeholder="ISBN"
                    />
                    <div className="flex gap-1">
                        <button
                            onClick={handleSave}
                            className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleCancel}
                            className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div className="truncate" title={book.Title}>{book.Title}</div>
                    <div className="truncate" title={book.Author}>{book.Author}</div>
                    <div className="truncate">{book.Genre}</div>
                    <div>{book.PublishedYear}</div>
                    <div className="truncate">{book.ISBN}</div>

                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors flex items-center gap-1"
                    >
                        <Edit3 size={12} /> Edit
                    </button>
                </>
            )}
        </div>

    );
});

VirtualRow.displayName = 'VirtualRow';

const CSVBookManager: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [originalBooks, setOriginalBooks] = useState<Book[]>([]);
    const [modifiedRows, setModifiedRows] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState<boolean>(false);
    const [filters, setFilters] = useState<Filters>({
        search: '',
        genre: '',
        yearFrom: '',
        yearTo: ''
    });
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rowsPerPage] = useState<number>(50);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load demo data on mount
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            const demoBooks: Book[] = generateFakeBooks(10000);
            setBooks(demoBooks);
            setOriginalBooks([...demoBooks]);
            setLoading(false);
        }, 100);
    }, []);


    const handleFileUpload = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
        const file = event.target.files?.[0];
        if (!file) return;

        setLoading(true);

        const newBooks: Book[] = [];

        Papa.parse<Book>(file, {
            header: true,
            skipEmptyLines: true,
            chunk: (results) => {
                const parsedChunk: Book[] = results.data.map((row: any) => ({
                    Title: row.Title || '',
                    Author: row.Author || '',
                    Genre: row.Genre || '',
                    PublishedYear: parseInt(row.PublishedYear) || 0,
                    ISBN: row.ISBN || ''
                }));

                newBooks.push(...parsedChunk);
            },
            complete: () => {
                // Merge new books with existing books
                setBooks(prevBooks => [...prevBooks, ...newBooks]);
                setOriginalBooks(prevBooks => [...prevBooks, ...newBooks]);
                setModifiedRows(new Set());
                setCurrentPage(1);
                setLoading(false);
            },
            error: (error) => {
                console.error('Error parsing CSV:', error);
                setLoading(false);
            }
        });
    }, []);

    const filteredAndSortedBooks = useMemo((): Book[] => {
        let filtered = books.filter((book: Book) => {
            const matchesSearch = !filters.search ||
                book.Title.toLowerCase().includes(filters.search.toLowerCase()) ||
                book.Author.toLowerCase().includes(filters.search.toLowerCase());

            const matchesGenre = !filters.genre || book.Genre === filters.genre;
            const matchesYearFrom = !filters.yearFrom || book.PublishedYear >= parseInt(filters.yearFrom);
            const matchesYearTo = !filters.yearTo || book.PublishedYear <= parseInt(filters.yearTo);

            return matchesSearch && matchesGenre && matchesYearFrom && matchesYearTo;
        });

        if (sortConfig.key) {
            filtered.sort((a: Book, b: Book) => {
                const aVal = a[sortConfig.key!];
                const bVal = b[sortConfig.key!];

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return filtered;
    }, [books, filters, sortConfig]);

    const paginatedBooks = useMemo((): Book[] => {
        const start = (currentPage - 1) * rowsPerPage;
        return filteredAndSortedBooks.slice(start, start + rowsPerPage);
    }, [filteredAndSortedBooks, currentPage, rowsPerPage]);

    const totalPages = Math.ceil(filteredAndSortedBooks.length / rowsPerPage);

    const handleEdit = useCallback((index: number, newData: Book): void => {
        const actualIndex = books.findIndex((book: Book) =>
            book.Title === paginatedBooks[index].Title &&
            book.Author === paginatedBooks[index].Author
        );

        const updatedBooks = [...books];
        updatedBooks[actualIndex] = newData;
        setBooks(updatedBooks);

        const newModifiedRows = new Set(modifiedRows);
        newModifiedRows.add(actualIndex);
        setModifiedRows(newModifiedRows);
    }, [books, paginatedBooks, modifiedRows]);

    const handleSort = useCallback((key: keyof Book): void => {
        setSortConfig(prevConfig => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
        }));
    }, []);

    const resetAllEdits = useCallback((): void => {
        setBooks([...originalBooks]);
        setModifiedRows(new Set());
    }, [originalBooks]);

    const generateNewData = useCallback((): void => {
        setLoading(true);
        setTimeout(() => {
            const newBooks: Book[] = generateFakeBooks(10000);
            setBooks(newBooks);
            setOriginalBooks([...newBooks]);
            setModifiedRows(new Set());
            setCurrentPage(1);
            setFilters({ search: '', genre: '', yearFrom: '', yearTo: '' });
            setLoading(false);
        }, 100);
    }, []);

    const downloadCSV = useCallback((): void => {
        const csvContent = Papa.unparse(books, {
            header: true
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `edited_books_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [books]);

    const uniqueGenres = useMemo((): string[] => {
        return [...new Set(originalBooks.map((book: Book) => book.Genre))].sort();
    }, [originalBooks]);

    const handleFilterChange = useCallback((field: keyof Filters) => (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ): void => {
        setFilters(prev => ({ ...prev, [field]: e.target.value }));
        setCurrentPage(1);
    }, []);

    const SortButton: React.FC<{
        sortKey: keyof Book;
        children: React.ReactNode;
    }> = ({ sortKey, children }) => (
        <button
            onClick={() => handleSort(sortKey)}
            className="text-left flex items-center gap-1 hover:text-blue-600 transition-colors"
        >
            {children}
            {sortConfig.key === sortKey && (
                sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
            )}
        </button>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

            <div className="max-w-9xl mx-auto p-4">
                {/* Main Content Header */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <h2 className="text-xl font-bold mb-4">📚 Book CSV Editor</h2>

                        <div className="flex flex-wrap gap-3">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                disabled={loading}
                            >
                                <Upload size={18} />
                                Upload CSV
                            </button>

                            <button
                                onClick={generateNewData}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                                disabled={loading}
                            >
                                <RefreshCw size={18} />
                                Generate New Data
                            </button>

                            <button
                                onClick={resetAllEdits}
                                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
                                disabled={modifiedRows.size === 0 || loading}
                            >
                                <RotateCcw size={18} />
                                Reset Edits
                            </button>

                            <button
                                onClick={downloadCSV}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                                disabled={books.length === 0 || loading}
                            >
                                <Download size={18} />
                                Download CSV
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                        <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="text-blue-600 text-sm font-medium">Total Books</div>
                            <div className="text-2xl font-bold text-blue-800">{books.length.toLocaleString()}</div>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                            <div className="text-green-600 text-sm font-medium">Filtered Results</div>
                            <div className="text-2xl font-bold text-green-800">{filteredAndSortedBooks.length.toLocaleString()}</div>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-lg">
                            <div className="text-orange-600 text-sm font-medium">Modified Rows</div>
                            <div className="text-2xl font-bold text-orange-800">{modifiedRows.size}</div>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg">
                            <div className="text-purple-600 text-sm font-medium">Current Page</div>
                            <div className="text-2xl font-bold text-purple-800">{currentPage} / {totalPages}</div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter size={20} className="text-gray-600" />
                        <h2 className="text-lg font-semibold text-gray-800">Filters & Search</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search title or author..."
                                value={filters.search}
                                onChange={handleFilterChange('search')}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <select
                            value={filters.genre}
                            onChange={handleFilterChange('genre')}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Genres</option>
                            {uniqueGenres.map((genre: string) => (
                                <option key={genre} value={genre}>{genre}</option>
                            ))}
                        </select>

                        <input
                            type="number"
                            placeholder="Year from"
                            value={filters.yearFrom}
                            onChange={handleFilterChange('yearFrom')}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="1800"
                            max="2024"
                        />

                        <input
                            type="number"
                            placeholder="Year to"
                            value={filters.yearTo}
                            onChange={handleFilterChange('yearTo')}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="1800"
                            max="2024"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader className="animate-spin text-blue-600" size={32} />
                            <span className="ml-3 text-gray-600">Loading books...</span>
                        </div>
                    ) : (
                        <>
                            {/* Table Header */}
                            <div className="grid grid-cols-7 gap-2 p-4 bg-gray-50 border-b font-semibold text-gray-700 text-sm">
                                <div>#</div>
                                <SortButton sortKey="Title">Title</SortButton>
                                <SortButton sortKey="Author">Author</SortButton>
                                <SortButton sortKey="Genre">Genre</SortButton>
                                <SortButton sortKey="PublishedYear">Year</SortButton>
                                <SortButton sortKey="ISBN">ISBN</SortButton>
                                <div>Actions</div>
                            </div>

                            {/* Table Body */}
                            <div className="max-h-96 overflow-y-auto">
                                {paginatedBooks.map((book: Book, index: number) => {
                                    const actualIndex = books.findIndex((b: Book) =>
                                        b.Title === book.Title && b.Author === book.Author
                                    );
                                    return (
                                        <VirtualRow
                                            key={`${book.Title}-${book.Author}-${index}`}
                                            book={book}
                                            index={(currentPage - 1) * rowsPerPage + index}
                                            onEdit={handleEdit}
                                            isModified={modifiedRows.has(actualIndex)}
                                            style={{}}
                                        />
                                    );
                                })}
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 border-t">
                                <div className="text-sm text-gray-600">
                                    Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, filteredAndSortedBooks.length)} of {filteredAndSortedBooks.length} entries
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Previous
                                    </button>

                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded">
                                        Page {currentPage} of {totalPages}
                                    </span>

                                    <button
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>


        </div>
    );
};

export default CSVBookManager;
