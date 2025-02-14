import { useState, useEffect, useRef } from "react";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import { LogSnag } from "@logsnag/node";
import { Heart } from "lucide-react";

const logsnag = new LogSnag({
  token: "LOGSNAG_TOKEN",
  project: "PROJECT_NAME",
});

const track = async () => {
  await logsnag.track({
    channel: "yes",
    event: "Valentine's Day",
    description: "She said yes!",
    icon: "💖",
    notify: true,
  });
};

const FloatingHearts = () => {
  return (
    <div className="fixed inset-0 pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-pink-600"
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 100,
          }}
          animate={{
            y: -100,
            transition: {
              repeat: Number.POSITIVE_INFINITY,
              duration: 10 + Math.random() * 10,
              ease: "linear",
            },
          }}
        >
          <Heart size={16 + Math.random() * 16} />
        </motion.div>
      ))}
    </div>
  );
};

function App() {
  const steps = [
    {
      content: "Heyyyyy, pretty girl.",
      image: "/character/one.png",
    },
    {
      content: `Hey, remember the date 5th Jan, the day I slid into your DMs? 
      `,
      image: "/character/two.png",
    },
    {
      content: `The first google meet and the first fight we had.
      `,
      image: "/character/three.png",
    },
    {
      content: `The whole month was full of roller coaster, the trust that we have gained on each other`,
      image: "/character/four.png",
    },
    {
      content: `Our first date, the first time we met, the first time we held hands, the first time we kissed.`,
      image: "/character/five.png",
    },
    {
      content: "So, let's start a new beautiful chapter of our life.....",
      image: "/character/six.png",
    },
    {
      content: "Will you be my Valentine forever?",
      image: "/character/seven.png",
    },
  ];
  const [currentStep, setCurrentStep] = useState(0);
  const [sheWantsToBeMyValentine, setSheWantsToBeMyValentine] = useState(false);
  const { width, height } = useWindowSize();
  const [audioLoaded, setAudioLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Preload images
    const imagePaths = [
      ...steps.map((step) => step.image),
      "/character/yayyyy.png",
    ];

    imagePaths.forEach((path) => {
      const img = new Image();
      img.src = path;
    });

    // Enhanced audio setup
    if (audioRef.current) {
      audioRef.current.volume = 0.5;

      // Set up audio element
      const audio = audioRef.current;
      audio.preload = "auto";
      audio.loop = true;

      // Promise chain to handle different autoplay scenarios
      const tryPlay = async () => {
        try {
          // Try to play immediately
          await audio.play();
          setAudioLoaded(true);
        } catch (error) {
          console.log(
            "Initial autoplay failed, setting up event listeners:",
            error
          );

          // Set up multiple event listeners to try playing
          const events = ["click", "touchstart", "mousedown", "keydown"];

          const playHandler = async () => {
            try {
              await audio.play();
              setAudioLoaded(true);
              // Remove all event listeners once played successfully
              events.forEach((event) => {
                document.removeEventListener(event, playHandler);
              });
            } catch (err) {
              console.log("Playback failed:", err);
            }
          };

          // Add all event listeners
          events.forEach((event) => {
            document.addEventListener(event, playHandler, { once: true });
          });
        }
      };

      // Start the play attempt chain
      tryPlay();

      // Cleanup function
      return () => {
        const events = ["click", "touchstart", "mousedown", "keydown"];
        events.forEach((event) => {
          document.removeEventListener(event, () => {});
        });

        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      };
    }
  }, []);

  return (
    <div className="app-container">
      <audio ref={audioRef} preload="auto">
        <source src="/music.mp3" type="audio/mpeg" />
      </audio>
      {/* Optional UI indicator for audio status */}
      {!audioLoaded && (
        <div className="fixed top-4 right-4 bg-white/80 text-pink-600 px-4 py-2 rounded-full text-sm">
          Click anywhere to play music 🎵
        </div>
      )}
      <FloatingHearts />
      {sheWantsToBeMyValentine && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Confetti width={width} height={height} />
          <div className="fixed top-0 left-0 w-full h-full bg-[#FFC5D3] flex flex-col items-center justify-center">
            <motion.h1
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="text-white text-4xl font-bold text-center"
            >
              Thanks for making my life beautiful.
              <br />I LOVE YOU ❤️❤️.
            </motion.h1>
            <img
              src="/character/yayyyy.png"
              alt=""
              className="w-40 animate-bounce mt-10"
            />
          </div>
        </motion.div>
      )}
      <div className="bg-[#FFC5D3] min-h-screen text-white p-5 flex flex-col items-center justify-center max-w-md mx-auto">
        <motion.img
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          src={steps[currentStep].image}
          alt=""
          className="w-40"
        />
        <motion.div
          key={currentStep + "-text"}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-josefin text-4xl font-bold"
        >
          {steps[currentStep].content}
        </motion.div>

        {currentStep < 6 && (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentStep(currentStep + 1)}
              className="bg-white text-[#FFC5D3] py-3 text-xl rounded-xl w-full mt-10 font-semibold"
            >
              Next
            </motion.button>
            {currentStep > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentStep(currentStep - 1)}
                className="bg-white text-[#FFC5D3] py-3 text-xl rounded-xl w-full mt-2 font-semibold opacity-90"
              >
                Back
              </motion.button>
            )}
          </>
        )}
        {currentStep === 6 && (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={async () => {
                setSheWantsToBeMyValentine(true);
                await track();
              }}
              className="bg-white text-[#FFC5D3] py-3 text-xl rounded-xl w-full mt-10 font-semibold"
            >
              Yes, babe!!
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={async () => {
                setSheWantsToBeMyValentine(true);
                await track();
              }}
              className="bg-white text-[#FFC5D3] py-3 text-xl rounded-xl w-full mt-2 font-semibold"
            >
              Definitely, why not?
            </motion.button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
