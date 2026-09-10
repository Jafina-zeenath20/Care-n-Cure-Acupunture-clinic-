// ============================================================
// CARE N CURE WEBSITE JAVASCRIPT
// ============================================================


// ============================================================
// FADE-IN ANIMATION
// ============================================================

const faders = document.querySelectorAll(".fade-in");

const appearOptions = {
  threshold: 0.2
};

const appearOnScroll = new IntersectionObserver(
  function (entries, observer) {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        entry.target.classList.add("visible");

        observer.unobserve(entry.target);

      }

    });

  },
  appearOptions
);


faders.forEach(fader => {

  appearOnScroll.observe(fader);

});


// ============================================================
// TESTIMONIAL SLIDER
// ============================================================

let currentSlide = 0;

const slides =
  document.querySelectorAll(".testimonial");

const track =
  document.querySelector(".testimonial-track");

const nextButton =
  document.querySelector(".next");

const prevButton =
  document.querySelector(".prev");


function updateSlider() {

  if (!track || slides.length === 0) {
    return;
  }

  track.style.transform =
    `translateX(-${currentSlide * 100}%)`;

}


if (nextButton) {

  nextButton.addEventListener(
    "click",
    () => {

      currentSlide =
        (currentSlide + 1) % slides.length;

      updateSlider();

    }
  );

}


if (prevButton) {

  prevButton.addEventListener(
    "click",
    () => {

      currentSlide =
        (currentSlide - 1 + slides.length)
        % slides.length;

      updateSlider();

    }
  );

}


setInterval(() => {

  if (slides.length > 0) {

    currentSlide =
      (currentSlide + 1) % slides.length;

    updateSlider();

  }

}, 6000);


// ============================================================
// APPOINTMENT FORM
// ============================================================

const appointmentForm =
  document.getElementById("appointmentForm");


if (appointmentForm) {

  appointmentForm.addEventListener(
    "submit",
    async function (e) {

      e.preventDefault();

      const form = e.target;

      const data =
        Object.fromEntries(
          new FormData(form).entries()
        );


      try {

        const res =
          await fetch("/api/appointment", {

            method: "POST",

            headers: {
              "Content-Type": "application/json"
            },

            body: JSON.stringify(data)

          });


        const result =
          await res.json();


        if (res.ok) {

          alert(
            result.message ||
            "Appointment booked successfully!"
          );

          form.reset();

        } else {

          alert(
            result.message ||
            "Unable to submit appointment."
          );

        }


      } catch (error) {

        console.error(error);

        alert(
          "Unable to connect to the server."
        );

      }

    }
  );

}


// ============================================================
// AI CHATBOT
// ============================================================

const chatbotButton =
  document.getElementById("chatbotButton");

const chatbotWindow =
  document.getElementById("chatbotWindow");

const closeChatbot =
  document.getElementById("closeChatbot");

const chatInput =
  document.getElementById("chatInput");

const sendChat =
  document.getElementById("sendChat");

const chatMessages =
  document.getElementById("chatMessages");

const typingIndicator =
  document.getElementById("typingIndicator");


// ============================================================
// OPEN CHATBOT
// ============================================================

if (chatbotButton) {

  chatbotButton.addEventListener(
    "click",
    () => {

      chatbotWindow.classList.add("open");

      setTimeout(() => {

        chatInput.focus();

      }, 200);

    }
  );

}


// ============================================================
// CLOSE CHATBOT
// ============================================================

if (closeChatbot) {

  closeChatbot.addEventListener(
    "click",
    () => {

      chatbotWindow.classList.remove("open");

    }
  );

}


// ============================================================
// ADD MESSAGE
// ============================================================

function addChatMessage(
  message,
  sender
) {

  const messageElement =
    document.createElement("div");


  messageElement.classList.add(
    "chat-message"
  );


  if (sender === "user") {

    messageElement.classList.add(
      "user-message"
    );

  } else {

    messageElement.classList.add(
      "bot-message"
    );

  }


  messageElement.textContent =
    message;


  chatMessages.appendChild(
    messageElement
  );


  chatMessages.scrollTop =
    chatMessages.scrollHeight;

}


// ============================================================
// TYPING INDICATOR
// ============================================================

function showTyping() {

  typingIndicator.classList.add(
    "show"
  );

  chatMessages.scrollTop =
    chatMessages.scrollHeight;

}


function hideTyping() {

  typingIndicator.classList.remove(
    "show"
  );

}


// ============================================================
// SEND MESSAGE
// ============================================================

async function sendMessage() {

  const message =
    chatInput.value.trim();


  if (!message) {

    return;

  }


  // Show customer message

  addChatMessage(
    message,
    "user"
  );


  // Clear input

  chatInput.value = "";


  // Show typing

  showTyping();


  // Disable button

  sendChat.disabled = true;


  try {

    const response =
      await fetch("/api/chat", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          message: message

        })

      });


    const data =
      await response.json();


    hideTyping();


    if (!response.ok) {

      addChatMessage(
        data.detail ||
        "Sorry, something went wrong.",
        "bot"
      );

      return;

    }


    addChatMessage(
      data.answer,
      "bot"
    );


  } catch (error) {

    console.error(
      "Chatbot error:",
      error
    );


    hideTyping();


    addChatMessage(
      "Sorry, I'm unable to connect right now. Please contact Care n Cure directly.",
      "bot"
    );

  } finally {

    sendChat.disabled = false;

    chatInput.focus();

  }

}


// ============================================================
// SEND BUTTON
// ============================================================

if (sendChat) {

  sendChat.addEventListener(
    "click",
    sendMessage
  );

}


// ============================================================
// ENTER KEY
// ============================================================

if (chatInput) {

  chatInput.addEventListener(
    "keydown",
    function (event) {

      if (event.key === "Enter") {

        event.preventDefault();

        sendMessage();

      }

    }
  );

}


// ============================================================
// QUICK QUESTIONS
// ============================================================

const quickQuestions =
  document.querySelectorAll(
    ".quick-questions button"
  );


quickQuestions.forEach(button => {

  button.addEventListener(
    "click",
    () => {

      const question =
        button.dataset.question;


      chatInput.value =
        question;


      sendMessage();

    }
  );

});
