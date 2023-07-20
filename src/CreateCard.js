import "./App.css";
import React, { useEffect } from "react";
import { useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import lottie from "lottie-web";
import submitLogo from "./submit.json";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AnimatedPage from "./transition/AnimatedPage";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase/firebaseConfig";
import { useProfileStore } from "./globalState/useProfileStore";
import { useLoading } from "./globalState/useLoading";
import { Snackbar } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function CreateCard() {
  
  const {  user } = useAuth0();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [isLoading, setLoadingMessage, finishLoading, loadingMessage] =
    useLoading((state) => [
      state.isLoading,
      state.setLoadingMessage,
      state.finishLoading,
      state.loadingMessage,
    ]);

  const [state, setState] = React.useState({
    Open: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, Open } = state;

  const handleClick = (newState) => () => {
    setState({ Open: true, ...newState });
  };

  const [cardQuestion, setCardQuestion] = useState("");
  const [cardAnswer, setCardAnswer] = useState("");
  const [cards, setCard] = useState({});
  const [twitter, setTwitter] = useState("");
  const [about, setAbout] = useState("");

  const name = useProfileStore((state) => state.profileName);

  useEffect(() => {
    getDoc(doc(db, "info", user.name)).then((docSnap) => {
      if (docSnap.exists()) {
        setCard(docSnap.data().cards);
        setTwitter(docSnap.data().twitter);
        setAbout(docSnap.data().about);
      } else {
        console.log("No such document!");
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardAnswer, cardQuestion]);

  const onSubmit = async () => {
    const tempArr = {
      front: cardQuestion,
      back: cardAnswer,
    };

    cards.push(tempArr);

    setLoadingMessage("Saving changes...");
    handleClick({
      vertical: "top",
      horizontal: "center",
    })();

    try {
      await setDoc(doc(db, "info", user.name), {
        name: name,
        about: about,
        twitter: twitter,
        cards: cards,
      }).then(() => {
        console.log("successfully added card");
        handleOpen();

        finishLoading();
      });
    } catch (error) {
      console.log(error.message, "error getting image");
    }
  };

  function handleChange1(event) {
    setCardQuestion(event.target.value);
  }

  function handleChange2(event) {
    setCardAnswer(event.target.value);
  }

  React.useEffect(() => {
    lottie.loadAnimation({
      container: document.querySelector("#react-logo"),
      animationData: submitLogo,
      renderer: "svg", // "canvas", "html"
      loop: true, // boolean
      autoplay: true, // boolean
    });
  }, []);

  return (
    <AnimatedPage>
      <div className="CreateCard">
        {isLoading && (
          <div>
            <Snackbar
              anchorOrigin={{ vertical, horizontal }}
              open={Open}
              onClose={handleClose}
              message={loadingMessage}
              key={vertical + horizontal}
            />
          </div>
        )}
        <div class="min-h-screen bg-backcolor py-6 flex flex-col justify-center sm:py-12">
          <div class="relative py-3 sm:max-w-xl sm:mx-auto">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
            <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
              <div class="max-w-md mx-auto">
                <div>
                  <h1 class="text-2xl font-semibold">Fill your card</h1>
                </div>
                <div class="divide-y divide-gray-200">
                  <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                    <div class="relative">
                      <input
                        autocomplete="off"
                        id="question"
                        name="question"
                        onChange={handleChange1}
                        value={cardQuestion}
                        type="text"
                        class="peer 
                              placeholder-transparent
                              h-10 w-full border-b-2
                              border-gray-30
                              0 text-gray-900
                              focus:outline-none
                                 focus:borer-rose-600"
                        placeholder="Question"
                      />
                      <label
                        for="question"
                        class="absolute 
                            left-0 
                            -top-3.5
                            text-gray-600
                            text-sm 
                            peer-placeholder-shown:text-base
                            peer-placeholder-shown:text-gray-440 
                            peer-placeholder-shown:top-2
                            transition-all peer-focus:-top-3.5
                            peer-focus:text-gray-600 
                            peer-focus:text-sm"
                      >
                        Question
                      </label>
                    </div>
                    <div class="relative">
                      <input
                        autocomplete="off"
                        id="Answer"
                        name="Answer"
                        onChange={handleChange2}
                        value={cardAnswer}
                        type="text"
                        class="peer placeholder-transparent 
                              h-10
                                w-full 
                                border-b-2
                                border-gray-300
                                text-gray-900 
                                focus:outline-none 
                                focus:borer-rose-600"
                        placeholder="Answer"
                      />
                      <label
                        for="Answer"
                        class="absolute left-0 
                            -top-3.5 text-gray-600
                             text-sm 
                             peer-placeholder-shown:text-base
                             peer-placeholder-shown:text-gray-440
                              peer-placeholder-shown:top-2
                               transition-all
                               peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                      >
                        Answer
                      </label>
                    </div>
                    <div class="relative">
                      <button
                        onClick={onSubmit}
                        class="bg-blue-500 text-white rounded-md px-2 py-1"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <Box sx={style}>
              <Stack direction="row">
                <Typography
                  id="transition-modal-description"
                  sx={{ mt: 2, ml: 12 }}
                >
                  Saved
                </Typography>
                <div id="react-logo" style={{ width: 30, height: 30 }} />
              </Stack>
            </Box>
          </Fade>
        </Modal>
      </div>
    </AnimatedPage>
  );
}
