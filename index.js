const API_URL = "https://eo3qbo52a7.execute-api.us-east-2.amazonaws.com/dev"
const form = document.getElementById("image-resize-form");
const resConatiner = document.getElementById("response-container");

uploadImage = async e => {
  e.preventDefault();
  const file = document.getElementById("image").files[0];
  const width = document.getElementById("width").value;
  const height = document.getElementById("height").value;

  const url = `${API_URL}/upload?width=${width}&height=${height}`;

  let base64 = null;
    if (file) {
      base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result.split(',')[1];
          resolve(result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        fileName: file?.name,
        contentType: file?.type,
        file: base64,
      }),
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    const link = document.createElement("a");
    link.href = "https://www.google.com";
    link.textContent = result.resizedImageUrl;
    resConatiner.innerHTML = "";
    resConatiner.appendChild(link);
  } catch (error) {
    console.error('Error uploading image:', error);
  }
}

form.addEventListener("submit", uploadImage);
