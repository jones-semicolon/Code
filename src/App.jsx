import { useState, useRef, useEffect } from "react";
import * as ReactDOM from "react-dom";
import { IconPlus } from "@tabler/icons-react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css";
import Tab from "./components/Tab";
import Alert from "./components/Alert";
import "./App.css";

function App() {
  const [content, setContent] = useState("");
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");
  const [saved, setSaved] = useState(false);
  const [tabs, setTabs] = useState([]);
  //const currentTab = useRef(0);
  const [currentTab, setCurrentTab] = useState(0);
  const source = useRef(null);
  const editorRef = useRef(null);
  var typingTimer;

  useEffect(() => {
    if (!source.current && content === null) return;
    if (tabs.length) {
      Promise.all(
        tabs.map((tab, i) => {
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
        })
      ).then(() => {
        if (tabs[currentTab].language) {
          let code = `<style>${css}</style>${html}<script>${js}</script>`;
          source.current.contentWindow.document.open();
          source.current.contentWindow.document.write(code);
          source.current.contentWindow.document.close();
        }
      });
    }
    if (tabs.length && tabs[currentTab] !== "undefined") {
      tabs[currentTab].content = content;
    }
    if (
      tabs.length &&
      tabs[currentTab] !== "undefined" &&
      tabs[currentTab].language !== "undefined" &&
      tabs[currentTab].language !== ""
    ) {
      const textarea = document.querySelector(
        '[aria-hidden="false"] > textarea'
      );
      function startTyping() {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
          localStorage.setItem("content", JSON.stringify(tabs));
          setSaved(true);
        }, 3000);
      }
      const clearTime = () => clearTimeout(typingTimer);
      textarea.addEventListener("keyup", startTyping);
      textarea.addEventListener("keydown", clearTime);
      return () => {
        textarea.removeEventListener("keyup", startTyping);
        textarea.removeEventListener("keydown", clearTime);
      };
    }
  }, [content, html, js, css]);

  useEffect(() => {
    if (localStorage.getItem("content")) {
      setTabs(JSON.parse(localStorage.getItem("content")));
    }
    const textContainer = document.querySelector(".textarea")
    const edit = () => {
      document.querySelector("[aria-hidden=false] textarea").focus()
    }
    textContainer.addEventListener("click", edit)
    return(() => textContainer.removeEventListener("click", edit))
  }, []);

  useEffect(() => {
    
    if (
      (tabs.length === 0 && !localStorage.getItem("content")) ||
      JSON.parse(localStorage.getItem("content"))?.length === 0
    ) {
      setTabs([
        {
          name: "",
          content: "",
          language: "",
        },
      ]);
    } else if (tabs.length > 0) {
      localStorage.setItem("content", JSON.stringify(tabs));
    }
    
  }, [tabs]);

  useEffect(() => {
    const tabContainer = document.querySelector(".tabs");
    if (tabs[currentTab] !== undefined && tabs.length) {
      setContent(tabs[currentTab].content);
    }
    setTimeout(() => 
    tabContainer.scrollTo(tabContainer.offsetWidth * currentTab, 0), 50)
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
    setCurrentTab(tabs?.length)
  };

  const lang = (type) => {
    switch (type) {
      case "html":
        return languages.html;
      case "css":
        return languages.css;
      case "js":
        return languages.js;
      default:
        return languages.txt;
    }
  };

  return (
    <div className="App">
      <Alert ariaHidden={saved} saved={() => setSaved(false)} />
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
                <Editor
                  value={content}
                  onValueChange={(code) => setContent(code)}
                  highlight={(code) => highlight(code, lang(tab.language))}
                  key={i}
                  padding={5}
                  aria-hidden={i === currentTab ? false : true}
                  ref={editorRef}
                />
              ))
            : null}
        </div>
      </section>
      <iframe frameBorder="0" ref={source}></iframe>
    </div>
  );
}

export default App;
