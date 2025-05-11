import React, { useEffect, useState } from 'react';
import './ResourceCard.css';
import { FaYoutube, FaGraduationCap, FaBook, FaExternalLinkAlt } from 'react-icons/fa';

const ResourceCard = ({ skill }) => {
  const [resources, setResources] = useState({
    free: [],
    paid: [],
    docs: null
  });

  const OFFICIAL_DOCS = {
    'react': 'https://react.dev',
    'python': 'https://docs.python.org/3/',
    'javascript': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    'rust': 'https://doc.rust-lang.org/book/'
  };

  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // Use Vite's env variable

  const resourcePrompt = `
    Generate a list of the best resources to learn {skill}. Return a JSON object with:
    - free_resources: Array of objects, each with:
      - title: String (resource title)
      - url: String (valid URL)
      - source: String (source name, e.g., "YouTube", "FreeCodeCamp")
    - paid_resources: Array of objects, each with:
      - title: String (resource title)
      - url: String (valid URL)
      - source: String (source name, e.g., "Udemy", "Pluralsight")
      - price: String (price, e.g., "$49.99" or "Subscription")
    Ensure 3-5 free resources and 3-5 paid resources. Output only the JSON object wrapped in \`\`\`json\n...\n\`\`\`, with no additional text, comments, or explanations.
  `;

  useEffect(() => {
    const loadResources = async () => {
      // Get official docs if available
      const docsUrl = OFFICIAL_DOCS[skill.toLowerCase()];
      
      // Fetch from Gemini API
      try {
        if (!GEMINI_API_KEY) {
          throw new Error('Gemini API key is missing. Set VITE_GEMINI_API_KEY in .env');
        }

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: resourcePrompt.replace('{skill}', skill),
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1000,
            },
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Gemini raw response:', JSON.stringify(data, null, 2)); // Debug log

        // Extract text from response
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!responseText) {
          throw new Error('No text content in Gemini response');
        }

        // Try parsing markdown code block
        let apiResults;
        const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch) {
          try {
            apiResults = JSON.parse(jsonMatch[1]);
          } catch (parseError) {
            console.error('JSON parse error:', parseError, 'Raw JSON:', jsonMatch[1]);
            throw new Error('Failed to parse JSON from markdown block');
          }
        } else {
          // Fallback: Try parsing raw response as JSON
          try {
            apiResults = JSON.parse(responseText);
          } catch (parseError) {
            console.error('Fallback JSON parse error:', parseError, 'Raw text:', responseText);
            throw new Error('Invalid JSON response from Gemini');
          }
        }

        setResources({
          free: apiResults?.free_resources || [],
          paid: apiResults?.paid_resources || [],
          docs: docsUrl
        });
      } catch (error) {
        console.error('Gemini API error:', error);
        setResources({
          free: [],
          paid: [],
          docs: docsUrl
        });
      }
    };

    loadResources();
  }, [skill]);

  return (
    <div className="resource-card">
      <h3 className="resource-header">Learn {skill}</h3>
      
      {/* Official Documentation */}
      {resources.docs && (
        <div className="resource-section">
          <div className="resource-type">
            <FaBook className="resource-icon docs-icon" />
            <span>Official Documentation</span>
          </div>
          <a 
            href={resources.docs} 
            target="_blank" 
            rel="noopener noreferrer"
            className="resource-link"
          >
            {resources.docs.replace('https://', '')}
            <FaExternalLinkAlt className="external-icon" />
          </a>
        </div>
      )}

      {/* Free Resources */}
      <div className="resource-section">
        <div className="resource-type">
          <FaYoutube className="resource-icon free-icon" />
          <span>Free Resources</span>
        </div>
        <ul className="resource-list">
          {resources.free.length > 0 ? (
            resources.free.slice(0, 3).map((resource, index) => (
              <li key={index} className="resource-item">
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="resource-link"
                >
                  {resource.title}
                  <FaExternalLinkAlt className="external-icon" />
                </a>
                {resource.source && (
                  <span className="resource-source">({resource.source})</span>
                )}
              </li>
            ))
          ) : (
            <li className="resource-item">
              <a 
                href={`https://www.youtube.com/results?search_query=learn+${skill}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="resource-link"
              >
                Search YouTube for tutorials
                <FaExternalLinkAlt className="external-icon" />
              </a>
            </li>
          )}
        </ul>
      </div>

      {/* Paid Resources */}
      <div className="resource-section">
        <div className="resource-type">
          <FaGraduationCap className="resource-icon paid-icon" />
          <span>Premium Courses</span>
        </div>
        <ul className="resource-list">
          {resources.paid.length > 0 ? (
            resources.paid.slice(0, 3).map((resource, index) => (
              <li key={index} className="resource-item">
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="resource-link"
                >
                  {resource.title}
                  <FaExternalLinkAlt className="external-icon" />
                </a>
                {resource.source && (
                  <span className="resource-source">({resource.source})</span>
                )}
                {resource.price && (
                  <span className="resource-price">{resource.price}</span>
                )}
              </li>
            ))
          ) : (
            <li className="resource-item">
              <a 
                href={`https://www.udemy.com/courses/search/?q=${skill}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="resource-link"
              >
                Browse Udemy courses
                <FaExternalLinkAlt className="external-icon" />
              </a>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ResourceCard;