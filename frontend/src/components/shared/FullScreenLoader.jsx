const FullScreenLoader = ({ message = "Loading...", transparent = false }) => {
  return (
    <div className={`fullscreen-loader ${transparent ? 'bg-black/70' : 'bg-[#1f1f1f]'}`}>
      <div className="loader-container">
        <div className="spinner"></div>
        {message && <p className="loader-text">{message}</p>}
      </div>
    </div>
  );
};

export default FullScreenLoader;