import "./VerticalToolbar.css";

import circleIcon from "../../../assets/circle.png";
import rectangleIcon from "../../../assets/rectangle.png";
import textIcon from "../../../assets/text.png";
import arrowIcon from "../../../assets/arrow.png";
import widthIcon from "../../../assets/width.png";

const VerticalToolbar = ({
	drawCircle,
	drawRect,
	addText,
	drawArrow,
	penColor,
	changePenColor,
	penWidth,
	changePenWidth,
	widthOpen,
	setWidthOpen,
}) => {
  return (
    <div className="vertical_bar">
      <div className="vertical_button_wrapper">
        <img src={circleIcon} alt="circle" onClick={drawCircle} />
        <img src={rectangleIcon} alt="rectangle" onClick={drawRect} />
        <img src={textIcon} alt="text" onClick={addText} />
        <img src={arrowIcon} alt="arrow" onClick={drawArrow} />
        <input
          type="color"
          value={penColor}
          onChange={(e) => changePenColor(e.target.value)}
        />
        <div className="width_button">
          <img
            src={widthIcon}
            alt="width"
            onClick={() => setWidthOpen(!widthOpen)}
          />
          {widthOpen && (
            <input
              type="range"
              id="width_slider"
              min={1}
              max={30}
              value={penWidth}
              onChange={(e) => changePenWidth(parseInt(e.target.value))}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VerticalToolbar;
