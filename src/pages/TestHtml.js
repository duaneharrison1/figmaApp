import React, { useEffect, useState } from "react";
import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";

function TestHtml() {
  const [htmlContent, setHtmlContent] = useState("");
  const [executionTime, setExecutionTime] = useState(0);

  const [fileCache, setFileCache] = useState({});  // Cache for storing file URLs
  const [htmlCache, setHtmlCache] = useState({});  // Cache for storing HTML content

  // Preload file URLs into cache
  const preloadFiles = async () => {
    const storage = getStorage();
    const folderRef = ref(storage, "testingTwoHtml");
    const fileList = await listAll(folderRef);

    const cache = {};
    const filePromises = fileList.items.map(async (item) => {
      const fileUrl = await getDownloadURL(item);
      cache[item.name] = fileUrl;
    });

    await Promise.all(filePromises);
    setFileCache(cache);
  };

  // Preload paths on initial load
  useEffect(() => {
    preloadFiles();
    fetchHtml("index.html"); // Load the default page
  }, []);

  // Fetch HTML file
  const fetchHtml = async (fileName) => {
    if (htmlCache[fileName]) {
      // Use cached HTML content if available
      setHtmlContent(htmlCache[fileName]);
      return;
    }

    const startTime = performance.now(); // Start timer
    try {
      const storage = getStorage();
      const fileRef = ref(storage, `testingTwoHtml/${fileName}`);
      const fileUrl = fileCache[fileName] || await getDownloadURL(fileRef); // Use cache or fetch URL

      const response = await fetch(fileUrl);
      let html = await response.text();

      // Replace relative paths and set content
      html = await replaceRelativePaths(html);
      setHtmlContent(html);

      // Cache the HTML content for future use
      setHtmlCache((prevCache) => ({
        ...prevCache,
        [fileName]: html,
      }));

      // Attach navigation handlers and evaluate scripts after rendering
      setTimeout(() => {
        attachNavigationHandlers();
        evaluateScripts(html);
      }, 0);
    } catch (error) {
      console.error(`Error fetching HTML file "${fileName}":`, error);
    } finally {
      const endTime = performance.now(); // End timer
      setExecutionTime(endTime - startTime); // Calculate execution time
    }
  };

  // Replace relative paths in HTML
  const replaceRelativePaths = (html) => {
    Object.keys(fileCache).forEach((fileName) => {
      const fileUrl = fileCache[fileName];
      html = html.replace(new RegExp(`(src|href)="(${fileName})"`, "g"), (_, attr) => `${attr}="${fileUrl}"`);
    });
    return html;
  };

  // Attach navigation handlers for links
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

  // Evaluate the scripts in the HTML
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

  // Expose functions from inline scripts to the global scope
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

  // Navigate to a different HTML file
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
