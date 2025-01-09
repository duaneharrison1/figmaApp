import React, { useEffect, useState } from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

function TestHtml() {
  const [htmlContent, setHtmlContent] = useState("");

  const fetchHtml = async (fileName) => {
    try {
      const storage = getStorage();
      const fileRef = ref(storage, `testingHtml/${fileName}`);
      const fileUrl = await getDownloadURL(fileRef);

      const response = await fetch(fileUrl);
      let html = await response.text();

      html = await replaceRelativePaths(html, storage);
      setHtmlContent(html);
    } catch (error) {
      console.error("Error fetching HTML file:", error);
    }
  };

  const replaceRelativePaths = async (html, storage) => {
    const replacements = {
      "styles.css": "testingHtml/styles.css",
      "imageOne.jpg": "testingHtml/imageOne.jpg",
    };

    for (const [relativePath, storagePath] of Object.entries(replacements)) {
      const fileRef = ref(storage, storagePath);
      const fileUrl = await getDownloadURL(fileRef);
      html = html.replace(new RegExp(relativePath, "g"), fileUrl);
    }

    return html;
  };

  // Expose the navigateTo function globally
  useEffect(() => {
    window.navigateTo = (fileName) => {
      fetchHtml(fileName);
    };

    // Load the default page
    fetchHtml("index.html");
  }, []);

  return (
    <div>
      {/* Render the HTML content dynamically */}
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
}

export default TestHtml;
