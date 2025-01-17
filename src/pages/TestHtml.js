import React, { useEffect, useState } from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

function TestHtml() {
  const [htmlContent, setHtmlContent] = useState("");
  const [executionTime, setExecutionTime] = useState(0);

  const fetchHtml = async (fileName) => {
    const startTime = performance.now(); // Start timer
    try {
      const storage = getStorage();
      const fileRef = ref(storage, `testingTwoHtml/${fileName}`);
      const fileUrl = await getDownloadURL(fileRef);

      const response = await fetch(fileUrl);
      let html = await response.text();

      // Replace relative paths in the HTML with their Firebase Storage URLs
      html = await replaceRelativePaths(html, storage);
      setHtmlContent(html);
    } catch (error) {
      console.error(`Error fetching HTML file "${fileName}":`, error);
    } finally {
      const endTime = performance.now(); // End timer
      setExecutionTime(endTime - startTime); // Calculate execution time
    }
  };

  const replaceRelativePaths = async (html, storage) => {
    try {
      // Extract all `src` and `href` attributes from the HTML
      const resourceRegex = /(src|href)="([^"]+)"/g;
      const matches = [...html.matchAll(resourceRegex)];

      for (const match of matches) {
        const [fullMatch, attr, relativePath] = match;

        // Skip external URLs or already resolved paths
        if (relativePath.startsWith("http") || relativePath.startsWith("//")) {
          continue;
        }

        try {
          // Get the Firebase Storage URL for the referenced file
          const fileRef = ref(storage, `testingTwoHtml/${relativePath}`);
          const fileUrl = await getDownloadURL(fileRef);

          // Replace the relative path in the HTML with the resolved Firebase URL
          html = html.replace(fullMatch, `${attr}="${fileUrl}"`);
        } catch (error) {
          console.warn(`Resource "${relativePath}" not found in storage.`);
        }
      }

      return html;
    } catch (error) {
      console.error("Error replacing relative paths:", error);
      return html;
    }
  };

  useEffect(() => {
    // Expose navigation function globally for links in the HTML
    window.navigateTo = (fileName) => {
      if (fileName) fetchHtml(fileName);
    };

    // Load the default page
    fetchHtml("index.html");
  }, []);

  const navigateTo = async (fileName) => {
    if (fileName) {
      await fetchHtml(fileName);
    } else {
      console.error("File name is required for navigation.");
    }
  };

  return (
    <div>
      <div>
        <h3>Execution Time: {executionTime.toFixed(2)} millisecond</h3>
      </div>
      {/* Render the HTML content dynamically */}
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
}

export default TestHtml;
