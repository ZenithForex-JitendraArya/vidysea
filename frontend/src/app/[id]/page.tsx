// app/[id]/page.tsx

import React from 'react';
import { apiUrl } from '../../../lib/config';

interface Params {
    params: { id: string };
}

async function getQuestion(id: string) {
    const res = await fetch(apiUrl+`/question/${id}`, {
        cache: 'no-store',
    });
    return res.json();
}

export default async function QuestionPage({ params }: Params) {
    const { id } = params;
    const result = await getQuestion(id);
    console.log(result)
    if (!result.success) {
        return (
            <div className="container py-5">
                <h1 className="text-danger text-center"> Question Not Found</h1>
            </div>
        );
    }

    const question = result.data;

    return (
        <div className="container py-5">
            <h1 className="text-center mb-4">View Question</h1>
            <div className="mb-4">
                <h4 className="mb-2">Question ID</h4>
                <div className="p-3 border rounded bg-light">
                    #{question.id}
                </div>
            </div>
            <div className="mb-4">
                <h4 className="mb-2">Section</h4>
                <div className="p-3 border rounded bg-light">
                    {question.section_name}
                </div>
                <h4 className="mb-2">Sub Section </h4>
                <div className="p-3 border rounded bg-light">
                    {question.subsection_name}
                </div>
            </div>

            <div className="mb-4">
                <h4 className="mb-2">Question</h4>
                <div className="p-3 border rounded bg-light">
                    {question.question_text}
                </div>
            </div>

            <div className="mb-4">
                <h4 className="mb-2">Option Type</h4>
                <div className="p-3 border rounded bg-light">
                    {question.option_type}
                </div>
            </div>

            <div>
                <h4 className="mb-3">Options</h4>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Text</th>
                            <th>Marks</th>
                            <th>Image</th>
                        </tr>
                    </thead>
                    <tbody>
                        {question.options.map((opt: any, idx: number) => (
                            <tr key={idx}>
                                <td>{opt.text}</td>
                                <td>{opt.marks}</td>
                                <td>
                                    {opt.image_path ? (
                                        <img
                                            src={`http://localhost:5000/uploads/${opt.image_path}`}
                                            alt={`Option ${idx + 1}`}
                                            style={{ maxWidth: '120px', maxHeight: '80px' }}
                                        />
                                    ) : (
                                        'N/A'
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
