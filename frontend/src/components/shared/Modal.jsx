// Modal.jsx - Premium Glass Effect
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Soft blur background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/20 to-transparent backdrop-blur-md"
        onClick={onClose}
      />

      {/* Glass card */}
      <div className="relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-2xl p-6 max-w-md w-full mx-4 border border-white/30 shadow-2xl">
        {/* Inner glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

        {/* Header */}
        <div className="flex justify-between items-center mb-4 relative z-10">
          <h2 className="text-white text-xl font-bold tracking-wide drop-shadow-lg">{title}</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;