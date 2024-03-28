<script setup>
import { reactive, ref, watch } from "vue";
import CustomButton from "@/components/CustomButton.vue";
import DATA from "@/utils/movies_and_tvshows.json";

const results = ref(DATA);
const error = ref(false);

const rules = {
  q0: (input, facts) =>
    !input ? true : input === "any" ? true : facts.q0 === input,
  q1: (input, facts) =>
    !input
      ? true
      : input === "any"
      ? true
      : checkResponseArray(input, facts.q1),
  q2: (input, facts) =>
    !input
      ? true
      : input === "any"
      ? true
      : checkResponseInterval(input, facts.q2),
  q3: (input, facts) =>
    !input
      ? true
      : input === "any"
      ? true
      : checkResponseArray(input, facts.q3),
  qm0: (input, facts) =>
    !input || !facts.qm0
      ? true
      : input === "any"
      ? true
      : checkResponseInterval(input, facts.qm0),
  qt0: (input, facts) =>
    !input || !facts.qt0
      ? true
      : input === "any"
      ? true
      : checkResponseInterval(input, facts.qt0),
};
const ruleKeys = Object.keys(rules);

const checkResponseArray = (response, facts) => {
  if (!Array.isArray(response)) {
    response = [response];
  }
  return response.some((element) => facts.includes(element));
};

function checkResponseInterval(response, facts) {
  const [startInterval, endInterval] = response.split("-");

  if (facts >= parseInt(startInterval) && facts <= parseInt(endInterval)) {
    return true;
  }
  return false;
}

function checkRules(entries, input, rule) {
  console.log("rule: ", rule);
  const res = entries.filter((entry) => {
    // console.log("entry: ", entry);
    return rule(input, entry.facts);
  });

  console.log("entries length: ", entries.length);
  console.log("res length: ", res.length);

  if (res.length === 0) return entries;
  return res;
}

const state = reactive({
  questions: {
    q0: {
      text: "Do you want to watch a movie or a TV show?",
      options: ["movie", "tv-show", "any"],
    },
    q1: {
      text: "What genre are you interested in?",
      options: [
        "action",
        "comedy",
        "drama",
        "fantasy",
        "biography",
        "crime",
        "any",
      ],
    },
    q2: {
      text: "Do you have any preferred production years?",
      options: ["2020", "2010-2020", "2000-2010", "1990-2000", "any"],
    },
    q3: {
      text: "What is your preferred age range for content?",
      options: ["13+", "18+", "Adult"],
    },
  },
  currentQuestionIndex: 0,
  selectedAnswers: {
    0: "",
    1: [],
    2: "",
    3: [],
  },
  showResult: false,
});

const questionsArray = ref(Object.values(state.questions));

function nextQuestion() {
  if (
    state.selectedAnswers[state.currentQuestionIndex] === "" ||
    state.selectedAnswers[state.currentQuestionIndex] === null
  ) {
    error.value = true;
    return;
  }
  if (state.currentQuestionIndex < questionsArray.value.length - 1) {
    error.value = false;
    results.value = checkRules(
      results.value,
      state.selectedAnswers[state.currentQuestionIndex],
      rules[ruleKeys[state.currentQuestionIndex]]
    );
    state.currentQuestionIndex++;
  } else {
    state.showResult = true;
  }
  console.log(state.selectedAnswers);
}

watch(
  () => state.currentQuestionIndex,
  (newVal) => {
    if (!(newVal in state.selectedAnswers)) {
      state.selectedAnswers[newVal] = null;
    }
  }
);

function resetTest() {
  state.currentQuestionIndex = 0;
  state.showResult = false;
  state.selectedAnswers = {
    0: "",
    1: [],
    2: "",
    3: [],
  };
}
</script>

