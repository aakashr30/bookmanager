import React from "react";

// Import your book images
import Book1 from "../assets/book1.png";
import Book2 from "../assets/book2.png";
import Book3 from "../assets/book3.png";
import Book4 from "../assets/book4.png";
import Book5 from "../assets/book5.png";
import Book6 from "../assets/book6.png";

// Array of books
const books = [
    { id: 1, title: "", cover: Book1 },
    { id: 2, title: "", cover: Book2 },
    { id: 3, title: "", cover: Book3 },
    { id: 4, title: "", cover: Book4 },
    { id: 5, title: "", cover: Book5 },
    { id: 6, title: "", cover: Book6 },
    // keep adding as many as you have...
];

const Books: React.FC = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Buy Books</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {books.map((book) => (
                    <div
                        key={book.id}
                        className="border rounded shadow p-2 flex flex-col items-center hover:shadow-lg transition"
                    >
                        <img
                            src={book.cover}
                            alt={book.title}
                            className="h-48 w-auto mb-2 object-contain"
                        />
                        <h2 className="text-lg font-semibold text-center">{book.title}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Books;
