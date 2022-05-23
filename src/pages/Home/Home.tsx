// @ts-expect-error allow JS imports
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
  exampleSwears[Math.round(Math.random() * exampleSwears.length)];

const taunts = [
  "what a silly thing to say, [NAME]",
  "what did you say this time?",
  "i hope you're happy with yourself, [NAME]",
  "this is so silly, [NAME].",
];
const taunt = taunts[Math.round(Math.random() * taunts.length)];

// Get our localStorage outside of the component

// re-order once so that our prev. selected item is the default selected jar
const initialUserName = localStorage.getItem("user-name") || "";
const initialJarName = localStorage.getItem("jar-name") || "";
const initialJarNames = localStorage.getItem("jar-names") as unknown as string[] || [];

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
  "name-stage",
  "jar-input-stage",
  "jar-select-stage",
  "swear-input-stage",
  "submit-stage",
  "all",
];
let initialStageID = 0;
let straightToSubmitScreen = false;
if (initialJarName !== "" && initialUserName !== "") {
  straightToSubmitScreen = true;
  initialStageID = inputStages.indexOf("submit-stage");
}

// typescript generics lesson:
// type A = {
//   bleh: { hmm: number}
// }

// type B = {
//   hmm: string;
// }

// type C = A & B;

// const myF = <A, B> (a : A, b : B) : A & B => {
//   return {...a, ...b} as any;
// };
// const obj = myF({ bleh: {hmm:2, rah:"baccy"}, }, {hmm:"no",});

// console.log(obj);

