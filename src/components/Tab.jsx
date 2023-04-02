import { useState, useEffect } from "react";
import {
  IconBrandHtml5,
  IconX,
  IconBrandCss3,
  IconBrandJavascript,
  IconCode,

} from "@tabler/icons-react";

export default function Tab(props) {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (title.length) {
      props.tab.name = title;
    }
    if (props.tab.name.length === 1) return;
    setTitle(props.tab.name);
  }, [title]);

  const logoHandler = (str) => {
    switch (true) {
      case /^.*\.html$/.test(str):
        props.tab.language = "html";
        return (
          <IconBrandHtml5
            style={{ fill: "hsl(0 70% 60%)", stroke: "hsl(0 70% 60%)" }}
          />
        );
      case /^.*\.css$/.test(str):
        props.tab.language = "css";
        return (
          <IconBrandCss3
            style={{ fill: "hsl(190 70% 40%)", stroke: "hsl(190 70% 40%)" }}
          />
        );
      case /^.*\.js$/.test(str):
        props.tab.language = "js";
        return (
          <IconBrandJavascript
            style={{ fill: "hsl(45 70% 60%)", stroke: "hsl(45 70% 60%)" }}
          />
        );
      default:
        props.tab.language = "txt";
        return <IconCode />;
    }
  };

  return (
    <div
      className="tab-container"
      aria-hidden={props.ariaHidden}
      onClick={() => props.onClick(props.index)}
    >
      <div className="icon" onClick={() => props.onClick(props.index)}>
        {logoHandler(title)}
      </div>
      <input
        type="text"
        placeholder="Untitled"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onClick={() => {
          props.onClick(props.index);
        }}
      />
      <button
        className="icon"
        onClick={(e) => {
          e.stopPropagation();
          props.close(props.index);
          setTitle("");
        }}
      >
        <IconX />
      </button>
    </div>
  );
}
