import React, { useEffect, useState } from "react";
import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";

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
    try {
      const folderRef = ref(storage, "testingHtml");
      const fileList = await listAll(folderRef);

      for (const item of fileList.items) {
        const fileUrl = await getDownloadURL(item);
        const fileName = item.name;

        // Replace all occurrences of the filename in the HTML
        html = html.replace(new RegExp(fileName, "g"), fileUrl);
      }

      return html;
    } catch (error) {
      console.error("Error replacing relative paths:", error);
      return html;
    }
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
