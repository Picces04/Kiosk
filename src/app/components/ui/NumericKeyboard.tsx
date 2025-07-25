import React from 'react';
import { Delete, X } from 'lucide-react';

interface NumericKeyboardProps {
    value: string;
    onChange: (value: string) => void;
    onClose: () => void;
    maxLength?: number;
}

const NumericKeyboard: React.FC<NumericKeyboardProps> = ({
    value,
    onChange,
    onClose,
    maxLength = 12,
}) => {
    const handleNumberClick = (num: string) => {
        if (value.length < maxLength) {
            onChange(value + num);
        }
    };

    const handleBackspace = () => {
        onChange(value.slice(0, -1));
    };

    const handleClear = () => {
        onChange('');
    };

    const numbers = [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
        ['C', '0', '⌫'],
    ];

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                        Nhập số
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="mb-6">
                    <div className="bg-gray-100 rounded-xl p-4 text-center">
                        <span className="text-2xl font-mono text-gray-900">
                            {value || '0'}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {numbers.map((row, rowIndex) =>
                        row.map((key, keyIndex) => (
                            <button
                                key={`${rowIndex}-${keyIndex}`}
                                onClick={() => {
                                    if (key === 'C') {
                                        handleClear();
                                    } else if (key === '⌫') {
                                        handleBackspace();
                                    } else {
                                        handleNumberClick(key);
                                    }
                                }}
                                className={`h-16 rounded-xl font-semibold text-xl transition-all duration-200 ${
                                    key === 'C'
                                        ? 'bg-red-500 hover:bg-red-600 text-white'
                                        : key === '⌫'
                                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                                } hover:transform hover:scale-105 active:scale-95`}
                            >
                                {key === '⌫' ? (
                                    <Delete size={20} className="mx-auto" />
                                ) : (
                                    key
                                )}
                            </button>
                        ))
                    )}
                </div>

                <div className="mt-6 text-center">
                    <button
                        onClick={onClose}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-xl transition-colors duration-200"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NumericKeyboard;
