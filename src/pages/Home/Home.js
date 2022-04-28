// import { X, Y, Z } from "../../features";
import { ThemeToggle } from "../../components";
import { ThemeContext } from "../../Theme";
import React, { useState, useContext, useEffect, useRef } from "react";
import { ReactDOM } from "react";

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
const inputStages = ["name", "swear", "jar", "send swear", "all"];

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

    const allInputDivs = formRef.current.getElementsByClassName("input");
    for (let div in allInputDivs) {
      // div.classList.remove("display-on");
    }
    console.log("allInputDivs", allInputDivs);

    // allInputDivs.classList.remove("test");

    switch (inputStages[inputStageID % inputStages.length]) {
      case "name":
        // formRef.current
        //   .getElementsByClassName("name-input")
        //   .classList.add("display-on");
        // formRef.current
        //   .getElementsByClassName("nav-buttons")
        //   .classList.add("display-on");
        break;
      case "swear":
        break;
      case "jar":
        break;
      case "send swear":
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

  const onInputKeyPress = (e) => {
    // handle enters and tabs to move on
    // if key === tab or enter, increment
    // if key === shift+tab, de-increment
    if (false) {
      incrementStage(1);
    }
  };

  const jarSelectButton = () => {
    //
  };
  const newJarButton = () => {
    //
  };

  const incrementStage = (byThisAmount) => {
    console.log("hmm");
    setInputStageID((inputStageID + byThisAmount) % inputStages.length);
  };

  return (
    <div className={"container"}>
      <h1 alt="we swear a little too much">
        place your donations to the swear-jar here:
      </h1>
      <form ref={formRef} onSubmit={onSubmit}>
        <div className="input name-input">
          <label>who are you?</label>
          <input
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
        <div className="input swear-input">
          <label>what came out of that dirty mouth? &gt;:(</label>
          <input
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
        <div className="input jar-holder">
          <div className="jar-input">
            <label>what's the name of your jar?</label>
            <input
              id="jar-input"
              type="text"
              name="jar-input"
              placeholder={"e.g. 'Sean and Jessie's jar'"}
              value={jarName}
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
        <div className="input submit-input">
          <button name="submit-button" id="submit-button" type="submit">
            &gt; 🤬 &gt;
          </button>
        </div>
        <div className="input nav-buttons">
          <button
            name="last-button"
            id="last-button"
            onClick={() =>
              setInputStageID((inputStageID - 1) % inputStages.length)
            }
          >
            &lt; &lt; &lt;
          </button>
          <button
            name="next-button"
            id="next-button"
            onClick={() =>
              setInputStageID((inputStageID - 1) % inputStages.length)
            }
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
