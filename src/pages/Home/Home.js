// import { X, Y, Z } from "../../features";
import { ThemeToggle } from "../../components";
import { ThemeContext } from "../../Theme";
import React, { useState, useContext, useEffect, useRef } from "react";

const exampleSwears = [
  "bollock-chops",
  "oh crumpets",
  "flipping hell",
  "crikey",
  "finland!",
  "cheesy crisps",
  "holy cow",
  "frak it",
  "aw jeez aw man",
];

const exampleSwear =
  exampleSwears[parseInt(Math.random() * exampleSwears.length)];

// Get our localStorage outside of the component
// re-order once so that our prev. selected item is the default selected jar
const initialJarName = localStorage.getItem("jar-name") || "Jessie's Jar";
const initialJarNames = localStorage.getItem("jar-names") || [
  "Sean's Jar",
  "Jessie's Jar",
];

// Shift our initial jarName to the top of the list (add it if it isn't there)
if (initialJarName !== "") {
  if (initialJarNames.includes(initialJarName)) {
    initialJarNames.splice(initialJarNames.indexOf(initialJarName), 1);
  }
  initialJarNames.unshift(initialJarName);
}

// Input stages used to display ONLY the fields we want at a time
// "send swear" will be the default once a user has set themselves up - then it's a "swear + send button" situ
const inputStages = ["name", "swear", "jar", "send-swear", "all"];

function Home() {
  const { mode, toggleMode } = useContext(ThemeContext);
  const [userName, setUserName] = useState(
    localStorage.getItem("user-name") || ""
  );
  const [jarName, setJarName] = useState(initialJarName);
  const [jarNames, setJarNames] = useState(initialJarNames);
  const [swear, setSwear] = useState(localStorage.getItem("swear") || "");
  const [inputStageID, setInputStageID] = useState(
    localStorage.getItem("input-stage-id") || 0
  );
  const formRef = useRef(null);

  useEffect(() => {
    if (formRef === null) return;

    formRef.current.removeAttribute("class");
    formRef.current.classList.add(inputStages[inputStageID]);
    console.log(inputStageID, inputStages[inputStageID]);

    switch (inputStages[inputStageID % inputStages.length]) {
      case "name":
        // name-input
        document.getElementById("name-input").focus();
        break;
      case "swear":
        // swear-input
        document.getElementById("swear-input").focus();
        console.log(document.getElementById("swear-input"));
        break;
      case "jar":
        // jar-select
        document.getElementById("jar-select").focus();
        break;
      case "send-swear":
        // submit-button
        document.getElementById("submit-button").focus();
        break;
      default:
      //
    }
  }, [inputStageID]);

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting!");
    // TODO submit name to DB
    // if jar doesn't exist, create jar (and await confirmation?)
    if (false) {
      const newJar = "";
      setJarNames([...jarNames, newJar]);
    }
    return;
  };

  const onInputKeyDown = (e) => {
    // handle enters and tabs to move on
    // if key === tab or enter, increment
    // if key === shift+tab, de-increment
    e.preventDefault();
    if (e.shiftKey && (e.keyCode === 13 || e.keyCode === 9)) {
      incrementStage(-1);
    }
    if (e.keyCode === 13 || e.keyCode === 9) {
      console.log("pressed!");
      incrementStage(1);
    }
  };

  const jarSelectButton = (e) => {
    console.log(e);
    incrementStage(1);
  };
  const newJarButton = (e) => {
    console.log(e);
    incrementStage(1);
  };

  const incrementStage = (byThisAmount) => {
    setInputStageID((inputStageID + byThisAmount) % inputStages.length);
  };

  return (
    <div className={"container"}>
      <h1 alt="we swear a little too much">
        place your donations to the swear-jar here:
      </h1>
      {/* form className will be used to cycle stages */}
      <form className="name" ref={formRef} onSubmit={onSubmit}>
        <div className="stage name-input">
          <label>who are you?</label>
          <input
            onKeyDown={(e) => onInputKeyDown(e)}
            id="name-input"
            type="text"
            name="name-input"
            placeholder="e.g. 'sean'"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
          />
        </div>
        <div className="stage swear-input">
          <label>what came out of that dirty mouth? &gt;:(</label>
          <input
            onKeyDown={(e) => onInputKeyDown(e)}
            id="swear-input"
            type="text"
            name="swear-input"
            placeholder={"e.g. '" + exampleSwear + "'"}
            value={swear}
            onChange={(e) => {
              setSwear(e.target.value);
            }}
          ></input>
        </div>
        <div className="stage jar-holder">
          <div className="jar-input">
            <label>what's the name of your jar?</label>
            <input
              id="jar-input"
              type="text"
              name="jar-input"
              placeholder={"e.g. 'Sean and Jessie's jar'"}
              value={jarName}
              onKeyDown={(e) => {
                if (e.shiftKey && e.keyCode === 9) {
                  incrementStage(-1);
                }
              }}
              onChange={(e) => {
                setJarName(e.target.value);
              }}
            />
            <button
              name="new-jar-button"
              id="new-jar-button"
              onClick={newJarButton}
            >
              this jar
            </button>
          </div>
          <div className="jar-select">
            <label>or are you using a jar which exists?</label>
            <select name="jar-select" id="jar-select">
              {jarNames?.map((jar, i) => {
                return (
                  <option key={i} value={jar}>
                    {jar}
                  </option>
                );
              })}
            </select>
            <button
              name="jar-select-button"
              id="jar-select-button"
              onClick={jarSelectButton}
            >
              this jar instead
            </button>
          </div>
        </div>
        <div className="stage submit-input">
          <button name="submit-button" id="submit-button" type="submit">
            &gt; 🤬 &gt;
          </button>
        </div>
        <div className="stage nav-buttons">
          <button
            name="last-button"
            id="last-button"
            onClick={() => incrementStage(-1)}
          >
            &lt; &lt; &lt;
          </button>
          <button
            name="next-button"
            id="next-button"
            onClick={() => incrementStage(1)}
          >
            &gt; &gt; &gt;
          </button>
        </div>
      </form>
      <ThemeToggle mode={mode} toggleMode={toggleMode} />
    </div>
  );
}

export default Home;
