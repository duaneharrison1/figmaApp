import React, { useEffect } from "react";

const TikTokEmbed = () => {
  useEffect(() => {
    // Load TikTok embed script dynamically
    const script = document.createElement("script");
    script.src = "https://www.tiktok.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (

<>
    <blockquote
        className="tiktok-embed"
        cite="https://www.tiktok.com/@janustiu/video/7342645742324010245"
        data-video-id="7342645742324010245"
        style={styles.embed}
      >
        <section>
          <a
            target="_blank"
            rel="noopener noreferrer"
            title="@janustiu"
            href="https://www.tiktok.com/@janustiu?refer=embed"
          >
            @janustiu
          </a>{" "}
          Figmafolio might be the handy and affordable solution you need to help
          publish your Figma files directly to a website...
        </section>
      </blockquote>
    </> 
  );
};

const styles = {
  container: {
    maxWidth: "400px", 
    minWidth: "325px",
    borderRadius: "12px", 
    overflow: "hidden",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)", 
    margin: "auto",
  },
  embed: {
    maxWidth: "100%", // Ensures it fits within the container
    borderRadius: "12px",
  },
};

export default TikTokEmbed;