// const Home: React.FC<{ myProp: string}> = ({ myProp }) => {
const Home: React.FC = () => {
  const { mode, toggleMode } = useContext(ThemeContext);
  const [userName, setUserName] = useState(initialUserName);
  const [jarNames, setJarNames] = useState(initialJarNames);
  const [jarName, setJarName] = useState(initialJarName);
  const [selectedJar, setSelectedJar] = useState(jarNames[0] || initialJarName);
  const [finalSelectedJar, setFinalSelectedJar] = useState(initialJarName);
  const [swear, setSwear] = useState(localStorage.getItem("swear") || "");
  const [inputStageID, setInputStageID] = useState(initialStageID);
  const formRef = useRef<HTMLFormElement>(null);

  // "Stage" is the stage of user input - name, jarName, swear, etc
  const setStage = (stage: string) => {
    if (inputStages.includes(stage)) {
      setInputStageID(inputStages.indexOf(stage));
    }
  };

  useEffect(() => {
    formRef.current?.removeAttribute("class");
    formRef.current?.classList.add(inputStages[inputStageID]);
  }, [inputStageID]);

  // runs once
  useEffect(() => {
    if (straightToSubmitScreen) {
      setStage("submit-stage");
      document.getElementById("swear-input")?.focus(); // typescript ! operator - I am certain this is here. TS only, just like ? but more worse
    } else {
      document.getElementById("name-stage")?.focus();
    }
  }, []);

  const onSubmit = (e: any)  => { //TODO not "any"
    e.preventDefault();
    console.log("Submitting!");
    // TODO submit name to DB
    // if jar doesn't exist, create jar (and await confirmation?)
    if (true) {
      // submit to firebase

      // set defaults for user's next use
      localStorage.setItem("user-name", userName);
      localStorage.setItem("jar-name", jarName);
      localStorage.setItem("jar-names", [...jarNames, finalSelectedJar] as unknown as string); // TODO REASON NOT TO DO THIS: DON'T LET CLIENT DICTATE TOTAL JAR LIST
      setJarNames([...jarNames, finalSelectedJar]); // ???
    }
    return;
  };

  const onTextFieldKeyDown = (e: any) => { //TODO not "any"
    console.log(typeof(e));
    const form = e.target.form;
    const inputIndex = Array.prototype.indexOf.call(form, e.target);
    if (!e.shiftKey && (e.keyCode === 13 || e.keyCode === 9)) {
      if (
        e.keyCode === 13 &&
        (e.target.id === "submit-button" ||
          (e.target.id === "swear-input" &&
            inputStages[inputStageID] === "send-swear"))
      ) {
        console.log("let the submit code run");
        // let the submit code run
        return;
      }
      if (e.keyCode === 9 && e.target.id === "submit-button") {
        // setStage as all if you're tabbing after the "submit" button
        setStage("all");
      }
      // enter, tab
      if (e.target.value === "" && !e.target.id.includes("button")) {
        // wiggle field, do nothing
        e.preventDefault();
        return;
      }
      // advance form (don't submit!)
      if (inputIndex < form.length - 1) {
        form.elements[inputIndex + 1].focus();
      }
      e.preventDefault();
      return;
    } else if (e.shiftKey && (e.keyCode === 13 || e.keyCode === 9)) {
      // shift-tab / shift + enter
      if (inputIndex > 0) {
        form.elements[inputIndex - 1].focus();
      }
      e.preventDefault();
    }
  };

  const onFocusHandler = (e: any) => { //TODO not "any"
    if (inputStages[inputStageID] === "all") {
      // do nothing
      return;
    }
    // switch on the target IDs - stages and IDs should match
    // default: set stage (stage div id)
    // everything else is special cases, e.g. swear-input
    switch (e.currentTarget.id) {
      case "swear-input-stage":
        if (inputStages[inputStageID] === "submit-stage") {
          return;
        }
        // setStage("all");
        // do something special
        setStage(e.currentTarget.id);
        break;
      default:
        setStage(e.currentTarget.id);
        break;
    }
  };

  const newJarButton = (e : React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (jarName === "") return;
    setFinalSelectedJar(jarName);
    if (inputStages[inputStageID] !== "all") {
      document.getElementById("swear-input")?.focus();
      // setStage("swear-input-stage");
    }
  };
  const jarSelectButton = (e : React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (selectedJar === "") return;
    setFinalSelectedJar(selectedJar);
    if (inputStages[inputStageID] !== "all") {
      document.getElementById("swear-input")?.focus();
    }
  };

  return (
    <div className={"container"}>
      <h1 id="h1">
        place your donations to the swear-jar here:
      </h1>
      {/* "form "name" will be used to cycle stages" */}
      <form className="name" ref={formRef} onSubmit={() => onSubmit}>
        <div className="stage taunt-holder">
          <label>
            <h2>{taunt.replace("[NAME]", userName)}</h2>
          </label>
        </div>
        <div
          className="stage name-input"
          id="name-stage"
          onFocus={(e) => onFocusHandler(e)}
        >
          <label htmlFor="name-input">who are you?</label>
          <input
            onKeyDown={(e) => onTextFieldKeyDown(e)}
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
        <div className="stage jar-holder">
          <div
            className="jar-input"
            id="jar-input-stage"
            onFocus={(e) => onFocusHandler(e)}
          >
            <label htmlFor="jar-input">
              your swear jar will need a name.
              <br />
              what will it be?
            </label>
            <input
              id="jar-input"
              type="text"
              name="jar-input"
              placeholder="e.g. 'Sean and Jessie's jar'"
              value={jarName}
              onKeyDown={(e) => onTextFieldKeyDown(e)}
              onChange={(e) => {
                setJarName(e.target.value);
              }}
            />
            {initialJarNames?.length !== 0 ? (
              <button
                name="new-jar-button"
                id="new-jar-button"
                type="button"
                onClick={(e) => newJarButton(e)}
              >
                new jar
              </button>
            ) : (
              <></>
            )}
          </div>
          {initialJarNames?.length !== 0 ? (
            <div
              className="jar-select"
              id="jar-select-stage"
              onFocus={(e) => onFocusHandler(e)}
            >
              <label htmlFor="jar-select">
                or are you using a jar which exists?
              </label>
              <select
                name="jar-select"
                id="jar-select"
                onKeyDown={(e) => onTextFieldKeyDown(e)}
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
                type="button"
                onClick={(e) => jarSelectButton(e)}
              >
                this jar instead
              </button>
            </div>
          ) : (
            <></>
          )}
        </div>
        <div
          className="stage swear-input"
          id="swear-input-stage"
          onFocus={(e) => onFocusHandler(e)}
        >
          <label htmlFor="swear-input">
            what came out of that dirty mouth? &gt;{":("}
          </label>
          <input
            onKeyDown={(e) => onTextFieldKeyDown(e)}
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
        <div
          className="stage submit-input"
          id="submit-stage"
          onFocus={(e) => onFocusHandler(e)}
        >
          <label htmlFor="submit-button">
            press this button and we'll make a note of it in your jar,{" "}
            <i>{finalSelectedJar}</i>
          </label>
          <label htmlFor="submit-button">
            (we aren't donating money, but we are adding to your swear log 😊)
          </label>
          <button
            onKeyDown={(e) => onTextFieldKeyDown(e)}
            name="submit-button"
            id="submit-button"
            type="submit"
          >
            send to the jar 🤬🤬🤬
          </button>
        </div>
      </form>
      <ThemeToggle mode={mode} toggleMode={toggleMode} />
    </div>
  );
};

export default Home;
