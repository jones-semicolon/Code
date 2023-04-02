import { useState, useRef, useEffect } from "react";
import { IconPlus, IconInnerShadowBottomRight } from "@tabler/icons-react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { html as htmlLang } from "@codemirror/lang-html";
import { css as cssLang } from "@codemirror/lang-css";
import { EditorView } from "@codemirror/view";
import { Resizable } from "re-resizable";
import Tab from "./components/Tab";
import Alert from "./components/Alert";
import "./App.css";

function App() {
  const [content, setContent] = useState("");
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");
  const [saved, setSaved] = useState(false);
  const [tabs, setTabs] = useState("");
  const [currentTab, setCurrentTab] = useState(0);
  const [editorSize, setEditorSize] = useState({ width: "", height: "" });
  const [iframe, setIframe] = useState({ width: "", height: "" });
  const [srcDoc, setSrcDoc] = useState(
    `<html><body></body><style></style><script></script></html>`
  );
  const [flag, setFlag] = useState(false);
  const [iframeFlag, setIframeFlag] = useState(false);

  useEffect(() => {
    if (
      tabs[currentTab] === undefined ||
      !tabs.length ||
      tabs[currentTab].name === ""
    )
      return;
    tabs[currentTab].content = content;
    if (tabs[currentTab].language !== null) {
      const typing = setTimeout(() => {
        localStorage.setItem("content", JSON.stringify(tabs));
        setSaved(true);
      }, 2000);
      return () => clearTimeout(typing);
    }
  }, [content]);

  useEffect(() => {
    if (tabs[currentTab] === undefined || !tabs.length) return;
    //tabs[currentTab].content = content;
    tabs.forEach((tab, i) => {
      let htmlSrc = tabs[currentTab].language === "html";
      let jsSrc = tabs[currentTab].language === "js";
      let cssSrc = tabs[currentTab].language === "css";
      switch (true) {
        case htmlSrc:
          setHtml(content);
          break;
        case cssSrc:
          setCss(content);
          break;
        case jsSrc:
          setJs(content);
          break;
        default:
          return;
      }
      switch (tab.language) {
        case "html":
          setHtml(tab.content);
          break;
        case "css":
          setCss(tab.content);
          break;
        case "js":
          setJs(tab.content);
          break;
        default:
          return;
      }
    });
    const editor = setTimeout(() => {
      setSrcDoc(
        `<html><body>${html}</body><style>${css}</style><script>${js}</script></html>`
      );
    }, 250);
    return () => clearTimeout(editor);
  }, [content, css, html, js, tabs]);

  useEffect(() => {
    if (localStorage.getItem("content")) {
      setTabs(JSON.parse(localStorage.getItem("content")));
    }
  }, []);

  useEffect(() => {
    if (tabs.length === 0) {
      if (JSON.parse(localStorage.getItem("content"))?.length > 0) return;
      setTabs([
        {
          name: "",
          content: "",
          language: "",
        },
      ]);
    } else if (tabs.length > 0) {
      localStorage.setItem("content", JSON.stringify(tabs));
      if (tabs.find((el) => el.language === "css") === undefined) {
        setCss("");
      }
      if (tabs.find((el) => el.language === "html") === undefined) {
        setHtml("");
      }
      if (tabs.find((el) => el.language === "js") === undefined) {
        setJs("");
      }
    }
  }, [tabs]);

  useEffect(() => {
    const tabContainer = document.querySelector(".tabs");
    const tab = document.querySelector(".tab-container");
    if (tabs[currentTab] !== undefined && tabs.length) {
      setContent(tabs[currentTab].content);
    }
    setTimeout(
      () => tabContainer.scrollTo(tab?.offsetWidth * currentTab, 0),
      50
    );
  }, [currentTab, tabs]);

  const closeTab = (index) => {
    if (currentTab >= index && currentTab !== 0 /*|| index !== 0*/) {
      setCurrentTab(currentTab - 1);
    }
    tabs.splice(index, 1);
    if (tabs?.length > 0) {
      setTabs((tabs) => [...tabs]);
    } else {
      localStorage.removeItem("content");
      setTabs([]);
    }
  };

  const addTab = () => {
    tabs?.length
      ? setTabs((tabs) => [...tabs, { name: "", content: "" }])
      : setTabs([{ name: "", content: "" }]);
    setCurrentTab(tabs?.length);
  };

  const lang = (type) => {
    switch (type) {
      case "html":
        return htmlLang();
      case "css":
        return cssLang();
      case "js":
        return javascript();
      default:
        return htmlLang();
    }
  };

  const handleStyles = {
    bottom: {
      marginTop: -7,
      marginLeft: -5,
      top: "100%",
      left: "50%",
      border: "3px solid #999",
      borderLeft: "none",
      borderRight: "none",
      borderTop: "none",
      borderWidth: 5,
      borderColor: "#4d4d4d",
      width: 10,
      height: 10,
      boxSizing: "border-box",
      zIndex: 1,
    },
    right: {
      marginTop: -5,
      marginLeft: -7,
      top: "50%",
      left: "100%",
      border: "3px solid #999",
      borderTop: "none",
      borderLeft: "none",
      borderBottom: "none",
      borderWidth: 5,
      borderColor: "#4d4d4d",
      width: 10,
      height: 10,
      boxSizing: "border-box",
      zIndex: 1,
    },
  };

  return (
    <div className="App">
      <Alert ariaHidden={saved} saved={() => setSaved(false)} />
      <Resizable
        className="resizable-editor"
        defaultSize={{ width: "100%" }}
        height={editorSize.height}
        width={editorSize.width}
        maxHeight="100%"
        onResizeStop={(e, direction, ref, d) => {
          setFlag(false);
          setEditorSize({
            width: editorSize.width + d.width,
            height: editorSize.height + d.height,
          });
        }}
        onResizeStart={(e) => {
          e.stopPropagation();
          setFlag(true);
        }}
        enable={{
          top: false,
          right: true,
          bottom: true,
          left: false,
          topRight: false,
          bottomRight: true,
          bottomLeft: false,
          topLeft: false,
        }}
        handleStyles={flag ? handleStyles : ''}
        handleComponent={{
          bottomRight: flag ? (
            <IconInnerShadowBottomRight style={{ height: "15px" }} />
          ) : (
            ""
          ),
        }}
        bounds="parent"
      >
        <section>
          <nav>
            <div className="toolbar">
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div className="tabs">
              {tabs?.length
                ? tabs.map((tab, i) => (
                    <Tab
                      tab={tab}
                      close={(e) => closeTab(e)}
                      key={i}
                      index={i}
                      editTab={(name, index) => editTab(name, index)}
                      ariaHidden={i === currentTab ? false : true}
                      onClick={(e) => {
                        setCurrentTab(e);
                      }}
                    />
                  ))
                : null}
              <button className="icon" onClick={addTab}>
                <IconPlus />
              </button>
            </div>
          </nav>
          <div className="textarea">
            {tabs?.length
              ? tabs.map((tab, i) => (
                  <CodeMirror
                    value={content}
                    basicSetup={{
                      foldGutter: true,
                      allowMultipleSelections: true,
                      indentOnInput: true,
                      closeBrackets: true,
                      lineNumbers: true,
                      bracketMatching: true,
                      lintKeymap: true,
                      autocompletion: true
                    }}
                    width="100%"
                    minHeight="35px"
                    extensions={[lang(tab.language), EditorView.lineWrapping]}
                    onChange={(value) => setContent(value)}
                    aria-hidden={i === currentTab ? false : true}
                    key={i}
                    theme="dark"
                  />
                ))
              : null}
          </div>
        </section>
      </Resizable>
      <Resizable
        className="resizable-iframe"
        defaultSize={{ height: "100%", width: "100%" }}
        maxHeight="100%"
        maxWidth="100%"
        height={iframe.height}
        width={iframe.width.length}
        onResizeStop={(e, direction, ref, d) => {
          e.stopPropagation();
          setIframeFlag(false);
          setIframe({
            width: iframe.width + d.width,
            height: iframe.height + d.height,
          });
        }}
        onResizeStart={(e) => {
          e.stopPropagation();
          setIframeFlag(true);
        }}
        enable={{
          top: false,
          right: true,
          bottom: true,
          left: false,
          topRight: false,
          bottomRight: true,
          bottomLeft: false,
          topLeft: false,
        }}
        handleStyles={iframeFlag ? handleStyles : ""}
        handleComponent={{
          bottomRight: iframeFlag ? (
            <IconInnerShadowBottomRight style={{ height: "15px" }} />
          ) : (
            ""
          ),
        }}
        bounds="parent"
      >
        <iframe
          frameBorder="0"
          sandbox="allow-scripts"
          srcDoc={srcDoc}
        ></iframe>
      </Resizable>
    </div>
  );
}

export default App;
