import i18next from 'i18next';

i18next.init({
  lng: 'en', // if you're using a language detector, do not define the lng option
  debug: true,
  saveMissing: true,
  resources: {
    en: {
      translation: {
        home: 'Home',
        signup: 'Sign Up',
        email: 'Email',
        password: 'Password',
        form: 'Form',
        email_error: 'Please input your email',
        password_error: 'Please input your password!',
        unknown_error: 'Sorry something went wrong',
        user_created: 'Account successfully created',
        user_exist: 'Sorry account already exits',
        user_exist2: 'Sorry account already exits. Please sign in',
        logged_in: 'You are now logged in',
        login_signup: 'Login | Sign up',
        resources: 'Resources',
        about_us: 'About Us',
        logout: 'Logout',
        logout_ok: 'You are now logged out',
        logout_failed: 'Sorry failed to logout, please try again',
        app_beta_note:
          "🚀 Get ready to embark on an educational journey like never before with Sparked Next, the evolution of modern learning! We're thrilled to unveil the next chapter of our educational app, and it's packed with innovative features and enhancements that will elevate your learning experience.",
        admin: 'Admin',
        courses: 'Courses',
        dashboard: 'Dashboard',
      },
    },
  },
});
