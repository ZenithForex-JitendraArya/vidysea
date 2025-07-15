'use client';


// import { API_BASE_URL } from '../../lib/config';

import React, { useState, useEffect, ReactEventHandler } from 'react';
import { useRouter } from 'next/navigation';
import { apiUrl } from '../../lib/config';


interface Section {
    id: number;
    name: string;
}

interface SubSection {
    id: number;
    name: string;
    sectionId: number;
}

interface Option {
    text: string;
    marks: string;
    image: File | null;
}

export default function QuestionForm() {
    const [sectionsList, setSectionsList] = useState<Section[]>([]);
    const [subSectionsList, setSubSectionsList] = useState<SubSection[]>([]);
    const [selectedSection, setSelectedSection] = useState<number | null>(null);
    const [selectedSubSection, setSelectedSubSection] = useState<number | null>(null);
    const [question, setQuestion] = useState('');
    const [optionType, setOptionType] = useState<'SINGLE' | 'MULTI'>('SINGLE');
    const [options, setOptions] = useState<Option[]>([{ text: '', marks: '', image: null }]);
    const router = useRouter();

    useEffect(() => {
        getSectionList();
    }, []);

    const getSectionList = async () => {
        try {
            const res = await fetch(apiUrl+'/section', {
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

    const sectionHandler = async (sectionId: number) => {
        setSelectedSection(sectionId);
        setSelectedSubSection(null);
        try {
            const res = await fetch(apiUrl+`/subsection/${sectionId}`, {
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

    const handleOptionChange = (index: number, field: keyof Omit<Option, 'image'>, value: string) => {
        const updated = [...options];
        updated[index][field] = value;
        setOptions(updated);
    };


    const handleOptionImageChange = (index: number, file: File | null) => {
        console.log('Selected file for option', index, ':', file);
        const updated = [...options];
        console.log(file);
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
            const res = await fetch(apiUrl+'/question', {
                method: 'POST',
                body: formData,
            });
            const resp = await res.json();  // ✅ FIXED
            console.log(resp);
            if (!resp.success) {
                throw new Error('Something went wrong!');
            } else {
                alert('Question submitted successfully!');
                // setSelectedSection('');         // ✅ FIXED
                // setSelectedSubSection('');      // ✅ FIXED
                setQuestion('');
                setOptionType('SINGLE');
                setOptions([{ text: '', marks: '', image: null }]);
                router.push('/')
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
                        onChange={(e) => setOptionType(e.target.value as 'SINGLE' | 'MULTI')}
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
