// Modal.tsx
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-gray-900 rounded-lg w-80 p-4 relative text-white max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <button onClick={onClose} className="absolute top-2 right-2 text-2xl font-bold hover:text-red-500 transition-colors">
          &times;
        </button>
        <div className="max-h-60 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
