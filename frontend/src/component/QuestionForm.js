'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiUrl } from '../../lib/config';

export default function QuestionForm() {
    const [sectionsList, setSectionsList] = useState([]);
    const [subSectionsList, setSubSectionsList] = useState([]);
    const [selectedSection, setSelectedSection] = useState(null);
    const [selectedSubSection, setSelectedSubSection] = useState(null);
    const [question, setQuestion] = useState('');
    const [optionType, setOptionType] = useState('SINGLE');
    const [options, setOptions] = useState([{ text: '', marks: '', image: null }]);
    const router = useRouter();

    useEffect(() => {
        getSectionList();
    }, []);

    const getSectionList = async () => {
        try {
            const res = await fetch(apiUrl + '/section', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!res.ok) {
                throw new Error('Failed to fetch sections!');
            }

            const result = await res.json();
            if (result.success) {
                setSectionsList(result.data);
            } else {
                throw new Error('Failed to get sections data!');
            }
        } catch (err) {
            console.error(err);
            alert('Error fetching sections');
        }
    };

    const sectionHandler = async (sectionId) => {
        setSelectedSection(sectionId);
        setSelectedSubSection(null);
        try {
            const res = await fetch(apiUrl + `/subsection/${sectionId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!res.ok) {
                throw new Error('Failed to fetch subsections!');
            }
            const result = await res.json();
            if (result.success) {
                setSubSectionsList(result.data);
            } else {
                throw new Error('Subsection fetch failed');
            }
        } catch (err) {
            console.error(err);
            alert('Error fetching subsections');
        }
    };

    const handleAddOption = () => {
        setOptions([...options, { text: '', marks: '', image: null }]);
    };

    const handleOptionChange = (index, field, value) => {
        const updated = [...options];
        updated[index][field] = value;
        setOptions(updated);
    };

    const handleOptionImageChange = (index, file) => {
        console.log('Selected file for option', index, ':', file);
        const updated = [...options];
        updated[index].image = file;
        setOptions(updated);
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('sectionId', String(selectedSection));
        formData.append('subSectionId', String(selectedSubSection));
        formData.append('question', question);
        formData.append('optionType', optionType);
        options.forEach((opt, idx) => {
            formData.append(`options[${idx}][text]`, opt.text);
            formData.append(`options[${idx}][marks]`, opt.marks);
            if (opt.image) {
                formData.append(`options[${idx}][image]`, opt.image);
            }
        });
        try {
            const res = await fetch(apiUrl + '/question', {
                method: 'POST',
                body: formData,
            });
            const resp = await res.json();
            console.log(resp);
            if (!resp.success) {
                throw new Error('Something went wrong!');
            } else {
                alert('Question submitted successfully!');
                setQuestion('');
                setOptionType('SINGLE');
                setOptions([{ text: '', marks: '', image: null }]);
                router.push('/');
            }
        } catch (err) {
            console.error(err);
            alert('Error submitting question');
        }
    };

    return (
        <>
            <h1 style={{ textAlign: 'center' }}>Create Question</h1>
            <div className="container p-4">
                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">Section</label>
                        <select
                            className="form-select"
                            onChange={(e) => sectionHandler(Number(e.target.value))}
                            value={selectedSection || ''}
                        >
                            <option value="">Select Section</option>
                            {sectionsList.map((s) => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col">
                        <label className="form-label">Sub Section</label>
                        <select
                            className="form-select"
                            onChange={(e) => setSelectedSubSection(Number(e.target.value))}
                            value={selectedSubSection || ''}
                        >
                            <option value="">Select Sub Section</option>
                            {subSectionsList.map((ss) => (
                                <option key={ss.id} value={ss.id}>{ss.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Question</label>
                    <input
                        type="text"
                        placeholder="Type Question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Option Type</label>
                    <select
                        className="form-select"
                        value={optionType}
                        onChange={(e) => setOptionType(e.target.value)}
                    >
                        <option value="SINGLE">Single</option>
                        <option value="MULTI">Multi</option>
                    </select>
                </div>

                <table className="table table-bordered mb-3">
                    <thead>
                        <tr>
                            <th>Option</th>
                            <th>Marks</th>
                            <th>Image</th>
                        </tr>
                    </thead>
                    <tbody>
                        {options.map((opt, idx) => (
                            <tr key={idx}>
                                <td>
                                    <input
                                        type="text"
                                        placeholder={`Option ${idx + 1}`}
                                        value={opt.text}
                                        onChange={(e) => handleOptionChange(idx, 'text', e.target.value)}
                                        className="form-control"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder="Marks"
                                        value={opt.marks}
                                        onChange={(e) => handleOptionChange(idx, 'marks', e.target.value)}
                                        className="form-control"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="form-control"
                                        onChange={(e) => handleOptionImageChange(idx, e.target.files?.[0] || null)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="mb-3">
                    <button type="button" onClick={handleAddOption} className="btn btn-secondary me-2">
                        Add More Option
                    </button>
                    <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
                        Submit
                    </button>
                </div>
            </div>
        </>
    );
}
