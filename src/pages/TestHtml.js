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

      // Attach custom navigation handlers after loading new content
      setTimeout(() => attachNavigationHandlers(), 0);
    } catch (error) {
      console.error(`Error fetching HTML file "${fileName}":`, error);
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

  const attachNavigationHandlers = () => {
    const links = document.querySelectorAll("a");
    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (href && !href.startsWith("http") && href !== "#") {
        link.addEventListener("click", (event) => {
          event.preventDefault();
          navigateTo(href);
        });
      }
    });
  };

  // Expose the navigateTo function globally
  useEffect(() => {
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
      {/* Render the HTML content dynamically */}
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
}

export default TestHtml;