<template>
  <div class="home">
    <img class="logo" src="../assets/logo.png" alt="" />
    <div class="questions" v-if="!state.showResult">
      <h1>
        {{ questionsArray[state.currentQuestionIndex].text }}
      </h1>
      <div
        v-for="(option, index) in questionsArray[state.currentQuestionIndex]
          .options"
        :key="index"
        class="radio-option"
      >
        <label
          :for="`option-${state.currentQuestionIndex}-${index}`"
          v-if="
            state.currentQuestionIndex === 1 || state.currentQuestionIndex === 3
          "
        >
          <input
            type="checkbox"
            :value="option"
            :id="`option-${state.currentQuestionIndex}-${index}`"
            v-model="state.selectedAnswers[state.currentQuestionIndex]"
            :name="`question-${state.currentQuestionIndex}`"
            required
          />{{ option }}</label
        >

        <label :for="`option-${state.currentQuestionIndex}-${index}`" v-else>
          <input
            type="radio"
            :value="option"
            :id="`option-${state.currentQuestionIndex}-${index}`"
            v-model="state.selectedAnswers[state.currentQuestionIndex]"
            :name="`question-${state.currentQuestionIndex}`"
            required
          />
          {{ option }}</label
        >
      </div>
      <div class="button">
        <CustomButton title="Next" @click="nextQuestion" />
      </div>
    </div>
    <div class="filtered-results" v-if="state.showResult">
      <h2>Our recommandation:</h2>
      <div class="result">
        <img src="../assets/logCircle.png" alt="" />
        <div class="details">
          <h3>{{ results[0].details.name }}</h3>
          <p>{{ results[0].details.genre }}</p>
          <p>{{ results[0].details.production_year }}</p>
          <p>{{ results[0].details.age_range }}</p>
          <p>
            {{
              results[0].details.duration || results[0].details.number_seasons
            }}
          </p>
        </div>
        <CustomButton title="Try again" @click="resetTest" />
      </div>

      <div class="others" v-if="results.length > 1">
        <h2>You may also like...</h2>
        <div class="results">
          <div
            class="result"
            v-for="(item, index) in results.slice(1, 5)"
            :key="index"
          >
            <h3>{{ item.details.name }}</h3>
            <div class="details">
              <p>{{ "Genre: " + item.details.genre }}</p>
              <p>{{ "Year of production: " + item.details.production_year }}</p>
              <p>{{ "Age range: " + item.details.age_range }}</p>
              <p>{{ item.details.duration || item.details.number_seasons }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  background-image: url("../assets/background.jpg");
  height: 100vh;
  color: white;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .logo {
    position: absolute;
    top: 20px;
    width: 150px;
  }

  .questions {
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .radio-option {
      label {
        position: relative;
        cursor: pointer;
        display: flex;
        align-items: center;
      }

      /* Base styles for both types of inputs */
      input[type="radio"],
      input[type="checkbox"] {
        appearance: none;
        background: none;
        border: 2px solid #777;
        height: 1.5em;
        width: 1.5em;
        margin-right: 10px;
        border-radius: 100%;
        vertical-align: text-bottom;
        position: relative;
      }

      /* Remove the circular shape from checkboxes */
      input[type="checkbox"] {
        border-radius: 0;
      }

      /* Styles for the pseudo-elements */
      input[type="radio"]::before,
      input[type="checkbox"]::before {
        content: "";
        position: absolute;
        margin: auto;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        top: 0;
      }

      /* Center of the checked radio button */
      input[type="radio"]:checked::before {
        border: 5px solid transparent;
        border-radius: 100%;
        background: #ddb31b;
      }

      /* The checkmark shape */
      input[type="checkbox"]:checked::before {
        border-right: 5px solid #ddb31b;
        border-bottom: 6px solid #ddb31b;
        height: 90%;
        width: 30%;
        transform: rotate(50deg) translateY(-20%) translateX(-10%);
      }

      /* Some focus styles for accessibility */
      input[type="radio"]:focus,
      input[type="checkbox"]:focus {
        outline: solid 1px;
        outline-offset: 2px;
      }
    }

    .button {
      width: 100%;
      display: flex;
      justify-content: flex-end;
    }
  }

  .filtered-results {
    display: flex;

    flex-direction: column;

    .result {
      background-color: #1e1e1e;
      border-radius: 15px;
      padding: 10px;
      width: 100%;
      height: 300px;
      margin-bottom: 50px;

      display: flex;
      align-items: center;
      gap: 20px;

      img {
        height: 250px;
      }

      h3 {
        color: #ddb31b;
      }

      .details {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        height: 100%;
        h3 {
          font-size: 50px;
          margin-top: 0px;
        }
        p {
          margin-top: 0px;
        }
      }
    }

    .others {
      display: flex;
      flex-direction: column;

      h2 {
        padding-left: 30px;
      }
    }
    .results {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 20px;

      .result {
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        gap: 0;
        margin-bottom: 0px;

        width: 20%;
        height: 200px;
      }
    }
  }
}
</style>
