import React, { useState } from "react";
import Papa from "papaparse";

type Book = {
    Title: string;
    Author: string;
    Genre: string;
    PublishedYear: string;
    ISBN: string;
};

const BookCSVEditor: React.FC = () => {
    const [data, setData] = useState<Book[]>([]);
    const [originalData, setOriginalData] = useState<Book[]>([]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            complete: (result) => {
                setData(result.data as Book[]);
                setOriginalData(result.data as Book[]);
            },
        });
    };

    const handleCellChange = (index: number, key: keyof Book, value: string) => {
        const newData = [...data];
        newData[index][key] = value;
        setData(newData);
    };

    const handleDownload = () => {
        const csv = Papa.unparse(data);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "edited_books.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleReset = () => {
        setData([...originalData]);
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">📚 Book CSV Editor</h2>
            <input type="file" accept=".csv" onChange={handleFileUpload} />
            {data.length > 0 && (
                <>
                    <div className="flex space-x-2 mt-4">
                        <button
                            onClick={handleDownload}
                            className="bg-green-600 text-white px-4 py-2 rounded"
                        >
                            Download Edited CSV
                        </button>
                        <button
                            onClick={handleReset}
                            className="bg-red-600 text-white px-4 py-2 rounded"
                        >
                            Reset All Edits
                        </button>
                    </div>
                    <table className="w-full mt-6 border border-gray-300">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="border px-2">Title</th>
                                <th className="border px-2">Author</th>
                                <th className="border px-2">Genre</th>
                                <th className="border px-2">PublishedYear</th>
                                <th className="border px-2">ISBN</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.slice(0, 50).map((row, i) => (
                                <tr key={i}>
                                    {(Object.keys(row) as (keyof Book)[]).map((key) => (
                                        <td key={key} className="border px-2">
                                            <input
                                                className="w-full p-1 border rounded"
                                                value={row[key] || ""}
                                                onChange={(e) => handleCellChange(i, key, e.target.value)}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p className="mt-2 text-sm text-gray-500">
                        Showing first 50 rows of {data.length}
                    </p>
                </>
            )}
        </div>
    );
};

export default BookCSVEditor;
