import React, { useState, useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import * as qna from "@tensorflow-models/qna";
import * as tf from "@tensorflow/tfjs";
import "../components/body.css";
import predata from "../utils/predata";

const Body = () => {
  const [model, setModel] = useState(null);
  let [color, setColor] = useState("#ffffff");
  const [question, setQuestion] = useState("");
  const [passage, setPassage] = useState(predata);
  const [answers, setAnswers] = useState([]);
  const [err, setErr] = useState(0);

  useEffect(() => {
    async function loadQnAModel() {
      await tf.setBackend("webgl");
      const qnaModel = await qna.load();
      setModel(qnaModel);
    }

    loadQnAModel();
  }, []);

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const handlePassageChange = (event) => {
    setPassage(event.target.value);
  };

  const findAnswers = async () => {
    try {
      if (!model || !question || !passage) {
        setErr(1);
        setAnswers([]);
        return;
      }
      setErr(0);
      const results = await model.findAnswers(question, passage);
      console.log(results);
      setAnswers(results);
    } catch (error) {
      console.error("Error finding answers:", error);
    }
  };

  return (
    <div className="body-container">
      {model ? (
        <div>
          <h1>QnA-Guruji</h1>

          <div className="passage-container">
            <label>Passage:</label>
            <textarea
              value={passage}
              onChange={handlePassageChange}
              style={{ width: "500px", height: "200px" }}
            />
          </div>
          <div className="question-container">
            <label>Question:</label>
            <input
              type="text"
              value={question}
              onChange={handleQuestionChange}
              style={{ width: "400px", height: "50px" }}
            />
          </div>
          <button className="find-answer-btn" onClick={findAnswers}>
            Find Answers
          </button>
          <div className="answer-container">
            <label>Answers:</label>
            {err ? (
              <div style={{ color: "red" }}>
                {"Error: Kindly provide the missing fields."}
              </div>
            ) : (
              <textarea readOnly>
                {answers.length > 0 ? (
                  <ul>
                    {answers.map((answer, index) => (
                      <li key={index}>{answer.text}</li>
                    ))}
                  </ul>
                ) : (
                  "No answers for the context."
                )}
              </textarea>
            )}
          </div>
        </div>
      ) : (
        <div>
          <h1>Model is still loading.</h1>
          <ClipLoader
            color={color}
            loading={!model}
            size={100}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}
    </div>
  );
};

export default Body;
