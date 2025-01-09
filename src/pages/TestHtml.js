import React, { useEffect, useState } from "react";
import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";

function TestHtml() {
  const [htmlContent, setHtmlContent] = useState("");
  const [fileUrls, setFileUrls] = useState({});

  const fetchHtml = async (filePath) => {
    try {
      const storage = getStorage();
      const fileRef = ref(storage, filePath);
      const fileUrl = await getDownloadURL(fileRef);

      const response = await fetch(fileUrl);
      let html = await response.text();

      html = replaceRelativePaths(html);
      setHtmlContent(html);
    } catch (error) {
      console.error("Error fetching HTML file:", error);
    }
  };

  const replaceRelativePaths = (html) => {
    // Replace all known file paths in the HTML
    Object.entries(fileUrls).forEach(([fileName, fileUrl]) => {
      const regex = new RegExp(fileName, "g");
      html = html.replace(regex, fileUrl);
    });
    return html;
  };

  const listFiles = async () => {
    try {
      const storage = getStorage();
      const folderRef = ref(storage, "testingHtml");
      const folderContents = await listAll(folderRef);

      // Map filenames to their URLs
      const filePromises = folderContents.items.map(async (item) => {
        const fileUrl = await getDownloadURL(item);
        return { name: item.name, url: fileUrl };
      });

      const filesData = await Promise.all(filePromises);
      const fileUrlsMap = filesData.reduce((acc, file) => {
        acc[file.name] = file.url;
        return acc;
      }, {});

      setFileUrls(fileUrlsMap);

      // Default: Load the first HTML file (or specific file if desired)
      const htmlFiles = filesData.filter((file) => file.name.endsWith(".html"));
      if (htmlFiles.length > 0) {
        fetchHtml(`testingHtml/${htmlFiles[0].name}`); 
      }
    } catch (error) {
      console.error("Error listing files:", error);
    }
  };

  useEffect(() => {
    listFiles();
  }, []);

  return (
    <div>
      {/* Render the HTML content dynamically */}
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
}

export default TestHtml;
