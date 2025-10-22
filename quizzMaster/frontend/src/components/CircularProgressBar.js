import style from "../style/Analyses.module.css"

const CircularProgressBar = ({ sqSize, strokeWidth, percentage }) => {
    const radius = (sqSize - strokeWidth) / 2;
    const dashArray = radius * Math.PI * 2;
    const dashOffset = dashArray - dashArray * (percentage / 100);
  
    return (
      <svg width={sqSize} height={sqSize} viewBox={`0 0 ${sqSize} ${sqSize}`}>
        <circle
          className={style["circle-background"]}
          cx={sqSize / 2}
          cy={sqSize / 2}
          r={radius}
          strokeWidth={`${strokeWidth}px`}
          fill="none"
          stroke="#e6e6e6"
        />
        <circle
          className={style["circle-progress"]}
          cx={sqSize / 2}
          cy={sqSize / 2}
          r={radius}
          strokeWidth={`${strokeWidth}px`}
          fill="none"
          stroke="#DD2C00"
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
        />
        <text
          className={style["circle-text"]}
          x="50%"
          y="50%"
          dy=".3em"
          textAnchor="middle"
          fill="#333"
          fontSize="24"
          fontWeight="600"
        >
          {`${percentage}%`}
        </text>
      </svg>
    );
  };

export default CircularProgressBar;