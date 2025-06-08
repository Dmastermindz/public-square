import React from "react";
import ReactMapGL, { FullscreenControl } from "react-map-gl";

function Map() {
  const [viewport, setViewport] = React.useState({
    width: "100%",
    height: "100%",
    latitidue: 37.7577,
    longitude: -122.4376,
    zoom: 8,
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "scroll";
    };
  }, []);

  return (
    <ReactMapGL
      initialViewState={{
        longitude: 0.1276,
        latitude: 51.5072,
        zoom: 4.4,
        asyncRender: true,
      }}
      // style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/dmastermind/clfn80l9800d201qiaud2dayd"
      mapboxAccessToken="pk.eyJ1IjoiZG1hc3Rlcm1pbmQiLCJhIjoiY2xmbjd0eHF5MGpuMTNycDYzZnZvY2NsNCJ9.vSsm8I_l-DQNPh0Q-vS0dQ"
      //{...viewport}  -- for Applicaiton Controlled Map
    >
      <FullscreenControl position={"bottom-left"} />
    </ReactMapGL>
  );
}

export default Map;
