/* -------------------------------------------------------------------------- */
// Alle interactieve onderdelen voor onze site. We maken van alle inputs een object met zijn eigen eigenschappen.
let fullName = {},
  email = {},
  password = {},
  signInButton;
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
// Twee standaard functies, nog basic, maar kan je nog uitbreiden.
const isValidEmailAddress = function (emailAddress) {
  // Basis manier om e-mailadres te checken.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
};

const isEmpty = function (fieldValue) {
  return !fieldValue || fieldValue.length < 1;
};

// Geeft de foutboodschap voor het wachtwoord terug, of een lege string als alles in orde is.
// Het minimum aantal tekens komt uit het minlength-attribuut in de HTML (-1 als het er niet staat).
const getPasswordError = function () {
  if (isEmpty(password.input.value)) {
    return "This field is required";
  }
  if (password.input.value.length < password.input.minLength) {
    return `Use at least ${password.input.minLength} characters`;
  }
  return "";
};
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
const doubleCheckEmailAddress = function () {
  if (isValidEmailAddress(email.input.value)) {
    // Stop met dit veld in de gaten te houden; het is in orde.
    email.input.removeEventListener("input", doubleCheckEmailAddress);
    removeErrors(email);
  } else {
    // Stuk herhalende code.
    if (isEmpty(email.input.value)) {
      email.errorMessage.innerText = "This field is required";
    } else {
      email.errorMessage.innerText = "Invalid email address";
    }
  }
};

const doubleCheckPassword = function () {
  const error = getPasswordError();
  if (!error) {
    // Stop met dit veld in de gaten te houden; het is in orde.
    password.input.removeEventListener("input", doubleCheckPassword);
    removeErrors(password);
  } else {
    password.errorMessage.innerText = error;
    addErrors(password);
  }
};

const doubleCheckName = function () {
  if (!isEmpty(fullName.input.value)) {
    // Stop met dit veld in de gaten te houden; het is in orde.
    fullName.input.removeEventListener("input", doubleCheckName);
    removeErrors(fullName);
  }
};

const addErrors = function (formField) {
  formField.field.classList.add("has-error");
  formField.errorMessage.classList.add("is-visible");
};

const removeErrors = function (formField) {
  formField.field.classList.remove("has-error");
  formField.errorMessage.classList.remove("is-visible");
};
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
const getDOMElements = function () {
  // Het naamveld staat enkel op de registratiepagina.
  fullName.input = document.querySelector(".js-name-input");
  if (fullName.input) {
    fullName.label = document.querySelector(".js-name-label");
    fullName.errorMessage = fullName.label.querySelector(
      ".js-name-error-message",
    );
    fullName.field = document.querySelector(".js-name-field");
  }

  email.label = document.querySelector(".js-email-label");
  email.errorMessage = email.label.querySelector(".js-email-error-message");
  email.input = document.querySelector(".js-email-input");
  email.field = document.querySelector(".js-email-field");

  password.label = document.querySelector(".js-password-label");
  password.errorMessage = password.label.querySelector(
    ".js-password-error-message",
  );
  password.input = document.querySelector(".js-password-input");
  password.field = document.querySelector(".js-password-field");

  signInButton = document.querySelector(".js-sign-in-button");
};

const enableListeners = function () {
  if (fullName.input) {
    fullName.input.addEventListener("blur", function () {
      if (isEmpty(fullName.input.value)) {
        addErrors(fullName);
        fullName.input.addEventListener("input", doubleCheckName);
      }
    });
  }

  email.input.addEventListener("blur", function () {
    if (!isValidEmailAddress(email.input.value)) {
      if (isEmpty(email.input.value)) {
        email.errorMessage.innerText = "This field is required";
      } else {
        email.errorMessage.innerText = "Invalid email address";
      }

      addErrors(email);

      // Gebruik een named function (doubleCheckPassword), om die er weer af te kunnen halen. Dit vermijd ook het dubbel toevoegen ervan.
      email.input.addEventListener("input", doubleCheckEmailAddress);
    }
  });

  password.input.addEventListener("blur", function () {
    const error = getPasswordError();
    if (error) {
      password.errorMessage.innerText = error;
      addErrors(password);

      // Gebruik een named function (doubleCheckPassword), om die er weer af te kunnen halen. Dit vermijd ook het dubbel toevoegen ervan.
      password.input.addEventListener("input", doubleCheckPassword);
    } else {
      removeErrors(password);
    }
  });

  signInButton.addEventListener("click", function (e) {
    // We gaan de form zelf versturen wanneer nodig.
    e.preventDefault();

    const nameIsValid = !fullName.input || !isEmpty(fullName.input.value);

    if (
      nameIsValid &&
      isValidEmailAddress(email.input.value) &&
      !getPasswordError()
    ) {
      if (fullName.input) {
        removeErrors(fullName);
      }
      removeErrors(email);
      removeErrors(password);
      console.info("Form is good to go.");
    } else {
      if (!nameIsValid) {
        addErrors(fullName);
        fullName.input.addEventListener("input", doubleCheckName);
      }
      if (!isValidEmailAddress(email.input.value)) {
        addErrors(email);
        email.input.addEventListener("input", doubleCheckEmailAddress);
      }
      if (getPasswordError()) {
        password.errorMessage.innerText = getPasswordError();
        addErrors(password);
        password.input.addEventListener("input", doubleCheckPassword);
      }
    }
  });
};

function handlePasswordSwitcher() {
  let passwordInput = document.querySelector(".js-password-input"),
    passwordCheckbox = document.querySelector(".js-password-toggle-checkbox");

  if (!passwordInput || !passwordCheckbox) {
    throw new Error(
      "The password input or the password checkbox classes could not be found.",
    );
  }

  passwordCheckbox.addEventListener("click", function () {
    if (passwordInput.type == "password") {
      passwordInput.type = "text";
    } else {
      passwordInput.type = "password";
    }
  });
}

const init = function () {
  // We splitsen alles netjes op in verschillende functies.
  // Alle linken leggen naar onze HTML.
  getDOMElements();

  // We voegen listeners toe om te wachten op interactie
  enableListeners();

  handlePasswordSwitcher();
};

init();
