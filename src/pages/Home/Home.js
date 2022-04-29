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

const taunts = [
  "what a silly thing to say, [NAME]",
  "what did you say this time?",
  "i hope you're happy with yourself, [NAME]",
  "this is so silly, [NAME].",
];
const taunt = taunts[parseInt(Math.random() * taunts.length)];

// Get our localStorage outside of the component
// re-order once so that our prev. selected item is the default selected jar
const initialUserName = localStorage.getItem("user-name") || "";
const initialJarName = localStorage.getItem("jar-name") || "";
const initialJarNames = localStorage.getItem("jar-names") || [
  "Community Jar",
  "John's Jar",
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
const inputStages = [
  "name",
  "swear",
  "new-jar",
  "existing-jar",
  "send-swear",
  "all",
];
let initialStageID = 0;
let straightToSubmitScreen = false;
if (initialJarName !== "" && initialUserName !== "") {
  initialStageID = inputStages.indexOf("send-swear");
  straightToSubmitScreen = true;
}

const Home = () => {
  const { mode, toggleMode } = useContext(ThemeContext);
  const [userName, setUserName] = useState(initialUserName);
  const [jarNames, setJarNames] = useState(initialJarNames);
  const [jarName, setJarName] = useState(initialJarName);
  const [selectedJar, setSelectedJar] = useState(jarNames[0] || initialJarName);
  const [finalSelectedJar, setFinalSelectedJar] = useState(initialJarName);
  const [swear, setSwear] = useState(localStorage.getItem("swear") || "");
  const [inputStageID, setInputStageID] = useState(initialStageID);
  const formRef = useRef(null);

  const setStage = (stage) => {
    if (inputStages.includes(stage)) {
      setInputStageID(inputStages.indexOf(stage));
    }
  };

  // useEffect to handle auto-focus
  useEffect(() => {
    if (formRef === null) return;

    formRef.current.removeAttribute("class");
    formRef.current.classList.add(inputStages[inputStageID]);

    switch (inputStages[inputStageID % inputStages.length]) {
      case "name":
        // name-input
        document.getElementById("name-input").focus();
        break;
      case "swear":
        // swear-input
        document.getElementById("swear-input").focus();
        break;
      case "new-jar":
        if (initialJarName !== "") {
          setStage("existing-jar");
        }
        document.getElementById("jar-input").focus();
        break;
      case "existing-jar":
        // If the user had an earlier jar, use that. If not, direct them to new jar creation
        document.getElementById("jar-select").focus();
        break;
      case "send-swear":
        // submit-button
        straightToSubmitScreen
          ? document.getElementById("swear-input").focus()
          : document.getElementById("submit-button").focus();
        break;
      default:
      //
    }
  }, [inputStageID]);

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting!");
    // incrementStage(1);
    // TODO submit name to DB
    // if jar doesn't exist, create jar (and await confirmation?)
    if (false) {
      setJarNames([...jarNames, finalSelectedJar]); // ???
    }
    return;
  };

  const onInputKeyDown = (e) => {
    // handle enters and tabs to move on
    // if key === tab or enter, increment
    // if key === shift+tab, de-increment

    if (inputStages[inputStageID] === "all") return;

    if (e.shiftKey && (e.keyCode === 13 || e.keyCode === 9)) {
      e.preventDefault();
      incrementStage(-1);
    } else if (e.keyCode === 13 || e.keyCode === 9) {
      if (e.target.value === "") {
        e.preventDefault();
      }
      if (
        inputStages[inputStageID] !== "all" &&
        inputStages[inputStageID] !== "send-swear" &&
        e.target.value !== ""
      ) {
        // e.preventDefault();
        incrementStage(1);
      }
    }
  };

  const newJarButton = (e) => {
    e.preventDefault();
    if (jarName === "") return;
    setFinalSelectedJar(jarName);
    if (inputStages[inputStageID] !== "all") {
      setStage("send-swear");
      // incrementStage(1);
    }
  };
  const jarSelectButton = (e) => {
    e.preventDefault();
    if (selectedJar === "") return;
    setFinalSelectedJar(selectedJar);
    if (inputStages[inputStageID] !== "all") {
      setStage("send-swear");
      // incrementStage(1);
    }
  };

  const incrementStage = (byThisAmount) => {
    setInputStageID(
      (inputStageID + byThisAmount + inputStages.length) % inputStages.length
    );
  };

  return (
    <div className={"container"}>
      <h1 id="h1" tabIndex={-1} alt="we swear a little too much">
        place your donations to the swear-jar here:
      </h1>
      {/* "form "name" will be used to cycle stages" */}
      <form className="name" ref={formRef} onSubmit={onSubmit}>
        <div className="stage taunt-holder">
          <label>
            <h2>{taunt.replace("[NAME]", userName)}</h2>
          </label>
        </div>
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
          <div className="jar-input" onFocus={() => setStage("new-jar")}>
            <label>what's the name of your jar?</label>
            <input
              id="jar-input"
              type="text"
              name="jar-input"
              placeholder="e.g. 'Sean and Jessie's jar'"
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
              this new jar
            </button>
          </div>
          <div className="jar-select" onFocus={() => setStage("existing-jar")}>
            <label>or are you using a jar which exists?</label>
            <select
              name="jar-select"
              id="jar-select"
              onChange={(e) => setSelectedJar(e.target.value)}
            >
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
          <label>
            {swear === ""
              ? "\xa0"
              : swear + ": straight to " + finalSelectedJar}
          </label>
          <button name="submit-button" id="submit-button" type="submit">
            send to the jar 🤬🤬🤬
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
};

export default Home;
