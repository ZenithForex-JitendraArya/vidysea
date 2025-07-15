'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { apiUrl } from '../../lib/config';

console.log(apiUrl);
interface Question {
    id: number;
    question_text: string;
    option_type: string;
}

export default function HomePage() {
    const [questions, setQuestions] = useState<Question[]>([]);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const res = await fetch(apiUrl+'/question');
            const result = await res.json();
            if (result.success) {
                setQuestions(result.data);
            } else {
                alert('Failed to fetch questions');
            }
        } catch (err) {
            console.error(err);
            alert('Error loading questions');
        }
    };

    return (
        <div className="container p-4">
            <h2 className="mb-3">Last 5 Questions</h2>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Question</th>
                        <th>Option Type</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {questions.map((q) => (
                        <tr key={q.id}>
                            <td>{q.id}</td>
                            <td>{q.question_text}</td>
                            <td>{q.option_type}</td>
                            <td>
                                <Link href={`/${q.id}`} className="btn btn-sm btn-info me-2">
                                    View
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Link href="/create" className="btn btn-primary">
                Create New Question
            </Link>
        </div>
    );
}
