import React, { useState, useEffect } from 'react';
import './DeepSeekWidget.css';
import { FaRobot, FaLightbulb, FaSpinner } from 'react-icons/fa';

const DeepSeekWidget = ({ skill, currentTopic }) => {
  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const recommendationPrompt = `
    Generate learning recommendations and a tutorial for the skill "{skill}" and topic "{currentTopic}". Return a JSON object with:
    - recommendations: Object containing:
      - concepts: Array of strings (3-5 key concepts to understand)
      - projects: Array of strings (3-5 practice project ideas)
      - common_mistakes: Array of strings (3-5 common pitfalls to avoid)
    - tutorial: Object containing:
      - title: String (title of the tutorial)
      - introduction: String (brief overview of the topic, 2-3 sentences)
      - steps: Array of strings (5-8 detailed steps to learn or apply the topic)
      - conclusion: String (summary and next steps, 1-2 sentences)
    Ensure the tutorial is beginner-friendly and practical. Output only the JSON object wrapped in \`\`\`json\n...\n\`\`\`, with no additional text, comments, or explanations.
  `;

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!skill || !currentTopic) {
        setRecommendations(null);
        return;
      }

      setIsLoading(true);
      setError(null);

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
                    text: recommendationPrompt
                      .replace('{skill}', skill)
                      .replace('{currentTopic}', currentTopic),
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1500, // Increased to accommodate tutorial
            },
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Gemini raw response:', JSON.stringify(data, null, 2));

        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!responseText) {
          throw new Error('No text content in Gemini response');
        }

        let recommendationsData;
        const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch) {
          try {
            recommendationsData = JSON.parse(jsonMatch[1]);
          } catch (parseError) {
            console.error('JSON parse error:', parseError, 'Raw JSON:', jsonMatch[1]);
            throw new Error('Failed to parse JSON from markdown block');
          }
        } else {
          try {
            recommendationsData = JSON.parse(responseText);
          } catch (parseError) {
            console.error('Fallback JSON parse error:', parseError, 'Raw text:', responseText);
            throw new Error('Invalid JSON response from Gemini');
          }
        }

        setRecommendations(recommendationsData);
      } catch (err) {
        setError(err.message);
        console.error('Gemini API error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [skill, currentTopic]);

  return (
    <div className="deepseek-widget">
      <div className="widget-header">
        <FaRobot className="ai-icon" />
        <h3>AI Learning Guide</h3>
      </div>
      
      {isLoading ? (
        <div className="loading-state">
          <FaSpinner className="spinner" />
          <p>Generating smart recommendations and tutorial...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>Couldn't load content: {error}. Try refreshing.</p>
        </div>
      ) : recommendations ? (
        <div className="recommendations-container">
          <div className="recommendation-section">
             {recommendations.tutorial && (
            <div className="recommendation-section tutorial-section">
              <h4>{recommendations.tutorial.title}</h4>
              <p className="tutorial-intro">{recommendations.tutorial.introduction}</p>
              <ol className="tutorial-steps">
                {recommendations.tutorial.steps?.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
              <p className="tutorial-conclusion">{recommendations.tutorial.conclusion}</p>
            </div>
          )}
            <h4>Key Concepts</h4>
            <ul>
              {recommendations.recommendations?.concepts?.map((concept, index) => (
                <li key={index}>
                  <FaLightbulb className="bullet-icon" />
                  <span>{concept}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="recommendation-section">
            <h4>Practice Projects</h4>
            <ul>
              {recommendations.recommendations?.projects?.map((project, index) => (
                <li key={index}>
                  <FaLightbulb className="bullet-icon" />
                  <span>{project}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="recommendation-section">
            <h4>Common Pitfalls</h4>
            <ul>
              {recommendations.recommendations?.common_mistakes?.map((mistake, index) => (
                <li key={index}>
                  <FaLightbulb className="bullet-icon" />
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </div>

         
        </div>
      ) : (
        <div className="empty-state">
          <p>Select a topic to get AI-powered recommendations and tutorial</p>
        </div>
      )}
    </div>
  );
};

export default DeepSeekWidget;