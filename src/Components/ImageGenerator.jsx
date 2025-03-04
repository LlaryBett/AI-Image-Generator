import React, { useRef, useState } from 'react';
import './ImageGenerator.css';
import default_image from '../Assets/default_image.svg';

const ImageGenerator = () => {
    const [image_url, setImage_url] = useState('/');
    const inputRef = useRef(null);

    const generateImage = async () => {
        const prompt = inputRef.current.value.trim();
        if (!prompt) {
            alert("Please enter a prompt!");
            return;
        }

        try {
            const response = await fetch("https://api.openai.com/v1/images/generations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    prompt: prompt,
                    n: 1,
                    size: "512x512",
                }),
            });

            const data = await response.json();

            if (data.error) {
                console.error("API Error:", data.error);
                alert(`Error: ${data.error.message}`);
                return;
            }

            if (!data.data || data.data.length === 0) {
                console.error("No image data received", data);
                alert("No image received. Try a different prompt.");
                return;
            }

            setImage_url(data.data[0].url);
        } catch (error) {
            console.error("Fetch Error:", error);
            alert("Failed to fetch image. Check your API key and internet connection.");
        }
    };

    return (
        <div className='ai-image-generator'>
            <div className='header'>AI Image <span>Generator</span></div>
            <div className="img-loading">
                <div className='image'>
                    <img src={image_url === "/" ? default_image : image_url} alt="Generated" />
                </div>
            </div>
            <div className='search-box'>
                <input type="text" ref={inputRef} className='search-input' placeholder="Enter your text here" />
                <div className="generate-btn" onClick={generateImage}>Generate</div>
            </div>
        </div>
    );
};

export default ImageGenerator;
