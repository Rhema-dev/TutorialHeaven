import { useState } from 'react';
import './DonateButton.css';

const DonateButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText('7041099662');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="donate-container">
      <button 
        className="donate-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        Donate to Developer
        <span className={`heart-icon ${isOpen ? 'active' : ''}`}>❤️</span>
      </button>

      {isOpen && (
        <div className="donate-card">
          <div className="donate-card-header">
            <h3>Support My Work</h3>
            <button 
              className="close-button"
              onClick={() => setIsOpen(false)}
            >
              &times;
            </button>
          </div>
          <div className="donate-card-body">
            <div className="bank-info">
              <div className="info-row">
                <span className="info-label">Bank:</span>
                <span className="info-value">Opay</span>
              </div>
              <div className="info-row">
                <span className="info-label">Account Number:</span>
                <div className="account-row">
                  <span className="info-value">7041099662</span>
                  <button 
                    className="copy-button"
                    onClick={copyToClipboard}
                  >
                    {isCopied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <div className="info-row">
                <span className="info-label">Account Name:</span>
                <span className="info-value">Rhema Emmanuel-Great Oshiokhua</span>
              </div>
            </div>
            <div className="thank-you">
              <p>Your support helps me create more amazing projects!</p>
              <div className="emoji-stars">✨🌟✨</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonateButton;