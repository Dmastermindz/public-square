// TradingViewWidget.jsx
import React, { useEffect, useRef, memo } from "react";
function TradingViewWidget() {
  const container = useRef();
  useEffect(() => {
    // Add custom styling for the iframe content
    const style = document.createElement("style");
    style.textContent = `
      .tradingview-widget-container iframe {
        background-color: rgba(9, 13, 24, 255) !important;
      }
      
      /* Hide the iframe's embedded GeckoTerminal logo/footer */
      iframe#geckoterminal-embed {
        height: calc(100% + 80px) !important;
        margin-bottom: -40px;
        margin-top: -40px;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  return (
    <div
      className="tradingview-widget-container"
      ref={container}
      style={{ height: "100%", width: "100%", overflow: "hidden" }}>
      <iframe
        height="100%"
        width="100%"
        id="geckoterminal-embed"
        title="GeckoTerminal Embed"
        src="https://www.geckoterminal.com/base/pools/0x30ec7b2f5be26d03d20ac86554daadd2b738ca0f?embed=1&info=0&swaps=0&grayscale=0&light_chart=0&chart_type=price&resolution=15m&theme=dark&header=0&logo=0"
        frameBorder="0"
        allow="clipboard-write"
        allowFullScreen
        style={{ backgroundColor: "rgba(9, 13, 24, 255)" }}
      />
      <div
        className="tradingview-widget-copyright"
        href="https://www.geckoterminal.com/"
        rel="noopener nofollow"
        target="_blank"></div>
    </div>
  );
}
export default memo(TradingViewWidget);
