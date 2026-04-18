import React, { useEffect, useState } from "react";

function Loading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((old) => {
        if (old >= 100) return 100;
        return old + Math.random() * 10; // random increment for realism
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      <div style={{ ...styles.bar, width: `${progress}%` }} />
    </div>
  );
}

const styles = {
  container: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "6px",
    backgroundColor: "#0B0F19",
    zIndex: 9999,
  },
  bar: {
    height: "100%",
    backgroundColor: "#4f46e5", // nice blue/purple color for CRM vibes
    transition: "width 0.2s ease",
  },
};

export default Loading;
