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

      // Replace relative paths and set content
      html = await replaceRelativePaths(html, storage);
      setHtmlContent(html);

      // Attach navigation handlers and evaluate scripts after rendering
      setTimeout(() => {
        attachNavigationHandlers();
        evaluateScripts(html);
      }, 0);
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

          const fileName = href.split("/").pop();
          navigateTo(fileName);
        });
      }
    });
  };

  const evaluateScripts = (html) => {
    const container = document.createElement("div");
    container.innerHTML = html;

    const scripts = container.querySelectorAll("script");
    scripts.forEach((script) => {
      try {
        if (script.src) {
          const newScript = document.createElement("script");
          newScript.src = script.src;
          newScript.async = true;
          document.body.appendChild(newScript);
        } else {
          const inlineCode = script.innerHTML;
          const globalFunction = new Function(inlineCode);
          globalFunction();

          exposeFunctionsToGlobalScope(inlineCode);
        }
      } catch (error) {
        console.error("Error evaluating script:", error);
      }
    });
  };

  const exposeFunctionsToGlobalScope = (scriptContent) => {
    const functionRegex = /function\s+([a-zA-Z0-9_]+)/g;
    const matches = [...scriptContent.matchAll(functionRegex)];
    matches.forEach((match) => {
      const functionName = match[1];
      if (!window[functionName]) {
        window[functionName] = new Function(scriptContent);
      }
    });
  };

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
