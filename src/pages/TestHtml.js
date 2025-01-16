import React, { useEffect, useState } from "react";
import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";

function TestHtml() {
  const [htmlContent, setHtmlContent] = useState("");

  const fetchHtml = async (fileName) => {
    try {
      const storage = getStorage();
      const fileRef = ref(storage, `testingTwoHtml/${fileName}`);
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
      const folderRef = ref(storage, "testingTwoHtml");
      const fileList = await listAll(folderRef);

      for (const item of fileList.items) {
        const fileUrl = await getDownloadURL(item);
        const fileName = item.name;

        // Replace relative paths in `src` and `link` tags but not `href` attributes
        html = html.replace(
          new RegExp(`(src|href)="(${fileName})"`, "g"),
          (_, attr) => `${attr}="${fileUrl}"`
        );
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

          // Extract only the filename from the href
          const fileName = href.split("/").pop();
          navigateTo(fileName);
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
