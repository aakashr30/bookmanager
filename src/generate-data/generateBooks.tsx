import { faker } from "@faker-js/faker";
import fs from "fs";
import path from "path";

type Book = {
    Title: string;
    Author: string;
    Genre: string;
    PublishedYear: number;
    ISBN: string;
};

function generateBooks(count: number): Book[] {
    const books: Book[] = [];

    for (let i = 0; i < count; i++) {
        books.push({
            Title: faker.book.title(),
            Author: faker.book.author(),
            Genre: faker.book.genre(),
            PublishedYear: faker.number.int({ min: 1900, max: 2023 }),
            ISBN: faker.commerce.isbn(),
        });
    }

    return books;
}

// Save as CSV
function saveCSV(books: Book[]) {
    const header = "Title,Author,Genre,PublishedYear,ISBN\n";
    const rows = books
        .map(
            (book) =>
                `"${book.Title}","${book.Author}","${book.Genre}",${book.PublishedYear},${book.ISBN}`
        )
        .join("\n");

    const csv = header + rows;
    const filePath = path.join(__dirname, "books.csv");
    fs.writeFileSync(filePath, csv, "utf-8");
    console.log(`✅ CSV file generated at: ${filePath}`);
}

// Generate 10,000 books
const books = generateBooks(10000);
saveCSV(books);
