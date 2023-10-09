import i18next from "i18next";

 i18next.init({
  lng: "en", // if you're using a language detector, do not define the lng option
  debug: true,
  resources: {
    en: {
      translation: {
        home: "Home",
        signup: "Sign Up",
        email: "Email",
        password: "Password",
        form: "Form",
        email_error: "Please input your email",
        password_error: "Please input your password!",
        unknown_error: "Sorry something went wrong",
        user_created: "Account successfully created",
        user_exist: "Sorry account already exits",
        user_exist2: "Sorry account already exits. Please sign in",
        logged_in: "You are now logged in",
      },
    },
  },
});

